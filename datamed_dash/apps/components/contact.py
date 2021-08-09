from app import app
from dash.development.base_component import Component
from dash_html_components import Div, B, Img, A

from .commons import SingleSection


def Contact() -> Component:
    return Div(
        [
            Div(className="header-space"),
            Div(
                [
                    Div(
                        "Contact",
                        className="fp-section fp-section-1 d-flex justify-content-center h1 mt-5",
                    ),
                    Div(
                        Img(
                            src=app.get_asset_url("big_illustration_5.svg"),
                        ),
                        className="fp-section fp-section-1 d-flex justify-content-center",
                    ),
                ],
            ),
            Div(
                [
                    SingleSection(
                        "Numéro du standard téléphonique de l'ANSM",
                        [
                            B(
                                "01 55 87 30 00",
                                className="mb-3",
                            ),
                        ],
                    ),
                    SingleSection(
                        "Guichet usager",
                        [
                            Div(
                                "L’ANSM met en place un nouveau service destiné à faciliter la relation "
                                "avec les usagers. Ce dispositif s’appuie sur une équipe spécialement "
                                "recrutée pour prendre en charge les demandes des patients, "
                                "des professionnels de santé, des industriels, et plus largement "
                                "du grand public.",
                                className="mb-3",
                            ),
                            Div(
                                "Si votre question concerne les effets indésirables, les ruptures de stock ou "
                                "tout autre demande concernant data.ansm, nous vous invitons à remplir un "
                                "formulaire de contact. Il sera directement adressé à notre cellule Accueil "
                                "des usagers qui le traitera dans les meilleurs délais.",
                                className="mb-3",
                            ),
                            Div(
                                "Il est important de ne pas transmettre des données "
                                "médicales non nécessaires au traitement de votre demande.",
                                className="mb-3",
                            ),
                            Div(
                                "Pour les autres demandes, merci de contacter directement les services concernés.",
                            ),
                        ],
                    ),
                    A(
                        "accéder au formulaire de contact",
                        className="Btn Btn-isPrimary",
                        role="button",
                        href="https://ansm.sante.fr/contact",
                        target="_blank",
                    ),
                ],
                className="mentions",
            ),
        ],
        className="container-fluid p-0",
    )
