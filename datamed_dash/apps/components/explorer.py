from app import app
from apps.components.utils import Box
from dash.development.base_component import Component
from dash_bootstrap_components import Card
from dash_html_components import Div, B, I, Img, A, H3, H1, P

from .commons import FrontPageSection, FrontPageSectionFull


def ExplorerHeader() -> Component:
    return FrontPageSection(
        FrontPageSectionFull(
            [
                H1("Explorez notre sélection de données publiques"),
                P(
                    "L’Agence Nationale de Sécurité du Médicament et des "
                    "produits de santé met à votre disposition une sélection de ses "
                    "bases de données. Laissez-vous guider par ses modalités d’utilisation.",
                    className="medium-text",
                ),
                Img(
                    src=app.get_asset_url("illustration_explorer.svg"),
                    className="ExploreDescriptionImage",
                ),
            ],
            class_name="ExplorerPageMainSection",
        ),
        class_name="FrontPageSection-isColorWhite FrontPageSection-isBottomBoxShadowed",
    )


def BddCard(
    src_img: str, title: str, open_data: str, body: str, source_bdd: str, href: str
) -> Card:

    return Box(
        Div(
            [
                Box(
                    Img(src=app.get_asset_url(src_img)),
                    isBordered=False,
                    hasNoPadding=True,
                    className="CardBoxImage ExploreDataItemImage",
                ),
                Box(
                    [
                        H3(title, className="withSubtitle"),
                        Div(
                            [
                                "Open data : ",
                                open_data,
                                I(className="lock-icon bi bi-lock d-inline-block"),
                            ],
                            className="small-text",
                        ),
                        Div(
                            [
                                Div(
                                    body,
                                    className="regular-text",
                                ),
                                Div(
                                    [
                                        B("Source de données : "),
                                        source_bdd,
                                    ],
                                    className="regular-text",
                                ),
                            ],
                            className="CardBoxTextContentLayout",
                        ),
                        A(
                            "Découvrir le jeu de données",
                            href=href,
                            className="normal-text Link",
                        ),
                    ],
                    isBordered=False,
                    className="CardBoxText",
                ),
            ],
            className="CardBox",
        ),
        hasNoPadding=True,
    )


def ModaliteItem(question: str, answer) -> Component():
    return Div(
        [
            H3(question),
            P(answer, className="normal-text"),
        ],
        className="ModaliteItem",
    )


def Explorer() -> Component:
    return Div(
        [
            Div(className="header-space"),
            ExplorerHeader(),
            FrontPageSection(
                FrontPageSectionFull(
                    [
                        BddCard(
                            "rupturedestock-160.svg",
                            "Ruptures de stock de médicaments",
                            "Non",
                            Div(
                                "Renseignez-vous sur l'historique des ruptures de stock "
                                "des médicaments d'intérêt thérapeutique majeur."
                            ),
                            "TrustMed (ANSM)",
                            "/apps/ruptures",
                        ),
                        # BddCard(
                        #     "icons/pres_autre.svg",
                        #     "Mésusage du médicament",
                        #     "Non",
                        #     Div(
                        #         "Découvrez les médicaments les plus à risque de "
                        #         "mésusage et les conséquences possibles sur votre santé."
                        #     ),
                        #     "Base Nationale de PharmacoVigilance",
                        #     "/apps/mesusage",
                        # ),
                    ]
                )
            ),
            FrontPageSection(
                FrontPageSectionFull(
                    [
                        H1("Modalités d'utilisation"),
                        Div(
                            [
                                ModaliteItem(
                                    "Comment ça marche ?",
                                    "Vous accédez à des bases publiées par l’ANSM que "
                                    "vous pouvez directement visualiser sur notre plateforme.",
                                ),
                                ModaliteItem(
                                    "Qui peut l'utiliser ?",
                                    "Toute personne souhaitant alimenter sa connaissance personnelle, "
                                    "la plateforme étant néanmoins destinée à des usagers qui ont de la "
                                    "connaissance dans le domaine médical et/ou dans l’exploitation de la donnée.",
                                ),
                                ModaliteItem(
                                    "Y'a-t-il des données sensibles ?",
                                    [
                                        "L’ensemble des données affichées ont été approuvées par la Comission "
                                        "Nationale de l'Informatique et des Libertés (CNIL) et correspondent aux "
                                        "standards d’anonymisation. Si toutefois vous rencontrez des anomalies, "
                                        "n’hésitez pas à nous le ",
                                        A(
                                            "signaler",
                                            href="/apps/contact",
                                            className="Link",
                                        ),
                                        ".",
                                    ],
                                ),
                                ModaliteItem(
                                    "Dans quel cadre utiliser ces données ?",
                                    "L’utilisation de ces données est réservé à un usage personnel et de recherche. "
                                    "Les analyses effectuées sont à la charge de la personne publiant les résultats. "
                                    "L’ANSM ne se tient pas responsable des erreurs d’interprétation.",
                                ),
                            ]
                        ),
                    ],
                ),
                class_name="FrontPageSection-isColor3",
            ),
        ],
        className="container-fluid p-0",
    )
