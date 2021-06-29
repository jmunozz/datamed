from dash.development.base_component import Component
from dash_html_components import Div

from .components.contact import Contact
from .components.footer import Footer
from .components.navbar import Navbar


def Layout() -> Component:
    return Div(
        [Navbar(), Contact(), Footer()],
        className="layout",
        id="layout_contact",
    )
