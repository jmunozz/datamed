import dash.dependencies as dd
from app import app
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_bootstrap_components import Tooltip
from dash_core_components import Graph
from dash_html_components import Div, A, P, I
from sm import SideMenu

INITIAL_YEAR = "2020"


def DescriptionRuptures() -> Component:
    tooltip_text = (
        "La base de données des ruptures de stock recense les médicaments d’intérêt thérapeutique majeur "
        "faisant actuellement l’objet de difficultés d’approvisionnement et pour lesquels, il n’y a pas "
        "d’alternative thérapeutique disponible sur le marché français."
    )
    return Div(
        Div(
            [
                Div(
                    I(
                        className="bi bi-book d-flex justify-content-center pt-3",
                        style={"font-size": "3rem"},
                    ),
                    className="col-1",
                ),
                Div(
                    [
                        Div(
                            "Observatoire des ruptures de stock",
                            className="heading-4",
                            id="description-ruptures",
                        ),
                        Div(
                            [
                                Div(
                                    "BASE DE DONNÉES",
                                    className="caption-text d-inline-block",
                                ),
                                I(
                                    className="info-icon bi bi-info-circle d-inline-block",
                                    id="bdd-ruptures-info-icon",
                                ),
                                Tooltip(
                                    tooltip_text,
                                    target="bdd-ruptures-info-icon",
                                    placement="right",
                                ),
                            ]
                        ),
                        Div("Bases de données exploitées", className="small-text-bold"),
                        A(
                            "TrustMed, États des lieux des laboratoires",
                            href="/apps/ruptures",
                            className="normal-text link",
                            id="refresh-substances",
                        ),
                        Div(
                            "Description",
                            className="small-text-bold",
                        ),
                        P(
                            "L’ANSM a pour mission d’observer tout au long de l’année l’état des ruptures de stock "
                            "de médicaments présents dans les circuits Ville et Hôpital et de s’assurer du maintien "
                            "des stocks en cas de tension d’approvisionnement et de rupture. Retrouvez les différentes "
                            "formes et chiffres de signalements que l’Agence reçoit, et les actions mises en place "
                            "pour y remédier et maintenir ainsi l’alimentation des officines au niveau national.",
                            className="normal-text text-justify",
                        ),
                        Div(
                            "Avertissement",
                            className="small-text-bold",
                        ),
                        P(
                            "Les chiffres présentés ici ont pour but d’ouvrir les données au grand public afin de "
                            "communiquer les actions de l’Agence. Leur interprétation et leur diffusion est soumise à "
                            "des réglementations strictes. L’Agence ne se tient pas responsable en cas d’interprétation"
                            " erronée et de divulgation de ces chiffres, dans un contexte qui ne permettrait pas "
                            "leur lecture dans les conditions optimales. En cas de doute, veuillez nous contacter, "
                            "vous contribuerez alors directement à l’amélioration de l’information diffusée.",
                            className="normal-text text-justify",
                        ),
                        Div(
                            "Réutilisation des données",
                            className="small-text-bold",
                        ),
                        A(
                            "Analyse thématique",
                            href="/apps/ruptures",
                            className="normal-text link d-inline-block",
                            id="refresh-substances",
                        ),
                        Div(", ", className="d-inline-block"),
                        A(
                            "data.gouv.fr",
                            href="https://www.data.gouv.fr/",
                            className="normal-text link d-inline-block",
                            id="refresh-substances",
                        ),
                    ],
                    className="col-11 pr-5",
                ),
            ],
            className="description col-xl-8 col-sm-11 row",
        ),
        style={"margin-top": "31.5px"},
        className="topic-section",
    )


def AtcBar() -> Graph:
    return Graph(
        figure=None,
        className="img-card",
        responsive=True,
        style={"height": "500px"},
        id="atc-bar-chart",
    )


def Ruptures() -> Component:
    return Div(
        [
            SideMenu(
                id="side-menu",
                items=[
                    {"id": "description-ruptures", "label": "Description"},
                    {"id": "signalements", "label": "Signalements"},
                    {"id": "gestion-ruptures", "label": "Gestion des ruptures"},
                ],
                className="side-menu",
            ),
            Div(
                [
                    DescriptionRuptures(),
                ]
            ),
        ],
        className="side-menu-container",
    )


@app.callback(
    dd.Output("atc-bar-chart", "figure"),
    dd.Input("annee-dropdown", "value"),
)
def update_figure(value: str):
    if not value:
        raise PreventUpdate
    return None
