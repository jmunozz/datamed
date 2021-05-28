from app import app
from dash.development.base_component import Component
from dash_bootstrap_components import Card, CardImg, CardBody, CardLink
from dash_bootstrap_components import Row
from dash_html_components import Div, B, I, Img, A


def ExplorerHeader() -> Component:
    return Div(
        [
            Div(
                Img(
                    src=app.get_asset_url("Illustration-explorer.svg"),
                ),
                className="fp-section fp-section-1 justify-content-center",
            ),
            Div(
                "Explorez notre sélection de données publiques",
                className="fp-section fp-section-1 justify-content-center heading-4",
            ),
            Row(
                Div(
                    "L’Agence Nationale de Sécurité du Médicament et des "
                    "Produits de Santé met à votre disposition une sélection de ses "
                    "bases de données. Laissez-vous guider par ses modalités d’utilisation",
                    className="large-text col-lg-6 col-md-10 col-sm-10 text-center mb-5",
                ),
                className="fp-section fp-section-1 justify-content-md-center",
            ),
        ],
    )


def BddCard(
    src_img: str, title: str, open_data: str, body: str, source_bdd: str, href: str
) -> Card:
    return Card(
        [
            CardImg(src=src_img, style={"width": "270px", "height": "240px"}),
            CardBody(
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
                                [
                                    B("Source de données : "),
                                    source_bdd,
                                ],
                                className="button-text d-inline-block col-6",
                            ),
                        ],
                        className="d-flex row mt-4 mb-5",
                    ),
                    CardLink(
                        "DÉCOUVRIR LE JEU DE DONNÉES",
                        href=href,
                        className="normal-text link",
                    ),
                ],
                className="px-4",
            ),
        ],
        className="explorer-card",
    )


def ModaliteItem(question: str, answer) -> Component():
    return Div(
        [
            Div(question, className="col-md-12 heading-5 mb-4"),
            Div(answer, className="col-md-12 medium-text text-justify"),
        ],
        style={"margin-bottom": "80px"},
    )


def Modalites() -> Component:
    return Div(
        [
            Div(
                "Modalités d'utilisation",
                className="heading-4 text-center mb-5",
            ),
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
                                style={"color": "#A03189", "text-decoration": "none"},
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
                ],
            ),
        ],
        style={"width": "956px", "margin": "376px auto 1.5rem auto"},
    )


def Explorer() -> Component:
    return Div(
        [
            Div(className="header-space"),
            ExplorerHeader(),
            BddCard(
                "/assets/pills_2.svg",
                "Données ruptures de stock",
                "Non",
                Div(
                    [
                        "Renseignez-vous sur l'historique des ruptures de stock "
                        "des médicaments d'intéret thérapeutique majeur.",
                        A(
                            "Trouvez des informations complémentaires sur le site de l'ANSM.",
                            href="https://ansm.sante.fr/disponibilites-des-produits-de-sante/medicaments",
                            className="ExternalLink d-block",
                        ),
                    ]
                ),
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
            Modalites(),
        ],
        className="container-fluid p-0",
    )
