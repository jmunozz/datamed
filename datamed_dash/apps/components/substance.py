import math
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash
import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import dash_table
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
    Table,
)
from dash_core_components import Graph
from db import substance, fetch_data
from plotly.subplots import make_subplots
from sm import SideMenu

from .commons import PatientsTraites
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


def get_notif_figures_from_df(df):
    return [
        {
            "figure": "{}%".format(round(x["pourcentage_notif"])),
            "caption": x["notificateur"],
            "img": NOTIF_IMAGE_URL[x["notificateur"]],
        }
        for x in fetch_data.transform_df_to_series_list(df)
        if not math.isnan(x["pourcentage_notif"])
    ]


def EffetsIndesirablesTooltip() -> Component:
    return dbc.Card(
        [
            html.H2(
                dbc.Button(
                    "Comment sont calculés ces indicateurs ?",
                    color="link",
                    id="group-substance-ei-tooltip-toggle",
                    className="color-secondary",
                ),
                className="with-lightbulb",
            ),
            dbc.Collapse(
                dbc.CardBody(
                    [
                        html.P(
                            "Nombre de cas notifiés d’effets indésirables en France estimé à partir des données de "
                            "la Base Nationale de PharmacoVigilance (BNPV). La BNPV est alimentée par les centres "
                            "régionaux de pharmacovigilance qui sont notifiés par les professionnels de santé ou par "
                            "les patients et association agréées via un portail "
                            "dédié : https://signalement.social-sante.gouv.fr"
                        ),
                        html.P(
                            "Sont notifiés les effets indésirables que le patient ou son entourage suspecte "
                            "d’être liés à l’utilisation d’un ou plusieurs médicaments et les mésusages, abus ou "
                            "erreurs médicamenteuses. Il s’agit de cas évalués et validés par un comité d’experts. "
                            "Pour plus d’informations, "
                            "consultez : https://ansm.sante.fr/page/la-surveillance-renforcee-des-medicaments"
                        ),
                    ]
                ),
                id="group-substance-ei-tooltip-collapse",
            ),
        ],
        className="box",
    )


def Substance(code: str) -> Component:

    divs = [
        Header(code),
        Description(code),
    ]

    if code in set(fetch_data.fetch_table("substance_exposition", "code").index):
        # Load patients traités dataframes
        df_age = substance.get_age_df(code)
        df_sexe = substance.get_sexe_df(code)
        df_expo = substance.get_exposition_df(code)
        divs.append(
            PatientsTraites(
                df_age=df_age,
                df_sexe=df_sexe,
                df_expo=df_expo,
                index=code,
                pie_colors=PIE_COLORS_SUBSTANCE,
                type="substance",
            )
        )

        # Load cas déclarés EI dataframes
        df_decla = substance.get_decla_df(code)
        df_notif = substance.get_notif_df(code)
        df_cas_age = substance.get_age_cas_df(code)
        df_cas_sexe = substance.get_sexe_cas_df(code)
        divs.append(CasDeclares(df_decla, df_notif, df_cas_age, df_cas_sexe, code))

        # Load SOC dataframe
        df_soc = fetch_data.fetch_table("substance_soclong_ordei", "code")
        divs.append(SystemesOrganes(df_soc, code))

    return html.Div(
        [
            SideMenu(
                id="side-menu",
                items=[
                    {"id": "description", "label": "Description"},
                    {"id": "population-concernee", "label": "Population concernée"},
                    {
                        "id": "effets-indesirables",
                        "label": "Effets indésirables",
                    },
                ],
                className="side-menu",
            ),
            html.Div(
                divs,
                className="container side-content",
            ),
        ],
        className="container-fluid p-0 content",
    )


def Header(code: str) -> Component:
    df_sub = fetch_data.fetch_table("substance", "code")
    sub = df_sub.loc[code].nom
    return html.Div(
        [
            html.Div(sub.capitalize(), className="heading-4"),
            html.Div("Substance active", className="large-text"),
            html.A("Qu'est-ce qu'une substance active ?"),
        ],
        className="content-header",
    )


def Description(code: str) -> Component:
    df_sub = fetch_data.fetch_table("substance", "code")
    df_cis_sub = fetch_data.fetch_table(
        "specialite_substance", "code_substance"
    ).reset_index()
    df_cis = fetch_data.fetch_table("specialite", "cis").reset_index()
    df_cis_sub = (
        df_cis_sub[["code_substance", "cis"]]
        .merge(df_cis[["cis", "nom"]], on="cis")
        .rename(columns={"nom": "nom_specialite"})
    ).sort_values(by="nom_specialite")
    df_cis_sub.nom_specialite = df_cis_sub.nom_specialite.str.capitalize()

    return TopicSection(
        Box(
            [
                html.Div(
                    "Spécialités de médicaments contenant : {}".format(
                        df_sub.loc[code].nom
                    ),
                    className="medium-text mt-5",
                ),
                html.Div(
                    "{} médicaments identifiés".format(
                        len(df_cis_sub[df_cis_sub.code_substance == code])
                    ),
                    className="normal-text mt-3",
                    style={"color": "#33C2D6"},
                ),
                dash_table.DataTable(
                    id="substance-specialite-table",
                    columns=[
                        {"name": i, "id": i}
                        for i in df_cis_sub[df_cis_sub.code_substance == code][
                            ["nom_specialite"]
                        ].columns
                    ],
                    data=df_cis_sub[df_cis_sub.code_substance == code].to_dict(
                        "records"
                    ),
                    page_size=10,
                    style_as_list_view=True,
                    style_table={"overflowX": "auto"},
                    style_cell={
                        "height": "50px",
                        "backgroundColor": "#FAFAFA",
                    },
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


def CasDeclares(
    df: pd.DataFrame,
    df_notif: pd.DataFrame,
    df_cas_age: pd.DataFrame,
    df_cas_sexe: pd.DataFrame,
    code: str,
) -> Component:
    decla = int(fetch_data.get_one_value(df, code, "cas"))
    taux_cas = round(fetch_data.get_one_value(df, code, "taux_cas"))

    # Notificators graph
    figure_graph_notif = (
        FigureGraph(
            get_notif_figures_from_df(df_notif.sort_values(by="pourcentage_notif", ascending=False)),
            height="80px",
            class_name="justify-content-start",
        )
        if not df_notif.empty
        else NoData()
    )

    # Consumers curves graphs
    fig = make_subplots(specs=[[{"secondary_y": True}]])
    if df.cas_annee.min() > 10:
        fig.add_trace(
            go.Scatter(
                x=df.annee,
                y=df.cas_annee,
                mode="lines",
                name="Cas déclarés",
                line={
                    "shape": "spline",
                    "smoothing": 1,
                    "width": 4,
                    "color": "#F599B5",
                },
            ),
            secondary_y=False,
        )

    fig.add_trace(
        go.Scatter(
            x=df.annee,
            y=df.conso_annee,
            mode="lines",
            name="Patients traités",
            line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#EA336B"},
            hoverlabel={"namelength": -1},
        ),
        secondary_y=True,
    )

    fig.update_yaxes(
        title_text="Déclarations d'effets indésirables",
        color="#F599B5",
        secondary_y=False,
    )
    fig.update_yaxes(title_text="Patients traités", color="#EA336B", secondary_y=True)
    fig.update_xaxes(title_text="Années", nticks=len(df.loc[code]))
    fig.update_layout(CURVE_LAYOUT)

    # Sex repartition graph
    figure_graph_sexe = (
        NoData()
        if df_cas_sexe.empty
        else FigureGraph(
            commons.get_sexe_figures_from_df(df_cas_sexe, "pourcentage_cas")
        )
    )

    # Age repartition graph
    # Check if percentages are NaN values
    if not np.isnan(df_cas_age.pourcentage_cas.unique()).any():
        fig_age = go.Figure(
            go.Pie(
                labels=df_cas_age.age,
                values=df_cas_age.pourcentage_cas,
                marker_colors=PIE_COLORS_SUBSTANCE,
            )
        ).update_layout(PIE_LAYOUT)
        graph_age = Graph(
            figure=fig_age,
            responsive=True,
        )
    else:
        graph_age = NoData()

    return TopicSection(
        [
            SectionTitle("Cas déclarés d'effets indésirables"),
            EffetsIndesirablesTooltip(),
            dbc.Row(
                [
                    GraphBox(
                        "",
                        [
                            FigureGraph(
                                [
                                    {
                                        "figure": f"{decla}",
                                        "caption": "Nombre de cas déclarés sur la période 2014-2018",
                                    }
                                ]
                            )
                        ],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "",
                        [
                            FigureGraph(
                                [
                                    {
                                        "figure": f"{taux_cas} / 100 000",
                                        "caption": "Taux de déclaration pour 100 000 patients "
                                        "traités/an sur la période 2014-2018",
                                    }
                                ]
                            )
                        ],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Nombre de cas déclarés d’effets indésirables et patients traités par année",
                        [
                            Graph(
                                figure=fig,
                                responsive=True,
                            )
                        ],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par sexe des cas déclarés",
                        [figure_graph_sexe],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition par âge des cas déclarés",
                        [graph_age],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par type de notificateur",
                        [figure_graph_notif],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
        ],
        id="effets-indesirables",
    )


def SystemesOrganes(df: pd.DataFrame, code: str) -> Component:
    fig = px.treemap(
        df.loc[code].sort_values(by="pourcentage_cas", ascending=False).head(10),
        path=["soc_long"],
        values="pourcentage_cas",
        color_discrete_sequence=TREE_COLORS,
        hover_name="soc_long",
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

    return TopicSection(
        [
            SectionTitle("Effets indésirables par système d'organe"),
            SectionP(
                "Les Systèmes d’organes (Système Organe Classe ou SOC) représentent les 27 classes de disciplines "
                "médicales selon la hiérarchie MedDRA Sont listés ici les 10 SOC avec le plus d’effets indésirables "
                "déclarés. Attention : Un cas est comptabilisé qu’une seule fois par SOC en cas de plusieurs effets "
                "indésirables affectant le même SOC. Un cas peut en revanche être comptabilisé sur plusieurs SOC "
                "différents (en fonction des effets indésirables déclarés)."
            ),
            dbc.Row(
                [
                    GraphBox(
                        "",
                        [
                            html.Div(
                                Graph(
                                    figure=fig,
                                    responsive=True,
                                    id="soc-treemap",
                                ),
                                id="soc-treemap-container",
                            ),
                            html.Div(id="selected-soc", className="d-none"),
                            HltModal(),
                        ],
                        class_name_wrapper="col-md-12",
                    ),
                ]
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
        col = active_cell["column_id"]
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

        df_hlt = fetch_data.fetch_table("substance_hlt_ordei", "code")
        df_hlt = df_hlt.where(pd.notnull(df_hlt), None)
        df_hlt_details = (
            df_hlt[df_hlt.soc_long == selected_soc]
            .loc[code]
            .sort_values(by="pourcentage_cas", ascending=False)
        ).reset_index()
        df_hlt_details.pourcentage_cas = df_hlt_details.pourcentage_cas.apply(
            lambda x: "{}%".format(round(x)) if x else ""
        )
        df_hlt_details = df_hlt_details.rename(
            columns={"effet_hlt": "High-Level-Term", "pourcentage_cas": "Pourcentage"}
        )

        # fig_hlt = px.treemap(
        #     df_hlt_details.sort_values(by="pourcentage_cas", ascending=False).head(10),
        #     path=["effet_hlt"],
        #     values="pourcentage_cas",
        #     color_discrete_sequence=TREE_COLORS,
        #     hover_name="effet_hlt",
        # )

        return (
            True,
            Table.from_dataframe(
                df_hlt_details[["High-Level-Term", "Pourcentage"]],
                striped=True,
                bordered=True,
                hover=True,
                responsive=True,
            ),
            # Graph(
            #     figure=fig_hlt,
            #     responsive=True,
            # ),
            selected_soc,
            selected_soc,
        )
    else:
        return False, "", "", ""


# @app.callback(
#     dd.Output("collapse-1", "is_open"),
#     dd.Input("group-1-toggle", "n_clicks"),
#     dd.State("collapse-1", "is_open"),
# )
# def toggle_accordion(n_clicks, is_open):
#     ctx = dash.callback_context
#     if not ctx.triggered:
#         return False
#     if n_clicks:
#         return not is_open
