from datetime import datetime as dt
from typing import Tuple, Dict

import dash.dependencies as dd
import dash_bootstrap_components as dbc
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from app import app
from apps.components.commons import Header
from apps.components.utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    BoxArticle,
    SectionRow,
    Tooltip,
    generate_title_id,
    InformationIcon,
)
from apps.constants.colors import BAR_CHART_COLORS, TREE_COLORS
from apps.constants.layouts import (
    RUPTURES_BAR_LAYOUT,
    TREEMAP_LAYOUT,
    CURVE_LAYOUT,
    get_ruptures_curve_layout,
)
from apps.graphs import (
    RupturesSignalementsFigure,
    RupturesMesuresFigure,
    getRupturesMesuresRepartitionGraph,
)
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_core_components import Graph
from dash_html_components import Div, P, H1, H4, A, Span
from db import fetch_data
from plotly.subplots import make_subplots
from sm import SideMenu

INITIAL_YEAR = str(dt.now().year)

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
                        A(
                            "Trouvez des informations complémentaires sur le site de l'ANSM.",
                            href="https://ansm.sante.fr/disponibilites-des-produits-de-sante/medicaments",
                            className="ExternalLink d-block",
                            target="_blank"
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
    df_annee = df.reset_index().groupby("annee").numero.count().reset_index()
    df_annee = df_annee.rename(columns={"numero": "nb_signalements"})

    fig = go.Figure(
        SingleCurve(
            df_annee.annee,
            df_annee.nb_signalements,
            "Signalements",
            "#00B3CC",
        )
    )

    fig.update_layout(CURVE_LAYOUT)
    fig.update_xaxes(title_text="Année")
    fig.update_yaxes(title_text="Nombre de signalements")

    return Graph(figure=fig, responsive=True, style={"height": 450})


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
            go.Bar(
                x=df_etat.date,
                y=df_etat.nombre,
                marker=dict(color=colors[idx]),
                name=e.capitalize()
            )
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
    df_cause = df_ruptures.groupby(["annee", "cause"]).etat.count().reset_index()
    df_cause = df_cause.rename(columns={"etat": "nombre_signalements"})
    df_cause.nombre_signalements = df_cause.apply(
        lambda x: x.nombre_signalements
        / df_cause[df_cause.annee == x.annee].nombre_signalements.sum()
        * 100,
        axis=1,
    )
    df_cause.cause = df_cause.cause.str.capitalize()
    df_cause = df_cause.set_index("annee")

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
        texttemplate="%{label}<br>%{value:.2f}%",
        textposition="middle center",
        textfont_size=18,
        hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{value:.2f}%</b> <extra></extra>",
    )
    return fig


def getRupturesMesuresRepartitionGraphBox(annee: str = INITIAL_YEAR) -> Component:
    return getRupturesMesuresRepartitionGraph(df_mesures, annee)


def RupturesSignalementsFigureBox(df_sig: pd.DataFrame) -> Component:
    return RupturesSignalementsFigure(df_sig)


def RupturesMesuresFigureBox(df: pd.DataFrame) -> Component:
    return RupturesMesuresFigure(df)


def Signalements() -> Component:
    return TopicSection(
        [
            SectionRow(
                H1("Nombre et nature des signalements", className="SectionTitle")
            ),
            SectionRow(
                [
                    GraphBox("", RupturesSignalementsFigureBox(df_ruptures)),
                    GraphBox("", RupturesMesuresFigureBox(df_mesures)),
                ],
                withGutter=True,
            ),
            SectionRow(
                [
                    GraphBox(
                        "Nombre de signalements par an",
                        [SignalementsTotal(df_ruptures)],
                        tooltip=[
                            H4("Nombre de signalements par an"),
                            P(
                                "Attention, l'année 2021 n'est pas terminée !",
                                className="regular-text",
                            ),
                        ],
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
                                        [
                                            "Nombre de signalements par classe thérapeutique",
                                            InformationIcon(),
                                        ],
                                        id=generate_title_id(
                                            "Nombre de signalements par classe thérapeutique"
                                        ),
                                        className="GraphBoxTitle d-inline-block",
                                    ),
                                    Tooltip(
                                        [
                                            H4(
                                                "Nombre de signalements par classe thérapeutique"
                                            ),
                                            P(
                                                "Le Système de classification anatomique, thérapeutique et chimique "
                                                "(en anglais : Anatomical Therapeutic Chemical (ATC) Classification "
                                                "System) est utilisé pour classer les médicaments. C'est le "
                                                "Collaborating Centre for Drug Statistics Methodology de "
                                                "l'Organisation mondiale de la santé (OMS) qui le contrôle. "
                                                "Les médicaments sont divisés en groupes selon l'organe ou le "
                                                "système sur lequel ils agissent ou leurs caractéristiques "
                                                "thérapeutiques et chimiques.",
                                                className="regular-text",
                                            ),
                                            P(
                                                "Ce graphique représente le nombre de signalements reçus par classe "
                                                "pharmacothérapeutique (classification ATC). La courbe bleue indique "
                                                "le nombre de présentations de médicaments (une présentation correspond"
                                                " à un conditionnement précis d'un médicament, par exemple une boîte de"
                                                " 30 gélules et une boîte de 90 gélules d'un même médicament sont deux "
                                                "présentations différentes). Dans sa globalité, ce graphique permet "
                                                "d'apprécier le nombre de signalements reçu spar rapport au nombre de "
                                                "médicaments disponibles.",
                                                className="regular-text",
                                            ),
                                        ],
                                        target=generate_title_id(
                                            "Nombre de signalements par classe thérapeutique"
                                        ),
                                    ),
                                    dbc.Select(
                                        id="annee-dropdown",
                                        value=INITIAL_YEAR,
                                        options=[
                                            {"label": y, "value": y}
                                            for y in sorted(df_ruptures.annee.unique())
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
                                        [
                                            "Statut des dossiers dans le circuit",
                                            InformationIcon(),
                                        ],
                                        id=generate_title_id(
                                            "Statut des dossiers dans le circuit"
                                        ),
                                        className="GraphBoxTitle d-inline-block",
                                    ),
                                    Tooltip(
                                        [
                                            H4("Statut des dossiers dans le circuit"),
                                            P(
                                                "Les données antérieures à Mai 2021 ne pas sont dans un format "
                                                "compatible à leur exploitation.",
                                                className="regular-text",
                                            ),
                                            P(
                                                "Chaque signalement amène à l'ouverture d'un dossier impactant le "
                                                "circuit ville ou le circuit hôpital, ou les deux. La clôture d'un "
                                                "dossier ne peut être faite qu'à la remise à disposition effective "
                                                "du produit sur le marché.",
                                                className="regular-text",
                                            ),
                                        ],
                                        target=generate_title_id(
                                            "Statut des dossiers dans le circuit"
                                        ),
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
                                "Nombre d'ouvertures et de clôtures de dossier",
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
                                        ["Causes des signalements", InformationIcon()],
                                        id=generate_title_id("Causes des signalements"),
                                        className="GraphBoxTitle d-inline-block",
                                    ),
                                    Tooltip(
                                        [
                                            H4("Causes des signalements"),
                                            P(
                                                "Lorsqu'un signalement arrive à l'ANSM, il est mis en place une"
                                                " évaluation afin de déterminer les mesures les plus adaptées pour "
                                                "pallier à l'insuffisance de stock.",
                                                className="regular-text",
                                            ),
                                        ],
                                        target=generate_title_id(
                                            "Causes des signalements"
                                        ),
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
        ],
        id="signalements",
    )


def GestionRuptures() -> Component:
    return TopicSection(
        [
            SectionRow(H1("Gestion des ruptures", className="SectionTitle")),
            SectionRow(
                Box(
                    Div(
                        [
                            Div(
                                [
                                    H4(
                                        "Mesures prises pour pallier aux ruptures",
                                        className="GraphTitle d-inline-block",
                                    ),
                                    dbc.Select(
                                        id="annee-mesures-dropdown",
                                        value=INITIAL_YEAR,
                                        options=[
                                            {
                                                "label": y,
                                                "value": y,
                                            }
                                            for y in sorted(df_mesures.annee.unique())
                                        ],
                                        className="GraphSelect d-inline-block",
                                        style={"float": "right"},
                                    ),
                                ],
                                className="mb-3",
                            ),
                            Graph(
                                figure=getRupturesMesuresRepartitionGraphBox(),
                                responsive=True,
                                id="pie-mesures",
                                style={"height": 450},
                            ),
                        ],
                    )
                )
            ),
        ],
        id="gestion-ruptures",
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
                        [Description(), Signalements(), GestionRuptures()],
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
    return get_signalement_atc_curve(value)


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
    return get_causes(value)


@app.callback(
    dd.Output("pie-mesures", "figure"),
    dd.Input("annee-mesures-dropdown", "value"),
)
def update_figure(value: str):
    if not value:
        raise PreventUpdate
    return getRupturesMesuresRepartitionGraphBox(value)
