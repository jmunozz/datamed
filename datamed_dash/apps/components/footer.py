from typing import List

from app import app
from apps.components.commons import FrontPageSection, FrontPageSectionPart
from dash.development.base_component import Component
from dash_html_components import Div, Img, A, H2, Ul, Li


def FooterElement(title: str, element_list: List[str]) -> Component:
    return Div(
        [
            H2(title),
            Ul(
                [Li(element, className="FooterLink") for element in element_list],
                className="FooterLinkContainer",
            ),
        ],
    )


def Logos() -> Component:
    return Div(
        [
            A(
                Img(
                    src=app.get_asset_url("Logo ANSM blanc.svg"),
                ),
                href="https://ansm.sante.fr/",
                className="normal-text FooterLogo",
                target="_blank",
            ),
        ],
        className="FooterLogoContainer Stack",
    )


def Website():
    return FooterElement(
        "Le site",
        [
            A(
                "À propos",
                href="/apps/a_propos",
                className="normal-text Link Link-isOnDarkBackground",
            ),
            A(
                "Plan du site",
                href="/apps/construction",
                className="normal-text Link Link-isOnDarkBackground",
            ),
            A(
                "Mentions légales",
                href="/apps/mentions_legales",
                className="normal-text Link Link-isOnDarkBackground",
            ),
            A(
                "Contact",
                href="/apps/construction",
                className="normal-text Link Link-isOnDarkBackground",
            ),
        ],
    )


def Partners():
    return (
        FooterElement(
            "Partenaires",
            [
                A(
                    "Base de données publique des médicaments",
                    href="https://base-donnees-publique.medicaments.gouv.fr/",
                    className="normal-text Link Link-isOnDarkBackground",
                    target="_blank",
                ),
                A(
                    "Etalab",
                    href="https://www.etalab.gouv.fr/",
                    className="normal-text Link Link-isOnDarkBackground",
                    target="_blank",
                ),
                A(
                    "DINUM",
                    href="https://www.numerique.gouv.fr/dinum/",
                    className="normal-text Link Link-isOnDarkBackground",
                    target="_blank",
                ),
                A(
                    "Health Data Hub",
                    href="https://www.health-data-hub.fr/",
                    className="normal-text Link Link-isOnDarkBackground",
                    target="_blank",
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
