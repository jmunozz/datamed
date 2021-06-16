from typing import List, Dict, Optional
import math
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus


import dash
import dash.dependencies as dd
from dash.exceptions import PreventUpdate
import dash_bootstrap_components as dbc
import dash_html_components as html
from dash_html_components.Data import Data
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from app import app
from dash.development.base_component import Component
from dash_core_components import Graph
from dash_html_components import Div, H1
from datamed_custom_components import Accordion
from db import fetch_data
from db import specialite, substance
from dash_bootstrap_components import (
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
)

from apps.components.utils import (
    Box,
    GraphBox,
    TopicSection,
    SectionRow,
    normalize_string,
)
from apps.graphs import (
    ReparitionSexeFigure,
    RepartitionAgeGraph,
    EICasDeclareFigure,
    EITauxDeclarationGraph,
    EIRepartitionSexeFigure,
    EIRepartitionAgeGraph,
    EIRepartitionNotificateursFigure,
    EIRepartitionGraviteGraph,
    EIRepartitionSystemeOrganes,
    EIRepartitionHLT,
)
from apps.constants.misc import UTILISATION, UTILISATION_IMG_URL

# Return NoData if df empty or figure missing for man or woman
def RepartitionSexeBox(df_sexe: pd.DataFrame) -> Component:
    no_data = NoData(class_name="BoxContent-isHalf")
    if df_sexe is None:
        return no_data
    df_sexe = df_sexe.where(pd.notnull(df_sexe), None)
    sexe_percentage_data = fetch_data.transform_df_to_series_list(df_sexe)
    for d in sexe_percentage_data:
        if d.pourcentage_patients is None:
            return no_data
    return ReparitionSexeFigure(df_sexe)


# Return NoData if df empty or one age category is missing
def RepartitionAgeBox(df_age: pd.DataFrame, pie_colors: List) -> Component:
    if df_age is None or np.isnan(df_age.pourcentage_patients.unique()).all():
        return NoData(class_name="BoxContent-isHalf")
    return RepartitionAgeGraph(df_age, pie_colors)


# Return NoData if df is empty
def EICasDeclareFigureBox(df_decla: pd.DataFrame):
    content = NoData(class_name="BoxContent-isHalf")
    if df_decla is not None:
        content = EICasDeclareFigure(df_decla)
    return GraphBox("", content)


# Return NoData if df is empty
def EITauxDeclarationBox(df_decla: pd.DataFrame):
    content = NoData(class_name="BoxContent-isHalf")
    if df_decla is not None:
        content = EITauxDeclarationGraph(df_decla)
    return GraphBox("", content)


# Return NoData if df is empty
def EIRepartitionSexeFigureBox(df_cas_sexe: pd.DataFrame):
    content = NoData(class_name="BoxContent-isHalf")
    if df_cas_sexe is not None:
        content = EIRepartitionSexeFigure(df_cas_sexe)
    return GraphBox("Répartition par sexe des cas déclarés", content)


# Return NoData if df is empty or any age category is missing
def EIRepartitionAgeGraphBox(df_cas_age: pd.DataFrame) -> Component:
    content = NoData(class_name="BoxContent-isHalf")
    if df_cas_age is not None:
        content = EIRepartitionAgeGraph(df_cas_age)
    return GraphBox("Répartition par âge des cas déclarés", content)


# Return NoData if df is empty
def EIRepartitionNotificateursFigureBox(df_notif: pd.DataFrame) -> Component:
    content = NoData(class_name="BoxContent-isHalf")
    if df_notif is not None:
        content = EIRepartitionNotificateursFigure(df_notif)
    return GraphBox("Répartition par déclarant", content)


# Return NoData if df is empty
def EIRepartitionGraviteGraphBox(df_gravite: pd.DataFrame) -> Component:
    content = NoData(class_name="BoxContent-isHalf")
    if df_gravite is not None:
        content = EIRepartitionGraviteGraph(df_gravite)
    return GraphBox(
        "Gravité des déclarations",
        content,
        className="Box-isHalf",
        tooltip=[
            html.H4("Cas grave"),
            html.P(
                "Effet indésirable létal, ou susceptible de mettre la vie en danger, ou entraînant "
                "une invalidité ou une incapacité importante ou durable, ou provoquant ou "
                "prolongeant une hospitalisation, ou se manifestant par une anomalie ou une "
                "malformation congénitale.",
                className="regular-text",
            ),
        ],
    )


def EIRepartitionSystemeOrganesBox(df_soclong: pd.DataFrame):
    return (
        html.Div(
            [
                html.Div(
                    EIRepartitionSystemeOrganes(df_soclong),
                    id="soc-treemap-container",
                    className=""
                ),
                html.Div(id="selected-soc", className="d-none"),
                HltModal(),
            ],
        ),
    )

def EIRepartitionHLTBox(df_hlt: pd.DataFrame): 
    return EIRepartitionHLT(df_hlt)

def HltModal() -> Modal:
    return Modal(
        [
            ModalHeader(id="header-modal"),
            ModalBody(id="body-modal"),
            ModalFooter(
                Button(
                    "Fermer",
                    id="close-backdrop",
                    className="ml-auto button-text-bold",
                    color="secondary",
                    outline=True,
                )
            ),
        ],
        scrollable=True,
        centered=True,
        id="update-on-click-data",
        size="xl",
    )


def EISystemesOrganesTooltip():
    return SectionRow(
        Box(
            Accordion(
                [
                    html.P(
                        "Les systèmes d’organes (Système Organe Classe ou SOC) représentent les 27 classes de disciplines "
                        "médicales selon la hiérarchie MedDRA. Sont listés ici les 10 SOC ayant le plus d’effets indésirables "
                        "déclarés.",
                        className="normal-text text-justify",
                    ),
                    html.P(
                        "Attention : Un cas n'est comptabilisé qu’une seule fois par SOC en cas de plusieurs effets "
                        "indésirables affectant le même SOC. Un cas peut en revanche être comptabilisé sur plusieurs SOC "
                        "différents (en fonction des effets indésirables déclarés).",
                        className="normal-text text-justify",
                    ),
                ],
                labelClass="InternalLink normal-text",
                label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
            )
        )
    )


def SingleSection(title: str, children_list: List) -> Component:
    children = [Div(title, className="h3 mb-3")] + children_list
    return Div(
        children,
        className="normal-text mb-5 text-justify",
    )


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


def HistoriqueRupturesTooltip():
    return SectionRow(
        Box(
            Accordion(
                [
                    html.Div(
                        [
                            html.P(
                                [
                                    html.Span(
                                        "Cette rubrique recense l'historique des déclarations de ruptures et de "
                                        "risques de rupture concernant les médicaments d’intérêt thérapeutique "
                                        "majeur (MITM) reçues par l'ANSM depuis le 3 Mai 2021.",
                                        className="normal-text",
                                    ),
                                ],
                                className="justify-text normal-text",
                            ),
                            html.P(
                                [
                                    html.Span(
                                        "Pour retrouver les dernières informations destinées aux professionnels de "
                                        "santé et aux patients concernant les médicaments d’intérêt thérapeutique "
                                        "majeur faisant actuellement l’objet de difficultés d’approvisionnement et "
                                        "pour lesquels il n’y a pas d’alternative thérapeutique disponible sur "
                                        "le marché français, vous pouvez vous référer au site : ",
                                    ),
                                    html.A(
                                        "ansm.sante.fr/disponibilites-des-produits-de-sante/medicaments",
                                        href="https://ansm.sante.fr/disponibilites-des-produits-de-sante/medicaments",
                                        className="Link",
                                        target="_blank",
                                    ),
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
                label="Quelles données sont affichées ? D’où viennent-elles ?",
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
        icon_url = app.get_asset_url("rupturedestock-120.svg")
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
