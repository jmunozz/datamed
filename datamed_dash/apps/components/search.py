import json
import zipfile
from typing import List
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash
import dash.dependencies as dd
import dash_table
import pandas as pd
import plotly.graph_objects as go
import requests
from app import app
from bs4 import BeautifulSoup
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
import dash_bootstrap_components as dbc
import dash_core_components as dcc
import dash_html_components as html
from plotly.subplots import make_subplots
from sm import SideMenu

from ..constants.colors import PIE_COLORS, BAR_CHART_COLORS
from ..constants.layouts import BAR_LAYOUT, CURVE_LAYOUT, PIE_LAYOUT
from db import specialite, substance, atc
from.utils import Box, GraphBox, TopicSection, ArticleTitle, SectionTitle, ExternalLink



def load_specialites_into_options(): 
    df_spe = specialite.list_specialite()
    print([ {"value": x[0], "label": x[1]} for x in df_spe["nom"].items()])


def Search() -> Component:
    return html.Div([dbc.FormGroup(
        [dbc.Input(
            id="search-input",
            placeholder="Médicament, substance active"
        ),
        dcc.Dropdown(
            id="search-bar-dropdown",
            # className="normal-text main-dropdown",
        )],
        className="search-bar ml-auto flex-nowrap mt-4 align-items-center search"
    ), html.Div(id="output")])



# def Search() -> Component:
#     return html.Div(html.Div(
#         html.Div(
#             [
#                 SearchBar("input-group-content mr-3 pl-0", "specialite-search-bar"),
#                 html.Div(
#                     html.Div(
#                         Button(
#                             "RECHERCHER",
#                             n_clicks=0,
#                             outline=True,
#                             className="button-text-bold",
#                             color="secondary",
#                             type="submit",
#                             id="specialite-rechercher-button",
#                             style={"min-width": "fit-content"},
#                         )
#                     ),
#                     className="input-group-append",
#                 ),
#             ],
#             className="input-group col-md-12",
#         ),
#         className="row",
#     ),
#     className="col-12"
#     )

@app.callback(
    dd.Output("output", "children"),
    dd.Input("search-input", "value"),
)
def update_options(value:str): 
    ctx = dash.callback_context
    if not ctx.triggered:
        load_specialites_into_options()
    return value

@app.callback(
    dd.Output("search-bar", "options"),
    dd.Input("search-bar", "search_value"),
)
def update_search_bar_options(search_value: str):
    if not search_value:
        raise PreventUpdate

    # search_value = search_value.lower()

    # values_list = [v for v in SPE_SA_DICT.keys() if v.lower().startswith(search_value)]
    # values_list.sort()
    # values_list = sorted(values_list, key=len)
    # return [
    #     {"label": v[:90] + "..." if len(v) > 90 else v, "value": v} for v in values_list
    # ]


@app.callback(
    dd.Output("search-bar", "href"),
    dd.Input("search-bar", "value"),
)
def update_path(value: str):
    if value:
        return "/apps/specialite?" + urlencode({"search": quote_plus(value)})