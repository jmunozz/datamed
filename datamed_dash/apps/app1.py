from dash_html_components import Div

from .components.arrow import Arrow
from .components.donnees_une import DonneesUne
from .components.footer import Footer

from .components.navbar import Navbar
from .components.plateforme import Plateforme
from .components.frontpage import FrontPage

layout = Div(
    [Navbar(), *FrontPage(), Footer(),], className="layout", id="layout_landing_page",
)
