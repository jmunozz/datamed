import dash_html_components as html
import dash_bootstrap_components as dbc
from dash.development.base_component import Component


def Box(children, class_name_wrapper="col-md-12", class_name="") -> Component: 
    class_name=f"box {class_name}"
    return html.Div(html.Div(children, className=class_name), className=class_name_wrapper)

def ArticleTitle(title) -> Component: 
    return html.H4(title, className="small-text-bold with-margin")

def GraphBox(title, children, class_name_wrapper="col-md-12", class_name="") -> Component: 
    return Box([html.Div(title, className="small-text-bold")] + children, class_name_wrapper=class_name_wrapper, class_name=class_name)

def TopicSection(children, id) -> Component: 
    return dbc.Row(html.Div(children, className="col-12"), className="topic-section", id=id)

def SectionTitle(title: str) -> Component:
    return dbc.Row(html.Div(html.H4(title, className="d-inline-block"), className="col-12"),className="section-title")

def ExternalLink(label, link): 
    return html.A(
            f"{label}",
            href=link,
            target="_blank",
            rel="noopener noreferrer",
            className="normal-text link d-inline-block",
            id="refresh-substances",
    )