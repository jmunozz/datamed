from typing import List, Dict

import dash_bootstrap_components as dbc
from dash.development.base_component import Component
from dash_html_components import Div, A, Img, H4, H1, Label


def Box(
    children, class_name_wrapper="col-md-12", class_name="", style=None
) -> Component:
    class_name = f"box {class_name}"
    return Div(
        Div(children, className=class_name, style=style),
        className=class_name_wrapper,
    )


def ArticleTitle(title: str) -> Component:
    return H4(title, className="small-text-bold with-margin")


def GraphBox(
    title: str, children: List, class_name_wrapper="col-md-12", class_name=""
) -> Component:
    if not title:
        children = [Div(title, className="small-text-bold mb-4")] + children
    return Box(
        children,
        class_name_wrapper=class_name_wrapper,
        class_name=class_name,
    )


def FigureGraph(figures: List[Dict]) -> Component:
    l = []
    for f in figures:
        elems = []
        elems = elems + [Img(src=f["img"])] if f.get("img") else []
        elems = elems + [H1(f["figure"])] if f.get("figure") else []
        elems = elems + [Label(f["caption"])] if f.get("caption") else []
        l += [Div(elems, className="d-flex flex-column align-items-center")]
    return Div(l, className="d-flex flex-row flex-wrap justify-content-around")


def TopicSection(children: List, id: str) -> Component:
    return dbc.Row(Div(children, className="col-12"), className="topic-section", id=id)


def SectionTitle(title: str) -> Component:
    return dbc.Row(
        Div(H1(title, className="d-inline-block"), className="col-12"),
        className="section-title",
    )


def SectionP(text: str) -> Component:
    return dbc.Row(Div(Div(text, className="normal-text"), className="col-12"))


def ExternalLink(label: str, link: str):
    return A(
        f"{label}",
        href=link,
        target="_blank",
        rel="noopener noreferrer",
        className="normal-text link d-inline-block",
        id="refresh-substances",
    )
