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
from dash_html_components import Div, P, H1, H4, A, Span
from db import fetch_data
from plotly.subplots import make_subplots
from sm import SideMenu

from .commons import BoxArticle, Header
from .utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    FigureGraph,
    SectionRow,
)
from ..constants.colors import BAR_CHART_COLORS, TREE_COLORS, PIE_COLORS_SPECIALITE
from ..constants.layouts import (
    PIE_LAYOUT,
    RUPTURES_BAR_LAYOUT,
    TREEMAP_LAYOUT,
    CURVE_LAYOUT,
    get_ruptures_curve_layout,
)

INITIAL_YEAR = 2021

df_ruptures = fetch_data.fetch_table("ruptures", "numero")
df_sig = fetch_data.fetch_table("signalements", "annee")
df_mesures = fetch_data.fetch_table("mesures", "index")


def Description() -> Component:
    return TopicSection(
        Box(
            [
                BoxArticle(
                    [
                        ArticleTitle("Bases de données exploitées"),
                        Div(
                            "TrustMed",
                            className="normal-text-cap d-block",
                            style={"color": "#A03189"},
                        ),
                    ]
                ),
                BoxArticle(
                    [
                        ArticleTitle("Description"),
                        P(
                            " Les laboratoires pharmaceutiques exploitants ont l'obligation de déclarer toute rupture "
                            "ou risque de rupture concernant des médicaments d'intérêt thérapeutique majeur à "
                            "l'ANSM. L’action de l’ANSM est centrée sur la gestion des ruptures de stock et risques "
                            "de rupture de stock de ces médicaments qui peuvent entraîner un risque de santé publique.",
                            className="normal-text justify-text",
                        ),
                        P(
                            "Retrouvez différentes statistiques sur les signalements reçus par "
                            "l’Agence et les actions mises en place pour y remédier.",
                            className="normal-text justify-text",
                        ),
                        Div(
                            [
                                Span(
                                    "Pour toutes les dernières informations à destination des patients et "
                                    "professionnels de santé sur les ruptures de stock en cours, consultez : ",
                                    className="normal-text justify-text",
                                ),
                                A(
                                    "ansm.sante.fr.",
                                    href="https://ansm.sante.fr/",
                                    className="normal-text Link",
                                    target="_blank",
                                ),
                            ],
                        ),
                    ]
                ),
                BoxArticle(
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

    fig.update_layout(CURVE_LAYOUT)
    fig.update_xaxes(title_text="Année")
    fig.update_yaxes(title_text="Nombre de signalements")

    return Graph(
        figure=fig,
        responsive=True,
    )


def get_signalements_circuit(circuit: str = "ville") -> Dict:
    colors = ["#5E2A7E", "#009640"]
    df = df_ruptures.reset_index()

    df_circuit = df[(df.circuit == circuit) & (df.date >= "2021-05-04")]
    df_circuit.date = df_circuit.date.apply(lambda x: dt(x.year, x.month, 1))
    df_circuit = (
        df_circuit[df_circuit.circuit == circuit]
        .groupby(["date", "etat"])
        .numero.count()
        .reset_index()
    )
    df_circuit = df_circuit.rename(columns={"numero": "nombre"})

    fig = make_subplots()
    for idx, e in enumerate(["ouvert", "clôturé"]):
        df_etat = df_circuit[df_circuit.etat == e]
        fig.add_trace(
            SingleCurve(df_etat.date, df_etat.nombre, e.capitalize(), colors[idx])
        )

    fig.update_layout(get_ruptures_curve_layout(df_circuit.date))
    fig.update_xaxes(title_text="Date")
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

    fig.update_layout(get_ruptures_curve_layout(df_rupture_circuit.annee))
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


def get_mesures(annee=INITIAL_YEAR):
    df_mesures["annee"] = df_mesures.numero.apply(lambda x: 2000 + int(x[:2]))
    df = df_mesures.groupby(["annee", "mesure"]).numero.count().reset_index()
    df = df.rename(columns={"numero": "nombre"}).set_index("annee")

    fig = go.Figure(
        go.Pie(
            labels=df.loc[annee].mesure,
            values=df.loc[annee].nombre,
            marker_colors=PIE_COLORS_SPECIALITE,
        )
    ).update_layout(PIE_LAYOUT)
    return fig


def Signalements(df: pd.DataFrame) -> Component:
    signalements = len(df[df.annee == dt.now().year - 1])
    this_year = str(dt.now().year)[-2:]
    mesures = len(
        df_mesures[
            (df_mesures.etat_mesure == "accord")
            & (df_mesures.identifiant.str.startswith(this_year))
        ].identifiant.unique()
    )
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
                                        "figure": "{} signalements".format(
                                            signalements,
                                        ),
                                        "caption": "Nombre de signalements en {}".format(
                                            dt.now().year - 1
                                        ),
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
                                        "figure": "{} actions réalisées".format(
                                            mesures
                                        ),
                                        "caption": "Signalements ayant fait l'objet d'une "
                                        "mesure de gestion pour l'année en cours",
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
                        "Nombre de signalements par an",
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
                                            for y in range(2014, dt.now().year + 1)
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
                                style={"height": 450},
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
                                            ]
                                        ],
                                        className="GraphSelect d-inline-block",
                                        style={"float": "right"},
                                    ),
                                ],
                                className="mb-5",
                            ),
                            H4(
                                "Évolution du nombre d'ouvertures et de clôtures de dossier",
                                className="GraphTitle mb-3",
                            ),
                            Graph(
                                figure=get_signalements_circuit(),
                                responsive=True,
                                id="signalements-circuit",
                                className="mb-5",
                                style={"height": 300},
                            ),
                            H4(
                                "Évolution du nombre de ruptures",
                                className="GraphTitle mb-3",
                            ),
                            Graph(
                                figure=get_ruptures_circuit(),
                                responsive=True,
                                id="ruptures-circuit",
                                style={"height": 300},
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
                                            for y in range(2014, dt.now().year + 1)
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
                                style={"height": 450},
                            ),
                        ],
                    )
                )
            ),
            SectionRow(
                Box(
                    Div(
                        [
                            Div(
                                [
                                    H4(
                                        "Mesures prises",
                                        className="GraphTitle d-inline-block",
                                    ),
                                    dbc.Select(
                                        id="annee-mesures-dropdown",
                                        value=INITIAL_YEAR,
                                        options=[
                                            {"label": dt.now().year, "value": dt.now().year}
                                            for y in range(2014, dt.now().year + 1)
                                        ],
                                        className="GraphSelect d-inline-block",
                                        style={"float": "right"},
                                    ),
                                ],
                                className="mb-3",
                            ),
                            Graph(
                                figure=get_mesures(),
                                responsive=True,
                                id="pie-mesures",
                                style={"height": 450},
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


@app.callback(
    dd.Output("pie-mesures", "figure"),
    dd.Input("annee-mesures-dropdown", "value"),
)
def update_figure(value: str):
    if not value:
        raise PreventUpdate
    return get_mesures(int(value))
