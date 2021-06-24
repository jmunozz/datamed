from dash.development.base_component import Component
from dash_html_components import Div

from .components.propos import APropos
from .components.footer import Footer
from .components.navbar import Navbar
from apps.components.commons import SideEffects


def Layout() -> Component:
    return Div(
        [Navbar(), APropos(), Footer(), SideEffects()],
        className="layout",
        id="layout_a_propos",
    )
