from os import name
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

from .commons import PatientsTraites, NoData, Header, BoxArticle, BoxRow
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
from ..constants.layouts import (
    PIE_LAYOUT,
    STACKED_BAR_CHART_LAYOUT,
    PIE_TRACES,
    STACKED_BAR_CHART_TRACES,
)


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
    df_init = specialite.get_erreur_med_init(cis)

    return (
        Header(series_spe),
        html.Div(
            [
                SideMenu(
                    id="side-menu",
                    items=[
                        {"id": "description", "label": "Description"},
                        {"id": "patients-traites", "label": "Patients Traités"},
                        {
                            "id": "erreurs-medicamenteuses",
                            "label": "Erreurs médicamenteuses",
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
                                df_init,
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
    return html.Ul(
        [
            html.Li(
                html.A(
                    series.nom.capitalize(),
                    href="/apps/substance?search={}".format(code),
                    className="Link",
                    id="refresh-substances",
                ),
                className="ListItem",
            )
            for code, series in df_sub.iterrows()
        ],
        className="List",
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
                    BoxArticle(
                        [ArticleTitle("Substance(s) active(s)"), SubstanceLinks(df_sub)]
                    ),
                    BoxArticle(
                        [
                            ArticleTitle(
                                "Classe ATC (Anatomique, Thérapeutique et Chimique)"
                            ),
                            html.Span(
                                "{} ({})".format(
                                    series_atc.label.capitalize(), series_atc.atc,
                                ),
                                className="Badge Badge-isSecondary normal-text",
                            ),
                        ]
                    ),
                    BoxArticle(
                        [
                            ArticleTitle("État de commercialisation"),
                            html.Span(
                                series_spe.etat_commercialisation.capitalize(),
                                className="Badge normal-text",
                            ),
                        ],
                    ),
                    BoxArticle(
                        [
                            ArticleTitle("Laboratoire"),
                            html.Span(
                                series_spe.titulaires.title(), className="normal-text",
                            ),
                        ],
                    ),
                    BoxArticle(
                        [
                            ArticleTitle("Description"),
                            html.P(
                                series_desc.description,
                                className="normal-text text-justify",
                            ),
                        ]
                    ),
                    BoxRow(
                        [
                            BoxArticle(
                                [
                                    ArticleTitle("Recommandations de la HAS"),
                                    ExternalLink(
                                        "Afficher les recommandations",
                                        get_has_link(series_spe),
                                    ),
                                ],
                                in_row=True,
                            ),
                            BoxArticle(
                                [
                                    ArticleTitle(
                                        "Infos pour les professionnels de santé"
                                    ),
                                    ExternalLink("Afficher le RCP", get_rcp_link(cis)),
                                ],
                                in_row=True,
                            ),
                            BoxArticle(
                                [
                                    ArticleTitle("Infos pour les patients"),
                                    ExternalLink(
                                        "Afficher la notice", get_notice_link(cis)
                                    ),
                                ],
                                in_row=True,
                            ),
                        ],
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
            hover_name=field,
            hover_data={field: False,},
        )

        fig.update_layout(STACKED_BAR_CHART_LAYOUT)
        fig.update_traces(STACKED_BAR_CHART_TRACES)

        return html.Div(
            Graph(figure=fig, id="stack-bar", responsive=True, style={"height": 225}),
            className="ErrMedStackBar",
        )


def BoxPourcentageEffetsIndesirable(df_ei: pd.DataFrame) -> Component:
    if df_ei is None:
        return NoData(class_name="BoxContent-isHalf")

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
        return NoData("BoxContent-isHalf")
    fig_pop = go.Figure(
        go.Pie(
            labels=df_pop.population_erreur,
            values=df_pop.pourcentage,
            marker_colors=PIE_COLORS_SPECIALITE,
            hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
        )
    ).update_layout(PIE_LAYOUT)
    fig_pop.update_traces(PIE_TRACES)
    return Graph(figure=fig_pop, responsive=False)


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
        style_cell={"height": "50px", "backgroundColor": "#FFF",},
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
    df_init: pd.DataFrame,
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
                            html.P(
                                [
                                    html.Span(
                                        "Les données sur les erreurs médicamenteuses proviennent des déclarations de risque d’erreur "
                                        "ou d’erreurs médicamenteuses avec ou sans évènements indésirables, gérées par l’ANSM. Elles "
                                        "sont déclarées par les patients ou les professionnels de santé, notamment via le ",
                                    ),
                                    html.A(
                                        "portail des signalements",
                                        href="https://signalement.social-sante.gouv.fr",
                                        className="Link",
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
                        labelClass="InternalLink normal-text",
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
                        "Erreurs initiales",
                        [StackBarGraph(df_init, "initial_erreur",)],
                    ),
                ]
            ),
            SectionRow(
                [
                    GraphBox(
                        "Cause des erreurs médicamenteuses",
                        [StackBarGraph(df_cause, "cause_erreur",)],
                    ),
                ]
            ),
            SectionRow(
                [
                    GraphBox(
                        "Nature des erreurs médicamenteuses",
                        [StackBarGraph(df_nat, "nature_erreur",)],
                    ),
                ]
            ),
            SectionRow(
                [
                    GraphBox(
                        "Liste des dénominations des médicaments concernés par ces erreurs médicamenteuses",
                        html.Div(
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
                                    className="text-justify",
                                ),
                                BoxListDenomination(df_denom),
                            ]
                        ),
                    ),
                ]
            ),
        ],
        id="erreurs-medicamenteuses",
    )


def EffetsIndesirables(df_sub: pd.DataFrame) -> Component:
    # Hack to display as a grid (last row items do not resize), add empty elems
    NB_ELEM_PER_ROW = 3
    nb_empty_div = NB_ELEM_PER_ROW - (df_sub.size % NB_ELEM_PER_ROW)
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
                                [
                                    "Les données concernent des effets indésirables ",
                                    html.B("suspectés"),
                                    " suite à la prise d'un  médicament, mais qui ne sont pas ",
                                    html.B("obligatoirement liés ou dus"),
                                    " au médicament. Les déclarations d'effets indésirables ne doivent pas être interprétées comme signifiant que le médicament provoque l'effet observé ou que son utilisation présente un risque. Seule une analyse détaillée et une évaluation scientifique de toutes les données disponibles permettent des tirer des conclusions robustes sur les bénéfices et les risques d'un médicament.",
                                ],
                                className="normal-text justify-text",
                            ),
                        ],
                        labelClass="InternalLink normal-text",
                        label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
                        isOpenOnFirstRender=True,
                    )
                )
            ),
            SectionRow(
                [
                    Box(
                        html.Div(
                            [
                                html.H4(
                                    sub.nom.capitalize(),
                                    className="EffetIndesirableBoxTitle",
                                ),
                                html.Div(
                                    html.Img(
                                        src=app.get_asset_url("substance_icon.svg")
                                    )
                                ),
                                html.A(
                                    "Voir les effets indésirables",
                                    href="/apps/substance?search={}".format(code),
                                    className="Link EffetIndesirableBoxLink",
                                ),
                            ],
                            className="Stack Stack-isCentered",
                        ),
                        className="EffetIndesirableBox",
                    )
                    for code, sub in df_sub.iterrows()
                ]
                + [
                    html.Div(className="EmptyEffetIndesirableBox")
                    for n in range(nb_empty_div)
                ],
                withGutter=True,
            ),
        ],
        id="",
    )


def AdverseEffectLink(substance: str, code: str) -> Component:
    return Box(
        html.Div(
            [
                html.Span(substance, className="AdverseEffectRowLabel",),
                html.A(
                    "Consulter les effets indésirables",
                    href="/apps/substance?search={}#effets-indesirables".format(code),
                    className="Link",
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


def RuptureCellRow(key, value):
    if key == "Statut":
        css_class_value = "Badge Badge-isSecondary"
    else:
        css_class_value = "Badge Badge-isInvisible"
    return html.Div(
        [html.Div(key), html.Div(html.Span(value, className=css_class_value))],
        className="RuptureCellRow",
    )


def RuptureCell(series_rup):
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

    infos = {
        "Présentation de médicament": series_rup.nom.capitalize(),
        "Statut": series_rup.classification.capitalize(),
        "Circuit": circuit.capitalize() if circuit else "Pas de données",
        "Cause": series_rup.cause.capitalize()
        if series_rup.cause
        else "Pas de données",
        "Date de signalement": date_as_string(series_rup.date),
        "Date de rupture": shortage_date,
        "Date de remise à disposition": availability_date,
    }

    return html.Div(
        [RuptureCellRow(key, value) for (key, value) in infos.items()],
        className="RuptureCell",
    )


def RuptureDeStockTable(df_rup: pd.DataFrame):
    rows = [RuptureCell(row) for label, row in df_rup.iterrows()]
    return html.Div(rows, className="Rupture")


def RuptureDeStock(df_rup: pd.DataFrame):
    if df_rup is None:
        df_rup = pd.DataFrame()
    else:
        df_rup = df_rup.sort_values(by=["date"], ascending=False)

    return TopicSection(
        [
            SectionRow(
                html.Div("Historique des ruptures de stock", className="SectionTitle")
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
            SectionRow(
                Box(
                    html.Div(
                        [
                            Box(
                                [
                                    html.Img(
                                        src=app.get_asset_url(
                                            "icons/pres_autre_120.svg"
                                        ),
                                    ),
                                ],
                                isBordered=False,
                                className="CardBoxImage RupturesBox",
                            ),
                            Box(
                                [
                                    BoxArticle(
                                        [
                                            html.H3("Données de rupture de stock"),
                                            html.P(
                                                "Accédez aux données globales de l’état des ruptures de stock en France, ainsi qu’aux mesures prises par l’Agence pour prévenir la pénurie de médicaments."
                                            ),
                                            html.A(
                                                "visualiser les données",
                                                className="Btn Btn-isPrimary",
                                                role="button",
                                                href="/apps/ruptures",
                                            ),
                                        ]
                                    )
                                ],
                                isBordered=False,
                                className="CardBoxText",
                            ),
                        ],
                        className="CardBox",
                    ),
                    hasNoPadding=True,
                ),
            ),
        ],
        id="rupture-de-stock",
    )
