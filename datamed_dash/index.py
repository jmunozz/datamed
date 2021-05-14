import os
from urllib.parse import urlparse, unquote_plus

import dash_core_components as dcc
from dash.dependencies import Output, Input
from dash_html_components import Div

from app import app, server
from apps import app1, app2, app3, app4, app5, app6

app.layout = Div([dcc.Location(id="url", refresh=False), Div(id="page-content")])


@app.callback(Output("page-content", "children"), Input("url", "href"))
def display_page(href):
    parsed_url = urlparse(unquote_plus(href))
    pathname = parsed_url.path

    if pathname == "/apps/accueil":
        return app1.layout
    elif pathname == "/apps/specialite":
        return app2.Layout(parsed_url)
    elif pathname == "/apps/substance":
        return app5.Layout(parsed_url)
    elif pathname == "/apps/explorer":
        return app3.Layout()
    elif pathname == "/apps/ruptures":
        return app4.Layout()
    elif pathname == "/apps/construction":
        return app6.Layout()
    else:
        return app1.layout


if __name__ == "__main__":
    if os.environ.get("FLASK_ENV") == "development":
        app.run_server(host="0.0.0.0", port=8050, debug=True)
    else:
        app.run_server()
