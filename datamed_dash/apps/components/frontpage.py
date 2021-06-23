from typing import Tuple

import dash_html_components as html
from app import app

from .commons import (
    FrontPageSection,
    FrontPageSectionPart,
    FrontPageSectionFull,
    SearchBar,
)


def FrontPage() -> Tuple[html.Div, html.Div]:
    return (
        html.Div(className="header-space"),
        html.Div(
            [
                FrontPageSection(
                    [
                        FrontPageSectionFull(
                            [
                                html.H3("Trouvez des données autour du médicament"),
                                SearchBar("frontpage-search-bar"),
                            ],
                            class_name="Stack Stack-isCentered Stack-isVerticalCentered",
                        ),
                        FrontPageSectionPart(
                            [
                                html.H1(
                                    "Des données accessibles et expliquées, au service des patients"
                                ),
                                html.P(
                                    "L’Agence Nationale de Sécurité du Médicament et des Produits de Santé (ANSM) "
                                    "ouvre ses données de manière pédagogique pour permettre au plus grand nombre "
                                    "de réaliser des choix éclairés.",
                                    className="medium-text justify-text",
                                ),
                            ],
                            class_name="Stack Stack-isCentered Stack-isVerticalCentered",
                        ),
                        FrontPageSectionPart(
                            html.Img(src=app.get_asset_url("big_illustration_1.svg"))
                        ),
                    ],
                    has_appendice=True,
                    class_name="FrontPageSection-isColorWhite FrontPageSection-isBottomBoxShadowed FrontPageSection-hasAppendice",
                ),
                FrontPageSection(
                    [
                        FrontPageSectionPart(
                            html.Img(src=app.get_asset_url("big_illustration_2.svg"))
                        ),
                        FrontPageSectionPart(
                            [
                                html.H1(
                                    "Une plateforme unique pour réunir les données essentielles de l’ANSM"
                                ),
                                html.P(
                                    "L’ANSM ouvre dans un premier temps ses données autour des effets indésirables "
                                    "des médicaments, des erreurs médicamenteuses et des ruptures de stocks. "
                                    "S'en suivront celles du bon usage du médicament et bien d’autres !",
                                    className="medium-text justify-text",
                                ),
                                html.A(
                                    "à propos",
                                    className="Btn Btn-isPrimary",
                                    role="button",
                                    href="/apps/a_propos",
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
                                                        "public-male-250.svg"
                                                    ),
                                                    style={"height": "250px"},
                                                ),
                                                html.H2(
                                                    "Grand public",
                                                    className="center-text",
                                                ),
                                                html.P(
                                                    "Citoyens, patients, aidants, associations de patients",
                                                    className="medium-text center-text",
                                                ),
                                            ],
                                            className="Stack Stack-isCentered FrontPageAudienceDisplayElem",
                                        ),
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "doctor-female-250.svg"
                                                    ),
                                                    style={"height": "250px"},
                                                ),
                                                html.H2(
                                                    "Professionnels de santé",
                                                    className="center-text",
                                                ),
                                                html.P(
                                                    "Médecins, pharmaciens, sages-femmes, infirmiers, "
                                                    "intervenants du paramédical",
                                                    className="medium-text center-text",
                                                ),
                                            ],
                                            className="Stack Stack-isCentered FrontPageAudienceDisplayElem",
                                        ),
                                        html.Div(
                                            [
                                                html.Img(
                                                    src=app.get_asset_url(
                                                        "datascentist-250.svg"
                                                    ),
                                                    style={"height": "250px"},
                                                ),
                                                html.H2(
                                                    "Experts en données",
                                                    className="center-text",
                                                ),
                                                html.P(
                                                    "Journalistes, data analysts, chercheurs, éditeurs de logiciel",
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
                                    "La majorité des données de la plateforme data.ansm proviennent de bases "
                                    "de données gerées par l’ANSM. Certaines données proviennent de bases Open Source "
                                    "gerées par d’autres institutions de santé (CNAM, HAS).",
                                    className="medium-text justify-text",
                                ),
                                html.P(
                                    "Ces bases de données sont alimentées par différentes parties prenantes "
                                    "(agents de l’ANSM, institutions, grand public, professionnels de santé, "
                                    "industriels).",
                                    className="medium-text justify-text",
                                ),
                                html.A(
                                    "explorer les données",
                                    className="Btn Btn-isPrimary",
                                    role="button",
                                    href="/apps/explorer",
                                ),
                            ],
                            class_name="Stack Stack-isVerticalCentered",
                        ),
                        FrontPageSectionPart(
                            html.Img(src=app.get_asset_url("big_illustration_3.svg"))
                        ),
                    ]
                ),
            ],
            className="container-fluid p-0",
        ),
    )
