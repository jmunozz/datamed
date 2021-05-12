import urllib
from typing import Tuple

import dash_html_components as html
import dash_table
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
from app import app
from bs4 import BeautifulSoup
from dash.development.base_component import Component
from dash_core_components import Graph
from datamed_custom_components import Accordion
from db import specialite, fetch_data
from sm import SideMenu

from .commons import PatientsTraites, NoData, Header
from .utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    ExternalLink,
    FigureGraph,
    SectionRow,
    date_as_string,
    nested_get,
)
from ..constants.colors import PIE_COLORS_SPECIALITE
from ..constants.layouts import PIE_LAYOUT, STACKED_BAR_CHART_LAYOUT


def get_rcp_link(cis: str) -> str:
    link = "https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid={}&typedoc=R".format(
        cis
    )
    fallback_link = "https://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid={}".format(
        cis
    )
    page = requests.get(link)
    soup = BeautifulSoup(page.content, "html.parser")
    return (
        fallback_link
        if soup.body.findAll(
            text="Le document demandé n'est pas disponible pour ce médicament"
        )
        else link
    )


def get_notice_link(cis: str) -> str:
    link = "https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid={}&typedoc=N".format(
        cis
    )
    fallback_link = "https://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid={}".format(
        cis
    )
    page = requests.get(link)
    soup = BeautifulSoup(page.content, "html.parser")
    return (
        fallback_link
        if soup.body.findAll(
            text="Le document demandé n'est pas disponible pour ce médicament"
        )
        else link
    )


def get_has_link(series_spe: pd.Series) -> str:
    nom_specialite = series_spe.nom.capitalize()
    url_specialite = urllib.parse.quote_plus(nom_specialite)
    return "https://www.has-sante.fr/jcms/fc_2875171/fr/resultat-de-recherche?text={}&tmpParam=&opSearch=".format(
        url_specialite
    )


def Specialite(cis: str) -> Tuple[Component, html.Div]:

    df_spe = specialite.get_specialite_df(cis)
    series_spe = fetch_data.as_series(df_spe)
    df_sub = specialite.list_substances(cis)
    df_age = specialite.get_age_df(cis)
    df_sexe = specialite.get_sexe_df(cis)
    df_expo = specialite.get_exposition(cis)
    df_desc = specialite.get_description_df(cis)
    df_atc = specialite.get_atc_df(cis)
    df_ei = specialite.get_erreur_med_effet_indesirable(cis)
    df_cause = specialite.get_erreur_med_cause(cis)
    df_nat = specialite.get_erreur_med_nature(cis)
    df_pop = specialite.get_erreur_med_population(cis)
    df_denom = specialite.get_erreur_med_denom(cis)
    df_rup = specialite.get_ruptures(cis)

    return (
        Header(series_spe),
        html.Div(
            [
                SideMenu(
                    id="side-menu",
                    items=[
                        {"id": "description", "label": "Description"},
                        {"id": "population-concernee", "label": "Population concernée"},
                        {
                            "id": "erreurs-medicamenteuses",
                            "label": "Données de pharmacovigilance",
                        },
                        {
                            "id": "rupture-de-stock",
                            "label": "Historique des ruptures de stock",
                        },
                    ],
                    className="SideMenu",
                ),
                html.Div(
                    html.Div(
                        [
                            Description(df_spe, df_desc, df_atc, df_sub),
                            PatientsTraites(
                                df_age=df_age,
                                df_sexe=df_sexe,
                                df_expo=df_expo,
                                pie_colors=PIE_COLORS_SPECIALITE,
                            ),
                            ErreursMedicamenteuses(
                                df_ei,
                                df_pop,
                                df_cause,
                                df_nat,
                                df_denom,
                                series_spe,
                            ),
                            EffetsIndesirables(df_sub),
                            RuptureDeStock(df_rup),
                        ],
                        className="ContentWrapper ContentWrapper-hasHeader",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )


def SubstanceLinks(df_sub: pd.DataFrame) -> Component:
    return html.Div(
        [
            html.A(
                series.nom.upper(),
                href="/apps/substance?search={}".format(code),
                className="normal-text link d-block",
                id="refresh-substances",
            )
            for code, series in df_sub.iterrows()
        ]
    )


def Description(
    df_spe: pd.DataFrame,
    df_desc: pd.DataFrame,
    df_atc: pd.DataFrame,
    df_sub: pd.DataFrame,
) -> Component:
    series_spe = fetch_data.as_series(df_spe)
    series_desc = fetch_data.as_series(df_desc)
    series_atc = fetch_data.as_series(df_atc)
    cis = series_spe.name

    return TopicSection(
        SectionRow(
            Box(
                [
                    html.Article(
                        [ArticleTitle("Substance(s) active(s)"), SubstanceLinks(df_sub)]
                    ),
                    html.Article(
                        [
                            ArticleTitle("Statut de la spécialité de médicament"),
                            html.Div(
                                series_spe.etat_commercialisation.capitalize(),
                                className="Badge normal-text",
                            ),
                        ]
                    ),
                    html.Article(
                        [
                            ArticleTitle("Laboratoire"),
                            html.Div(
                                series_spe.titulaires.title(),
                                className="normal-text",
                            ),
                        ]
                    ),
                    html.Article(
                        [
                            ArticleTitle("Description"),
                            html.Span(
                                "Classe ATC (Anatomique, Thérapeutique et Chimique) :",
                                className="normal-text",
                                style={"margin-right": "15px"},
                            ),
                            html.Span(
                                "{} ({})".format(
                                    series_atc.label.capitalize(),
                                    series_atc.atc,
                                ),
                                className="Badge Badge-isSecondary normal-text",
                            ),
                            html.P(
                                series_desc.description,
                                className="normal-text text-justify mt-3",
                            ),
                        ]
                    ),
                    html.Article(
                        [
                            ArticleTitle("Recommandations de la HAS"),
                            ExternalLink(
                                "Afficher les recommandations",
                                get_has_link(series_spe),
                            ),
                        ]
                    ),
                    html.Article(
                        [
                            ArticleTitle("Infos pour les professionnels de santé"),
                            ExternalLink("Afficher le RCP", get_rcp_link(cis)),
                        ]
                    ),
                    html.Article(
                        [
                            ArticleTitle("Infos pour les patients"),
                            ExternalLink("Afficher la notice", get_notice_link(cis)),
                        ]
                    ),
                ],
            ),
        ),
        isFirst=True,
        id="description",
    )


def StackBarGraph(df: pd.DataFrame, field: str) -> Graph:
    if df is None:
        return NoData()
    else:
        df.pourcentage = df.pourcentage / 100
        fig = px.bar(
            df,
            x="pourcentage",
            color=field,
            labels={
                "pourcentage": "Proportion",
                field: field.split("_")[0].capitalize(),
            },
            color_discrete_sequence=PIE_COLORS_SPECIALITE,
            orientation="h",
        )

        fig.update_layout(STACKED_BAR_CHART_LAYOUT)
        return Graph(figure=fig, responsive=True, id="stack-bar")


def BoxPourcentageEffetsIndesirable(df_ei: pd.DataFrame) -> Component:
    if df_ei is None:
        return NoData()

    EI = {"Non": "Sans effets indésirables", "Oui": "Avec effets indésirables"}
    EI_IMG_URL = {
        "Non": app.get_asset_url("healthy_man.svg"),
        "Oui": app.get_asset_url("sick_man.svg"),
    }

    return FigureGraph(
        [
            {
                "figure": "{}%".format(round(series.pourcentage)),
                "caption": EI[series.effet_indesirable],
                "img": EI_IMG_URL[series.effet_indesirable],
            }
            for cis, series in df_ei.iterrows()
        ]
    )


def BoxRepartitionPopulationConcernee(df_pop: pd.DataFrame) -> Component:
    if df_pop is None:
        return NoData()
    fig_pop = go.Figure(
        go.Pie(
            labels=df_pop.population_erreur,
            values=df_pop.pourcentage,
            marker_colors=PIE_COLORS_SPECIALITE,
        )
    ).update_layout(PIE_LAYOUT)
    return Graph(
        figure=fig_pop,
        responsive=True,
    )


def BoxListDenomination(df_denom):
    if df_denom is None:
        return NoData()
    df_denom.denomination = df_denom.denomination.str.capitalize()
    return dash_table.DataTable(
        id="denomination-table",
        columns=[{"name": i, "id": i} for i in df_denom[["denomination"]].columns],
        data=df_denom.to_dict("records"),
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
    )


def ErreursMedicamenteuses(
    df_ei: pd.DataFrame,
    df_pop: pd.DataFrame,
    df_cause: pd.DataFrame,
    df_nat: pd.DataFrame,
    df_denom: pd.DataFrame,
    series_spe: pd.DataFrame,
) -> Component:

    return TopicSection(
        [
            SectionRow(html.H1("Erreurs médicamenteuses", className="SectionTitle")),
            SectionRow(
                Box(
                    Accordion(
                        [
                            html.Span(
                                "Les données sur les erreurs médicamenteuses proviennent des déclarations de risque d’erreur "
                                "ou d’erreurs médicamenteuses avec ou sans évènements indésirables, gérées par l’ANSM. Elles "
                                "sont déclarées par les patients ou les professionnels de santé, notamment via le ",
                                className="normal-text",
                            ),
                            html.A(
                                "portail des signalements",
                                href="https://signalement.social-sante.gouv.fr",
                                className="normal-text link",
                            ),
                            html.P(
                                "Les erreurs médicamenteuses se classifient en fonction du stade (erreur de prescription, "
                                "erreur de délivrance, erreur d’administration), de la nature et de la cause de l'erreur."
                            ),
                        ],
                        label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
                    )
                )
            ),
            SectionRow(
                [
                    GraphBox(
                        "Existence d’effets indésirables suite aux erreurs médicamenteuses",
                        [BoxPourcentageEffetsIndesirable(df_ei)],
                    ),
                    GraphBox(
                        "Répartition de la population concernée par les erreurs médicamenteuses",
                        [BoxRepartitionPopulationConcernee(df_pop)],
                    ),
                ],
                withGutter=True,
            ),
            SectionRow(
                [
                    GraphBox(
                        "Cause des erreurs médicamenteuses",
                        [StackBarGraph(df_cause, "cause_erreur")],
                    ),
                ]
            ),
            SectionRow(
                [
                    GraphBox(
                        "Nature des erreurs médicamenteuses",
                        [StackBarGraph(df_nat, "nature_erreur")],
                    ),
                ]
            ),
            SectionRow(
                [
                    GraphBox(
                        "Liste des dénominations des médicaments concernés par ces erreurs médicamenteuses",
                        [
                            html.P(
                                [
                                    html.Span(
                                        "Ci-dessous vous trouverez la liste des dénominations de médicaments "
                                        "renseignées dans la base de données des erreurs médicamenteuses. En effet, "
                                        "dans cette base, les médicaments ne sont pas toujours renseignés par nom de "
                                        "spécialité. Nous avons sélectionné les dénominations qui se "
                                        "rapprochent le plus de ",
                                        className="normal-text",
                                    ),
                                    html.Strong(
                                        "{}".format(series_spe.nom.capitalize()),
                                        className="normal-text-bold",
                                    ),
                                    html.Span(
                                        " pour mener notre analyse.",
                                        className="normal-text",
                                    ),
                                ],
                                className="text-justify"
                            ),
                            BoxListDenomination(df_denom),
                        ],
                    ),
                ]
            ),
        ],
        id="erreurs-medicamenteuses",
    )


def EffetsIndesirables(df_sub: pd.DataFrame) -> Component:
    return TopicSection(
        [
            SectionRow(
                html.H1(
                    "Cas déclarés d’effets indésirables des substances actives",
                    className="SectionTitle",
                )
            ),
            SectionRow(
                Box(
                    Accordion(
                        [
                            html.P(
                                "Sont notifiés les effets indésirables que le patient ou son entourage suspecte "
                                "d’être liés à l’utilisation d’un ou plusieurs médicaments, ainsi que les mésusages, "
                                "abus ou erreurs médicamenteuses. Il s’agit de cas évalués et validés par "
                                "un comité d’experts.",
                                className="normal-text",
                            ),
                        ],
                        label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
                    )
                )
            ),
            SectionRow(
                [
                    AdverseEffectLink(sub.nom.capitalize(), code)
                    for code, sub in df_sub.iterrows()
                ]
            ),
        ],
        id="",
    )


def AdverseEffectLink(substance: str, code: str) -> Component:
    return Box(
        html.Div(
            [
                html.Label(
                    substance,
                    className="AdverseEffectRowLabel normal-text-bold",
                    style={"color": "#00B3CC"},
                ),
                html.A(
                    "Consulter les effets indésirables",
                    href="/apps/substance?search={}#effets-indesirables".format(code),
                    className="InternalLink normal-text",
                    style={"color": "#A03189"},
                ),
            ],
            className="AdverseEffectRow",
        )
    )


mapCircuitColRupture = {
    "ville": {
        "start": "debut_ville",
        "availability_date": "prevision_remise_dispo_ville",
    },
    "hôpital": {
        "start": "debut_hopital",
        "availability_date": "prevision_remise_dispo_hopital",
    },
}


def RuptureDeStockTableRowValues(values):
    return html.Div(
        [
            html.Div(v, style={"margin-bottom": "15px"}, className="normal-text")
            for v in values
        ],
        className="d-flex flex-column justify-content-start",
    )


def RuptureDeStockTableRowLabels(labels):
    return html.Div(
        [
            html.Div(
                label, className="normal-text-bold", style={"margin-bottom": "15px"}
            )
            for label in labels
        ],
        className="d-flex flex-column justify-content-start",
        style={"margin-right": "30px"},
    )


def RuptureDeStockTableRow(series_rup):
    circuit = series_rup.circuit
    col_start = nested_get(mapCircuitColRupture, f"{circuit}.start", None)
    col_availability_date = nested_get(
        mapCircuitColRupture, f"{circuit}.availability_date", None
    )
    availability_date = (
        date_as_string(series_rup.get(col_availability_date))
        if col_availability_date and not pd.isnull(series_rup[col_availability_date])
        else "Pas de données"
    )
    shortage_date = (
        date_as_string(series_rup.get(col_start))
        if col_start and not pd.isnull(series_rup[col_start])
        else "Pas de données"
    )

    return html.Div(
        [
            RuptureDeStockTableRowLabels(
                [
                    "Présentation de médicament",
                    "Statut",
                    "Circuit",
                    "Cause",
                    "Date de signalement",
                    "Date de rupture",
                    "Date de remise à disposition",
                ]
            ),
            RuptureDeStockTableRowValues(
                [
                    series_rup.nom.capitalize(),
                    series_rup.classification.capitalize(),
                    circuit.capitalize() if circuit else "Pas de données",
                    series_rup.cause.capitalize(),
                    date_as_string(series_rup.date),
                    shortage_date,
                    availability_date,
                ]
            ),
        ],
        className="d-flex flex-row border",
        style={"padding": "15px"},
    )


def RuptureDeStockTable(df_rup: pd.DataFrame):
    rows = [RuptureDeStockTableRow(row) for label, row in df_rup.iterrows()]
    return html.Div(rows, className="rds-table")


def RuptureDeStock(df_rup: pd.DataFrame):
    if df_rup is None:
        df_rup = pd.DataFrame()
    else:
        df_rup = df_rup.sort_values(by=["date"], ascending=False)

    return TopicSection(
        [
            SectionRow(
                html.H1("Historique des ruptures de stock", className="SectionTitle")
            ),
            SectionRow(
                Box(
                    [
                        html.Div(
                            "{} signalement(s)".format(fetch_data.get_df_len(df_rup)),
                            className="normal-text",
                            style={"color": "#33C2D6"},
                        ),
                        RuptureDeStockTable(df_rup),
                    ],
                ),
            ),
        ],
        id="rupture-de-stock",
    )
