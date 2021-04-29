import dash_bootstrap_components as dbc
import dash_html_components as html
from dash.development.base_component import Component


def Box(
    children, class_name_wrapper="col-md-12", class_name="", style=None
) -> Component:
    class_name = f"box {class_name}"
    return html.Div(
        html.Div(children, className=class_name, style=style),
        className=class_name_wrapper,
    )


def ArticleTitle(title) -> Component:
    return html.H4(title, className="small-text-bold with-margin")


def GraphBox(
    title, children, class_name_wrapper="col-md-12", class_name=""
) -> Component:
    return Box(
        [html.Div(title, className="small-text-bold mb-4")] + children,
        class_name_wrapper=class_name_wrapper,
        class_name=class_name,
    )

def FigureGraph(figures) -> Component:
    l = []
    for f in figures:
        elems = []
        elems = elems + [html.Img(src=f["img"])] if f.get("img") else []
        elems = elems + [html.H1(f["figure"])] if f.get("figure") else []
        elems = elems + [html.Label(f["caption"])] if f.get("caption") else []
        l = l + [html.Div(elems, className="d-flex flex-column align-items-center")]
    return html.Div(l, className="d-flex flex-row flex-wrap justify-content-around")


def TopicSection(children, id) -> Component:
    return dbc.Row(
        html.Div(children, className="col-12"), className="topic-section", id=id
    )


def SectionTitle(title: str) -> Component:
    return dbc.Row(
        html.Div(
            html.H1(title, className="d-inline-block"), className="col-12"
        ),
        className="section-title",
    )

def SectionP(str: str) -> Component:
    return dbc.Row(html.Div(html.P(str), className="col-12"))


def ExternalLink(label, link):
    return html.A(
        f"{label}",
        href=link,
        target="_blank",
        rel="noopener noreferrer",
        className="normal-text link d-inline-block",
        id="refresh-substances",
    )
