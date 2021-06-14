import math
from typing import List, Dict, Tuple
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash.dependencies as dd
import dash_html_components as html
import dash_table
import db.fetch_data as fetch_data
import db.substance as substance
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from app import app
from apps.components import commons
from apps.components.specialite import NoData
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_bootstrap_components import (
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
)
from dash_core_components import Graph
from datamed_custom_components.Accordion import Accordion
from sm import SideMenu

from .commons import (
    EIRepartitionGraviteGraphBox,
    EIRepartitionSexeFigureBox,
    PatientsTraites,
    Header,
    EICasDeclareFigureBox,
    EITauxDeclarationBox,
    EIRepartitionAgeGraphBox,
    EIRepartitionSexeFigureBox,
    EIRepartitionNotificateursFigureBox,
)
from .utils import (
    Box,
    GraphBox,
    TopicSection,
    SectionTitle,
    SectionRow,
)
from ..constants.colors import PIE_COLORS_SUBSTANCE, TREE_COLORS

df_hlt = fetch_data.fetch_table("substance_hlt_ordei", "code")
df_hlt = df_hlt.where(pd.notnull(df_hlt), None)


def EffetsIndesirablesTooltip() -> Component:
    return SectionRow(
        Box(
            Accordion(
                [
                    html.Div(
                        "Nombre de cas notifiés d’effets indésirables en France estimé à partir des "
                        "données de la Base Nationale de Pharmacovigilance (BNPV).",
                        className="normal-text",
                    ),
                    html.Span(
                        "La BNPV est alimentée par les centres régionaux de pharmacovigilance qui sont "
                        "notifiés par les professionnels de santé ou par les patients et association "
                        "agréées via un portail dédié : ",
                        className="normal-text",
                    ),
                    html.A(
                        "signalement.social-sante.gouv.fr",
                        href="https://signalement.social-sante.gouv.fr",
                        className="normal-text link",
                        target="_blank",
                    ),
                ],
                labelClass="InternalLink normal-text",
                label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
            )
        )
    )


def Substance(code: str) -> Tuple[Component, html.Div]:

    df_sub = substance.get_substance_df(code)
    series_sub = fetch_data.as_series(df_sub)
    df_sub_spe = substance.list_specialite(code)
    df_age = substance.get_age_df(code)
    df_sexe = substance.get_sexe_df(code)
    df_expo = substance.get_exposition_df(code)
    df_decla = substance.get_decla_df(code)
    df_notif = substance.get_notif_df(code)
    df_cas_age = substance.get_age_cas_df(code)
    df_cas_sexe = substance.get_sexe_cas_df(code)
    df_soc = substance.get_soc_df(code)
    df_gravite = substance.get_gravite(code)

    return (
        Header(series_sub, type="substance"),
        html.Div(
            [
                SideMenu(
                    id="side-menu",
                    items=[
                        {"id": "patients-traites", "label": "Patients traités"},
                        {"id": "effets-indesirables", "label": "Effets indésirables",},
                        {"id": "liste-specialites", "label": "Liste des spécialités",},
                    ],
                    className="SideMenu",
                ),
                html.Div(
                    html.Div(
                        [
                            PatientsTraites(
                                df_age=df_age,
                                df_sexe=df_sexe,
                                df_expo=df_expo,
                                pie_colors=PIE_COLORS_SUBSTANCE,
                            ),
                            EffetsIndesirables(
                                df_decla, df_notif, df_cas_age, df_cas_sexe, df_gravite
                            ),
                            SystemesOrganes(df_soc, code),
                            ListeSpecialites(df_sub, df_sub_spe),
                        ],
                        className="ContentWrapper",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )


def ListeSpecialites(df_sub: pd.DataFrame, df_sub_spe: pd.DataFrame) -> Component:
    series_sub = fetch_data.as_series(df_sub)
    if df_sub_spe is not None:
        df_sub_spe.nom = df_sub_spe.nom.str.capitalize()
        box_children = [
            html.Div(
                "{} médicaments identifiés".format(len(df_sub_spe)),
                className="normal-text mt-3",
                style={"color": "#33C2D6"},
            ),
            dash_table.DataTable(
                id="substance-specialite-table",
                columns=[{"name": "nom", "id": "nom"}],
                data=df_sub_spe.reset_index().to_dict("records"),
                page_size=10,
                style_as_list_view=True,
                style_table={"overflowX": "auto"},
                style_cell={"height": "50px", "backgroundColor": "#FFF",},
                style_data={
                    "fontSize": "14px",
                    "fontWeight": "400",
                    "font-family": "Roboto",
                    "lineHeight": "18px",
                    "textAlign": "left",
                },
                style_header={"display": "none"},
            ),
        ]
    else:
        box_children = [
            html.Div(
                "Aucun médicament identifié",
                className="normal-text mt-3",
                style={"color": "#33C2D6"},
            )
        ]

    return TopicSection(
        [
            SectionTitle(
                "Spécialités de médicaments contenant : {}".format(
                    series_sub.nom.capitalize()
                )
            ),
            Box(box_children,),
        ],
        id="liste-specialites",
    )


def EffetsIndesirables(
    df_decla: pd.DataFrame,
    df_notif: pd.DataFrame,
    df_cas_age: pd.DataFrame,
    df_cas_sexe: pd.DataFrame,
    df_gravite: pd.DataFrame,
) -> Component:
    children = [SectionRow(html.H1("Effets indésirables"))]
    dataframes = [df_decla, df_notif, df_cas_age, df_cas_sexe, df_gravite]
    if all(df is None for df in dataframes):
        children.append(NoData())
    else:
        children.extend(
            [
                EffetsIndesirablesTooltip(),
                SectionRow(
                    [
                        GraphBox("", [EICasDeclareFigureBox(df_decla)],),
                        GraphBox("", [EITauxDeclarationBox(df_decla)],),
                    ],
                    withGutter=True,
                ),
                SectionRow(
                    [
                        GraphBox(
                            "Répartition par sexe des cas déclarés",
                            [EIRepartitionSexeFigureBox(df_cas_sexe)],
                        ),
                        GraphBox(
                            "Répartition par âge des cas déclarés",
                            [EIRepartitionAgeGraphBox(df_cas_age)],
                        ),
                    ],
                    withGutter=True,
                ),
                SectionRow(
                    [
                        GraphBox(
                            "Gravité des déclarations",
                            [EIRepartitionGraviteGraphBox(df_gravite)],
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
                        ),
                    ],
                    withGutter=True,
                ),
                SectionRow(
                    [
                        GraphBox(
                            "Répartition par déclarant",
                            [EIRepartitionNotificateursFigureBox(df_notif)],
                        ),
                    ]
                ),
            ]
        )
    return TopicSection(children, id="effets-indesirables",)


def SystemesOrganesTooltip():
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


def SystemesOrganes(df: pd.DataFrame, code: str) -> Component:
    children = [
        SectionRow(html.H1("Déclarations d'effets indésirables par système d'organe"))
    ]
    if df is None or np.isnan(df.pourcentage_cas.unique()).all():
        children.append(NoData())
    else:
        children.extend(
            [
                SystemesOrganesTooltip(),
                SectionRow(
                    [
                        html.Div(
                            [
                                html.Div(
                                    Graph(
                                        figure=Treemap(
                                            df, code, "soc_long", "pourcentage_cas"
                                        ),
                                        responsive=True,
                                        id="soc-treemap",
                                    ),
                                    id="soc-treemap-container",
                                ),
                                html.Div(id="selected-soc", className="d-none"),
                                HltModal(),
                            ],
                            className="col-md-12",
                        ),
                    ],
                ),
            ]
        )
    return TopicSection(children, id="population-concernee",)


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


@app.callback(
    dd.Output("url", "href"),
    dd.Input("substance-specialite-table", "active_cell"),
    dd.State("substance-specialite-table", "page_current"),
    dd.State("substance-specialite-table", "page_size"),
    dd.State("substance-specialite-table", "data"),
)
def getActiveCell(active_cell, page_current, page_size, data):
    if active_cell:
        row = active_cell["row"]
        cellData = data[(page_current or 0) * page_size + row]["cis"]
        return "/apps/specialite?" + urlencode({"search": quote_plus(cellData)})
    else:
        raise PreventUpdate


@app.callback(
    [
        dd.Output("update-on-click-data", "is_open"),
        dd.Output("body-modal", "children"),
        dd.Output("header-modal", "children"),
        dd.Output("selected-soc", "children"),
    ],
    [
        dd.Input("soc-treemap-container", "n_clicks"),
        dd.Input("close-backdrop", "n_clicks"),
        dd.Input("url", "href"),
        dd.Input("soc-treemap", "clickData"),
    ],
    [dd.State("selected-soc", "children")],
)
def update_callback(
    clicks_container, clicks_close, href, click_data, previous_selected_soc
):
    if not click_data:
        return False, "", "", ""

    selected_soc = click_data["points"][0]["label"]
    selected_soc_has_changed = selected_soc != previous_selected_soc

    if selected_soc_has_changed:
        parsed_url = urlparse(unquote_plus(href))
        query = parse_qs(parsed_url.query)
        code = query["search"][0]

        df_hlt_details = (
            df_hlt[df_hlt.soc_long == selected_soc]
            .loc[code]
            .sort_values(by="pourcentage_cas", ascending=False)
        )

        return (
            True,
            Graph(
                figure=Treemap(df_hlt_details, code, "effet_hlt", "pourcentage_cas"),
                responsive=True,
            ),
            selected_soc,
            selected_soc,
        )
    else:
        return False, "", "", ""
