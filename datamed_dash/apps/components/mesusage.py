from typing import Tuple

from apps.components.commons import Header
from apps.components.utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    BoxArticle,
    Tooltip,
)
from dash.development.base_component import Component
from dash_html_components import Div, P, A, Span
from sm import SideMenu


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


def Mesusage() -> Tuple[Component, Div]:
    return (
        Header(None, type="mesusage"),
        Div(
            [
                SideMenu(
                    id="side-menu",
                    items=[
                        {"id": "description", "label": "Description"},
                    ],
                    className="SideMenu",
                ),
                Div(
                    Div(
                        [Description()],
                        className="ContentWrapper ContentWrapper-hasHeader",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )