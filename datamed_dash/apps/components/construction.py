from app import app
from dash.development.base_component import Component
from dash_bootstrap_components import Row
from dash_html_components import Div, Img, A


def Construction() -> Component:
    return Div(
        [
            Div(className="header-space"),
            Div(
                [
                    Div(
                        Img(
                            src=app.get_asset_url("Illustration-construction.svg"),
                        ),
                        className="fp-section fp-section-1 justify-content-center",
                    ),
                    Div(
                        "Page en construction",
                        className="fp-section fp-section-1 justify-content-center heading-4",
                    ),
                    Row(
                        [
                            Div(
                                [
                                    Div(
                                        "L’équipe des Entrepreneurs d’Intérêt Général s'attèle actuellement "
                                        "à la construction de cette page, encore un peu de patience !",
                                        className="large-text d-block mb-4",
                                    ),
                                    A(
                                        "Retour à l'accueil",
                                        href="/apps/accueil",
                                        className="normal-text link d-block",
                                    ),
                                ],
                                className="col-lg-6 col-md-10 col-sm-10 text-center mb-5"
                            )
                        ],
                        className="fp-section fp-section-1 justify-content-md-center d-flex",
                    ),
                ],
            ),
        ],
        className="container-fluid p-0",
    )
