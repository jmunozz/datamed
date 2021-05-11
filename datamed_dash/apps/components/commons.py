from typing import List, Dict, Optional

import dash
import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import pandas as pd
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

UTILISATION_IMG_URL = {
    "-": app.get_asset_url("Indice-1.svg"),
    1: app.get_asset_url("Indice-1.svg"),
    2: app.get_asset_url("Indice-2.svg"),
    3: app.get_asset_url("Indice-3.svg"),
    4: app.get_asset_url("Indice-4.svg"),
    5: app.get_asset_url("Indice.svg"),
}

SEXE = {1: "Hommes", 2: "Femmes"}

SEXE_IMG_URL = {
    1: app.get_asset_url("man_img.svg"),
    2: app.get_asset_url("woman_img.svg"),
}


def get_sexe_figures_from_df(df: pd.DataFrame, column: str) -> List[Dict]:
    df = df.where(pd.notnull(df), None)
    sexe_percentage_data = fetch_data.transform_df_to_series_list(df)
    return [
        {
            "figure": "{}%".format(round(x[column]))
            if x[column]
            else "Données insuffisantes",
            "caption": SEXE[x["sexe"]],
            "img": SEXE_IMG_URL[x["sexe"]],
        }
        for x in sexe_percentage_data
    ]


def makePie(labels: pd.Series, values: pd.Series, pie_colors: List):
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
                        html.Div(
                            [
                                html.Span(
                                    "Estimations obtenues à partir des données Open MEDIC portant sur l’usage du "
                                    "médicament, délivré en pharmacie de ville entre 2014 et 2018 et remboursé par "
                                    "l’Assurance Maladie. Pour plus d’informations, consultez : ",
                                    className="normal-text",
                                ),
                                html.A(
                                    "open-data-assurance-maladie.ameli.fr",
                                    href="http://open-data-assurance-maladie.ameli.fr/medicaments/index.php",
                                    className="normal-text link",
                                ),
                            ]
                        ),
                        html.P(
                            [
                                html.Strong("Attention", className="normal-text-bold"),
                                html.Span(
                                    " : l’estimation du nombre de patients repose sur des données agrégées au niveau "
                                    "de la présentation du médicament (code CIP). Les patients sont donc comptabilisés "
                                    "autant de fois qu’ils ont eu de remboursements de présentations différentes d’une "
                                    "même spécialité/substance active.",
                                    className="normal-text",
                                ),
                            ],
                            className="mt-3",
                        ),
                    ]
                ),
                id="collapse-1",
            ),
        ],
        className="box",
    )


def Utilisation(df_expo: Optional[pd.DataFrame]) -> Component:
    if df_expo is not None:
        series_exposition = fetch_data.as_series(df_expo)
        exposition = int(series_exposition.exposition)
        patients = "{:,} patients / an".format(
            int(series_exposition.conso_an_trunc)
        ).replace(",", " ")
    else:
        exposition = "-"
        patients = "Données insuffisantes"

    return dbc.Row(
        [
            Box(
                [
                    html.Div(
                        [
                            html.Div(
                                [
                                    html.Img(src=UTILISATION_IMG_URL[exposition]),
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
                            html.H2(patients, className="color-secondary"),
                            html.P(
                                "Approximation du nombre de patients traités sur la période 2014-2018"
                            ),
                            html.A(
                                "En savoir plus",
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


def RepartitionSexeBox(df_sexe: pd.DataFrame) -> Component:
    if df_sexe is None:
        return NoData()
    return FigureGraph(get_sexe_figures_from_df(df_sexe, "pourcentage_patients"))


def RepartitionAgeBox(df_age: pd.DataFrame, pie_colors: List) -> Component:
    if df_age is None:
        return NoData()
    return Graph(
        figure=makePie(df_age.age, df_age.pourcentage_patients, pie_colors),
        responsive=True,
    )


def PatientsTraites(
    df_age: pd.DataFrame,
    df_sexe: pd.DataFrame,
    df_expo: pd.DataFrame,
    pie_colors: List,
) -> Component:
    return TopicSection(
        [
            SectionTitle("Patients traités"),
            Accordion(),
            Utilisation(df_expo),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par sexe des patients traités",
                        [RepartitionSexeBox(df_sexe)],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition par âge des patients traités",
                        [RepartitionAgeBox(df_age, pie_colors)],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
        ],
        id="population-concernee",
    )


def Header(series_spe: pd.Series, type="specialite") -> Component:
    background_color = "#5E2A7E" if type == "specialite" else "#A03189"
    icon_url = (
        app.get_asset_url("pill.svg")
        if type == "specialite"
        else app.get_asset_url("substance_icon.svg")
    )
    type_label = (
        "Spécialité de médicament" if type == "specialite" else "Substance active"
    )
    help_link_component = (
        html.A("Qu'est-ce qu'une spécialité de médicament ?")
        if type == "specialite"
        else html.A("Qu'est-ce qu'une substance active ?")
    )
    return html.Div(
        html.Div(
            [
                html.Div(
                    html.Img(src=icon_url),
                    className="content-header-img",
                ),
                html.Div(
                    [
                        html.Div(series_spe.nom.capitalize(), className="heading-4"),
                        html.Div(type_label, className="large-text"),
                        help_link_component,
                    ],
                    className="content-header-text",
                ),
            ],
            className="content-header-content",
        ),
        className="content-header",
        style={"backgroundColor": background_color},
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
