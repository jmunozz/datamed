import datetime
from typing import List, Dict

import dash_bootstrap_components as dbc
import pandas as pd
import unidecode
from dash.development.base_component import Component
from dash_html_components import Div, A, Img, H4, H1, Label, Section


def SectionRow(children, withGutter=False):
    classes = ["SectionRow"]
    if withGutter:
        classes.append("SectionRow-withGutter")
    return Div(children, className=" ".join(classes))


def Box(children, className="", isBordered=True, hasNoPadding=False) -> Component:
    classes = ["Box"]
    if isBordered:
        classes.append("Box-isBordered")
    if hasNoPadding:
        classes.append("Box-hasNoPadding")
    classes = classes + className.split(" ")
    return Div(children, className=" ".join(classes))


def ArticleTitle(title: str) -> Component:
    return H4(title, className="small-text-bold with-margin")


# Add a Title and return a Box Component
def GraphBox(title: str, children: List) -> Component:
    if title:
        children = [Div(title, className="normal-text-bold mb-4")] + children
    return Box(children)


def FigureGraph(
    figures: List[Dict], height="150px", class_name="justify-content-around"
) -> Component:
    class_name = " ".join((["Line", "Line-isSpacedEvenly"] + class_name.split(" ")))
    children_list = []
    for f in figures:
        elems = []
        elems = (
            elems + [Img(src=f["img"], className="mb-2", style={"height": height})]
            if "img" in f
            else []
        )
        elems = elems + [H1(f["figure"])] if "figure" in f else []
        elems = (
            elems
            + [Label(f["caption"], className="normal-text", style={"color": "black"})]
            if f.get("caption")
            else []
        )
        children_list += [
            Div(
                elems,
                className="Stack Stack-isCentered",
                style={"color": "#00B3CC", "margin": "15px"},
            )
        ]
    return Div(children_list, className=class_name)


def TopicSection(children: List, id: str, isFirst=False) -> Component:
    classes = ["Section"]
    if isFirst:
        classes.append("Section-isFirst")
    return Section(children, className=" ".join(classes) + " mb-5", id=id)


def SectionTitle(title: str) -> Component:
    return H1(title, className="SectionTitle")


def SectionP(text: str) -> Component:
    return dbc.Row(Div(Div(text, className="normal-text"), className="col-12"))


def ExternalLink(label: str, link: str):
    return A(
        f"{label}",
        href=link,
        target="_blank",
        rel="noopener noreferrer",
        className="ExternalLink normal-text",
        id="refresh-substances",
    )


def date_as_string(date) -> str:
    # pd.NaT is somehow instance of date
    if not isinstance(date, datetime.date) or pd.isnull(date):
        return date
    return date.strftime("%d/%m/%Y")


def nested_get(dictionary: Dict, key: str, default):
    [current_key, *key_list] = key.split(".")
    try:
        current_value = dictionary[current_key]
        if not len(key_list):
            return current_value
        else:
            return nested_get(dictionary.get(current_key), "".join(key_list), default)
    except KeyError:
        return default


def normalize_string(text: str):
    return unidecode.unidecode(text)
