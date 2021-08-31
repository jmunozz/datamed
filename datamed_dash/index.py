from apps.components.commons import SideEffects
import os
from urllib.parse import urlparse, unquote_plus

import dash.exceptions as de
import dash_auth
import dash_core_components as dcc
from dash.dependencies import Output, Input, ClientsideFunction
from dash_html_components import Div

from app import app, server
from apps import (
    app_frontpage,
    app_specialite,
    app_explorer,
    app_ruptures,
    app_substance,
    app_construction,
    mentions_legales,
    a_propos,
    app_mesusage,
    app_contact,
)

app.layout = Div(
    [dcc.Location(id="url", refresh=False), Div(id="page-content"), SideEffects()]
)

USERNAME = os.environ["USERNAME"]
PASSWORD = os.environ["PASSWORD"]
dash_auth.BasicAuth(app, {USERNAME: PASSWORD})


def noop():
    raise de.PreventUpdate("no operation")


app.clientside_callback(
    ClientsideFunction(namespace="search_updated", function_name="scrollTop"),
    Output("dash-side-effect-hidden-div", "data-output"),
    Input("dash-side-effect-hidden-div", "data-input"),
)


@app.callback(Output("page-content", "children"), Input("url", "href"))
def display_page(href):

    parsed_url = urlparse(unquote_plus(href))
    pathname = parsed_url.path

    if pathname == "/apps/accueil":
        return app_frontpage.layout
    elif pathname == "/apps/specialite":
        return app_specialite.Layout(parsed_url)
    elif pathname == "/apps/substance":
        return app_substance.Layout(parsed_url)
    elif pathname == "/apps/explorer":
        return app_explorer.Layout()
    elif pathname == "/apps/ruptures":
        return app_ruptures.Layout()
    elif pathname == "/apps/mesusage":
        return app_mesusage.Layout()
    elif pathname == "/apps/construction":
        return app_construction.Layout()
    elif pathname == "/apps/mentions_legales":
        return mentions_legales.Layout()
    elif pathname == "/apps/a_propos":
        return a_propos.Layout()
    elif pathname == "/apps/contact":
        return app_contact.Layout()
    else:
        return app_frontpage.layout


if __name__ == "__main__":
    if os.environ.get("FLASK_ENV") == "development":
        app.run_server(host="0.0.0.0", port=8050, debug=True)
    else:
        app.run_server()
