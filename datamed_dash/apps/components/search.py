from urllib.parse import urlencode, quote_plus

import dash
import dash.dependencies as dd
import dash_core_components as dcc
from app import app
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from db import specialite
import dash_html_components as html

spe_name_max_len = 40


def first_load_specialite():
    specialite.list_specialite()


def load_specialites_into_options(search: str):
    search = search.lower()
    spe_series = specialite.list_specialite()["nom"]
    spe_series = spe_series[spe_series.str.startswith(search)]
    spe_series = spe_series.sort_values()
    options =         [{
            "label": v[1][:spe_name_max_len] + "..."
            if len(v[1]) > spe_name_max_len
            else v[1],
            "value": v[1],
        }
        for v in spe_series.items()]
    print(options)
    return options
    # return [{"label": "jordan", "value": 1}, {"label": "romain", "value": 3}, {"label": "theo", "value": 2}]


def Search() -> Component:
    return html.Form(dcc.Dropdown(
        id="search-dropdown",
        clearable=True,
        placeholder="Médicament, substance active",
        className="search",
    ), autoComplete="off", className="search-bar ml-auto flex-nowrap mt-4 align-items-center")


@app.callback(
    dd.Output("search-dropdown", "options"),
    dd.Input("search-dropdown", "search_value"),
)
def update_options(search_value: str):
    ctx = dash.callback_context
    if not ctx.triggered:
        first_load_specialite()
        raise PreventUpdate()
    if not search_value:
        return []
    return load_specialites_into_options(search_value)


@app.callback(
    dd.Output("url", "href"), dd.Input("search-dropdown", "value"),
)
def update_path(value: str):
    ctx = dash.callback_context
    if not ctx.triggered or not value:
        raise PreventUpdate()
    return "/apps/specialite?" + urlencode({"search": quote_plus(value)})
