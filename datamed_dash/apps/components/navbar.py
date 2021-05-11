from typing import List, Dict
from urllib.parse import urlencode, quote_plus

import dash
import dash.dependencies as dd
import dash_core_components as dcc
import dash_html_components as html
from app import app
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from datamed_custom_components import SearchBar
from db import specialite, substance
from pandas.core.frame import DataFrame

search_item_max_len = 100


def truncate_str(text: str) -> str:
    return (
        f"{text[:search_item_max_len]}..." if len(text) >= search_item_max_len else text
    )


def to_search_bar_options(df: DataFrame, type: str) -> List[Dict]:
    return [
        {
            "label": truncate_str(val),
            "value": index,
            "type": type,
        }
        for index, val in df.nom.items()
    ]


def LogoAnsm() -> Component:
    img = html.Img(
        src=app.get_asset_url("Logo.svg"),
        style={"width": "100px", "display": "inline-block"},
        className="mr-4"
    )
    return dcc.Link(img, href="/")


def MenuItem(title: str, href: str) -> Component:
    return html.A(
        title,
        href=href,
        className="button-text nav-link d-inline-block mr-4",
        style={"text-decoration": "none", "color": "black"}
    )


def Navbar() -> Component:
    df_spe = specialite.list_specialite()
    df_sub = substance.list_substance()
    opts_spe = to_search_bar_options(df_spe, "specialite")
    opts_sub = to_search_bar_options(df_sub, "substance")
    opts = opts_spe + opts_sub
    opts = sorted(opts, key=lambda x: x["label"])

    return html.Div(
        [
            LogoAnsm(),
            MenuItem("Analyses thématiques", "/"),
            MenuItem("Explorer", "/apps/explorer"),
            MenuItem("À propos", "/"),
            SearchBar(id="search-bar", opts=opts, fireOnSelect=True),
        ],
        className="navbar",
    )


@app.callback(
    dd.Output("url", "href"),
    dd.Input("search-bar", "value"),
)
def update_path(value):
    ctx = dash.callback_context
    if not ctx.triggered or not value:
        raise PreventUpdate()

    type = value["type"]
    index = value["value"]

    return f"/apps/{type}?" + urlencode({"search": quote_plus(index)})
