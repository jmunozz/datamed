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

from apps.components.commons import get_opts_search_bar
from datamed_custom_components import NavBar


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
    opts = get_opts_search_bar()
    return NavBar(id="navbar", opts=opts, fireOnSelect=True)


@app.callback(
    dd.Output("url", "href"), dd.Input("navbar", "url"), dd.Input("navbar", "value"),
)
def update_path(url, value):
    print(url, value)
    ctx = dash.callback_context
    if not ctx.triggered:
        raise PreventUpdate()
    if value:
        type = value["type"]
        index = value["value"]
        return f"/apps/{type}?" + urlencode({"search": quote_plus(index)})
    elif url:
        return url
    else:
        raise PreventUpdate()
