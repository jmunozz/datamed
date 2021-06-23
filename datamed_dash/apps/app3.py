from dash.development.base_component import Component
from dash_html_components import Div

from .components.footer import Footer
from .components.navbar import Navbar
from .components.explorer import Explorer
from apps.components.commons import SideEffects


def Layout() -> Component:
    return Div(
        [Navbar(), Explorer(), Footer(), SideEffects()],
        className="layout",
        id="layout_explorer",
    )
