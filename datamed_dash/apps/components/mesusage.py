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
from apps.constants.colors import (
    MESUSAGE_STACKED_BAR_COLORS
)
from apps.constants.layouts import (
    MESUSAGE_STACKED_BAR_CHART_LAYOUT
)
from dash.development.base_component import Component
from dash_core_components import Graph
from dash_html_components import Div, P, H1, A, Span
from datamed_custom_components import Accordion
from db import fetch_data
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
                            "Ce mésusage est à l’origine de 10 000 morts par an et de 130 000 hospitalisations.",
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


def DeclarationsBar():
    fig = go.Figure()
    for df, name, color in zip(
        [df_annee, df_pv],
        ["Cas déclarés de mésusage", "Cas déclarés de pharmacovigilance"],
        MESUSAGE_STACKED_BAR_COLORS,
    ):
        fig.add_trace(
            go.Bar(
                x=df.annee,
                y=df.cas,
                name=name,
                marker=dict(color=color),
            )
        )

    fig.update_layout(MESUSAGE_STACKED_BAR_CHART_LAYOUT)
    return TopicSection(
        [
            SectionRow(
                H1("Cas déclarés de mésusage", className="SectionTitle")
            ),
            SectionRow(
                Box(
                    Accordion(
                        [
                            P(
                                "Tous les patients peuvent être concernés par le mésusage. Les chiffres ci-dessous "
                                "ne concernent que les cas rapportés de mésusage ayant entrainé un effet indésirable.",
                                className="normal-text text-justify",
                            ),
                        ],
                        isOpenOnFirstRender=True,
                        labelClass="InternalLink normal-text",
                        label="Tout le monde peut être concerné",
                    )
                )
            ),
            SectionRow(
                [
                    GraphBox(
                        "Part annuelle des cas de mésusage parmi les cas de pharmacovigilance",
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
                        [Description(), DeclarationsBar()],
                        className="ContentWrapper ContentWrapper-hasHeader",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )
