import dash_core_components as dcc
from dash.development.base_component import Component
import dash_html_components as html
from .search import Search

def LogoAnsm() -> Component:
    img = html.Img(src="/assets/logo_ansm.png", style={"width": "100px", "display": "inline-block"})
    return dcc.Link(img, href="/")


def UrlAnsm() -> Component:
    return html.Span(
        ["data.", html.B("ansm.sante.fr")],
        style={"color": "black"},
        className="ml-2 d-inline-block",
    )


def MenuItem(title: str, href: str) -> Component:
    return html.A(
        title,
        href=href,
        className="button-text nav-link text-secondary d-inline-block mr-4",
    )


def Navbar() -> Component: 
    return html.Div([
        LogoAnsm(),
        MenuItem("Analyses thématiques", "/"),
        MenuItem("Explorer", "/apps/explorer"),
        MenuItem("À propos", "/"),
        Search()
    ], 
    className="navbar")

