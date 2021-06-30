from dash.development.base_component import Component
from dash_html_components import Div

from .components.footer import Footer
from .components.mesusage import Mesusage
from .components.navbar import Navbar


def Layout() -> Component:
    return Div(
        [Navbar(), *Mesusage(), Footer()],
    )
