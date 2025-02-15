from datetime import datetime as dt
from typing import Tuple

import plotly.graph_objects as go
from apps.components.commons import (
    Header,
    RepartitionSexeBox,
    RepartitionAgeBox,
    RepartitionGraviteGraphBox,
    RepartitionNotificateursFigureBox,
)
from apps.components.utils import (
    Box,
    Grid,
    GraphBox,
    TopicSection,
    ArticleTitle,
    BoxArticle,
    SectionRow,
)
from apps.constants.colors import MESUSAGE_STACKED_BAR_COLORS, PIE_COLORS_MESUSAGE
from apps.constants.layouts import MESUSAGE_STACKED_BAR_CHART_LAYOUT, PIE_TRACES
from dash.development.base_component import Component
from dash_core_components import Graph
from dash_html_components import Div, P, H1, H4, A, Span
from datamed_custom_components import Accordion
from db import fetch_data
from sm import SideMenu

df_pv = fetch_data.fetch_table("cas_pv", "index")
df_annee = fetch_data.fetch_table("mesusage_global_annee", "index")
df_sexe = fetch_data.fetch_table("mesusage_global_sexe", "index")
df_age = fetch_data.fetch_table("mesusage_global_age", "index")
df_decla = fetch_data.fetch_table("mesusage_global_declarant", "index")
df_gravite = fetch_data.fetch_table("mesusage_global_gravite", "index")

MESUSAGE_YEAR_INIT = 2015


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
                            "Le mésusage est une utilisation volontaire d’un médicament à visée thérapeutique "
                            "dans un usage qui n’est pas attendu, approprié  et sans justification "
                            "(bibliographie, essai clinique, etc.).",
                            className="normal-text justify-text",
                        ),
                        P(
                            "Ce mésusage est à l’origine de 10 000 morts par an "
                            "et de 130 000 hospitalisations, en France.",
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
                                    "Pour toutes les dernières informations à destination des patients "
                                    "et professionnels de santé sur le bon usage/mésusage du médicament, "
                                    "rendez-vous sur le site de l'ANSM : ",
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
            ],
        ),
        id="description",
    )


def PatientsConcernes():
    df_sexe["pourcentage_patients"] = df_sexe.cas.apply(
        lambda x: x / df_sexe.cas.sum() * 100
    )
    return TopicSection(
        [
            SectionRow(H1("Patients concernés", className="SectionTitle")),
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
                    Grid(
                        [
                            GraphBox(
                                "Répartition par sexe des cas de mésusage notifiés",
                                [RepartitionSexeBox(df_sexe)],
                            ),
                            GraphBox(
                                "Répartition par âge des cas de mésusage notifiés",
                                [RepartitionAgeBox(df_age, "cas", PIE_COLORS_MESUSAGE)],
                            ),
                        ],
                        2,
                    ),
                ]
            ),
        ],
        id="patients-concernes",
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
                x=df[df.annee.isin(range(MESUSAGE_YEAR_INIT, dt.now().year))].annee,
                y=df.cas,
                name=name,
                marker=dict(color=color),
            )
        )

    fig.update_layout(MESUSAGE_STACKED_BAR_CHART_LAYOUT)
    fig.update_traces(PIE_TRACES)

    df_decla["pourcentage_notif"] = df_decla.cas.apply(
        lambda x: x / df_decla.cas.sum() * 100
    )
    return TopicSection(
        [
            SectionRow(H1("Cas déclarés de mésusage", className="SectionTitle")),
            SectionRow(
                [
                    GraphBox(
                        "Part annuelle des cas de mésusage parmi les cas de pharmacovigilance",
                        [Graph(figure=fig, responsive=True, style={"height": 450})],
                        tooltip=[
                            H4("Cas de pharmacovigilance"),
                            P(
                                "Sont notifiés les effets indésirables que le patient ou son entourage suspecte "
                                "d’être liés à l’utilisation d’un ou plusieurs médicaments, ainsi que les mésusages, "
                                "abus ou erreurs médicamenteuses.",
                                className="regular-text text-justify mb-4",
                            ),
                            H4("Cas de mésusage"),
                            P(
                                "Sont notifiés les effets indésirables que le patient ou son entourage suspecte "
                                "d'être liés à l'utilisation volontaire d’un médicament à visée thérapeutique dans un "
                                "usage qui n’est pas attendu, approprié et sans justification (bibliographie, "
                                "essai clinique, etc.).",
                                className="regular-text text-justify",
                            ),
                        ],
                    ),
                ]
            ),
            SectionRow(
                [
                    GraphBox(
                        "Gravité des effets indésirables liés aux cas de mésusage",
                        [
                            RepartitionGraviteGraphBox(
                                df_gravite, "cas", PIE_COLORS_MESUSAGE
                            )
                        ],
                        className="Box-isHalf",
                        tooltip=[
                            H4("Cas grave"),
                            P(
                                "Effet indésirable létal, ou susceptible de mettre la vie en danger, "
                                "ou entraînant une invalidité ou une incapacité importante ou durable, "
                                "ou provoquant ou prolongeant une hospitalisation, ou se manifestant par "
                                "une anomalie ou une malformation congénitale.",
                                className="regular-text text-justify",
                            ),
                        ],
                    ),
                ],
                withGutter=True,
            ),
            SectionRow([RepartitionNotificateursFigureBox(df_decla)]),
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
                        {"id": "patients-concernes", "label": "Patients concernés"},
                        {
                            "id": "declarations-mesusage",
                            "label": "Cas déclarés de mésusage",
                        },
                    ],
                    className="SideMenu",
                ),
                Div(
                    Div(
                        [Description(), PatientsConcernes(), DeclarationsBar()],
                        className="ContentWrapper ContentWrapper-hasHeader",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )
