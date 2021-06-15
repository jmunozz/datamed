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
from apps.components.specialite import NoData
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from datamed_custom_components.Accordion import Accordion
from sm import SideMenu

from apps.graphs import EIRepartitionSystemeOrganes, EIRepartitionHLT

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
    EISystemesOrganesTooltip,
)
from .utils import (
    Box,
    GraphBox,
    TopicSection,
    SectionTitle,
    SectionRow,
)
from ..constants.colors import PIE_COLORS_SUBSTANCE, TREE_COLORS


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
                    [EICasDeclareFigureBox(df_decla), EITauxDeclarationBox(df_decla),],
                    withGutter=True,
                ),
                SectionRow(
                    [
                        EIRepartitionSexeFigureBox(df_cas_sexe),
                        EIRepartitionAgeGraphBox(df_cas_age),
                    ],
                    withGutter=True,
                ),
                SectionRow(
                    [EIRepartitionGraviteGraphBox(df_gravite)], withGutter=True,
                ),
                SectionRow([EIRepartitionNotificateursFigureBox(df_notif)]),
            ]
        )
    return TopicSection(children, id="effets-indesirables",)


def EIRepartitionSystemeOrganesBox(df: pd.DataFrame, code: str):
    return EIRepartitionSystemeOrganes(df, code)


def SystemesOrganes(df: pd.DataFrame, code: str) -> Component:
    children = [
        SectionRow(html.H1("Déclarations d'effets indésirables par système d'organe"))
    ]
    if df is None or np.isnan(df.pourcentage_cas.unique()).all():
        children.append(NoData())
    else:
        children.extend(
            [EISystemesOrganesTooltip(), SectionRow([],),]
        )
    return TopicSection(children, id="population-concernee",)


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
