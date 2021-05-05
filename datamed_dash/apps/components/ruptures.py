import json

import dash.dependencies as dd
import pandas as pd
import plotly.graph_objects as go
from app import app
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_bootstrap_components import Select, Tooltip
from dash_core_components import Graph
from dash_html_components import Div, A, P, I
from plotly.subplots import make_subplots
from sm import SideMenu

from .specialite import SectionTitle  # , Indicateur
from ..constants.colors import BAR_CHART_COLORS
from ..constants.layouts import BAR_LAYOUT

INITIAL_YEAR = "2020"

with open("data/ruptures_by_atc_by_annee.json") as f:
    RUPTURES_ATC_DICT = json.load(f)

with open("data/ventes_by_atc_by_annee.json") as f:
    VENTES_ATC_DICT = json.load(f)


def DescriptionRuptures() -> Component:
    tooltip_text = (
        "La base de données des ruptures de stock recense les médicaments d’intérêt thérapeutique majeur "
        "faisant actuellement l’objet de difficultés d’approvisionnement et pour lesquels, il n’y a pas "
        "d’alternative thérapeutique disponible sur le marché français."
    )
    return Div(
        Div(
            [
                Div(
                    I(
                        className="bi bi-book d-flex justify-content-center pt-3",
                        style={"font-size": "3rem"},
                    ),
                    className="col-1",
                ),
                Div(
                    [
                        Div(
                            "Observatoire des ruptures de stock",
                            className="heading-4",
                            id="description-ruptures",
                        ),
                        Div(
                            [
                                Div(
                                    "BASE DE DONNÉES",
                                    className="caption-text d-inline-block",
                                ),
                                I(
                                    className="info-icon bi bi-info-circle d-inline-block",
                                    id="bdd-ruptures-info-icon",
                                ),
                                Tooltip(
                                    tooltip_text,
                                    target="bdd-ruptures-info-icon",
                                    placement="right",
                                ),
                            ]
                        ),
                        Div("Bases de données exploitées", className="small-text-bold"),
                        A(
                            "TrustMed, États des lieux des laboratoires",
                            href="/apps/ruptures",
                            className="normal-text link",
                            id="refresh-substances",
                        ),
                        Div("Description", className="small-text-bold",),
                        P(
                            "L’ANSM a pour mission d’observer tout au long de l’année l’état des ruptures de stock "
                            "de médicaments présents dans les circuits Ville et Hôpital et de s’assurer du maintien "
                            "des stocks en cas de tension d’approvisionnement et de rupture. Retrouvez les différentes "
                            "formes et chiffres de signalements que l’Agence reçoit, et les actions mises en place "
                            "pour y remédier et maintenir ainsi l’alimentation des officines au niveau national.",
                            className="normal-text text-justify",
                        ),
                        Div("Avertissement", className="small-text-bold",),
                        P(
                            "Les chiffres présentés ici ont pour but d’ouvrir les données au grand public afin de "
                            "communiquer les actions de l’Agence. Leur interprétation et leur diffusion est soumise à "
                            "des réglementations strictes. L’Agence ne se tient pas responsable en cas d’interprétation"
                            " erronée et de divulgation de ces chiffres, dans un contexte qui ne permettrait pas "
                            "leur lecture dans les conditions optimales. En cas de doute, veuillez nous contacter, "
                            "vous contribuerez alors directement à l’amélioration de l’information diffusée.",
                            className="normal-text text-justify",
                        ),
                        Div("Réutilisation des données", className="small-text-bold",),
                        A(
                            "Analyse thématique",
                            href="/apps/ruptures",
                            className="normal-text link d-inline-block",
                            id="refresh-substances",
                        ),
                        Div(", ", className="d-inline-block"),
                        A(
                            "data.gouv.fr",
                            href="https://www.data.gouv.fr/",
                            className="normal-text link d-inline-block",
                            id="refresh-substances",
                        ),
                    ],
                    className="col-11 pr-5",
                ),
            ],
            className="description col-xl-8 col-sm-11 row",
        ),
        style={"margin-top": "31.5px"},
        className="topic-section",
    )


def NatureSignalements() -> Component:
    tooltip_text = ""
    return Div(
        [
            SectionTitle(
                "Nombre et nature des signalements",
                "nature-signalements-info-icon",
                tooltip_text,
                "signalements",
            ),
            Indicateur(
                10,
                "ruptures/an",
                "Nombre d’ouvertures de dossiers, de l’ouverture à la fermeture",
                "box d-inline-block",
            ),
            Indicateur(
                7.56,
                "j",
                "Nombre de jours moyen de ruptures sur l’année 2020",
                "box d-inline-block",
            ),
            Div(
                [
                    Div(
                        Div(
                            [
                                Div(
                                    [
                                        Div(
                                            "Nombre de signalements par classe thérapeutique",
                                            className="normal-text d-inline-block",
                                        ),
                                        Select(
                                            id="annee-dropdown",
                                            value=INITIAL_YEAR,
                                            options=[
                                                {"label": y, "value": y}
                                                for y in range(2014, 2021)
                                            ],
                                            className="graph-select-input d-inline-block",
                                            style={"float": "right"},
                                        ),
                                    ],
                                    style={"margin-bottom": "24px"},
                                ),
                                AtcBar(),
                            ],
                            className="box",
                        ),
                        className="col-xl-8",
                    ),
                ],
                className="row",
            ),
        ],
        className="topic-section",
    )


def compute_signal_by_atc_by_year(year: str) -> go.Figure:
    df = (
        pd.DataFrame.from_dict(RUPTURES_ATC_DICT[year], orient="index")
        .reset_index()
        .rename(columns={"index": "nom_atc", 0: "nb_signal"})
        .head(10)
    )
    atc_list = list(df.nom_atc.unique())

    fig = make_subplots(1, 2)
    fig.add_trace(
        go.Bar(
            y=df.nom_atc,
            x=df.nb_signal,
            orientation="h",
            marker=dict(color=BAR_CHART_COLORS),
            name="Nombre de signalements",
        )
    )

    if year in ["2017", "2018", "2019"]:
        # Dictionnaire des ventes uniquement pour les 10 premières ATC
        ventes_dict = {k: v for k, v in VENTES_ATC_DICT[year].items() if k in atc_list}
        df_ventes = (
            pd.DataFrame.from_dict(ventes_dict, orient="index")
            .reset_index()
            .rename(columns={"index": "nom_atc"})
        )

        # Réindexer les ventes dans le même ordre que les ruptures
        # pour que la courbe n'aille pas dans tous les sens
        df_ventes = df_ventes.set_index("nom_atc")
        df_ventes = df_ventes.reindex(index=df["nom_atc"])
        df_ventes = df_ventes.reset_index()

        fig.add_trace(
            go.Scatter(
                x=df_ventes.total / 10 ** 6,
                y=df_ventes.nom_atc,
                line={
                    "shape": "spline",
                    "smoothing": 1,
                    "width": 4,
                    "color": "#00B3CC",
                },
                mode="lines",
                name="Volume de ventes (en millions)",
            ),
            row=1,
            col=1,
        )

    BAR_LAYOUT.update(
        {
            "legend": dict(
                orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1
            ),
            "hovermode": "y unified",
        }
    )
    fig.update_layout(BAR_LAYOUT)
    return fig


def AtcBar() -> Graph:
    fig = compute_signal_by_atc_by_year(INITIAL_YEAR)
    return Graph(
        figure=fig,
        className="img-card",
        responsive=True,
        style={"height": "500px"},
        id="atc-bar-chart",
    )


def Ruptures() -> Component:
    return Div(
        [
            SideMenu(
                id="side-menu",
                items=[
                    {"id": "description-ruptures", "label": "Description"},
                    {"id": "signalements", "label": "Signalements"},
                    {"id": "gestion-ruptures", "label": "Gestion des ruptures"},
                ],
                className="side-menu",
            ),
            Div([DescriptionRuptures(), NatureSignalements(),]),
        ],
        className="side-menu-container",
    )


@app.callback(
    dd.Output("atc-bar-chart", "figure"), dd.Input("annee-dropdown", "value"),
)
def update_figure(value: str):
    if not value:
        raise PreventUpdate
    return compute_signal_by_atc_by_year(value)
