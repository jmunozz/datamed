from dash_html_components import Div

from .components.footer import Footer
from .components.frontpage import FrontPage
from .components.navbar import Navbar

layout = Div([Navbar(), *FrontPage(), Footer()],)
