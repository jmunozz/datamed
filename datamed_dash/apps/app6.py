from dash.development.base_component import Component
from dash_html_components import Div

from .components.construction import Construction
from .components.footer import Footer
from .components.navbar import Navbar
from apps.components.commons import SideEffects


def Layout() -> Component:
    return Div(
        [Navbar(), Construction(), Footer(), SideEffects()],
        className="layout",
        id="layout_construction",
    )
