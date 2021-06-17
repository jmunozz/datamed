import datetime
from typing import List, Dict

import dash_bootstrap_components as dbc
import dash_html_components as html
import pandas as pd
import unidecode
from dash.development.base_component import Component
from dash_html_components import Div, A, Img, H5, H1, H4, Label, Section
from app import app


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


def BoxRow(children):
    return html.Div(html.Div(children, className="BoxRowWrapper"), className="BoxRow")


def BoxArticle(children, in_row=False):
    class_names = ["BoxArticle"]
    if in_row:
        class_names = class_names + ["BoxArticle-isInRow"]
    return html.Article(children, className=" ".join(class_names))


def ArticleTitle(title: str) -> Component:
    return H5(title)


def generate_title_id(title: str) -> str:
    return title.lower().replace(" ", "-")


# Add a Title and return a Box Component
def GraphBox(title: str, children: List, tooltip=None, className="") -> Component:
    if title:
        title_component = (
            Div(
                [
                    H4(
                        [title, InformationIcon()],
                        id=generate_title_id(title),
                        className="GraphBoxTitle",
                    ),
                    Tooltip(tooltip, target=generate_title_id(title)),
                ]
            )
            if tooltip
            else Div(H4(title))
        )
        children = [title_component, Div(children, className="BoxContentWrapper")]
    return Box(children, className)


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
        className="Link",
        id="refresh-substances",
    )


def Tooltip(children: str, target: str):
    return dbc.Tooltip(
        children,
        target=target,
        placement="bottom",
        innerClassName="TooltipInner",
        arrowClassName="TooltipArrow",
        className="Tooltip",
        boundaries_element="window",
        offset=2,
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


def InformationIcon() -> Component:
    return html.I(className="bi bi-info-circle Icon")


def CardBox(
    children,
    img_url=app.get_asset_url("/icons/pres_autre_120.svg"),
    img_classname="",
    card_classname="",
    classname="",
) -> Component:
    img_classname = " ".join(["CardBoxImage"] + img_classname.split(" "))
    card_classname = " ".join(["CardBoxText"] + card_classname.split(" "))

    return Box(
        html.Div(
            [
                Box(
                    [html.Img(src=img_url),], isBordered=False, className=img_classname,
                ),
                Box(children, isBordered=False, className=card_classname,),
            ],
            className="CardBox",
        ),
        hasNoPadding=True,
        className=classname,
    )


def Grid(children, nb_elems_per_row: int):
    nb_empty_elem = nb_elems_per_row - (len(children) % nb_elems_per_row)
    grid_classname = f"GridElem-{nb_elems_per_row}"
    empty_elem_classname = " ".join(["GridEmptyElem", grid_classname])
    children = list(map(lambda x: html.Div(x, className=grid_classname), children)) + [
        html.Div(className=empty_elem_classname) for n in range(nb_empty_elem)
    ]
    return SectionRow(children, withGutter=True)


def trim_list(list: List[any]):
    return [i for i in list if i]
