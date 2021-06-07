import math
from typing import List, Dict, Tuple
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash.dependencies as dd
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
from datamed_custom_components.Accordion import Accordion
from plotly.subplots import make_subplots
from sm import SideMenu

from .commons import PatientsTraites, Header
from .utils import (
    Box,
    FigureGraph,
    GraphBox,
    TopicSection,
    SectionTitle,
    SectionRow,
)
from ..constants.colors import PIE_COLORS_SUBSTANCE, TREE_COLORS
from ..constants.layouts import PIE_LAYOUT, CURVE_LAYOUT, TREEMAP_LAYOUT

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
    "Non professionnel de santé": "Patient",
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
    return SectionRow(
        Box(
            Accordion(
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
                labelClass="InternalLink normal-text",
                label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
            )
        )
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
                        {"id": "patients-traites", "label": "Patients traités"},
                        {"id": "effets-indesirables", "label": "Effets indésirables",},
                        {"id": "liste-specialites", "label": "Liste des spécialités",},
                    ],
                    className="SideMenu",
                ),
                html.Div(
                    html.Div(
                        [
                            PatientsTraites(
                                df_age=df_age,
                                df_sexe=df_sexe,
                                df_expo=df_expo,
                                pie_colors=PIE_COLORS_SUBSTANCE,
                            ),
                            EffetsIndesirables(
                                df_decla, df_notif, df_cas_age, df_cas_sexe
                            ),
                            SystemesOrganes(df_soc, code),
                            ListeSpecialites(df_sub, df_sub_spe),
                        ],
                        className="ContentWrapper",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )


def ListeSpecialites(df_sub: pd.DataFrame, df_sub_spe: pd.DataFrame) -> Component:
    series_sub = fetch_data.as_series(df_sub)
    if df_sub_spe is not None:
        df_sub_spe.nom = df_sub_spe.nom.str.capitalize()
        box_children = [
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
                style_cell={"height": "50px", "backgroundColor": "#FFF",},
                style_data={
                    "fontSize": "14px",
                    "fontWeight": "400",
                    "font-family": "Roboto",
                    "lineHeight": "18px",
                    "textAlign": "left",
                },
                style_header={"display": "none"},
            ),
        ]
    else:
        box_children = [
            html.Div(
                "Aucun médicament identifié",
                className="normal-text mt-3",
                style={"color": "#33C2D6"},
            )
        ]

    return TopicSection(
        [
            SectionTitle(
                "Spécialités de médicaments contenant : {}".format(
                    series_sub.nom.capitalize()
                )
            ),
            Box(box_children,),
        ],
        id="liste-specialites",
    )


def CasDeclareFigureBox(df_decla: pd.DataFrame) -> Component:
    if df_decla is None:
        return NoData(class_name="BoxContent-isHalf")
    series_decla = fetch_data.as_series(df_decla)
    if not math.isnan(series_decla.cas):
        cas_str = "{:,}".format(int(series_decla.cas)).replace(",", " ")
        return FigureGraph(
            [
                {
                    "figure": cas_str,
                    "caption": "Nombre de cas déclarés sur la période 2014-2018",
                }
            ]
        )
    else:
        return NoData(class_name="BoxContent-isHalf")


def TauxDeclarationBox(df_decla: pd.DataFrame) -> Component:
    if df_decla is None:
        return NoData(class_name="BoxContent-isHalf")
    series_decla = fetch_data.as_series(df_decla)
    if not math.isnan(series_decla.taux_cas):
        taux_str = "{:,}".format(int(series_decla.taux_cas)).replace(",", " ")
        return FigureGraph(
            [
                {
                    "figure": "{} pour 100 000".format(taux_str),
                    "caption": "Taux de déclaration pour 100 000 patients "
                    "traités par an sur la période 2014-2018",
                }
            ]
        )
    else:
        return NoData(class_name="BoxContent-isHalf")


def CasDeclaresGraphBox(df_decla: pd.DataFrame) -> Component:
    if df_decla is None:
        return NoData()
    if df_decla.cas_annee.min() > 10:
        fig = go.Figure(
            go.Scatter(
                x=df_decla.annee,
                y=df_decla.cas_annee,
                mode="lines",
                name="Cas déclarés",
                line={
                    "shape": "spline",
                    "smoothing": 1,
                    "width": 4,
                    "color": "#EA336B",
                },
            ),
        )
        fig.update_yaxes(title_text="Déclarations d'effets indésirables")
        fig.update_xaxes(title_text="Années", nticks=len(df_decla.index))
        fig.update_layout(CURVE_LAYOUT)
        return Graph(figure=fig, responsive=True)


def RepartitionSexeFigureBox(df_cas_sexe: pd.DataFrame) -> Component:
    if df_cas_sexe is None:
        return NoData(class_name="BoxContent-isHalf")
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
                hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
            )
        ).update_layout(PIE_LAYOUT)
        return Graph(figure=fig_age, responsive=False,)
    else:
        return NoData(class_name="BoxContent-isHalf")


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


def EffetsIndesirables(
    df_decla: pd.DataFrame,
    df_notif: pd.DataFrame,
    df_cas_age: pd.DataFrame,
    df_cas_sexe: pd.DataFrame,
) -> Component:

    return TopicSection(
        [
            SectionRow(html.H1("Effets indésirables")),
            EffetsIndesirablesTooltip(),
            SectionRow(
                [
                    GraphBox("", [CasDeclareFigureBox(df_decla)],),
                    GraphBox("", [TauxDeclarationBox(df_decla)],),
                ],
                withGutter=True,
            ),
            SectionRow(
                [
                    GraphBox(
                        "Évolution du nombre de cas déclarés d’effets indésirables au cours du temps",
                        [CasDeclaresGraphBox(df_decla)],
                    ),
                ]
            ),
            SectionRow(
                [
                    GraphBox(
                        "Répartition par sexe des cas déclarés",
                        [RepartitionSexeFigureBox(df_cas_sexe)],
                    ),
                    GraphBox(
                        "Répartition par âge des cas déclarés",
                        [RepartitionAgeGraphBox(df_cas_age)],
                    ),
                ],
                withGutter=True,
            ),
            SectionRow(
                [
                    GraphBox(
                        "Répartition par déclarant",
                        [NotifFigureGraph(df_notif)],
                    ),
                ]
            ),
        ],
        id="effets-indesirables",
    )


def Treemap(df: pd.DataFrame, code: str, path: str, values: str) -> List[Component]:
    fig = px.treemap(
        df.loc[code].sort_values(by=values, ascending=False).head(10),
        path=[path],
        values=values,
        color_discrete_sequence=TREE_COLORS,
        hover_name=path,
    )

    fig.update_layout(TREEMAP_LAYOUT)
    fig.update_traces(
        texttemplate="%{label}<br>%{value:.0f}%",
        textposition="middle center",
        textfont_size=18,
        hovertemplate="<b>%{label}</b> <br> %{value:.0f}%",
    )
    return fig


def SystemesOrganesTooltip():
    return SectionRow(
        Box(
            Accordion(
                [
                    html.P(
                        "Les systèmes d’organes (Système Organe Classe ou SOC) représentent les 27 classes de disciplines "
                        "médicales selon la hiérarchie MedDRA. Sont listés ici les 10 SOC ayant le plus d’effets indésirables "
                        "déclarés.",
                        className="normal-text text-justify",
                    ),
                    html.P(
                        "Attention : Un cas n'est comptabilisé qu’une seule fois par SOC en cas de plusieurs effets "
                        "indésirables affectant le même SOC. Un cas peut en revanche être comptabilisé sur plusieurs SOC "
                        "différents (en fonction des effets indésirables déclarés).",
                        className="normal-text text-justify",
                    ),
                ],
                labelClass="InternalLink normal-text",
                label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
            )
        )
    )


def SystemesOrganes(df: pd.DataFrame, code: str) -> Component:
    return TopicSection(
        [
            SectionRow(
                html.H1("Déclarations d'effets indésirables par système d'organe")
            ),
            SystemesOrganesTooltip(),
            SectionRow(
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
                    and not np.isnan(df.pourcentage_cas.unique()).all()
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
