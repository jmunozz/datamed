from typing import List, Dict
from urllib.parse import urlencode, quote_plus

import dash
import dash.dependencies as dd
import dash_core_components as dcc
import dash_html_components as html
from app import app
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from db import specialite, substance
from apps.components.commons import SearchBar


def LogoAnsm() -> Component:
    img = html.Img(
        src=app.get_asset_url("logo.svg"),
        style={"width": "100px", "display": "inline-block"},
        className="mr-4",
    )
    return dcc.Link(img, href="/")


def MenuItem(title: str, href: str) -> Component:
    return html.A(title, href=href, className="NavbarItem normal-text",)


def Navbar() -> Component:
    return html.Div(
        [
            LogoAnsm(),
            # MenuItem("Analyses thématiques", "/apps/construction"),
            MenuItem("Explorer", "/apps/explorer"),
            MenuItem("À propos", "/apps/a_propos"),
            SearchBar(id="search-bar"),
            html.Div(id="dash-side-effect-hidden-div"),
        ],
        className="Navbar",
    )


@app.callback(
    dd.Output("url", "href"), dd.Input("search-bar", "value"),
)
def update_path(value):
    ctx = dash.callback_context
    if not ctx.triggered or not value:
        raise PreventUpdate()

    type = value["type"]
    index = value["value"]

    return f"/apps/{type}?" + urlencode({"search": quote_plus(index)})
