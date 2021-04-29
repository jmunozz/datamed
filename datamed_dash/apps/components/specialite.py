import dash_bootstrap_components as dbc
import dash_html_components as html
import dash_table
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
from bs4 import BeautifulSoup
from dash.development.base_component import Component
from dash_core_components import Graph
from db import specialite, substance, fetch_data
from sm import SideMenu

from app import app

from .commons import PatientsTraites
from .utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    SectionTitle,
    ExternalLink,
    SectionP,
    FigureGraph,
)
from ..constants.colors import PIE_COLORS_SPECIALITE
from ..constants.layouts import PIE_LAYOUT, STACKED_BAR_CHART_LAYOUT

EI = {"Non": "Sans effets indésirables", "Oui": "Avec effets indésirables"}
EI_IMG_URL = {
    "Non": app.get_asset_url("healthy_man.svg"),
    "Oui": app.get_asset_url("sick_man.svg"),
}


def get_has_guideline_link(current_specialite: pd.Series) -> str:
    cis = current_specialite.name
    return "https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid={}&typedoc=N".format(
        cis
    )


def get_rcp_link(cis) -> str:
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


def get_notice_link(cis) -> str:
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


def Specialite(cis: str) -> Component:
    divs = [
        Header(cis),
        Description(cis),
    ]
    df_expo = specialite.get_exposition(cis)
    if df_expo is not None:
        df_age = specialite.get_age_df(cis)
        df_sexe = specialite.get_sexe_df(cis)
        divs.append(
            PatientsTraites(
                df_age=df_age,
                df_sexe=df_sexe,
                df_expo=df_expo,
                index=cis,
                pie_colors=PIE_COLORS_SPECIALITE,
            )
        )

    df_emed = fetch_data.fetch_table("erreur_med_cis_denomination", "cis")
    if cis in df_emed.index.tolist():
        divs.append(ErreursMedicamenteuses(cis))

    divs.append(EffetsIndesirables(cis))

    return html.Div(
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
                ],
                className="side-menu",
            ),
            html.Div(
                html.Div(
                    divs, className="container-fluid", style={"padding-left": "80px"}
                ),
                className="container-fluid side-content",
            ),
        ],
        className="container-fluid p-0 content",
    )


def Header(cis: str) -> Component:
    spe = specialite.get_specialite(cis).nom
    return html.Div(
        [
            html.Div(spe.capitalize(), className="heading-4"),
            html.Div("Spécialité de médicament", className="large-text"),
            html.A("Qu'est-ce qu'une spécialité de médicament ?"),
        ],
        className="content-header",
    )


def SubstanceLinks(cis: str) -> Component:
    df_sub_spe = specialite.get_specialite_substance_df(cis)
    substances_codes_list = (
        df_sub_spe.code_substance.unique()
        if not isinstance(df_sub_spe.code_substance, str)
        else [df_sub_spe.code_substance]
    )
    df_sub = substance.list_substances(substances_codes_list)
    # df_sub = specialite.list_substances(cis)
    return html.Div(
        [
            html.A(
                nom_dict["nom"].upper(),
                href="/apps/substance?search={}".format(code),
                className="normal-text link d-block",
                id="refresh-substances",
            )
            for code, nom_dict in df_sub.to_dict(orient="index").items()
        ]
    )


def Description(cis: str) -> Component:
    current_specialite_series = specialite.get_specialite(cis)
    df_description = fetch_data.fetch_table("description", "cis")

    df_cis_atc = fetch_data.fetch_table("specialite_atc", "cis").reset_index()
    df_atc = fetch_data.fetch_table("classes_atc", "code")
    df = df_cis_atc.merge(df_atc, left_on="atc", right_on="code", how="left").set_index(
        "cis"
    )

    return TopicSection(
        Box(
            [
                html.Article(
                    [ArticleTitle("Substance(s) active(s)"), SubstanceLinks(cis)]
                ),
                html.Article(
                    [
                        ArticleTitle("Statut de la spécialité de médicament"),
                        html.Div(
                            current_specialite_series.etat_commercialisation.upper(),
                            className="normal-text-cap d-block",
                            id="refresh-substances",
                        ),
                    ]
                ),
                html.Article(
                    [
                        ArticleTitle("Description"),
                        html.P(
                            "Classe ATC (Anatomique, Thérapeutique et Chimique) : {} ({})".format(
                                df.loc[cis].label.capitalize(),
                                df.loc[cis].atc,
                            ),
                            className="normal-text",
                        ),
                        html.P(
                            df_description.loc[cis].description, className="normal-text"
                        ),
                    ]
                ),
                html.Article(
                    [
                        ArticleTitle("Recommandation HAS"),
                        ExternalLink(
                            "Afficher les recommandations",
                            get_has_guideline_link(current_specialite_series),
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
            class_name_wrapper="overlap-top-content",
        ),
        id="description",
    )


def NoData() -> html.Div:
    return html.Div(
        [
            html.Img(
                src="/assets/illu_no_data.svg",
                className="img-fluid",
                alt="Responsive image",
            ),
            html.Div(
                "Données insuffisantes pour affichage",
                className="small-text",
                style={"color": "#9e9e9e"},
            ),
        ],
        className="d-flex flex-column align-items-center",
    )


def StackBarGraph(df: pd.DataFrame, cis: str, field: str) -> Graph:
    if df[df.cis == cis].empty:
        return NoData()
    else:
        fig = px.bar(
            df[df.cis == cis],
            x="pourcentage",
            y="cis",
            color=field,
            labels={
                "pourcentage": "Proportion (%)",
                field: field.split("_")[0].capitalize(),
            },
            color_discrete_sequence=PIE_COLORS_SPECIALITE,
            orientation="h",
        )
        fig.update_layout(STACKED_BAR_CHART_LAYOUT)
        fig.update_layout(barmode="stack")
        fig.update_yaxes(visible=False, showticklabels=False)
        return Graph(
            figure=fig,
            responsive=False,
        )


def ErreursMedicamenteuses(cis: str) -> Component:
    df_ei = specialite.get_erreur_med_effet_indesirable(cis)
    ei_figures = [
        {
            "figure": "{}%".format(round(x["pourcentage"], 2)),
            "caption": EI[x["effet_indesirable"]],
            "img": EI_IMG_URL[x["effet_indesirable"]],
        }
        for x in fetch_data.transform_df_to_series_list(df_ei)
    ]

    df_pop = fetch_data.fetch_table("erreur_med_population", "cis").reset_index()
    fig_pop = go.Figure(
        go.Pie(
            labels=df_pop[df_pop.cis == cis].population_erreur,
            values=df_pop[df_pop.cis == cis].pourcentage,
            marker_colors=PIE_COLORS_SPECIALITE,
        )
    ).update_layout(PIE_LAYOUT)

    df_cause = fetch_data.fetch_table("erreur_med_cause", "cis").reset_index()
    df_nat = fetch_data.fetch_table("erreur_med_nature", "cis").reset_index()

    df_denom = fetch_data.fetch_table(
        "erreur_med_cis_denomination", "cis"
    ).reset_index()
    df_denom.denomination = df_denom.denomination.str.capitalize()

    return TopicSection(
        [
            SectionTitle("Erreurs médicamenteuses"),
            SectionP(
                "Les données sur les erreurs médicamenteuses proviennent des déclarations de risque d’erreur "
                "ou d’erreurs médicamenteuses avec ou sans évènements indésirables, gérées par l’ANSM. Elles sont "
                "déclarées par les patients ou les professionnels de santé notamment via le portail : "
                "https://signalement.social-sante.gouv.fr"
            ),
            SectionP(
                "Les Erreurs Médicamenteuses se classifient en fonction du stade (Erreur de prescription, "
                "Erreur de délivrance, Erreur d’administration), du type et de la cause. "
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Existence d’effets indésirables",
                        [FigureGraph(ei_figures)],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition de la population concernée",
                        [
                            Graph(
                                figure=fig_pop,
                                responsive=True,
                            )
                        ],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Cause des erreurs médicamenteuses",
                        [StackBarGraph(df_cause, cis, "cause_erreur")],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Nature des erreurs médicamenteuses",
                        [StackBarGraph(df_nat, cis, "nature_erreur")],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Liste des dénominations des médicaments concernés par ces erreurs médicamenteuses",
                        [
                            dash_table.DataTable(
                                id="denomination-table",
                                columns=[
                                    {"name": i, "id": i}
                                    for i in df_denom[df_denom.cis == cis][
                                        ["denomination"]
                                    ].columns
                                ],
                                data=df_denom[df_denom.cis == cis].to_dict("records"),
                                page_size=10,
                                style_as_list_view=True,
                                style_table={"overflowX": "auto"},
                                style_cell={
                                    "height": "50px",
                                    "backgroundColor": "#FAFAFA",
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
                        ],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
        ],
        id="erreurs-medicamenteuses",
    )


def EffetsIndesirables(cis: str) -> Component:
    df_sub_spe = specialite.get_specialite_substance_df(cis)
    substances_codes_list = (
        df_sub_spe.code_substance.unique()
        if not isinstance(df_sub_spe.code_substance, str)
        else [df_sub_spe.code_substance]
    )
    df_sub = substance.list_substances(substances_codes_list)

    return TopicSection(
        [
            SectionTitle("Cas déclarés d’effets indésirables des substances actives"),
            SectionP(
                "Sont notifiés les effets indésirables que le patient ou son entourage suspecte d’être liés à "
                "l’utilisation d’un ou plusieurs médicaments, ainsi que les mésusages, abus ou "
                "erreurs médicamenteuses. Il s’agit de cas évalués et validés par un comité d’experts."
            ),
            dbc.Row(
                [
                    AdverseEffectLink(nom_dict["nom"].capitalize(), code)
                    for code, nom_dict in df_sub.to_dict(orient="index").items()
                ]
            ),
        ],
        id="",
    )


def AdverseEffectLink(substance: str, code: str) -> Component:
    return Box(
        [
            html.Label(substance, className="color-secondary font-weight-bold"),
            html.A(
                "Voir les effets indésirables",
                href="/apps/substance?search={}".format(code),
                className="color-three",
            ),
        ],
        class_name="d-flex flex-row justify-content-between",
    )
