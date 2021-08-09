from typing import Tuple
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash
import dash.dependencies as dd
import dash_html_components as html
import dash_table
import numpy as np
import pandas as pd
from app import app
from apps.components.commons import (
    EIRepartitionGraviteGraphBox,
    PatientsTraites,
    Header,
    EICasDeclareFigureBox,
    EITauxDeclarationBox,
    EIRepartitionAgeGraphBox,
    EIRepartitionSexeFigureBox,
    RepartitionNotificateursFigureBox,
    EISystemesOrganesTooltip,
    EIRepartitionSystemeOrganesBox,
    EIRepartitionHLTBox,
)
from apps.components.specialite import NoData
from apps.components.utils import Box
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from datamed_custom_components.Accordion import Accordion
from db import substance, fetch_data
from sm import SideMenu

from .utils import Box, TopicSection, SectionTitle, SectionRow, Grid, trim_list
from ..constants.colors import PIE_COLORS_SUBSTANCE


def EffetsIndesirablesTooltip(tooltip_open=False) -> Component:
    return SectionRow(
        Box(
            Accordion(
                [
                    html.P(
                        "Ces indicateurs représentent le nombre de cas notifiés d’effets indésirables en France "
                        "estimé à partir des données de la Base Nationale de Pharmacovigilance (BNPV). Pour éviter "
                        "tout risque de réidentification des patients, les déclarations d'effets indésirables "
                        "apparaissant pour moins de 10 patients ne sont pas affichées.",
                        className="normal-text",
                    ),
                    html.P(
                        [
                            html.Span(
                                "La BNPV est alimentée par les Centres Régionaux de Pharmacovigilance (CRPV) qui "
                                "sont notifiés par les professionnels de santé ou par les patients et association "
                                "agréées via un portail dédié : ",
                                className="normal-text",
                            ),
                            html.A(
                                "signalement.social-sante.gouv.fr",
                                href="https://signalement.social-sante.gouv.fr",
                                className="Link",
                                target="_blank",
                            ),
                        ]
                    ),
                    html.P(
                        [
                            html.B("Attention :"),
                            " il s'agit uniquement des déclarations qui ont été faites sur la base du "
                            "volontariat. Ces données ne représentent pas l'exhaustivité des effets indésirables "
                            "comme observés lors des essais cliniques",
                        ],
                        className="normal-text",
                    ),
                ],
                isOpenOnFirstRender=tooltip_open,
                labelClass="InternalLink normal-text",
                label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
            )
        )
    )


def Substance(code: str) -> Tuple[Component, html.Div]:
    """
    @param code: substance code
    """
    df_sub = substance.get_substance_df(code)
    series_sub = fetch_data.as_series(df_sub)
    df_sub_spe = substance.list_specialite(code)
    df_age = substance.get_age_df(code)
    df_sexe = substance.get_sexe_df(code)
    df_expo = substance.get_exposition_df(code)
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
                        {
                            "id": "effets-indesirables",
                            "label": "Effets indésirables",
                        },
                        {
                            "id": "liste-specialites",
                            "label": "Liste des spécialités",
                        },
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
                                type="substance",
                                pie_colors=PIE_COLORS_SUBSTANCE,
                            ),
                            EffetsIndesirables(
                                df_expo,
                                df_notif,
                                df_cas_age,
                                df_cas_sexe,
                                df_gravite,
                            ),
                            SystemesOrganes(df_soc),
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
                style_cell={
                    "height": "50px",
                    "backgroundColor": "#FFF",
                },
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
            Box(
                box_children,
            ),
        ],
        id="liste-specialites",
    )


def EffetsIndesirables(
    df_expo: pd.DataFrame,
    df_notif: pd.DataFrame,
    df_cas_age: pd.DataFrame,
    df_cas_sexe: pd.DataFrame,
    df_gravite: pd.DataFrame,
) -> Component:
    children = [
        SectionRow(html.H1("Effets indésirables")),
    ]
    dataframes = [df_expo, df_notif, df_cas_age, df_cas_sexe, df_gravite]
    if all(df is None for df in dataframes):
        children.extend([EffetsIndesirablesTooltip(tooltip_open=True), NoData()])
    else:
        children.extend(
            [
                EffetsIndesirablesTooltip(),
                Grid(
                    [
                        EICasDeclareFigureBox(df_expo),
                        EITauxDeclarationBox(df_expo),
                        EIRepartitionSexeFigureBox(df_cas_sexe),
                        EIRepartitionAgeGraphBox(df_cas_age, PIE_COLORS_SUBSTANCE),
                        EIRepartitionGraviteGraphBox(df_gravite, PIE_COLORS_SUBSTANCE),
                        Box(
                            [
                                html.H4("Précision sur les déclarations d'effets indésirables"),
                                html.Div(
                                    [
                                        html.Img(
                                            src=app.get_asset_url("communique_120.svg"),
                                        ),
                                        html.P(
                                            "Les données affichées sur les effets indésirables sont basées sur "
                                            "le déclaratif. L’ANSM se sert des déclarations que font les patients "
                                            "ou les professionnels de santé pour détecter des signaux en "
                                            "pharmacovigilance. Ce relevé des déclarations ne permet en aucun "
                                            "cas de connaître la fréquence exacte de survenue des effets "
                                            "indésirables liés à la consommation d'un médicament.",
                                            className="d-flex d-inline justify-content-center text-justify mt-5",
                                        ),
                                    ]
                                ),
                            ],
                            className="Box-isHalf",
                        ),
                    ],
                    2,
                ),
                SectionRow([RepartitionNotificateursFigureBox(df_notif)]),
            ]
        )
    return TopicSection(
        children,
        id="effets-indesirables",
    )


def SystemesOrganes(df: pd.DataFrame) -> Component:
    children = [
        SectionRow(html.H1("Déclarations d'effets indésirables par système d'organe")),
    ]
    if df is None or np.isnan(df.pourcentage_cas.unique()).all():
        children.extend([EISystemesOrganesTooltip(tooltip_open=True), NoData()])
    else:
        children.extend(
            [
                EISystemesOrganesTooltip(),
                SectionRow(EIRepartitionSystemeOrganesBox(df, "substance")),
            ]
        )
    return TopicSection(
        children,
        id="population-concernee",
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
    ],
    [
        dd.Input({"type": "close-backdrop-substance", "index": dd.ALL}, "n_clicks"),
        dd.Input("url", "href"),
        dd.Input({"type": "soc-treemap-substance", "index": dd.ALL}, "clickData"),
    ],
)
def open_ei_modal_on_substance_page(clicks_close, href, click_data):
    # beware! with Input id as object click_data is a list !!
    changed_id = [p["prop_id"] for p in dash.callback_context.triggered][0]

    # User has not clicked on modal yet
    if not click_data or not trim_list(click_data):
        raise PreventUpdate()
    # Modal has been closed by user
    if "close-backdrop" in changed_id:
        return False, "", ""
    current_entry = click_data[0]["points"][0]["entry"]
    # User is going up in treemap
    if current_entry != "":
        return False, "", ""

    selected_soc = click_data[0]["points"][0]["label"]

    parsed_url = urlparse(unquote_plus(href))
    query = parse_qs(parsed_url.query)
    sub_code = query["search"][0]
    df_hlt = substance.get_hlt_df(sub_code)
    df_hlt = df_hlt[df_hlt.soc_long == selected_soc].sort_values(
        by="pourcentage_cas", ascending=False
    )

    return (
        True,
        EIRepartitionHLTBox(df_hlt),
        selected_soc,
    )
