from typing import List

from app import app
from dash.development.base_component import Component
from dash_html_components import Div, H3, Img, B, A


def FooterElement(title: str, element_list: List[str]) -> Component:
    text_element_list = [Div(title, className="heading-4 mb-4")] + [
        Div(element, className="normal-text d-block mb-3") for element in element_list
    ]
    return Div(text_element_list, className="footer-right-content")


def Logos() -> Component:
    return Div(
        [
            Div(
                [
                    Img(
                        src=app.get_asset_url("Logo republique française.svg"),
                        className="img-logo",
                    ),
                    Img(
                        src=app.get_asset_url("Logo ANSM blanc.svg"),
                        className="img-logo",
                    ),
                ]
            ),
            H3(
                ["data.", B("ansm.gouv.fr")],
                style={"color": "white", "margin-top": "20px"},
            ),
        ],
        className="logos",
    )


def FooterRight():
    return Div(
        [
            FooterElement(
                "Le site", ["À propos", "Plan du site", "Mentions légales", "Contact"]
            ),
            FooterElement(
                "Partenaires",
                [
                    A("ANSM", href="https://ansm.sante.fr/", className="link text-decoration-none"),
                    A(
                        "Base de données publique des médicaments",
                        href="https://base-donnees-publique.medicaments.gouv.fr/",
                        className="link text-decoration-none",
                    ),
                    A("Etalab", href="https://www.etalab.gouv.fr/", className="link text-decoration-none"),
                    A(
                        "DINUM",
                        href="https://www.numerique.gouv.fr/dinum/",
                        className="link text-decoration-none",
                    ),
                ],
            ),
        ],
        className="footer-right",
    )


def Footer() -> Component:
    return Div(
        [
            Logos(),
            FooterRight(),
        ],
        className="footer",
    )
