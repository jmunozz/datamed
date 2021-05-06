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
                html.Div(
                    [
                        html.Div(
                            html.Div(
                                [
                                    html.H1(
                                        "Des données accessibles et expliquées, au service des patients"
                                    ),
                                    html.P(
                                        "L’Agence Nationale de Sécurité du Médicament et des Produits de Santé (ANSM) ouvre ses données de manière pédagogique pour permettre au plus grand nombre de réaliser des choix éclairés"
                                    ),
                                ],
                                className="fp-wrapper fp-content",
                            ),
                            className="fp-half",
                        ),
                        dbc.Col(
                            html.Img(src=app.get_asset_url("frontpage_img_1.svg")),
                            className="fp-half with-p-y",
                        ),
                    ],
                    className="fp-section fp-section-1",
                ),
                html.Div(
                    [
                        html.Div(
                            html.Img(
                                src=app.get_asset_url("frontpage_img_1.svg"),
                                style={"transform": "scaleX(-1)"},
                            ),
                            className="fp-half with-p-y",
                        ),
                        html.Div(
                            html.Div(
                                [
                                    html.H1(
                                        "Une plateforme unique pour réunir les données essentielles de l’ANSM"
                                    ),
                                    html.P(
                                        "L’ANSM ouvrira dans un premier temps ses données autour des médicaments et suivront celles des ruptures de stocks, du bon usage des médicaments, des essais cliniques et bien d’autres !"
                                    ),
                                    html.A(
                                        "À propos",
                                        className="btn-outline-primary btn-lg",
                                        role="button",
                                        href="#",
                                    ),
                                ],
                                className="fp-wrapper fp-content",
                            ),
                            className="fp-half",
                        ),
                    ],
                    className="fp-section",
                ),
                html.Div(
                    [
                        html.Div(
                            [
                                html.H1(
                                    "À qui cette plateforme s’adresse ?",
                                    className="title-center title-standalone",
                                ),
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "doctor_female.svg"
                                                    ),
                                                    style={"height": "150px"},
                                                ),
                                                html.H2(
                                                    "Grand public",
                                                    style={
                                                        "minHeight": "75px",
                                                        "text-align": "center",
                                                    },
                                                ),
                                                html.P(
                                                    "Citoyen, patient temporaire, patient chronique, aidant, associations de patients"
                                                ),
                                            ],
                                            className="stacked feature",
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
                                                html.H2(
                                                    "Professionnel de santé",
                                                    style={
                                                        "minHeight": "75px",
                                                        "text-align": "center",
                                                    },
                                                ),
                                                html.P(
                                                    "Médecins généralistes et spécialistes, pharmaciens, infirmiers, intervenants du paramédical"
                                                ),
                                            ],
                                            className="stacked feature",
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
                                                html.H2(
                                                    "Expert en données",
                                                    style={
                                                        "minHeight": "75px",
                                                        "text-align": "center",
                                                    },
                                                ),
                                                html.P(
                                                    "Journalistes, data analysts, chercheurs, éditeurs de logiciels"
                                                ),
                                            ],
                                            className="feature stacked",
                                            style={"maxWidth": "300px"},
                                        ),
                                    ],
                                    className="features",
                                ),
                            ],
                            className="fp-full",
                        ),
                    ],
                    className="fp-section fp-section-3",
                ),
                html.Div(
                    [
                        html.Div(
                            html.Div(
                                [
                                    html.H1("Origine et nature des données"),
                                    html.P(
                                        "Les données de la plateforme proviennent de bases gerées en majorité par l’ANSM, et d’autres proviennent de bases open source gerées par d’autres institutions de santé (CNAM, HAS)."
                                    ),
                                    html.P(
                                        "Elles sont alimentées par les parties prenantes (agents de l’ANSM, institutions, grand public, professionnels de santé, industriels)."
                                    ),
                                    html.A(
                                        "Explorer les données",
                                        className="btn-outline-primary btn-lg",
                                        role="button",
                                        href="#",
                                    ),
                                ],
                                className="fp-wrapper fp-content",
                            ),
                            className="fp-half",
                        ),
                        html.Div(
                            html.Img(src=app.get_asset_url("frontpage_img_2.svg")),
                            className="fp-half with-p-y",
                        ),
                    ],
                    className="fp-section",
                ),
            ],
            className="container-fluid p-0",
        ),
    )

