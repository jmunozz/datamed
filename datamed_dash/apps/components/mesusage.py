from typing import Tuple

import plotly.graph_objects as go
from apps.components.commons import Header
from apps.components.utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    BoxArticle,
    SectionRow,
)
from apps.constants.layouts import (
    CURVE_LAYOUT,
)
from dash.development.base_component import Component
from dash_core_components import Graph
from dash_html_components import Div, P, H1, A, Span
from db import fetch_data
from plotly.subplots import make_subplots
from sm import SideMenu

df_pv = fetch_data.fetch_table("cas_pv", "index")
df_annee = fetch_data.fetch_table("mesusage_global_annee", "index")
df_sexe = fetch_data.fetch_table("mesusage_global_sexe", "index")
df_age = fetch_data.fetch_table("mesusage_global_age", "index")
df_decla = fetch_data.fetch_table("mesusage_global_declarant", "index")
df_gravite = fetch_data.fetch_table("mesusage_global_gravite", "index")


def Description() -> Component:
    return TopicSection(
        Box(
            [
                BoxArticle(
                    [
                        ArticleTitle("Bases de données exploitée"),
                        Div(
                            "Base Nationale de PharmacoVigilance (BNPV)",
                            className="normal-text-cap d-block",
                            style={"color": "#A03189"},
                        ),
                    ]
                ),
                BoxArticle(
                    [
                        ArticleTitle("Description"),
                        P(
                            "Le mésusage est une utilisation volontaire d’un médicament dans un usage "
                            "qui n’est pas attendu, et sans justifications (bibliographie, essais cliniques…).",
                            className="normal-text justify-text",
                        ),
                        P(
                            "Ce mésusage est à l’origine de 10 000 morts par an et de nombreuses hospitalisations.",
                            className="normal-text justify-text",
                        ),
                        P(
                            "L’ANSM a pour mission de mieux informer les professionnels de santé, mais "
                            "également les usagers, qui peuvent être à l’origine de ce mésusage des médicaments.",
                            className="normal-text justify-text",
                        ),
                        Div(
                            [
                                Span(
                                    "Pour toutes les dernières informations à destination des patients et "
                                    "professionnels de santé sur le bon usage du médicament, consultez : ",
                                    className="normal-text justify-text",
                                ),
                                A(
                                    "ansm.sante.fr/documents/reference/recommandations-pour-les-medicaments.",
                                    href="https://ansm.sante.fr/documents/reference/recommandations-pour-les-medicaments",
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
                            "",
                            className="normal-text text-justify",
                        ),
                        A(
                            "Trouvez des informations complémentaires sur le site de l'ANSM.",
                            href="https://ansm.sante.fr/disponibilites-des-produits-de-sante/medicaments",
                            className="ExternalLink d-block",
                            target="_blank",
                        ),
                    ]
                ),
            ],
        ),
        id="description",
    )


def DeclarationsCurves():
    fig = make_subplots(specs=[[{"secondary_y": True}]])

    fig.add_trace(
        go.Scatter(
            x=df_annee.annee,
            y=df_annee.cas,
            mode="lines",
            name="Déclarations d'effets indésirables liés au mésusage",
            line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#F599B5"},
        ),
        secondary_y=False,
    )

    fig.add_trace(
        go.Scatter(
            x=df_pv.annee,
            y=df_pv.cas,
            mode="lines",
            name="Cas de pharmacovigilance",
            line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#EA336B"},
            hoverlabel={"namelength": -1},
            hovertemplate="%{y:int}",
        ),
        secondary_y=True,
    )

    fig.update_yaxes(
        title_text="Déclarations d'effets indésirables liés au mésusage",
        color="#F599B5",
        secondary_y=False,
    )
    fig.update_yaxes(
        title_text="Cas de pharmacovigilance", color="#EA336B", secondary_y=True
    )
    fig.update_xaxes(title_text="Années")
    fig.update_layout(CURVE_LAYOUT)
    return TopicSection(
        [
            SectionRow(
                H1("Nombre de déclarations de mésusage", className="SectionTitle")
            ),
            SectionRow(
                [
                    GraphBox(
                        "Évolution des déclarations de mésusage au cours du temps",
                        [Graph(figure=fig, responsive=True, style={"height": 450})],
                        tooltip=[],
                    ),
                ]
            ),
        ],
        id="declarations-mesusage",
    )


def DeclarationsCurvesBis():
    COLORS = ["#009640", "#00B3CC"]

    fig = go.Figure()
    for df, name, color in zip(
        [df_annee, df_pv],
        ["Cas déclarés de mésusage", "Cas déclarés de pharmacovigilance"],
        COLORS,
    ):
        fig.add_trace(
            go.Bar(
                x=df.annee,
                y=df.cas,
                name=name,
                marker=dict(color=color),
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
    fig.update_layout(showlegend=True)
    return TopicSection(
        [
            SectionRow(
                H1("Nombre de déclarations de mésusage", className="SectionTitle")
            ),
            SectionRow(
                [
                    GraphBox(
                        "Évolution des déclarations de mésusage au cours du temps",
                        [Graph(figure=fig, responsive=True, style={"height": 450})],
                        tooltip=[],
                    ),
                ]
            ),
        ],
        id="declarations-mesusage",
    )


def Mesusage() -> Tuple[Component, Div]:
    return (
        Header(None, type="mesusage"),
        Div(
            [
                SideMenu(
                    id="side-menu",
                    items=[
                        {"id": "description", "label": "Description"},
                        {"id": "declarations-mesusage", "label": "Déclarations"},
                    ],
                    className="SideMenu",
                ),
                Div(
                    Div(
                        [Description(), DeclarationsCurves(), DeclarationsCurvesBis()],
                        className="ContentWrapper ContentWrapper-hasHeader",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )
