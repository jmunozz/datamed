import dash_core_components as dcc
import dash
import dash_html_components as html
import dash.dependencies as dd
from dash.development.base_component import Component
from pandas.core.frame import DataFrame
from dash.exceptions import PreventUpdate
from urllib.parse import urlencode, quote_plus


from app import app
from db import specialite, substance

from datamed_custom_components import SearchBar


search_item_max_len = 30


def to_search_bar_options(df: DataFrame, type: str):
    return [
        {
            "label": f"{val[:search_item_max_len]}..."
            if len(val) >= search_item_max_len
            else val,
            "value": index,
            "type": type,
        }
        for index, val in df["nom"].items()
    ]


def LogoAnsm() -> Component:
    img = html.Img(
        src="/assets/logo_ansm.png", style={"width": "100px", "display": "inline-block"}
    )
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
            SearchBar(id="search-bar", opts=opts),
        ],
        className="navbar",
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

