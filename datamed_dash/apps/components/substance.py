from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash
import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import dash_table
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
from app import app
from bs4 import BeautifulSoup
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_core_components import Graph
from db import specialite, substance, fetch_data
from sm import SideMenu
from apps.components.specialite import Accordion, UTILISATION

from .utils import Box, GraphBox, TopicSection, ArticleTitle, SectionTitle, ExternalLink
from ..constants.colors import PIE_COLORS
from ..constants.layouts import PIE_LAYOUT, STACKED_BAR_CHART_LAYOUT

code = "00001"


def Substance(code: str) -> Component:
    return html.Div(
        [
            SideMenu(
                id="side-menu",
                items=[
                    {"id": "description", "label": "Description"},
                    {"id": "population-concernee", "label": "Population concernée"},
                    {
                        "id": "erreurs-medicamenteuses",
                        "label": "Données de pharmacovigilance",
                    },
                ],
                className="side-menu",
            ),
            html.Div(
                [
                    Header(code),
                    Description(code),
                    PatientsTraites(code),
                    #EffetsIndesirables(code),
                ],
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


def Utilisation(code: str):
    df_expo = fetch_data.fetch_table("substance_exposition", "code")
    utilisation = df_expo.loc[code].exposition.values[0]
    return dbc.Row(
        [
            Box(
                [
                    html.Div(
                        [
                            html.Div(
                                [
                                    html.Img(
                                        src=app.get_asset_url("family_restroom.svg")
                                    ),
                                    html.P("INDICE"),
                                ],
                                className="d-flex flex-column",
                            ),
                            html.Div(
                                [
                                    html.Div(str(utilisation), className="heading-1"),
                                    html.Div("/5", className="heading-4"),
                                ],
                                className="d-flex",
                            ),
                        ],
                        style={"flex": 1, "backgroundColor": "#00B3CC"},
                        className="p-3 d-flex flex-row justify-content-around align-items-center on-background",
                    ),
                    html.Div(
                        [
                            html.Div(UTILISATION[utilisation], className="heading-4"),
                            html.Div(
                                "Nombre de patients traités par an en France",
                                className="normal-text",
                            ),
                            html.Div(
                                "En savoir plus sur le taux d'exposition",
                                className="normal-text link",
                                style={"color": "#00B3CC"},
                            ),
                        ],
                        style={"flex": 3},
                        className="p-3",
                    ),
                ],
                class_name_wrapper="col-md-12",
                class_name="p-0 d-flex",
            )
        ]
    )


# def SubstanceDiv(code: str) -> Component:
#     return html.Div(
#         html.Div(
#             html.Div(
#                 html.Div(
#                     [
#                         html.Div(
#                             html.I(
#                                 className="bi bi-book d-flex justify-content-center pt-3",
#                                 style={"font-size": "3rem"},
#                             ),
#                             className="position-absolute",
#                         ),
#                         html.Div(
#                             [
#                                 html.Div(
#                                     code,
#                                     className="heading-4",
#                                 ),
#                                 html.Div(
#                                     [
#                                         html.Div(
#                                             "SUBSTANCE ACTIVE",
#                                             className="caption-text d-inline-block",
#                                         ),
#                                         html.I(
#                                             className="info-icon bi bi-info-circle d-inline-block",
#                                             id="substance-info-icon",
#                                         ),
#                                         html.Tooltip(
#                                             "Composant d'une spécialité pharmaceutique reconnu "
#                                             "comme possédant des propriétés thérapeutiques.",
#                                             target="substance-info-icon",
#                                             placement="right",
#                                         ),
#                                     ]
#                                 ),
#                                 html.Div(
#                                     "Spécialités de médicaments contenant : {}".format(
#                                         code
#                                     ),
#                                     className="medium-text mt-5",
#                                 ),
#                                 html.Div(
#                                     "{} médicaments identifiés".format(
#                                         len(spe_dataframe)
#                                     ),
#                                     className="normal-text mt-3",
#                                     style={"color": "#33C2D6"},
#                                 ),
#                                 dash_table.DataTable(
#                                     id="substance-specialite-table",
#                                     columns=[
#                                         {"name": i, "id": i}
#                                         for i in spe_dataframe.columns
#                                     ],
#                                     data=spe_dataframe.to_dict("records"),
#                                     page_size=10,
#                                     style_as_list_view=True,
#                                     style_table={"overflowX": "auto"},
#                                     style_cell={
#                                         "height": "40px",
#                                     },
#                                     style_data={
#                                         "fontSize": "12px",
#                                         "fontWeight": "400",
#                                         "font-family": "Roboto",
#                                         "lineHeight": "16px",
#                                         "textAlign": "left",
#                                     },
#                                     style_header={"display": "none"},
#                                 ),
#                             ],
#                             className="pr-5",
#                             style={"padding-left": "70px"},
#                         ),
#                     ],
#                     className="description",
#                 ),
#                 className="col-md-12",
#             ),
#             className="row",
#         ),
#         className="col-12",
#     )


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
    ).set_index("code_substance").sort_values(by="nom_specialite")

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
                    "{} médicaments identifiés".format(len(df_cis_sub.loc[code])),
                    className="normal-text mt-3",
                    style={"color": "#33C2D6"},
                ),
                dash_table.DataTable(
                    id="substance-specialite-table",
                    columns=[
                        {"name": i, "id": i}
                        for i in df_cis_sub.loc[code].columns
                    ],
                    data=df_cis_sub.loc[code].to_dict("records"),
                    page_size=10,
                    style_as_list_view=True,
                    style_table={"overflowX": "auto"},
                    style_cell={
                        "height": "40px",
                    },
                    style_data={
                        "fontSize": "12px",
                        "fontWeight": "400",
                        "font-family": "Roboto",
                        "lineHeight": "16px",
                        "textAlign": "left",
                    },
                    style_header={"display": "none"},
                ),
            ],
            class_name_wrapper="overlap-top-content",
        ),
        id="description",
    )


def PatientsTraites(code: str) -> Component:
    df_age = fetch_data.fetch_table("substance_patient_age_ordei", "code")
    fig = go.Figure(
        go.Pie(
            labels=df_age.loc[code].age,
            values=df_age.loc[code].pourcentage_patients,
            marker_colors=PIE_COLORS,  # px.colors.qualitative.Set3,
        )
    ).update_layout(PIE_LAYOUT)

    return TopicSection(
        [
            SectionTitle("Patients traités"),
            Accordion(),
            Utilisation(code),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par sexe des patients traités",
                        [],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition par âge des patients traités",
                        [
                            Graph(
                                figure=fig,
                                responsive=True,
                            )
                        ],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
        ],
        id="population-concernee",
    )


# def EffetsIndesirables(cis: str) -> Component:
#     df_cis_sub = fetch_data.fetch_table("specialite_substance", "cis").reset_index()
#     df_sub = fetch_data.fetch_table("substance", "code").reset_index()
#     df = df_cis_sub[df_cis_sub.cis == cis].merge(
#         df_sub, left_on="code_substance", right_on="code", how="left"
#     )
#     substances_list = df.nom.unique()
#
#     return TopicSection(
#         [
#             SectionTitle(
#                 "Cas déclarés d’effets indésirables des substances actives du Doliprane"
#             ),
#             html.Div(
#                 "Sont notifiés les effets indésirables que le patient ou son entourage suspecte d’être liés à "
#                 "l’utilisation d’un ou plusieurs médicaments et les mésusages, abus ou erreurs médicamenteuses. "
#                 "Il s’agit de cas évalués et validés par un comité d’experts.",
#                 className="normal-text",
#             ),
#             dbc.Row(
#                 [
#                     AdverseEffectLink(substance.capitalize())
#                     for substance in substances_list
#                 ]
#             ),
#         ],
#         id="",
#     )


def AdverseEffectLink(
    substance: str, class_name="normal-text-bold", style={"color": "#00B3CC"}
) -> Component:
    return Box(substance, class_name=class_name, style=style)


@app.callback(
    dd.Output("url", "href"),
    [
        dd.Input("substance-specialite-table", "active_cell"),
        dd.Input("substance-specialite-table", "page_current"),
        dd.Input("substance-specialite-table", "page_size"),
    ],
    dd.State("substance-specialite-table", "data"),
)
def getActiveCell(active_cell, page_current, page_size, data):
    if active_cell:
        print(active_cell)
        col = active_cell["column_id"]
        row = active_cell["row"]
        cellData = data[(page_current or 0) * page_size + row]["cis"]
        return "/apps/specialite?" + urlencode({"search": quote_plus(cellData)})
    else:
        raise PreventUpdate

# @app.callback(
#     [
#         dd.Output("update-on-click-data", "is_open"),
#         dd.Output("body-modal", "children"),
#         dd.Output("header-modal", "children"),
#         dd.Output("selected-soc", "children"),
#     ],
#     [
#         dd.Input("soc-chart-container", "n_clicks"),
#         dd.Input("close-backdrop", "n_clicks"),
#         dd.Input("url", "href"),
#     ],
#     [dd.State("selected-soc", "children"), dd.State("soc-bar-chart", "hoverData")],
# )
# def update_callback(
#     clicks_container, clicks_close, href, previous_selected_soc, hover_data
# ):
#     if not hover_data:
#         return False, "", "", ""
#
#     selected_soc = hover_data["points"][0]["label"]
#     selected_soc_has_changed = selected_soc != previous_selected_soc
#
#     if selected_soc_has_changed:
#         parsed_url = urlparse(unquote_plus(href))
#         query = parse_qs(parsed_url.query)
#         selected_med = query["search"][0]
#
#         if SPE_SA_DICT[selected_med] == "spécialité":
#             medicament = SUBSTANCE_BY_SPECIALITE[selected_med]["produit"]
#         else:
#             medicament = selected_med
#
#         df_hlt = pd.DataFrame(MED_DICT[medicament]["hlt"])
#         df_hlt = df_hlt.rename(
#             columns={"effet_hlt": "Détail des effets rapportés par nombre décroissant"}
#         )
#         df_hlt_details = df_hlt[df_hlt.soc_long == selected_soc][
#             ["Détail des effets rapportés par nombre décroissant"]
#         ]
#         return (
#             True,
#             Table.from_dataframe(
#                 df_hlt_details,
#                 striped=True,
#                 bordered=True,
#                 hover=True,
#                 responsive=True,
#             ),
#             selected_soc,
#             selected_soc,
#         )
#     else:
#         return False, "", "", ""


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
