from urllib.parse import urlparse, unquote_plus
import os

import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Output, Input

from app import app, server
from apps import app1, app2, app3, app4

app.layout = html.Div(
    [dcc.Location(id="url", refresh=False), html.Div(id="page-content")]
)

os.environ["PYTHONUNBUFFERED"] = "1"
os.environ["DATABASE_URL"] = "postgresql://vcbfhnpadtnkzu:553026ea6ff893cd34cf8a4b61a8deeae2f9fb7de004fd393313220d2b249310@ec2-54-228-174-49.eu-west-1.compute.amazonaws.com:5432/d3s5pjrcuo170u"


@app.callback(Output("page-content", "children"), Input("url", "href"))
def display_page(href):
    parsed_url = urlparse(unquote_plus(href))
    pathname = parsed_url.path

    if pathname == "/apps/accueil":
        return app1.layout
    elif pathname == "/apps/specialite":
        return app2.Layout(parsed_url)
    elif pathname == "/apps/explorer":
        return app3.Layout()
    elif pathname == "/apps/ruptures":
        return app4.Layout()
    else:
        return app1.layout

if __name__ == "__main__":
    if os.environ.get("FLASK_ENV") == "development":
        app.run_server(host="0.0.0.0", port=8050, debug=True)
    else:
        app.run_server()
