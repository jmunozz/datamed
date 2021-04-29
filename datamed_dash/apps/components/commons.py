import dash
import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import dash_table
import plotly.express as px
import plotly.graph_objects as go
import requests
from app import app
from bs4 import BeautifulSoup
from dash.development.base_component import Component
from dash_core_components import Graph
from db import specialite, substance, fetch_data
from sm import SideMenu

from .utils import Box, GraphBox, TopicSection, ArticleTitle, SectionTitle, ExternalLink, SectionP, FigureGraph
from ..constants.colors import PIE_COLORS_SPECIALITE
from ..constants.layouts import PIE_LAYOUT, STACKED_BAR_CHART_LAYOUT



UTILISATION = {
    1: "Utilisation faible",
    2: "Utilisation faible",
    3: "Utilisation moyenne",
    4: "Utilisation élevée",
    5: "Utilisation élevée",
}

SEXE = {
    1: "Hommes", 
    2: "Femmes"
}

EI = {
    "Non": "Sans effets indésirables", 
    "Oui": "Avec effets indésirables"
}

def get_sexe_figures_from_df(df, column): 
    return [{"figure": round(x[column], 2), "caption": SEXE[x["sexe"]]} for x in fetch_data.transform_df_to_series_list(df)]

def makePie(labels, values): 
    return go.Figure(
        go.Pie(
            labels=labels,
            values=values,
            marker_colors=PIE_COLORS_SPECIALITE,  # px.colors.qualitative.Set3,
        )
    ).update_layout(PIE_LAYOUT)


def Accordion() -> Component:
    return dbc.Card(
        [
            html.H2(
                dbc.Button(
                    "Comment sont calculés ces indicateurs ?",
                    color="link",
                    id="group-1-toggle",
                    className="color-secondary"
                ),
                className="with-lightbulb",
            ),
            dbc.Collapse(
                dbc.CardBody(
                    [
                        html.P(
                            "Estimations obtenues à partir des données Open-Medic portant sur l’usage du médicament, délivré en pharmacie de ville en 2014 à 2018 et remboursé par l’Assurance Maladie. Pour plus d’informations, consultez : http://open-data-assurance-maladie.ameli.fr/medicaments/index.php"
                        ),
                        html.P(
                            "Attention : Les patients étant restitués par présentation dans les données Open Medic, ils sont comptabilisés autant de fois qu’ils ont eu de remboursements de présentations différentes d’un même produit/substance active. Les indicateurs restitués pourraient être surestimés pour certains médicaments."
                        ),
                    ]
                ),
                id="collapse-1",
            ),
        ],
        className="box",
    )

def Utilisation(df_expo, index):
    utilisation = df_expo.at[index, "exposition"][0]
    print(utilisation)
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
                                    html.H1(f"{utilisation}/5"),
                                ],
                                className="d-flex",
                            ),
                        ],
                        style={"flex": 1},
                        className="p-3 d-flex flex-row justify-content-around align-items-center bg-secondary",
                    ),
                    html.Div(
                        [
                            html.H2(UTILISATION[utilisation], className="color-secondary"),
                            html.P("Nombre de patients traités par an en France"),
                            html.A("En savoir plus sur le taux d'exposition", className="color-secondary"),
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

def PatientsTraites(df_age, df_sexe, df_expo, index) -> Component:
    sexe_figures = get_sexe_figures_from_df(df_sexe, "pourcentage_patients")
    return TopicSection(
        [
            SectionTitle("Patients traités"),
            Accordion(),
            Utilisation(df_expo, index),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par sexe des patients traités",
                        [FigureGraph(sexe_figures)],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition par âge des patients traités",
                        [
                            Graph(
                                figure=makePie(df_age.age, df_age.pourcentage_patients),
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
