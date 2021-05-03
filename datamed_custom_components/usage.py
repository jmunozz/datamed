import dash
from dash.dependencies import Input, Output
import dash_html_components as html

import datamed_custom_components as dcc

app = dash.Dash(__name__)



opts = [{"label": "jordan", "value": 1, "type": "specialite"}, {"label": "romain", "value": 2, "type": "specialite"}, {"label": "theo", "value": 4, "type": "substance"}, {"label": "jordan", "value": 1, "type": "specialite"}, {"label": "jordan", "value": 1, "type": "specialite"}]

app.layout = html.Div([
    dcc.SearchBar(
        id='search-bar',
        opts=opts
    ),
    html.Div(id='output')
], style={"fontSize": "1rem"})


@app.callback(Output('output', 'children'), Input('search-bar', 'value'))
def display_output(value):
    if value is not None:
        print(value)
        return 'You have entered {}'.format(value.value)
    else: 
        return 'Nothing entered'


if __name__ == '__main__':
    app.run_server(debug=True)
