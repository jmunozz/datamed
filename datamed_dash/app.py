import dash
import dash_bootstrap_components as dbc
from flask_caching import Cache

app = dash.Dash(
    __name__,
    external_stylesheets=[
        dbc.themes.BOOTSTRAP,
        __file__.replace("index.py", "./assets/style.css"),
    ],
    external_scripts=[
        dbc.themes.BOOTSTRAP,
        __file__.replace("index.py", "./assets/menu.js"),
    ],
    suppress_callback_exceptions=True,
    title="Dashboard - DataMed",
)

cache = Cache(app.server, config={
    'CACHE_TYPE': 'filesystem',
    "CACHE_DIR": "/tmp"
})

server = app.server
