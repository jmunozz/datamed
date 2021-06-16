import math
from typing import List, Dict, Tuple
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus
from datetime import datetime as dt
import dash.dependencies as dd
import dash_html_components as html
import db.fetch_data as fetch_data
import db.substance as substance
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from app import app
from dash.development.base_component import Component
from dash_core_components import Graph

from apps.constants.colors import (
    PIE_COLORS_SUBSTANCE,
    TREE_COLORS,
    PIE_COLORS_SPECIALITE,
)
from apps.constants.layouts import (
    TREEMAP_LAYOUT,
    PIE_LAYOUT,
    PIE_TRACES,
    STACKED_BAR_CHART_LAYOUT,
    STACKED_BAR_CHART_TRACES,
)
from apps.constants.misc import NOTIF_IMAGE_URL, NOTIF_NOM, SEXE, SEXE_IMG_URL


def get_notif_figures_from_df(df: pd.DataFrame) -> List[Dict]:
    return [
        {
            "figure": "{}%".format(round(x["pourcentage_notif"])).replace(".", ","),
            "caption": NOTIF_NOM[x["notificateur"]],
            "img": NOTIF_IMAGE_URL[x["notificateur"]],
        }
        for x in fetch_data.transform_df_to_series_list(df)
        if not math.isnan(x["pourcentage_notif"]) and round(x["pourcentage_notif"])
    ]


#
## Patients traités
#

# Représentation des patients traités par sexe (Nombre)
def ReparitionSexeFigure(df_sexe: pd.DataFrame) -> Component:
    return FigureGraph(
        get_sexe_figures_from_df(df_sexe, "pourcentage_patients"),
        class_name="BoxContent-isHalf",
    )


# Représentation des patients par âge (Camembert)
def RepartitionAgeGraph(df_age: pd.DataFrame, pie_colors: List) -> Component:
    return Graph(
        figure=makePie(df_age.age, df_age.pourcentage_patients, pie_colors),
        responsive=False,
    )


#
## Effets indésirables
#

# Représentation du nombre de cas déclarés d'effets indésirables (Nombre)
def EICasDeclareFigure(df_decla: pd.DataFrame) -> Component:
    series_decla = fetch_data.as_series(df_decla)
    cas_str = "{:,}".format(int(series_decla.cas)).replace(",", " ")
    return FigureGraph(
        [
            {
                "figure": cas_str,
                "caption": "Nombre de déclarations sur la période 2014-2018",
            }
        ]
    )


# Représentation du taux de déclaration d'effets indésirables pour 100 000 patients (Nombre)
def EITauxDeclarationGraph(df_decla: pd.DataFrame) -> Component:
    series_decla = fetch_data.as_series(df_decla)
    taux_str = "{:,}".format(int(series_decla.taux_cas)).replace(",", " ")
    return FigureGraph(
        [
            {
                "figure": "{} pour 100 000".format(taux_str),
                "caption": "Taux de déclaration pour 100 000 patients "
                "traités par an sur la période 2014-2018",
            }
        ]
    )


# Représentation de la répartition des effets indésirables par sexe (Nombre)
def EIRepartitionSexeFigure(df_cas_sexe: pd.DataFrame) -> Component:
    return FigureGraph(get_sexe_figures_from_df(df_cas_sexe, "pourcentage_cas"))


# Représentation de la répartition des effets indésirables par âge (Camembert)
def EIRepartitionAgeGraph(df_cas_age: pd.DataFrame) -> Component:
    fig_age = makePie(df_cas_age.age, df_cas_age.pourcentage_cas, PIE_COLORS_SUBSTANCE)
    return Graph(figure=fig_age, responsive=False,)


# Représentation des notificateurs d'effets indésirable par type (Nombre)
def EIRepartitionNotificateursFigure(df_notif: pd.DataFrame) -> Component:
    df_notif = df_notif.sort_values(by="pourcentage_notif", ascending=False)
    return FigureGraph(
        get_notif_figures_from_df(df_notif),
        height="80px",
        class_name="justify-content-between",
    )


# Représentation de la répartition des effets indésirable par gravité (Camembert)
def EIRepartitionGraviteGraph(df: pd.DataFrame) -> Component:
    fig = makePie(df.grave, df.cas, PIE_COLORS_SUBSTANCE)
    return Graph(figure=fig, responsive=False)


# Représentation de la répartition des effets indésirables par système d'organe (Treemap)
def EIRepartitionSystemeOrganes(df_soc: pd.DataFrame) -> Component:
    fig = Treemap(df_soc, "soc_long", "pourcentage_cas")
    return Graph(figure=fig, responsive=True, id="soc-treemap", style={"height": 450})


def EIRepartitionHLT(df_hlt: pd.DataFrame) -> Component:
    fig = Treemap(df_hlt, "effet_hlt", "pourcentage_cas")
    return Graph(figure=fig, responsive=True,)


#
## Erreurs médicamenteuse
#

# Représentation de la répartition par gravité des erreurs médicamenteuses (Camembert)
def EMRepartitionGraviteGraph(df: pd.DataFrame):
    fig = makePie(df.gravite, df.pourcentage)
    return Graph(figure=fig, responsive=False)


# Représentation de la répartition de la population concernée par les EM (Camembert)
def EMRepartitionPopulationConcernee(df: pd.DataFrame):
    fig = makePie(df.population_erreur, df.pourcentage, PIE_COLORS_SPECIALITE)
    return Graph(figure=fig, responsive=False)


# Représentation de la répartition des effets indésirables causés par des EM (Nombre)
def EMRepartitionEffetsIndesirablesFigure(df: pd.DataFrame):
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
            for cis, series in df.iterrows()
        ]
    )


# Représentation de la répartition des EM par erreur initiale (Stack)
def EMRepartitionErreursInitialesGraph(df: pd.DataFrame):
    return StackBarGraph(df, "initial_erreur")


# Représentation de la répartition des EM par cause (Stack)
def EMRepartitionCausesGraph(df: pd.DataFrame):
    return StackBarGraph(df, "cause_erreur")


# Représentation de la répartition des EM par nature (Stack)
def EMRepartitionNatureGraph(df: pd.DataFrame):
    return StackBarGraph(df, "nature_erreur")


#
## Ruptures
#


# Nombre de signalements pour l'année dernière (Nombre)
def RupturesSignalementsFigure(df: pd.DataFrame):
    last_year = dt.now().year - 1
    df = df.reset_index()
    df = df.drop_duplicates(subset=["numero", "cis"], keep="first")
    df_by_year = df.reset_index().groupby("annee").numero.count()
    nb_signalements = df_by_year.at[str(last_year)]
    return (
        FigureGraph(
            [
                {
                    "figure": "{} signalements".format(nb_signalements,),
                    "caption": "Nombre de signalements en {}".format(dt.now().year - 1),
                }
            ]
        ),
    )


# Nombre de mesures de gestions (Nombre)
def RupturesMesuresFigure(df_mesures: pd.DataFrame):
    this_year = str(dt.now().year)[-2:]
    nb_mesures = len(
        df_mesures[
            (df_mesures.etat_mesure == "accord")
            & (df_mesures.identifiant.str.startswith(this_year))
        ].identifiant.unique()
    )
    return (
        FigureGraph(
            [
                {
                    "figure": "{} actions réalisées".format(nb_mesures),
                    "caption": "Signalements ayant fait l'objet d'une "
                    "mesure de gestion depuis le 3 Mai 2021",
                }
            ]
        ),
    )


# Répartition des mesures pour une année donnée (Camembert)
def getRupturesMesuresRepartitionGraph(df_mesures: pd.DataFrame, annee: str):
    df = df_mesures.groupby(["annee", "mesure"]).numero.count().reset_index()
    df = df.rename(columns={"numero": "nombre"}).set_index("annee")
    return makePie(df.loc[annee].mesure, df.loc[annee].nombre, TREE_COLORS)


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
    fig = (
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
    return fig


def Treemap(df_soclong: pd.DataFrame, path: str, values: str) -> List[Component]:
    fig = px.treemap(
        df_soclong.sort_values(by=values, ascending=False).head(10),
        path=[path],
        values=values,
        color_discrete_sequence=TREE_COLORS,
        hover_name=path,
    )

    fig.update_layout(TREEMAP_LAYOUT)
    fig.update_traces(
        texttemplate="%{label}<br>%{value:.0f}%",
        textposition="middle center",
        textfont_size=18,
        hovertemplate="<b>%{label}</b> <br> %{value:.0f}%",
    )
    return fig


#
## Custom
#


def StackBarGraph(df: pd.DataFrame, field: str) -> Graph:
    df.pourcentage = df.pourcentage / 100
    fig = px.bar(
        df,
        x="pourcentage",
        color=field,
        labels={"pourcentage": "Proportion", field: field.split("_")[0].capitalize(),},
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


def FigureGraph(
    figures: List[Dict], height="150px", class_name="justify-content-around"
) -> Component:
    class_name = " ".join((["Line", "Line-isSpacedEvenly"] + class_name.split(" ")))
    children_list = []
    for f in figures:
        elems = []
        elems = (
            elems + [html.Img(src=f["img"], className="mb-2", style={"height": height})]
            if "img" in f
            else []
        )
        elems = elems + [html.H1(f["figure"])] if "figure" in f else []
        elems = (
            elems
            + [
                html.Label(
                    f["caption"], className="normal-text", style={"color": "black"}
                )
            ]
            if f.get("caption")
            else []
        )
        children_list += [
            html.Div(
                elems,
                className="Stack Stack-isCentered",
                style={"color": "#00B3CC", "margin": "15px"},
            )
        ]
    return html.Div(children_list, className=class_name)
