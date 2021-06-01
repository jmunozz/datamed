from typing import Tuple

import dash_bootstrap_components as dbc
import dash_html_components as html
from dash_html_components.Div import Div
from app import app


from .commons import FrontPageSection, FrontPageSectionPart, FrontPageSectionFull


def FrontPage() -> Tuple[html.Div, html.Div]:
    return (
        html.Div(className="header-space"),
        html.Div(
            [
                FrontPageSection(
                    [
                        FrontPageSectionPart(
                            [
                                html.H1(
                                    "Des données accessibles et expliquées, au service des patients"
                                ),
                                html.P(
                                    "L’Agence Nationale de Sécurité du Médicament et des Produits de Santé (ANSM) "
                                    "ouvre ses données de manière pédagogique pour permettre au plus grand nombre "
                                    "de réaliser des choix éclairés",
                                    className="medium-text justify-text",
                                ),
                            ],
                            class_name="Stack Stack-isCentered Stack-isVerticalCentered",
                        ),
                        FrontPageSectionPart(
                            html.Img(src=app.get_asset_url("Big illustration 1.svg"))
                        ),
                        Div(className="FrontPageSectionAppendice"),
                    ],
                    class_name="FrontPageSection-isColorWhite FrontPageSection-isBottomBoxShadowed  FrontPageSection-hasAppendice",
                ),
                FrontPageSection(
                    [
                        FrontPageSectionPart(
                            html.Img(src=app.get_asset_url("Big illustration 2.svg"))
                        ),
                        FrontPageSectionPart(
                            [
                                html.H1(
                                    "Une plateforme unique pour réunir les données essentielles de l’ANSM"
                                ),
                                html.P(
                                    "L’ANSM ouvrira dans un premier temps ses données autour des médicaments et "
                                    "suivront celles des ruptures de stocks, du bon usage des médicaments, des "
                                    "essais cliniques et bien d’autres !",
                                    className="medium-text justify-text",
                                ),
                                html.A(
                                    "à propos",
                                    className="Btn btn-outline-primary btn-lg fp-button",
                                    role="button",
                                    href="#",
                                ),
                            ],
                            class_name="Stack Stack-isVerticalCentered",
                        ),
                    ]
                ),
                FrontPageSection(
                    [
                        FrontPageSectionFull(
                            [
                                html.H1("À qui cette plateforme s’adresse ?"),
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "Public-Male-250.svg"
                                                    ),
                                                    style={"height": "250px"},
                                                ),
                                                html.H2(
                                                    "Grand public",
                                                    className="center-text",
                                                ),
                                                html.P(
                                                    "Citoyen, patient, aidant, associations de patients",
                                                    className="medium-text center-text",
                                                ),
                                            ],
                                            className="Stack Stack-isCentered FrontPageAudienceDisplayElem",
                                        ),
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "Doctor-Female-250.svg"
                                                    ),
                                                    style={"height": "250px"},
                                                ),
                                                html.H2(
                                                    "Professionnel de santé",
                                                    className="center-text",
                                                ),
                                                html.P(
                                                    "Médecin, pharmacien, sage-femme, infirmier, "
                                                    "intervenant du paramédical",
                                                    className="medium-text center-text",
                                                ),
                                            ],
                                            className="Stack Stack-isCentered FrontPageAudienceDisplayElem",
                                        ),
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "DataScentist-250.svg"
                                                    ),
                                                    style={"height": "250px"},
                                                ),
                                                html.H2(
                                                    "Expert en données",
                                                    className="center-text",
                                                ),
                                                html.P(
                                                    "Journaliste, data analyst, chercheur, éditeur de logiciel",
                                                    className="medium-text center-text",
                                                ),
                                            ],
                                            className="FrontPageAudienceDisplayElem Stack Stack-isCentered",
                                        ),
                                    ],
                                    className="FrontPageAudienceDisplay",
                                ),
                            ]
                        )
                    ],
                    class_name="FrontPageSection-isColor3 ",
                ),
                FrontPageSection(
                    [
                        FrontPageSectionPart(
                            [
                                html.H1("Origine et nature des données"),
                                html.P(
                                    "Les données de la plateforme proviennent de bases de données gerées en "
                                    "majorité par l’ANSM, et d’autres proviennent de bases open source gerées par "
                                    "d’autres institutions de santé (CNAM, HAS).",
                                    className="medium-text justify-text",
                                ),
                                html.P(
                                    "Elles sont alimentées par les parties prenantes (agents de l’ANSM, "
                                    "institutions, grand public, professionnels de santé, industriels).",
                                    className="medium-text justify-text",
                                ),
                                html.A(
                                    "explorer les données",
                                    className="Btn btn-outline-primary btn-lg fp-button",
                                    role="button",
                                    href="/apps/explorer",
                                ),
                            ],
                            class_name="Stack Stack-isVerticalCentered",
                        ),
                        FrontPageSectionPart(
                            html.Img(src=app.get_asset_url("Big illustration 3.svg"))
                        ),
                    ]
                ),
            ],
            className="container-fluid p-0",
        ),
    )
