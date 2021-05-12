from typing import Dict

BAR_LAYOUT = {
    "xaxis": dict(
        showgrid=False, showline=False, showticklabels=False, zeroline=False,
    ),
    "yaxis": dict(
        showgrid=False,
        showline=False,
        zeroline=False,
        autorange="reversed",
        ticks="outside",
        tickcolor="white",
        ticklen=1,
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
    "yaxis2_showgrid": False,
    "hovermode": "x unified",
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "hoverlabel": {"namelength": -1},
}

PIE_LAYOUT = {
    "autosize": False,
    "height": 400,
    "width": 400,
    "plot_bgcolor": "#FFFFFF",
    "paper_bgcolor": "#FFFFFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

STACKED_BAR_CHART_LAYOUT = {
    "xaxis": dict(showgrid=False, showline=False, zeroline=False, tickformat="%"),
    "yaxis": dict(
        showgrid=False,
        showline=False,
        zeroline=False,
        ticks="outside",
        tickcolor="white",
        ticklen=1,
        visible=False,
        showticklabels=False,
    ),
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(l=0, r=0, t=0, b=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "barmode": "stack",
}


TREEMAP_LAYOUT = {
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "hovermode": "x unified",
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

RUPTURES_BAR_LAYOUT = {
    "xaxis": dict(showgrid=False, showline=False, showticklabels=True, zeroline=False,),
    "yaxis": dict(
        showgrid=False,
        showline=False,
        showticklabels=True,
        zeroline=False,
        ticks="outside",
        tickcolor="white",
        ticklen=1,
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


def get_ruptures_curve_layout(tick0) -> Dict:
    return {
        "xaxis": {"tickmode": "linear", "tick0": tick0, "dtick": 1,},
        "xaxis_showgrid": False,
        "yaxis_showgrid": False,
        "hovermode": "x unified",
        "plot_bgcolor": "#FAFAFA",
        "paper_bgcolor": "#FAFAFA",
        "margin": dict(t=0, b=0, l=0, r=0),
        "font": {"size": 12, "color": "black"},
        "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        "hoverlabel": {"namelength": -1},
    }
