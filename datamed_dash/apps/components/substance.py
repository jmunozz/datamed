import math
from typing import List, Dict, Tuple
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash
import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import dash_table
import db.fetch_data as fetch_data
import db.substance as substance
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from app import app
from apps.components import commons
from apps.components.specialite import NoData
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_bootstrap_components import (
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
)
from dash_core_components import Graph
from plotly.subplots import make_subplots
from sm import SideMenu

from .commons import PatientsTraites, Header
from .utils import Box, FigureGraph, GraphBox, TopicSection, SectionTitle, SectionP
from ..constants.colors import PIE_COLORS_SUBSTANCE, TREE_COLORS
from ..constants.layouts import PIE_LAYOUT, CURVE_LAYOUT

NOTIF_IMAGE_URL = {
    "Autre professionnel de santé": app.get_asset_url("./doctor_1.svg"),
    "Dentiste": app.get_asset_url("./surgeon_1.svg"),
    "Infirmière": app.get_asset_url("./nurse_1.svg"),
    "Médecin généraliste": app.get_asset_url("./doctor_2.svg"),
    "Pharmacien": app.get_asset_url("./pharmacist.svg"),
    "Inconnu": app.get_asset_url("./face.svg"),
    "Non professionnel de santé": app.get_asset_url("./face.svg"),
    "Médecin spécialiste": app.get_asset_url("./surgeon_1.svg"),
}

NOTIF_NOM = {
    "Autre professionnel de santé": "Autre professionnel de santé",
    "Dentiste": "Dentiste",
    "Infirmière": "Infirmier",
    "Médecin généraliste": "Médecin généraliste",
    "Pharmacien": "Pharmacien",
    "Inconnu": "Inconnu",
    "Non professionnel de santé": "Non professionnel de santé",
    "Médecin spécialiste": "Médecin spécialiste",
}

df_hlt = fetch_data.fetch_table("substance_hlt_ordei", "code")
df_hlt = df_hlt.where(pd.notnull(df_hlt), None)


def get_notif_figures_from_df(df: pd.DataFrame) -> List[Dict]:
    return [
        {
            "figure": "{}%".format(round(x["pourcentage_notif"])).replace(".", ","),
            "caption": NOTIF_NOM[x["notificateur"]],
            "img": NOTIF_IMAGE_URL[x["notificateur"]],
        }
        for x in fetch_data.transform_df_to_series_list(df)
        if not math.isnan(x["pourcentage_notif"]) and round(x["pourcentage_notif"])
    ]


def EffetsIndesirablesTooltip() -> Component:
    return dbc.Card(
        [
            html.H2(
                dbc.Button(
                    "Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
                    color="link",
                    id="group-substance-ei-tooltip-toggle",
                    className="color-secondary",
                ),
                className="with-lightbulb",
            ),
            dbc.Collapse(
                dbc.CardBody(
                    [
                        html.Div(
                            [
                                html.Div(
                                    "Nombre de cas notifiés d’effets indésirables en France estimé à partir des "
                                    "données de la Base Nationale de Pharmacovigilance (BNPV).",
                                    className="normal-text",
                                ),
                                html.Span(
                                    "La BNPV est alimentée par les centres régionaux de pharmacovigilance qui sont "
                                    "notifiés par les professionnels de santé ou par les patients et association "
                                    "agréées via un portail dédié : ",
                                    className="normal-text",
                                ),
                                html.A(
                                    "signalement.social-sante.gouv.fr",
                                    href="https://signalement.social-sante.gouv.fr",
                                    className="normal-text link",
                                ),
                            ],
                            className="mb-3",
                        ),
                        html.Div(
                            [
                                html.Span(
                                    "Sont notifiés les effets indésirables que le patient ou son entourage suspecte "
                                    "d’être liés à l’utilisation d’un ou plusieurs médicaments et les mésusages, "
                                    "abus ou erreurs médicamenteuses. Il s’agit de cas évalués et validés par "
                                    "un comité d’experts. ",
                                    className="normal-text",
                                ),
                                html.Span(
                                    "Pour plus d’informations, consultez : ",
                                    className="normal-text",
                                ),
                                html.A(
                                    "ansm.sante.fr/page/la-surveillance-renforcee-des-medicaments",
                                    href="https://ansm.sante.fr/page/la-surveillance-renforcee-des-medicaments",
                                    className="normal-text link",
                                ),
                            ]
                        ),
                    ]
                ),
                id="group-substance-ei-tooltip-collapse",
            ),
        ],
        className="box",
    )


def Substance(code: str) -> Tuple[Component, html.Div]:

    df_sub = substance.get_substance_df(code)
    series_sub = fetch_data.as_series(df_sub)
    df_sub_spe = substance.list_specialite(code)
    df_age = substance.get_age_df(code)
    df_sexe = substance.get_sexe_df(code)
    df_expo = substance.get_exposition_df(code)
    df_decla = substance.get_decla_df(code)
    df_notif = substance.get_notif_df(code)
    df_cas_age = substance.get_age_cas_df(code)
    df_cas_sexe = substance.get_sexe_cas_df(code)
    df_soc = substance.get_soc_df(code)

    return (
        Header(series_sub, type="substance"),
        html.Div(
            [
                SideMenu(
                    id="side-menu",
                    items=[
                        {"id": "description", "label": "Description"},
                        {"id": "population-concernee", "label": "Population concernée"},
                        {"id": "effets-indesirables", "label": "Effets indésirables",},
                    ],
                    className="side-menu",
                ),
                html.Div(
                    html.Div(
                        [
                            Description(df_sub, df_sub_spe),
                            PatientsTraites(
                                df_age=df_age,
                                df_sexe=df_sexe,
                                df_expo=df_expo,
                                pie_colors=PIE_COLORS_SUBSTANCE,
                            ),
                            CasDeclares(df_decla, df_notif, df_cas_age, df_cas_sexe),
                            SystemesOrganes(df_soc, code),
                        ],
                        className="container-fluid",
                        style={"padding-left": "80px"},
                    ),
                    className="container-fluid side-content",
                ),
            ],
            className="container-fluid p-0 content",
        ),
    )


def Description(df_sub: pd.DataFrame, df_sub_spe: pd.DataFrame) -> Component:
    series_sub = fetch_data.as_series(df_sub)

    return TopicSection(
        Box(
            [
                html.Div(
                    "Spécialités de médicaments contenant : {}".format(
                        series_sub.nom.capitalize()
                    ),
                    className="medium-text mt-5",
                ),
                html.Div(
                    "{} médicaments identifiés".format(len(df_sub_spe)),
                    className="normal-text mt-3",
                    style={"color": "#33C2D6"},
                ),
                dash_table.DataTable(
                    id="substance-specialite-table",
                    columns=[{"name": "nom", "id": "nom"}],
                    data=df_sub_spe.reset_index().to_dict("records"),
                    page_size=10,
                    style_as_list_view=True,
                    style_table={"overflowX": "auto"},
                    style_cell={"height": "50px", "backgroundColor": "#FAFAFA",},
                    style_data={
                        "fontSize": "14px",
                        "fontWeight": "400",
                        "font-family": "Roboto",
                        "lineHeight": "18px",
                        "textAlign": "left",
                    },
                    style_header={"display": "none"},
                ),
            ],
            class_name_wrapper="overlap-top-content",
        ),
        id="description",
    )


def CasDeclareFigureBox(df_decla: pd.DataFrame) -> Component:
    if df_decla is None:
        return NoData()
    series_decla = fetch_data.as_series(df_decla)
    cas_str = "{:,}".format(int(series_decla.cas)).replace(",", " ")
    return FigureGraph(
        [
            {
                "figure": cas_str,
                "caption": "Nombre de cas déclarés sur la période 2014-2018",
            }
        ]
    )


def TauxDeclarationBox(df_decla: pd.DataFrame) -> Component:
    if df_decla is None:
        return NoData()
    series_decla = fetch_data.as_series(df_decla)
    taux_str = "{:,}".format(int(series_decla.taux_cas)).replace(",", " ")
    return FigureGraph(
        [
            {
                "figure": "{} / 100 000".format(taux_str),
                "caption": "Taux de déclaration pour 100 000 patients "
                "traités par an sur la période 2014-2018",
            }
        ]
    )


def CasDeclaresGraphBox(df_decla: pd.DataFrame) -> Component:
    if df_decla is None:
        return NoData()
    fig = make_subplots(specs=[[{"secondary_y": True}]])
    if df_decla.cas_annee.min() > 10:
        fig.add_trace(
            go.Scatter(
                x=df_decla.annee,
                y=df_decla.cas_annee,
                mode="lines",
                name="Cas déclarés",
                line={
                    "shape": "spline",
                    "smoothing": 1,
                    "width": 4,
                    "color": "#F29733",
                },
            ),
            secondary_y=False,
        )

    fig.add_trace(
        go.Scatter(
            x=df_decla.annee,
            y=df_decla.conso_annee,
            mode="lines",
            name="Patients traités",
            line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#EA336B"},
            hoverlabel={"namelength": -1},
            hovertemplate="%{y:int}",
        ),
        secondary_y=True,
    )

    fig.update_yaxes(
        title_text="Déclarations d'effets indésirables",
        color="#F29733",
        secondary_y=False,
    )
    fig.update_yaxes(title_text="Patients traités", color="#EA336B", secondary_y=True)
    fig.update_xaxes(title_text="Années", nticks=len(df_decla.index))
    fig.update_layout(CURVE_LAYOUT)

    return Graph(figure=fig, responsive=True,)


def RepartitionSexeFigureBox(df_cas_sexe: pd.DataFrame) -> Component:
    if df_cas_sexe is None:
        return NoData()
    else:
        return FigureGraph(
            commons.get_sexe_figures_from_df(df_cas_sexe, "pourcentage_cas")
        )


def RepartitionAgeGraphBox(df_cas_age: pd.DataFrame) -> Component:
    # Check if percentages are NaN values
    if (
        df_cas_age is not None
        and not np.isnan(df_cas_age.pourcentage_cas.unique()).any()
    ):
        fig_age = go.Figure(
            go.Pie(
                labels=df_cas_age.age,
                values=df_cas_age.pourcentage_cas,
                marker_colors=PIE_COLORS_SUBSTANCE,
            )
        ).update_layout(PIE_LAYOUT)
        return Graph(figure=fig_age, responsive=True,)
    else:
        return NoData()


def NotifFigureGraph(df_notif: pd.DataFrame) -> Component:
    if df_notif is None:
        return NoData()
    else:
        df_notif = df_notif.sort_values(by="pourcentage_notif", ascending=False)
        return FigureGraph(
            get_notif_figures_from_df(df_notif),
            height="80px",
            class_name="justify-content-between",
        )


def CasDeclares(
    df_decla: pd.DataFrame,
    df_notif: pd.DataFrame,
    df_cas_age: pd.DataFrame,
    df_cas_sexe: pd.DataFrame,
) -> Component:

    return TopicSection(
        [
            SectionTitle("Cas déclarés d'effets indésirables"),
            EffetsIndesirablesTooltip(),
            dbc.Row(
                [
                    GraphBox(
                        "",
                        [CasDeclareFigureBox(df_decla)],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "",
                        [TauxDeclarationBox(df_decla)],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Nombre de cas déclarés d’effets indésirables et patients traités par année",
                        [CasDeclaresGraphBox(df_decla)],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par sexe des cas déclarés",
                        [RepartitionSexeFigureBox(df_cas_sexe)],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition par âge des cas déclarés",
                        [RepartitionAgeGraphBox(df_cas_age)],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par type de notificateur",
                        [NotifFigureGraph(df_notif)],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
        ],
        id="effets-indesirables",
    )


def Treemap(df: pd.DataFrame, code: str, path: str, values: str) -> Component:
    fig = px.treemap(
        df.loc[code].sort_values(by=values, ascending=False).head(10),
        path=[path],
        values=values,
        color_discrete_sequence=TREE_COLORS,
        hover_name=path,
    )

    fig.update_layout(
        {
            "xaxis_showgrid": False,
            "yaxis_showgrid": False,
            "hovermode": "x unified",
            "plot_bgcolor": "#FAFAFA",
            "paper_bgcolor": "#FAFAFA",
            "margin": dict(t=0, b=0, l=0, r=0),
            "font": {"size": 12, "color": "black"},
            "legend": dict(
                orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1
            ),
        }
    )
    fig.update_traces(
        texttemplate="%{label}<br>%{value:.0f}%",
        textposition="middle center",
        textfont_size=18,
        hovertemplate="<b>%{label}</b> <br> %{value:.0f}%",
    )
    return fig


def SystemesOrganes(df: pd.DataFrame, code: str) -> Component:
    return TopicSection(
        [
            SectionTitle("Effets indésirables par système d'organe"),
            SectionP(
                "Les systèmes d’organes (Système Organe Classe ou SOC) représentent les 27 classes de disciplines "
                "médicales selon la hiérarchie MedDRA. Sont listés ici les 10 SOC ayant le plus d’effets indésirables "
                "déclarés."
            ),
            SectionP(
                "Attention : un cas n'est comptabilisé qu’une seule fois par SOC en cas de plusieurs effets "
                "indésirables affectant le même SOC. Un cas peut en revanche être comptabilisé sur plusieurs SOC "
                "différents (en fonction des effets indésirables déclarés)."
            ),
            dbc.Row(
                [
                    html.Div(
                        [
                            html.Div(
                                Graph(
                                    figure=Treemap(
                                        df, code, "soc_long", "pourcentage_cas"
                                    ),
                                    responsive=True,
                                    id="soc-treemap",
                                ),
                                id="soc-treemap-container",
                            ),
                            html.Div(id="selected-soc", className="d-none"),
                            HltModal(),
                        ],
                        className="col-md-12",
                    )
                    if df is not None
                    else GraphBox("", NoData()),
                ],
            ),
        ],
        id="population-concernee",
    )


def HltModal() -> Modal:
    return Modal(
        [
            ModalHeader(id="header-modal"),
            ModalBody(id="body-modal"),
            ModalFooter(
                Button(
                    "Fermer",
                    id="close-backdrop",
                    className="ml-auto button-text-bold",
                    color="secondary",
                    outline=True,
                )
            ),
        ],
        scrollable=True,
        centered=True,
        id="update-on-click-data",
        size="xl",
    )


@app.callback(
    dd.Output("group-substance-ei-tooltip-collapse", "is_open"),
    dd.Input("group-substance-ei-tooltip-toggle", "n_clicks"),
    dd.State("group-substance-ei-tooltip-collapse", "is_open"),
)
def toggle_substance_ei_tooltip(n_clicks, is_open):
    ctx = dash.callback_context
    if not ctx.triggered:
        return False
    if n_clicks:
        return not is_open


@app.callback(
    dd.Output("url", "href"),
    dd.Input("substance-specialite-table", "active_cell"),
    dd.State("substance-specialite-table", "page_current"),
    dd.State("substance-specialite-table", "page_size"),
    dd.State("substance-specialite-table", "data"),
)
def getActiveCell(active_cell, page_current, page_size, data):
    if active_cell:
        row = active_cell["row"]
        cellData = data[(page_current or 0) * page_size + row]["cis"]
        return "/apps/specialite?" + urlencode({"search": quote_plus(cellData)})
    else:
        raise PreventUpdate


@app.callback(
    [
        dd.Output("update-on-click-data", "is_open"),
        dd.Output("body-modal", "children"),
        dd.Output("header-modal", "children"),
        dd.Output("selected-soc", "children"),
    ],
    [
        dd.Input("soc-treemap-container", "n_clicks"),
        dd.Input("close-backdrop", "n_clicks"),
        dd.Input("url", "href"),
        dd.Input("soc-treemap", "clickData"),
    ],
    [dd.State("selected-soc", "children")],
)
def update_callback(
    clicks_container, clicks_close, href, click_data, previous_selected_soc
):
    if not click_data:
        return False, "", "", ""

    selected_soc = click_data["points"][0]["label"]
    selected_soc_has_changed = selected_soc != previous_selected_soc

    if selected_soc_has_changed:
        parsed_url = urlparse(unquote_plus(href))
        query = parse_qs(parsed_url.query)
        code = query["search"][0]

        df_hlt_details = (
            df_hlt[df_hlt.soc_long == selected_soc]
            .loc[code]
            .sort_values(by="pourcentage_cas", ascending=False)
        )

        return (
            True,
            Graph(
                figure=Treemap(df_hlt_details, code, "effet_hlt", "pourcentage_cas"),
                responsive=True,
            ),
            selected_soc,
            selected_soc,
        )
    else:
        return False, "", "", ""
