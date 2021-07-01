import math
from typing import List, Dict
from typing import Optional
from urllib.parse import urlencode, quote_plus

import dash
import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from app import app
from apps.components.utils import (
    Box,
    GraphBox,
    TopicSection,
    SectionRow,
    normalize_string,
    Grid,
    Tooltip as HoverTooltip,
    truncate_str,
)
from apps.constants.misc import (
    UTILISATION,
    UTILISATION_NB_PATIENTS_SPECIALITE,
    UTILISATION_NB_PATIENTS_SUBSTANCE,
)
from apps.graphs import (
    RepartitionGraviteGraph,
    ReparitionSexeFigure,
    RepartitionAgeGraph,
    EICasDeclareFigure,
    EITauxDeclarationGraph,
    EIRepartitionSexeFigure,
    EIRepartitionAgeGraph,
    RepartitionNotificateursFigure,
    EIRepartitionGraviteGraph,
    EIRepartitionSystemeOrganes,
    EIRepartitionHLT,
    FigureGraph,
)
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_bootstrap_components import (
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
)
from dash_html_components import Div, H1
from datamed_custom_components import Accordion, SearchBar as _SearchBar
from db import fetch_data, specialite, substance


def to_search_bar_options(df: pd.DataFrame, type: str) -> List[Dict]:
    return [
        {
            "label": truncate_str(val),
            "value": index,
            "type": type,
        }
        for index, val in df.nom.items()
    ]


def get_opts_search_bar():
    df_spe = specialite.list_specialite()
    df_sub = substance.list_substance()
    opts_spe = to_search_bar_options(df_spe, "specialite")
    opts_sub = to_search_bar_options(df_sub, "substance")
    opts = opts_spe + opts_sub
    opts = sorted(opts, key=lambda d: len(d["label"]))
    return opts


# This component is used to display usage as an indicator (for specialite and substance)
def Usage(type: str, level: int):

    nb_patients = (
        {
            "substance": UTILISATION_NB_PATIENTS_SUBSTANCE,
            "specialite": UTILISATION_NB_PATIENTS_SPECIALITE,
        }
    )[type]
    bar_height = [16, 24, 32, 48, 56]

    bars = [
        html.Div(
            HoverTooltip(
                [
                    html.P([html.B("Utilisation : "), UTILISATION[i]]),
                    html.P(
                        [
                            html.B("Nombre de patients : "),
                            nb_patients[i],
                        ]
                    ),
                ],
                target=f"UsageBarLevel{i}",
            ),
            id=f"UsageBarLevel{i}",
            className="UsageBar",
            style={"height": h},
        )
        for i, h in enumerate(bar_height)
    ]

    if math.isnan(level) or level < 0 or level > 4:
        return html.Div(
            [
                *bars,
            ],
            className="UsageContainer",
        )

    pill_position_x = level * 24 + level * 8
    pill_position_y = bar_height[level] + 4

    return html.Div(
        [
            *bars,
            html.Div(
                html.Img(src=app.get_asset_url("/icons/gelule_24.svg")),
                className=f"UsagePill UsagePillLevel{level}",
                style={"left": pill_position_x, "bottom": pill_position_y},
            ),
        ],
        className="UsageContainer",
    )


# this invisible component is used to perform side effects
def SideEffects():
    return html.Div(id="dash-side-effect-hidden-div")


def SearchBar():
    opts = get_opts_search_bar()
    return _SearchBar("search-bar", opts=opts, fireOnSelect=True)


def SingleCurve(x: pd.Series, y: pd.Series, name: str, color: str) -> go.Scatter:
    return go.Scatter(
        x=x,
        y=y,
        mode="lines",
        name=name,
        line={
            "shape": "spline",
            "smoothing": 1,
            "width": 4,
            "color": color,
        },
    )


# Return NoData if df empty or figure missing for man or woman
def RepartitionSexeBox(df: pd.DataFrame) -> Component:
    no_data = NoData(class_name="BoxContent-isHalf")
    if df is None:
        return no_data
    df = df.where(pd.notnull(df), None)
    sexe_percentage_data = fetch_data.transform_df_to_series_list(df)
    for d in sexe_percentage_data:
        if d.pourcentage_patients is None:
            return no_data
    return ReparitionSexeFigure(df, "pourcentage_patients")


# Return NoData if df empty or one age category is missing
def RepartitionAgeBox(df: pd.DataFrame, column: str, pie_colors: List) -> Component:
    if df is None or np.isnan(df[column].unique()).all():
        return NoData(class_name="BoxContent-isHalf")
    return RepartitionAgeGraph(df, column, pie_colors)


# Return NoData if df is empty
def EICasDeclareFigureBox(df_decla: pd.DataFrame):
    placeholder = FigureGraph(
        [
            {
                "figure": "Pas de données",
                "caption": "Nombre de déclarations sur la période 2014-2018",
            }
        ]
    )
    if df_decla is None:
        content = placeholder
    else:
        content = EICasDeclareFigure(df_decla)
    return GraphBox("", content)


# Return NoData if df is empty
def EITauxDeclarationBox(df: pd.DataFrame):
    placeholder = FigureGraph(
        [
            {
                "figure": "Pas de données",
                "caption": "Taux de déclaration pour 100 000 patients "
                "traités par an sur la période 2014-2018",
            }
        ]
    )
    if df is None:
        content = placeholder
    else:
        content = EITauxDeclarationGraph(df)
    return GraphBox("", content)


# Return NoData if df is empty
def EIRepartitionSexeFigureBox(df_cas_sexe: pd.DataFrame):
    placeholder = NoData(class_name="BoxContent-isHalf")
    if df_cas_sexe is None:
        content = placeholder
    else:
        content = EIRepartitionSexeFigure(df_cas_sexe)
    return GraphBox("Répartition par sexe des cas déclarés", content)


# Return NoData if df is empty or any age category is missing
def EIRepartitionAgeGraphBox(df_cas_age: pd.DataFrame, pie_colors: dict) -> Component:
    if df_cas_age is None:
        content = NoData(class_name="BoxContent-isHalf")
    # Check that none of age category is NaN
    elif df_cas_age.pourcentage_cas.isnull().any():
        content = NoData(class_name="BoxContent-isHalf")
    else:
        content = EIRepartitionAgeGraph(df_cas_age, pie_colors)
    return GraphBox("Répartition par âge des cas déclarés", content)


# Return NoData if df is empty
def RepartitionNotificateursFigureBox(df: pd.DataFrame) -> Component:
    placeholder = NoData(class_name="BoxContent-isHalf")
    if df is None:
        content = placeholder
    elif df.dropna().empty:
        content = placeholder
    else:
        content = RepartitionNotificateursFigure(df)
    return GraphBox("Répartition par déclarant", content)


def RepartitionGraviteGraphBox(
    df: pd.DataFrame, column: str, pie_colors: Dict
) -> Component:
    if df is None:
        return NoData("BoxContent-isHalf")
    return RepartitionGraviteGraph(df, column, pie_colors)


# Return NoData if df is empty
def EIRepartitionGraviteGraphBox(
    df_gravite: pd.DataFrame, pie_colors: dict
) -> Component:
    placeholder = NoData(class_name="BoxContent-isHalf")
    if df_gravite is None:
        content = placeholder
    # Check that both gravite category are not NaN
    elif df_gravite.cas.isnull().any():
        content = placeholder
    else:
        content = EIRepartitionGraviteGraph(df_gravite, pie_colors)
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
                className="regular-text text-justify",
            ),
        ],
    )


def EIRepartitionSystemeOrganesBox(df_soclong: pd.DataFrame, type: str):
    if df_soclong is None:
        return NoData()
    return [
        EIRepartitionSystemeOrganes(df_soclong, type),
        HltModal(type),
    ]


def EIRepartitionHLTBox(df_hlt: pd.DataFrame):
    return EIRepartitionHLT(df_hlt)


def HltModal(type: str) -> Modal:
    return Modal(
        [
            ModalHeader(id="header-modal"),
            ModalBody(id="body-modal"),
            ModalFooter(
                Button(
                    "Fermer",
                    id={"type": f"close-backdrop-{type}", "index": 1},
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


def EISystemesOrganesTooltip(tooltip_open=False):
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
                isOpenOnFirstRender=tooltip_open,
                labelClass="InternalLink normal-text",
                label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
            )
        )
    )


def EMTooltip(tooltip_open=False):
    return SectionRow(
        Box(
            Accordion(
                [
                    html.P(
                        [
                            html.Span(
                                "Les données sur les erreurs médicamenteuses proviennent des déclarations de "
                                "risque d’erreur ou d’erreurs médicamenteuses avec ou sans évènements indésirables, "
                                "gérées par l’ANSM. Elles sont déclarées par les patients ou les professionnels "
                                "de santé, notamment via le ",
                            ),
                            html.A(
                                "portail des signalements",
                                href="https://signalement.social-sante.gouv.fr",
                                className="Link",
                                target="_blank",
                            ),
                        ],
                        className="justify-text normal-text",
                    ),
                    html.P(
                        "Les erreurs médicamenteuses se classifient en fonction du stade (erreur de prescription, "
                        "erreur de délivrance, erreur d’administration), de la nature et de la cause de l'erreur.",
                        className="justify-text normal-text",
                    ),
                ],
                isOpenOnFirstRender=tooltip_open,
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
        layout = layout + [
            Div(
                [
                    html.Img(
                        src=app.get_asset_url("/mouse_scroll.svg"),
                        className="FrontPageSectionAppendiceImg",
                    )
                ],
                className="FrontPageSectionAppendice",
            )
        ]
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


def Utilisation(_type: str, df_expo: Optional[pd.DataFrame]) -> Component:
    if df_expo is not None:
        series_exposition = fetch_data.as_series(df_expo)
        if not np.isnan(series_exposition.exposition):
            exposition = int(series_exposition.exposition)
        else:
            exposition = "-"
        if not np.isnan(series_exposition.conso_an_trunc):
            # For démo day
            conso = (
                int(series_exposition.conso_an_trunc)
                if int(series_exposition.conso_an_trunc) <= 65000000
                else 65000000
            )
            patients = "{:,} patients / an".format(conso).replace(",", " ")
        else:
            patients = "Données insuffisantes"
    else:
        exposition = "-"
        patients = "Données insuffisantes"

    return SectionRow(
        [
            Div(
                [
                    Div(
                        [
                            Div(
                                html.P(UTILISATION[exposition - 1]),
                                className="UsageBoxImgTitle normal-text-bold",
                            ),
                            Usage(_type, exposition - 1),
                        ],
                        className="UsageBoxImg",
                    ),
                    Div(
                        [
                            html.H2(patients, className="UsageBoxTextTitle"),
                            html.P(
                                "Approximation du nombre de patients traités sur la période 2014-2018",
                                className="normal-text",
                            ),
                        ],
                        className="UsageBoxText",
                    ),
                ],
                className="UsageBox",
            )
        ],
    )


def PatientsTraites(
    df_age: pd.DataFrame,
    df_sexe: pd.DataFrame,
    df_expo: pd.DataFrame,
    type: str,
    pie_colors: List,
) -> Component:
    children = [
        SectionRow(html.H1("Patients traités", className="SectionTitle")),
        Tooltip(),
    ]
    dataframes = [df_age, df_sexe, df_expo]
    if all(df is None for df in dataframes):
        children.append(NoData())
    else:
        children.extend(
            [
                Utilisation(type, df_expo),
                Grid(
                    [
                        GraphBox(
                            "Répartition par sexe des patients traités",
                            [RepartitionSexeBox(df_sexe)],
                        ),
                        GraphBox(
                            "Répartition par âge des patients traités",
                            [
                                RepartitionAgeBox(
                                    df_age, "pourcentage_patients", pie_colors
                                )
                            ],
                        ),
                    ],
                    2,
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
    elif type == "mesusage":
        title = "Mésusage du médicament"
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


@app.callback(
    dd.Output("url", "href"),
    dd.Input("search-bar", "value"),
)
def update_path(value):
    ctx = dash.callback_context
    if not ctx.triggered:
        raise PreventUpdate()
    if value:
        type = value["type"]
        index = value["value"]
        return f"/apps/{type}?" + urlencode({"search": quote_plus(index)})
    else:
        raise PreventUpdate()
