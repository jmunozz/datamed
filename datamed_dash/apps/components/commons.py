from typing import List

import dash
import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import plotly.graph_objects as go
from app import app
from dash.development.base_component import Component
from dash_core_components import Graph
from db import fetch_data

from .utils import (
    Box,
    GraphBox,
    TopicSection,
    SectionTitle,
    FigureGraph,
)
from ..constants.layouts import PIE_LAYOUT

UTILISATION = {
    1: "Utilisation faible",
    2: "Utilisation faible",
    3: "Utilisation moyenne",
    4: "Utilisation élevée",
    5: "Utilisation très élevée",
    "-": "Utilisation inconnue",
}

SEXE = {1: "Hommes", 2: "Femmes"}
SEXE_IMG_URL = {
    1: app.get_asset_url("man_img.svg"),
    2: app.get_asset_url("woman_img.svg"),
}


def get_sexe_figures_from_df(df, column):
    return [
        {
            "figure": "{}%".format(round(x[column], 2)),
            "caption": SEXE[x["sexe"]],
            "img": SEXE_IMG_URL[x["sexe"]],
        }
        for x in fetch_data.transform_df_to_series_list(df)
    ]


def makePie(labels, values, pie_colors):
    return go.Figure(
        go.Pie(
            labels=labels,
            values=values,
            marker_colors=pie_colors,
        )
    ).update_layout(PIE_LAYOUT)

def NoData() -> html.Div:
    return html.Div(
        [
            html.Img(
                src=app.get_asset_url("illu_no_data.svg"),
                className="img-fluid",
                alt="Responsive image",
            ),
            html.Div(
                "Données insuffisantes pour affichage",
                className="small-text",
                style={"color": "#9e9e9e"},
            ),
        ],
        className="d-flex flex-column align-items-center",
    )


def Accordion() -> Component:
    return dbc.Card(
        [
            html.H2(
                dbc.Button(
                    "Comment sont calculés ces indicateurs ?",
                    color="link",
                    id="group-1-toggle",
                    className="color-secondary",
                ),
                className="with-lightbulb",
            ),
            dbc.Collapse(
                dbc.CardBody(
                    [
                        html.P(
                            "Estimations obtenues à partir des données Open-Medic portant sur l’usage du "
                            "médicament, délivré en pharmacie de ville en 2014 à 2018 et remboursé par l’Assurance "
                            "Maladie. Pour plus d’informations, consultez : "
                            "http://open-data-assurance-maladie.ameli.fr/medicaments/index.php"
                        ),
                        html.P(
                            "Attention : Les patients étant restitués par présentation dans les données Open Medic, "
                            "ils sont comptabilisés autant de fois qu’ils ont eu de remboursements de présentations "
                            "différentes d’un même produit/substance active. Les indicateurs restitués pourraient être "
                            "surestimés pour certains médicaments."
                        ),
                    ]
                ),
                id="collapse-1",
            ),
        ],
        className="box",
    )


def Utilisation(df_expo, index):
    if df_expo: 
        series_exposition = fetch_data.as_series(df_expo)
        exposition = series_exposition.exposition
    else: 
        exposition = "-"
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
                                    html.H1(f"{exposition}/5"),
                                ],
                                className="d-flex",
                            ),
                        ],
                        style={"flex": 1},
                        className="p-3 d-flex flex-row justify-content-around align-items-center bg-secondary",
                    ),
                    html.Div(
                        [
                            html.H2(
                                UTILISATION[exposition], className="color-secondary"
                            ),
                            html.P("Nombre de patients traités par an en France"),
                            html.A(
                                "En savoir plus sur le taux d'exposition",
                                className="color-secondary",
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


def RepartitionSexeBox(df_sexe) -> Component:
    if df_sexe is None: 
        return NoData()
    return FigureGraph(get_sexe_figures_from_df(df_sexe, "poucentage_patients"))

def RepartitionAgeBox(df_age, pie_colors) -> Component: 
    if df_age is None: 
        return NoData()
    return  Graph(
                                figure=makePie(
                                    df_age.age, df_age.pourcentage_patients, pie_colors
                                ),
                                responsive=True,
                            )

def PatientsTraites(df_age, df_sexe, df_expo, index, pie_colors: List) -> Component:
    return TopicSection(
        [
            SectionTitle("Patients traités"),
            Accordion(),
            Utilisation(df_expo, index),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par sexe des patients traités",
                        [RepartitionSexeBox(df_sexe)],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition par âge des patients traités",
                        [
                            RepartitionAgeBox(df_age, pie_colors)
                        ],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
        ],
        id="population-concernee",
    )


@app.callback(
    dd.Output("collapse-1", "is_open"),
    dd.Input("group-1-toggle", "n_clicks"),
    dd.State("collapse-1", "is_open"),
)
def toggle_accordion(n_clicks, is_open):
    ctx = dash.callback_context
    if not ctx.triggered:
        return False
    if n_clicks:
        return not is_open

