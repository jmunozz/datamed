from apps.components.commons import FrontPageSection, FrontPageSectionPart
from typing import List

from app import app
from dash.development.base_component import Component
from dash_html_components import Div, H3, Img, B, A, Span, H4, Ul, Li


def FooterElement(title: str, element_list: List[str]) -> Component:
    return Div(
        [
            H4(title),
            Ul(
                [Li(element, className="FooterLink") for element in element_list],
                className="FooterLinkContainer",
            ),
        ],
    )


def Logos() -> Component:
    return Div(
        [
            Img(
                src=app.get_asset_url("Logo ANSM blanc.svg"), className="FooterLogoImg",
            ),
            Img(
                src=app.get_asset_url("Logo republique française.svg"),
                className="FooterLogoImg",
            ),
        ],
        className="FooterLogoContainer Stack",
    )


def Website():
    return (
        FooterElement(
            "Le site", ["À propos", "Plan du site", "Mentions légales", "Contact"]
        ),
    )


def Partners():
    return (
        FooterElement(
            "Partenaires",
            [
                A(
                    "ANSM",
                    href="https://ansm.sante.fr/",
                    className="link text-decoration-none",
                ),
                A(
                    "Base de données publique des médicaments",
                    href="https://base-donnees-publique.medicaments.gouv.fr/",
                    className="link text-decoration-none",
                ),
                A(
                    "Etalab",
                    href="https://www.etalab.gouv.fr/",
                    className="link text-decoration-none",
                ),
                A(
                    "DINUM",
                    href="https://www.numerique.gouv.fr/dinum/",
                    className="link text-decoration-none",
                ),
                A(
                    "Health Data Hub",
                    href="https://www.health-data-hub.fr/",
                    className="link text-decoration-none",
                ),
            ],
        ),
    )


def Footer() -> Component:
    return FrontPageSection(
        [
            FrontPageSectionPart(Partners()),
            FrontPageSectionPart(Website()),
            FrontPageSectionPart(Logos()),
        ],
        class_name="Footer",
    )
