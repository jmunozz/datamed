from apps.components.utils import Box
from dash_html_components.H1 import H1
from app import app
from dash.development.base_component import Component
from dash_bootstrap_components import Card, CardImg, CardBody, CardLink
from dash_bootstrap_components import Row
from dash_html_components import Div, B, I, Img, A, H3, H1, P

from .commons import FrontPageSection, FrontPageSectionFull, FrontPageSectionPart


def ExplorerHeader() -> Component:
    return FrontPageSection(
        FrontPageSectionFull(
            [
                H1("Explorez notre sélection de données publiques"),
                P(
                    "L’Agence Nationale de Sécurité du Médicament et des "
                    "Produits de Santé met à votre disposition une sélection de ses "
                    "bases de données. Laissez-vous guider par ses modalités d’utilisation",
                    className="normal-text",
                ),
                Img(src=app.get_asset_url("Illustration-explorer.svg"), className=""),
            ],
            class_name="ExplorerPageMainSection",
        ),
        class_name="FrontPageSection-isColorWhite",
    )


def BddCard(
    src_img: str, title: str, open_data: str, body: str, source_bdd: str, href: str
) -> Card:

    return Box(
        Div(
            [
                Box(
                    Div(),
                    # Img(src=src_img, style={"width": "270px", "height": "240px"}),
                    isBordered=False,
                    hasNoPadding=True,
                    className="CardBoxImage ExploreDataItemImage",
                ),
                Box(
                    [
                        Div(title, className="heading-6"),
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
                                    className="button-text d-inline-block text-justify col-6",
                                ),
                                Div(
                                    [B("Source de données : "), source_bdd,],
                                    className="button-text d-inline-block col-6",
                                ),
                            ],
                            className="d-flex row mt-4 mb-5",
                        ),
                        A(
                            "DÉCOUVRIR LE JEU DE DONNÉES",
                            href=href,
                            className="normal-text link",
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
        [P(question, className="heading-5 mb-4"), P(answer, className="normal-text"),],
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
                            "/assets/pills_2.svg",
                            "Observatoire des ruptures de stock",
                            "Non",
                            "Renseignez-vous sur le statut des ruptures de stock de médicaments et trouvez des "
                            "alternatives thérapeutiques au traitement du patient en fonction de son profil.",
                            "TrustMed (ANSM)",
                            "/apps/ruptures",
                        ),
                        BddCard(
                            "/assets/ansm_entree.svg",
                            "Cartographie des sites de fabrication",
                            "Non",
                            "Découvrez les indicateurs utilisés par les agents de l’ANSM pour anticiper "
                            "les ruptures de stock et les actions mises en place pour y pallier.",
                            "État des lieux des laboratoires pharmaceutiques (ANSM)",
                            "/apps/construction",
                        ),
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
                                    "Toute personne souhaitant alimenter sa connaissance personnelle, destiné néanmoins à "
                                    "des usagers qui ont de la connaissance dans le domaine médical et/ou dans l’exploitation "
                                    "de la donnée.",
                                ),
                                ModaliteItem(
                                    "Il y a-t-il des données sensibles ?",
                                    [
                                        "L’ensemble des données affichées ont été approuvées par la CNIL et correspondent aux "
                                        "standards d’anonymisation. Si toutefois vous rencontrez des anomalies, n’hésitez pas "
                                        "à nous le ",
                                        A(
                                            "signaler",
                                            href="",
                                            style={
                                                "color": "#A03189",
                                                "text-decoration": "none",
                                            },
                                        ),
                                        ".",
                                    ],
                                ),
                                ModaliteItem(
                                    "Dans quel cadre utiliser ces données ?",
                                    "L’utilisation de ces données est réservé à un usage personnel et de recherche. Les analyses "
                                    "effectuées sont à la charge de la personne publiant les résultats. L’ANSM ne se tient pas "
                                    "responsable des erreurs d’interprétation.",
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
