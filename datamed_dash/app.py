import dash_bootstrap_components as dbc
from dash_extensions.enrich import DashProxy, MultiplexerTransform
from dotenv import load_dotenv
from flask_caching import Cache

load_dotenv()

app = DashProxy(
    __name__,
    external_stylesheets=[__file__.replace("index.py", "./assets/style.css"), dbc.themes.BOOTSTRAP],
    external_scripts=[
        dbc.themes.BOOTSTRAP,
        __file__.replace("index.py", "./assets/menu.js"),
        __file__.replace("index.py", "./assets/crisp.js"),
    ],
    suppress_callback_exceptions=True,
    title="data.ansm",
    transforms=[MultiplexerTransform()],
)

cache = Cache(app.server, config={"CACHE_TYPE": "filesystem", "CACHE_DIR": "/tmp"})

server = app.server
