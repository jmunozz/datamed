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
from dash_core_components import Graph
from db import specialite, fetch_data
from sm import SideMenu

from .commons import PatientsTraites, NoData, Header
from .utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    SectionTitle,
    ExternalLink,
    SectionP,
    FigureGraph,
)


def FrontPage() -> Component:
    return (
        html.Div(className="header-space"),
        html.Div(
            [
                dbc.Row(
                    [
                        dbc.Col(
                            [
                                SectionTitle(
                                    "Des données accessibles et expliquées, au service des patients"
                                ),
                                html.P(
                                    "L’Agence Nationale de Sécurité du Médicament et des Produits de Santé (ANSM) ouvre ses données de manière pédagogique pour permettre au plus grand nombre de réaliser des choix éclairés"
                                ),
                            ],
                            md=6,
                        ),
                        dbc.Col(
                            html.Img(src=app.get_asset_url("frontpage_img_1.svg")), md=6
                        ),
                    ]
                ),
                dbc.Row(
                    [
                        dbc.Col(
                            html.Img(
                                src=app.get_asset_url("frontpage_img_1.svg"),
                                style={"transform": "scaleX(-1)", "float": "right"},
                            ),
                            md=6,
                        ),
                        dbc.Col(
                            [
                                SectionTitle(
                                    "Une plateforme unique pour réunir les données essentielles de l’ANSM"
                                ),
                                html.P(
                                    "L’ANSM ouvrira dans un premier temps ses données autour des médicaments et suivront celles des ruptures de stocks, du bon usage des médicaments, des essais cliniques et bien d’autres !"
                                ),
                                html.A(
                                    "À propos",
                                    className="btn-primary btn-lg",
                                    role="button",
                                    href="#",
                                ),
                            ],
                            md=6,
                        ),
                    ]
                ),
                dbc.Row(
                    [
                        SectionTitle("À qui cette plateforme s’adresse ?"),
                        dbc.Col(
                            dbc.Row(
                                dbc.Col(
                                    [
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "doctor_female.svg"
                                                    ),
                                                    style={"height": "150px"},
                                                ),
                                                html.H2("Grand public"),
                                                html.P(
                                                    "Citoyen, patient temporaire, patient chronique, aidant, associations de patients"
                                                ),
                                            ],
                                            className="stacked",
                                            style={"maxWidth": "300px"},
                                        ),
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "doctor_female.svg"
                                                    ),
                                                    style={"height": "150px"},
                                                ),
                                                html.H2("Grand public"),
                                                html.P(
                                                    "Citoyen, patient temporaire, patient chronique, aidant, associations de patients"
                                                ),
                                            ],
                                            className="stacked",
                                            style={"maxWidth": "300px"},
                                        ),
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "doctor_female.svg"
                                                    ),
                                                    style={"height": "150px"},
                                                ),
                                                html.H2("Grand public"),
                                                html.P(
                                                    "Citoyen, patient temporaire, patient chronique, aidant, associations de patients"
                                                ),
                                            ],
                                            className="stacked",
                                            style={"maxWidth": "300px"},
                                        ),
                                    ],
                                    md=12,
                                    className="d-flex justify-content-between",
                                )
                            ),
                            md=12,
                        ),
                    ]
                ),
            ],
            className="container",
            style={"marginTop": "50px"},
        ),
    )

