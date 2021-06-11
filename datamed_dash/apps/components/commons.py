from typing import List, Dict, Optional

import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from app import app
from dash.development.base_component import Component
from dash_core_components import Graph
from dash_html_components import Div, H1
from datamed_custom_components import Accordion
from db import fetch_data
from db import specialite

from .utils import (
    Box,
    GraphBox,
    TopicSection,
    FigureGraph,
    SectionRow,
    normalize_string,
)
from ..constants.layouts import PIE_LAYOUT, PIE_TRACES

UTILISATION = {
    1: "Utilisation très faible",
    2: "Utilisation faible",
    3: "Utilisation modérée",
    4: "Utilisation élevée",
    5: "Utilisation très élevée",
    "-": "Utilisation inconnue",
}

UTILISATION_IMG_URL = {
    "-": app.get_asset_url("indice-nodata.svg"),
    1: app.get_asset_url("indice-1.svg"),
    2: app.get_asset_url("indice-2.svg"),
    3: app.get_asset_url("indice-3.svg"),
    4: app.get_asset_url("indice-4.svg"),
    5: app.get_asset_url("indice-5.svg"),
}

SEXE = {1: "Hommes", 2: "Femmes"}

SEXE_IMG_URL = {
    1: app.get_asset_url("man_bw_150.svg"),
    2: app.get_asset_url("woman_bw_150.svg"),
}


def BoxRow(children):
    return html.Div(html.Div(children, className="BoxRowWrapper"), className="BoxRow")


def BoxArticle(children, in_row=False):
    class_names = ["BoxArticle"]
    if in_row:
        class_names = class_names + ["BoxArticle-isInRow"]
    return html.Article(children, className=" ".join(class_names))


def FrontPageSectionPart(children, class_name=""):
    class_name = " ".join(["FrontPageSectionPart"] + class_name.split(" "))
    return html.Div(children, className=class_name)


def FrontPageSection(children, class_name="", has_appendice=False):
    layout = [html.Div(children, className="FrontPageSectionContainer")]
    if has_appendice:
        layout = layout + [Div(className="FrontPageSectionAppendice")]
    class_name = " ".join(["FrontPageSection"] + class_name.split(" "))
    return html.Div(layout, className=class_name)


def FrontPageSectionFull(children, class_name=""):
    class_name = " ".join(
        ["FrontPageSectionFull Stack Stack-isCentered"] + class_name.split(" ")
    )
    return html.Div(children, className=class_name)


def get_sexe_figures_from_df(df: pd.DataFrame, column: str) -> List[Dict]:
    df = df.where(pd.notnull(df), None)
    sexe_percentage_data = fetch_data.transform_df_to_series_list(df)
    return [
        {
            "figure": "{}%".format(round(x[column])),
            "caption": SEXE[x["sexe"]],
            "img": SEXE_IMG_URL[x["sexe"]],
        }
        for x in sexe_percentage_data
    ]


def makePie(labels: pd.Series, values: pd.Series, pie_colors: List):
    return (
        go.Figure(
            go.Pie(
                labels=labels,
                values=values,
                marker_colors=pie_colors,
                hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
            )
        )
        .update_layout(PIE_LAYOUT)
        .update_traces(PIE_TRACES)
    )


def NoData(class_name="") -> html.Div:
    class_name = " ".join(
        (["NoData", "Stack", "Stack-isCentered"] + class_name.split(" "))
    )
    return html.Div(
        [
            html.Img(
                src=app.get_asset_url("indice-nodata.svg"),
                className="img-fluid",
                alt="Responsive image",
            ),
            html.Div(
                "Données insuffisantes pour affichage",
            ),
        ],
        className=class_name,
    )


def Tooltip() -> Component:
    return SectionRow(
        Box(
            Accordion(
                [
                    html.Div(
                        [
                            html.P(
                                [
                                    html.Span(
                                        "Estimations obtenues à partir des données Open Medic portant sur l’usage du "
                                        "médicament, délivré en ",
                                        className="normal-text",
                                    ),
                                    html.B(
                                        html.Span(
                                            "pharmacie de ville",
                                        )
                                    ),
                                    html.Span(
                                        " entre 2014 et 2018 et remboursé par ",
                                    ),
                                    html.B(
                                        html.Span(
                                            "l’Assurance Maladie.",
                                        )
                                    ),
                                    html.Span(
                                        " Pour plus d’informations, consultez : ",
                                    ),
                                    html.A(
                                        "open-data-assurance-maladie.ameli.fr",
                                        href="http://open-data-assurance-maladie.ameli.fr/medicaments/index.php",
                                        className="Link",
                                        target="_blank",
                                    ),
                                ],
                                className="justify-text normal-text",
                            ),
                            html.P(
                                [
                                    html.B(html.Span("Attention : ")),
                                    html.Span(
                                        "Un patient est comptabilisé autant de fois qu’il a acheté de types "
                                        "de conditionnements (ou présentations) différents de la spécialité / "
                                        "substance active. Pour la spécialité Doliprane 500 mg, gélule, un patient qui "
                                        "aura acheté 2 boîtes de 16 gélules et 3 boîtes de 100 gélules au cours de "
                                        "l’année 2016 sera comptabilisé 2 fois pour 2016.",
                                    ),
                                ],
                                className="justify-text normal-text",
                            ),
                            html.P(
                                [
                                    html.Span(
                                        "La somme de ce nombre de patients sur la période 2014-2018 est ensuite "
                                        "divisée par 5 pour obtenir un chiffre moyen de patients traités par an."
                                    )
                                ],
                                className="justify-text normal-text",
                            ),
                        ],
                    ),
                    html.Div(
                        [],
                        className="text-justify mb-3",
                    ),
                    html.Div(
                        [],
                        className="mb-3",
                    ),
                ],
                isOpenOnFirstRender=True,
                labelClass="InternalLink normal-text",
                label="Comment sont calculés ces indicateurs ? D’où viennent ces données ?",
            )
        )
    )


def Utilisation(df_expo: Optional[pd.DataFrame]) -> Component:
    if df_expo is not None:
        series_exposition = fetch_data.as_series(df_expo)
        if not np.isnan(series_exposition.exposition):
            exposition = int(series_exposition.exposition)
        else:
            exposition = "-"
        if not np.isnan(series_exposition.conso_an_trunc):
            patients = "{:,} patients / an".format(
                int(series_exposition.conso_an_trunc)
            ).replace(",", " ")
        else:
            patients = "Données insuffisantes"
    else:
        exposition = "-"
        patients = "Données insuffisantes"

    df = pd.DataFrame(
        {
            "Utilisation": [
                "Très faible",
                "Faible",
                "Modéré",
                "Élevé",
                "Très élevé",
            ],
            "Nombre de patients (niveau spécialité)": [
                "< 1 000",
                "1 000 - 5 000",
                "5 000 - 15 000",
                "15 000 - 50 000",
                "> 50 000",
            ],
            "Nombre de patients (niveau substance active)": [
                "< 5 000",
                "5 000 - 25 000",
                "25 000 - 100 000",
                "100 000 - 500 000",
                "> 500 000",
            ],
        }
    )
    return SectionRow(
        [
            Box(
                Div(
                    [
                        Box(
                            [
                                html.P(
                                    UTILISATION[exposition],
                                    className="normal-text-bold text-center align-middle",
                                ),
                                html.Img(src=UTILISATION_IMG_URL[exposition]),
                            ],
                            isBordered=False,
                            className="CardBoxImage UsageBoxRate",
                        ),
                        Box(
                            [
                                html.H2(patients, className="color-secondary"),
                                html.P(
                                    "Approximation du nombre de patients traités sur la période 2014-2018",
                                    className="normal-text",
                                ),
                                html.A(
                                    "En savoir plus sur le niveau d'utilisation",
                                    className="normal-text color-secondary",
                                    id="open",
                                ),
                                dbc.Modal(
                                    [
                                        dbc.ModalHeader("Niveaux d'utilisation"),
                                        dbc.ModalBody(
                                            dbc.Table.from_dataframe(
                                                df,
                                                striped=True,
                                                bordered=True,
                                                hover=True,
                                            )
                                        ),
                                        dbc.ModalFooter(
                                            dbc.Button(
                                                "Fermer",
                                                id="close",
                                                className="ml-auto",
                                                style={"background-color": "#a03189"},
                                            )
                                        ),
                                    ],
                                    id="utilisation-modal",
                                ),
                            ],
                            isBordered=False,
                            className="CardBoxText",
                        ),
                    ],
                    className="CardBox",
                ),
                hasNoPadding=True,
            )
        ],
    )


def RepartitionSexeBox(df_sexe: pd.DataFrame) -> Component:
    no_data = NoData(class_name="BoxContent-isHalf")
    if df_sexe is None:
        return no_data
    df_sexe = df_sexe.where(pd.notnull(df_sexe), None)
    sexe_percentage_data = fetch_data.transform_df_to_series_list(df_sexe)
    for d in sexe_percentage_data:
        if d.pourcentage_patients is None:
            return no_data
    return FigureGraph(
        get_sexe_figures_from_df(df_sexe, "pourcentage_patients"),
        class_name="BoxContent-isHalf",
    )


def RepartitionAgeBox(df_age: pd.DataFrame, pie_colors: List) -> Component:
    if df_age is None or np.isnan(df_age.pourcentage_patients.unique()).all():
        return NoData(class_name="BoxContent-isHalf")
    return Graph(
        figure=makePie(df_age.age, df_age.pourcentage_patients, pie_colors),
        responsive=False,
    )


def PatientsTraites(
    df_age: pd.DataFrame,
    df_sexe: pd.DataFrame,
    df_expo: pd.DataFrame,
    pie_colors: List,
) -> Component:
    children = [
        SectionRow(html.H1("Patients traités", className="SectionTitle")),
    ]
    dataframes = [df_age, df_sexe, df_expo]
    if all(df is None for df in dataframes):
        children.append(NoData())
    else:
        children.extend(
            [
                Tooltip(),
                Utilisation(df_expo),
                SectionRow(
                    [
                        GraphBox(
                            "Répartition par sexe des patients traités",
                            [RepartitionSexeBox(df_sexe)],
                        ),
                        GraphBox(
                            "Répartition par âge des patients traités",
                            [RepartitionAgeBox(df_age, pie_colors)],
                        ),
                    ],
                    withGutter=True,
                ),
            ]
        )
    return TopicSection(
        children,
        id="patients-traites",
    )


def Header(series_spe: pd.Series, type="specialite") -> Component:
    if type == "substance":
        title = series_spe.nom.capitalize()
        css_class = "Header-isSubstance"
        icon_url = app.get_asset_url("substance_icon.svg")
        type_label = "Substance active"
        help_link = html.A("Qu'est-ce qu'une substance active ?", id="definition-open")
        modal_body = html.Div(
            "La substance active d'un médicament est une substance chimique entrant dans "
            "la composition du médicament et ayant un effet thérapeutique ou préventif."
        )
    elif type == "specialite":
        title = series_spe.nom.capitalize()
        css_class = "Header-isSpecialite"
        df_icones = specialite.get_icones(series_spe.name)
        series_icones = fetch_data.as_series(df_icones)
        icon_url = app.get_asset_url(
            f"icons/pres_{normalize_string(series_icones.icone)}_120.svg"
        )
        type_label = "Spécialité de médicament"
        help_link = html.A(
            "Qu'est-ce qu'une spécialité de médicament ?",
            id="definition-open",
            className="Link Link-isOnDarkBackground",
        )
        modal_body = [
            html.Div(
                "Les médicaments peuvent être regroupés suivant différents niveaux "
                "de précision (du plus au moins précis) :",
                className="mb-3",
            ),
            html.Div(
                "- La présentation : "
                "Doliprane 1000 mg, comprimé, boîte de 8 comprimés"
            ),
            html.Div("- La spécialité : Doliprane 1000 mg, comprimé"),
            html.Div("- Le produit : Doliprane"),
            html.Div("- La substance active : Paracétamol", className="mb-3"),
            html.Div(
                "La spécialité d’un médicament est donc caractérisée par "
                "une dénomination spéciale (Doliprane) et un conditionnement "
                "particulier (1000 mg, comprimé)."
            ),
        ]
    elif type == "rupture":
        title = "Données ruptures de stock"
        css_class = "Header-isRupture"
        icon_url = app.get_asset_url("liquide-64.png")
        type_label = "Base de données"
        help_link = html.A(
            "Qu'est-ce qu'une base de données ?",
            id="definition-open",
            className="Link Link",
        )
        modal_body = [
            html.Div(
                "Il s'agit d'un système structuré dans lequel vous placez vos données et qui impose des règles "
                "à ces données."
            )
        ]

    return html.Div(
        html.Div(
            html.Div(
                [
                    html.Div(
                        html.Img(src=icon_url),
                        className="HeaderImg",
                    ),
                    html.Div(
                        [
                            H1(title),
                            html.P(type_label, className="large-text"),
                            help_link,
                            dbc.Modal(
                                [
                                    dbc.ModalHeader("Définition"),
                                    dbc.ModalBody(
                                        modal_body,
                                        className="normal-text text-justify",
                                    ),
                                    dbc.ModalFooter(
                                        dbc.Button(
                                            "Fermer",
                                            id="definition-close",
                                            className="ml-auto",
                                            style={"background-color": "#a03189"},
                                        )
                                    ),
                                ],
                                id="definition-modal",
                            ),
                        ],
                        className="content-header-text",
                    ),
                ],
                className="HeaderWrapper",
            ),
            className="HeaderLayoutWrapper",
        ),
        className=f"Header {css_class}",
    )


@app.callback(
    dd.Output("utilisation-modal", "is_open"),
    [dd.Input("open", "n_clicks"), dd.Input("close", "n_clicks")],
    [dd.State("utilisation-modal", "is_open")],
)
def toggle_modal(n1, n2, is_open):
    if n1 or n2:
        return not is_open
    return is_open


@app.callback(
    dd.Output("definition-modal", "is_open"),
    [dd.Input("definition-open", "n_clicks"), dd.Input("definition-close", "n_clicks")],
    [dd.State("definition-modal", "is_open")],
)
def toggle_modal(n1, n2, is_open):
    if n1 or n2:
        return not is_open
    return is_open
