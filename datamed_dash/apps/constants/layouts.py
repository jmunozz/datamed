from typing import Dict

import pandas as pd

BAR_LAYOUT = {
    "xaxis": dict(
        showgrid=False,
        showline=False,
        showticklabels=False,
        zeroline=False,
        fixedrange=True,
    ),
    "yaxis": dict(
        showgrid=False,
        showline=False,
        zeroline=False,
        autorange="reversed",
        ticks="outside",
        tickcolor="white",
        ticklen=1,
        fixedrange=True,
    ),
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(l=0, r=0, t=0, b=0),
    "barmode": "group",
    "bargap": 0.10,
    "bargroupgap": 0.0,
    "font": {"size": 12, "color": "black"},
}

CURVE_LAYOUT = {
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "hovermode": "x unified",
    "plot_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "hoverlabel": {"namelength": -1},
    "xaxis": {"fixedrange": True},
    "yaxis": {"fixedrange": True},
}

PIE_LAYOUT = {
    "autosize": False,
    "height": 400,
    "width": 400,
    "plot_bgcolor": "#FFF",
    "margin": dict(t=1, b=1, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "hoverlabel": dict(
        bgcolor="white",
        bordercolor="white",
        font=dict(color="black", size=14, family="Roboto"),
    ),
}

PIE_TRACES = {"marker": dict(line=dict(color="#000000", width=1))}

SUNBURST_LAYOUT = {
    "autosize": False,
    "height": 400,
    "width": 400,
    "plot_bgcolor": "#FFF",
    "margin": dict(t=1, b=1, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

SUNBURST_TRACES = {
    "marker": dict(line=dict(color="#000000", width=1)),
    "hovertemplate": "<b>%{label}</b> <br> <br>Total : <b>%{value:f}</b> <extra></extra>",
}

MESUSAGE_STACKED_BAR_CHART_LAYOUT = {
    "plot_bgcolor": "#FFF",
    "margin": dict(l=0, r=0, t=0, b=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "font": {"color": "black"},
    "hovermode": "x unified",
    "hoverlabel": {"namelength": -1},
    "barmode": "stack",
}

STACKED_BAR_CHART_LAYOUT = {
    "xaxis": dict(
        showgrid=False, showline=False, zeroline=False, tickformat="%", fixedrange=True
    ),
    "yaxis": dict(
        showgrid=False,
        showline=False,
        zeroline=False,
        ticks="outside",
        tickcolor="white",
        ticklen=1,
        visible=False,
        showticklabels=False,
        fixedrange=True,
    ),
    "plot_bgcolor": "#FFF",
    "margin": dict(l=0, r=0, t=0, b=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "barmode": "stack",
    "hoverlabel": dict(
        bgcolor="white",
        bordercolor="white",
        font=dict(color="black", size=12, family="Roboto"),
    ),
}

STACKED_BAR_CHART_TRACES = {"marker": dict(line=dict(color="#000000", width=1))}

TREEMAP_LAYOUT = {
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "hovermode": "x unified",
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

TREEMAP_LAYOUT_OVERRIDE_SPECIALITE = {
    "paper_bgcolor": "#f5f5f5",
}

RUPTURES_BAR_LAYOUT = {
    "xaxis": dict(
        showgrid=False,
        showline=False,
        showticklabels=False,
        zeroline=False,
        fixedrange=True,
    ),
    "yaxis": dict(
        showgrid=False,
        showline=False,
        showticklabels=True,
        zeroline=False,
        ticks="outside",
        tickcolor="white",
        ticklen=1,
        fixedrange=True,
    ),
    "plot_bgcolor": "#FFF",
    "paper_bgcolor": "#FFF",
    "margin": dict(l=0, r=0, t=0, b=0),
    "barmode": "group",
    "bargap": 0.10,
    "bargroupgap": 0.0,
    "font": {"size": 12, "color": "black"},
    "hovermode": "x unified",
    "hoverlabel": {"namelength": -1},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}


def get_ruptures_curve_layout(tickvals: pd.Series) -> Dict:
    return {
        "xaxis": {"tickmode": "array", "tickvals": tickvals, "fixedrange": True},
        "yaxis": {"fixedrange": True},
        "xaxis_showgrid": False,
        "yaxis_showgrid": False,
        "hovermode": "x unified",
        "plot_bgcolor": "#FFF",
        "paper_bgcolor": "#FFF",
        "margin": dict(t=0, b=0, l=0, r=0),
        "font": {"size": 12, "color": "black"},
        "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        "hoverlabel": {"namelength": -1},
        "showlegend": True,
    }
