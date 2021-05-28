from datetime import datetime as dt
from typing import Tuple, Dict

import dash.dependencies as dd
import dash_bootstrap_components as dbc
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from app import app
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_core_components import Graph
from dash_html_components import Div, P, Article, H1, H4, Span, A
from datamed_custom_components import Accordion
from db import fetch_data
from plotly.subplots import make_subplots
from sm import SideMenu

from .commons import Header
from .utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    FigureGraph,
    SectionRow,
)
from ..constants.colors import BAR_CHART_COLORS, TREE_COLORS
from ..constants.layouts import (
    RUPTURES_BAR_LAYOUT,
    TREEMAP_LAYOUT,
    get_ruptures_curve_layout,
)

INITIAL_YEAR = 2020

df_ruptures = fetch_data.fetch_table("ruptures", "numero")
df_sig = fetch_data.fetch_table("signalements", "annee")


def Description() -> Component:
    return TopicSection(
        Box(
            [
                Article(
                    [
                        ArticleTitle("Bases de données exploitées"),
                        Div(
                            "TrustMed",
                            className="normal-text-cap d-block",
                            style={"color": "#A03189"},
                        ),
                    ]
                ),
                Article(
                    [
                        ArticleTitle("Description"),
                        P(
                            " Les laboratoires pharmaceutiques exploitants ont l'obligation de déclarer toute rupture "
                            "ou tout risque de rupture concernant des médicaments d'intérêt thérapeutique majeur à "
                            "l'ANSM. L’action de l’ANSM est centrée sur la gestion des ruptures de stock et risques "
                            "de rupture de stock de ces médicaments qui peuvent entraîner un risque de santé publique.",
                            className="normal-text text-justify",
                        ),
                        P(
                            "Retrouvez différentes statistiques sur les signalements reçus par "
                            "l’Agence et les actions mises en place pour y remédier.",
                            className="normal-text text-justify",
                        ),
                        Div(
                            [
                                P(
                                    "Pour toutes les dernières informations à destination des patients et "
                                    "professionnels de santé sur les ruptures de stock en cours, consultez : ",
                                    className="normal-text text-justify d-inline",
                                ),
                                A(
                                    "ansm.sante.fr.",
                                    href="https://ansm.sante.fr/",
                                    className="normal-text ExternalLink d-inline",
                                ),
                            ],
                        ),
                    ]
                ),
                Article(
                    [
                        ArticleTitle("Avertissement"),
                        P(
                            "Les chiffres présentés ici ont pour but d’ouvrir les données au grand public afin de "
                            "communiquer sur les actions de l’Agence. Leur périmètre se limite aux ruptures de stock "
                            "au niveau des laboratoires exploitants et ne prennent pas en compte notamment les "
                            "ruptures qui peuvent être causées par le circuit de distribution. Les données antérieures "
                            "à Mai 2021 sont susceptibles de faire l'objet d'erreur de saisie.",
                            className="normal-text text-justify",
                        ),
                    ]
                ),
                Article(
                    [
                        ArticleTitle("Réutilisation des données"),
                        P("", className="normal-text"),
                    ]
                ),
            ],
        ),
        id="description",
    )


def SingleCurve(x: pd.Series, y: pd.Series, name: str, color: str) -> go.Scatter:
    return go.Scatter(
        x=x,
        y=y,
        mode="lines",
        name=name,
        line={
            "shape": "spline",
            "smoothing": 1,
            "width": 4,
            "color": color,
        },
    )


def SignalementsTotal(df: pd.DataFrame) -> Component:
    colors = ["#009640", "#00B3CC"]
    df_annee = (
        df.reset_index()
        .groupby(["annee", "classification"])
        .numero.count()
        .reset_index()
    )
    df_annee = df_annee.rename(columns={"numero": "nb_signalements"})

    fig = make_subplots()
    for idx, status in enumerate(["rupture", "risque de rupture"]):
        df_status = df_annee[df_annee.classification == status]
        fig.add_trace(
            SingleCurve(
                df_status.annee,
                df_status.nb_signalements,
                status.capitalize(),
                colors[idx],
            )
        )

    fig.update_layout(
        {
            "xaxis_showgrid": False,
            "yaxis_showgrid": False,
            "hovermode": "x unified",
            "plot_bgcolor": "#FFF",
            "paper_bgcolor": "#FFF",
            "margin": dict(t=0, b=0, l=0, r=0),
            "font": {"size": 12, "color": "black"},
            "legend": dict(
                orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1
            ),
            "hoverlabel": {"namelength": -1},
        }
    )

    fig.update_xaxes(title_text="Année")
    fig.update_yaxes(title_text="Nombre de signalements")

    return Graph(
        figure=fig,
        responsive=True,
    )


def get_signalements_circuit(circuit: str = "ville") -> Dict:
    colors = ["#5E2A7E", "#009640"]
    df = df_ruptures.reset_index()
    df_circuit = (
        df[df.circuit == circuit]
        .groupby(["annee", "etat"])
        .numero.count()
        .reset_index()
    )
    df_circuit = df_circuit.rename(columns={"numero": "nombre"})

    fig = make_subplots()
    for idx, e in enumerate(["ouvert", "clôturé"]):
        df_etat = df_circuit[df_circuit.etat == e]
        fig.add_trace(
            SingleCurve(df_etat.annee, df_etat.nombre, e.capitalize(), colors[idx])
        )

    fig.update_layout(get_ruptures_curve_layout(df_etat.annee.min()))
    fig.update_xaxes(title_text="Année")
    fig.update_yaxes(title_text="Nombre de signalements")

    return fig


def get_ruptures_circuit(circuit: str = "ville") -> go.Figure:
    df = df_ruptures.reset_index()
    df_rupture_circuit = (
        df[(df.circuit == circuit) & (df.classification == "rupture")]
        .groupby("annee")
        .numero.count()
        .reset_index()
    )
    df_rupture_circuit = df_rupture_circuit.rename(
        columns={"numero": "nombre_ruptures"}
    )
    df_rupture_circuit.head(2)

    fig = go.Figure(
        SingleCurve(
            df_rupture_circuit.annee,
            df_rupture_circuit.nombre_ruptures,
            "Rupture",
            "#00B3CC",
        )
    )

    fig.update_layout(get_ruptures_curve_layout(df_rupture_circuit.annee.min()))
    fig.update_xaxes(title_text="Année")
    fig.update_yaxes(title_text="Nombre de ruptures")

    return fig


def get_signalement_atc_curve(annee=INITIAL_YEAR):
    # set up plotly figure
    fig = make_subplots(
        specs=[[{"secondary_y": True}]],
    )

    # add first bar trace at row = 1, col = 1
    fig.add_trace(
        go.Bar(
            x=df_sig.loc[annee].head(10).label,
            y=df_sig.loc[annee].head(10).nb_signalements,
            # orientation="h",
            marker=dict(color=BAR_CHART_COLORS),
            name="Nombre de signalements",
        ),
        secondary_y=False,
    )

    # add first scatter trace at row = 1, col = 1
    fig.add_trace(
        go.Scatter(
            x=df_sig.loc[annee].head(10).label,
            y=df_sig.loc[annee].head(10).nb_presentations,
            line={
                "shape": "spline",
                "smoothing": 1,
                "width": 4,
                "color": "#00B3CC",
            },
            mode="lines",
            name="Nombre de présentations",
        ),
        secondary_y=True,
    )

    fig.update_layout(RUPTURES_BAR_LAYOUT)
    fig.update_xaxes(title_text="Classe thérapeutique")
    fig.update_yaxes(autorange="reversed")
    fig.update_yaxes(
        title_text="Nombre de signalements",
        color="#009640",
        secondary_y=False,
    )
    fig.update_yaxes(
        title_text="Nombre de présentations", color="#00B3CC", secondary_y=True
    )

    return fig


def get_causes(annee=INITIAL_YEAR):
    df = df_ruptures.reset_index()
    df_cause = df.groupby(["annee", "cause"]).numero.count().reset_index()
    df_cause.numero = df_cause.apply(
        lambda x: x.numero / len(df_cause[df_cause.annee == x.annee]), axis=1
    )
    df_cause.cause = df_cause.cause.str.capitalize()
    df_cause = df_cause.rename(columns={"numero": "nombre_signalements"}).set_index(
        "annee"
    )

    fig = px.treemap(
        df_cause.loc[annee]
        .sort_values(by="nombre_signalements", ascending=False)
        .head(10),
        path=["cause"],
        values="nombre_signalements",
        color_discrete_sequence=TREE_COLORS,
        hover_name="cause",
    )

    fig.update_layout(TREEMAP_LAYOUT)
    fig.update_traces(
        texttemplate="%{label}<br>%{value:.0f}%",
        textposition="middle center",
        textfont_size=18,
        hovertemplate="<b>%{label}</b> <br> %{value:.0f}%",
    )
    return fig


def Signalements(df: pd.DataFrame) -> Component:
    signalements = round(len(df) / len(range(2014, dt.now().year + 1)))
    return TopicSection(
        [
            SectionRow(
                H1("Nombre et nature des signalements", className="SectionTitle")
            ),
            SectionRow(
                [
                    GraphBox(
                        "",
                        [
                            FigureGraph(
                                [
                                    {
                                        "figure": "{} signalements / an".format(
                                            signalements
                                        ),
                                        "caption": "Nombre moyen de signalements par an",
                                    }
                                ]
                            ),
                        ],
                    ),
                    GraphBox(
                        "",
                        [
                            FigureGraph(
                                [
                                    {
                                        "figure": "- actions réalisées",
                                        "caption": "Signalements ayant fait l'objet d'une mesure de gestion",
                                    }
                                ]
                            ),
                        ],
                    ),
                ],
                withGutter=True,
            ),
            SectionRow(
                [
                    GraphBox(
                        "Nombre de signalements par an, par catégorie",
                        [SignalementsTotal(df_ruptures)],
                    ),
                ]
            ),
            SectionRow(
                [
                    Box(
                        [
                            Div(
                                [
                                    H4(
                                        "Nombre de signalements par classe thérapeutique",
                                        className="GraphTitle d-inline-block",
                                    ),
                                    dbc.Select(
                                        id="annee-dropdown",
                                        value=INITIAL_YEAR,
                                        options=[
                                            {"label": y, "value": y}
                                            for y in range(2014, 2021)
                                        ],
                                        className="GraphSelect d-inline-block",
                                        style={"float": "right"},
                                    ),
                                ],
                                className="mb-3",
                            ),
                            Graph(
                                figure=get_signalement_atc_curve(),
                                responsive=True,
                                id="atc-bar-chart",
                            ),
                        ],
                    ),
                ]
            ),
            SectionRow(
                Box(
                    Div(
                        [
                            Div(
                                [
                                    H4(
                                        "Statut des dossiers dans le circuit",
                                        className="GraphTitle d-inline-block",
                                    ),
                                    dbc.Select(
                                        id="circuit-dropdown",
                                        value="ville",
                                        options=[
                                            {"label": y.capitalize(), "value": y}
                                            for y in [
                                                "ville",
                                                "hôpital",
                                                "ville et hôpital",
                                            ]
                                        ],
                                        className="GraphSelect d-inline-block",
                                        style={"float": "right"},
                                    ),
                                ],
                                className="mb-5",
                            ),
                            H4(
                                "Évolution du nombre d'ouvertures et de clôtures de dossiers dans le circuit",
                                className="GraphTitle mb-3",
                            ),
                            Graph(
                                figure=get_signalements_circuit(),
                                responsive=True,
                                id="signalements-circuit",
                                className="mb-5",
                            ),
                            H4(
                                "Évolution du nombre de ruptures dans le circuit",
                                className="GraphTitle mb-3",
                            ),
                            Graph(
                                figure=get_ruptures_circuit(),
                                responsive=True,
                                id="ruptures-circuit",
                            ),
                        ],
                    )
                ),
            ),
            SectionRow(
                Box(
                    Div(
                        [
                            Div(
                                [
                                    H4(
                                        "Motifs des signalements",
                                        className="GraphTitle d-inline-block",
                                    ),
                                    dbc.Select(
                                        id="annee-causes-dropdown",
                                        value=INITIAL_YEAR,
                                        options=[
                                            {"label": y, "value": y}
                                            for y in range(2014, 2021)
                                        ],
                                        className="GraphSelect d-inline-block",
                                        style={"float": "right"},
                                    ),
                                ],
                                className="mb-3",
                            ),
                            Graph(
                                figure=get_causes(),
                                responsive=True,
                                id="causes-treemap",
                            ),
                        ],
                    )
                )
            ),
        ],
        id="signalements",
    )


def Ruptures() -> Tuple[Component, Div]:
    return (
        Header(None, type="rupture"),
        Div(
            [
                SideMenu(
                    id="side-menu",
                    items=[
                        {"id": "description", "label": "Description"},
                        {"id": "signalements", "label": "Signalements"},
                        {
                            "id": "gestion-ruptures",
                            "label": "Gestion des ruptures",
                        },
                    ],
                    className="SideMenu",
                ),
                Div(
                    Div(
                        [Description(), Signalements(df_ruptures)],
                        className="ContentWrapper ContentWrapper-hasHeader",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )


@app.callback(
    dd.Output("atc-bar-chart", "figure"),
    dd.Input("annee-dropdown", "value"),
)
def update_figure(value: str):
    if not value:
        raise PreventUpdate
    return get_signalement_atc_curve(int(value))


@app.callback(
    [
        dd.Output("signalements-circuit", "figure"),
        dd.Output("ruptures-circuit", "figure"),
    ],
    dd.Input("circuit-dropdown", "value"),
)
def update_figure(value: str):
    if not value:
        raise PreventUpdate
    return get_signalements_circuit(value), get_ruptures_circuit(value)


@app.callback(
    dd.Output("causes-treemap", "figure"),
    dd.Input("annee-causes-dropdown", "value"),
)
def update_figure(value: str):
    if not value:
        raise PreventUpdate
    return get_causes(int(value))
