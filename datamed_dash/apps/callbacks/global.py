from urllib.parse import urlencode, quote_plus

import dash
import dash.exceptions as de
import dash.dependencies as dd


from app import app


@app.callback(
    dd.Output("url", "href"), dd.Input("search-dropdown", "value"),
)
def update_path(value: str):
    ctx = dash.callback_context
    if not ctx.triggered or not value:
        raise de.PreventUpdate()
    return "/apps/specialite?" + urlencode({"search": quote_plus(value)})
