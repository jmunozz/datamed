from apps.components.commons import SideEffects
from dash.development.base_component import Component
from dash_html_components import Div

from .components.footer import Footer
from .components.navbar import Navbar
from .components.propos import APropos


def Layout() -> Component:
    return Div(
        [Navbar(), APropos(), Footer(), SideEffects()],
    )
