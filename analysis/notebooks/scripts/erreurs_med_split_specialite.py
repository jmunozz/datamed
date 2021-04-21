#!/usr/bin/env python
# coding: utf-8

# In[1]:


from os import path

import pandas as pd
import plotly.graph_objects as go
from nltk.corpus import stopwords

STOPWORDS = stopwords.words("french")

P_ROOT = "~/Documents/GitHub/datamed/create_database/data/"
P_CIS_BDPM = path.join(P_ROOT, "BDPM/CIS_bdpm.txt")

NOMS_LIEUX = {
    'ES': 'Établissement de santé',
    'EMS': 'Établissement médico-social',
    'HAD': 'Domicile'
}


# In[2]:


def get_mesusage_dataframe() -> pd.DataFrame:
    df = pd.read_excel("~/Documents/GitHub/datamed/analysis/data/RqHackathon_20190911.xlsx")
    df = df.rename(
        columns={
            "codeATC": "atc",
            "DCI": "dci",
            "causeErreur": "cause_erreur",
            "natureErreur": "nature_erreur",
            "populationErreur": "population_erreur",
            "qualifErreur": "qualif_erreur",
            "lieuErreur": "lieu_erreur",
            "initialErreur": "initial_erreur",
            "EI": "effet_indesirable",
            "graviteConsequence": "gravite",
        }
    )
    df = df[
        [
            "id",
            "denomination",
            "dci",
            "atc",
            "cause_erreur",
            "nature_erreur",
            "population_erreur",
            "qualif_erreur",
            "lieu_erreur",
            "initial_erreur",
            "effet_indesirable",
            "gravite",
        ]
    ]
    df = df[~df.denomination.isna()]
    df.denomination = df.denomination.apply(lambda x: x.lower().strip() if x else None)
    df.lieu_erreur = df.lieu_erreur.apply(lambda x: NOMS_LIEUX.get(x, x))
    df.population_erreur = df.population_erreur.apply(
        lambda x: "Non renseigné" if not x or x == "NR" else x
    )
    df = df.where(pd.notnull(df), None)
    df.gravite = df.gravite.apply(lambda x: 'Non renseigné' if not x else x)
    return df


def clean_columns(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """
    Put column fields in lower case
    """
    df[col_name] = df[col_name].apply(lambda x: x.lower().strip())
    return df


def upload_cis_from_bdpm(path: str) -> pd.DataFrame:
    """
    Upload RSP CIS table
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read CIS_RSP.txt file and put in dataframe
    col_names = [
        "cis",
        "nom",
        "forme_pharma",
        "voie_admin",
        "statut_amm",
        "type_amm",
        "etat_commercialisation",
        "date_amm",
        "statut_bdpm",
        "num_autorisation",
        "titulaires",
        "surveillance_renforcee",
    ]
    df = pd.read_csv(
        path,
        sep="\t",
        encoding="latin1",
        names=col_names,
        header=None,
        dtype={"cis": str},
    )
    # Put substance_active field in lower case
    df = clean_columns(df, "nom")
    return df


def get_specialite_dataframe() -> pd.DataFrame:
    df = upload_cis_from_bdpm(P_CIS_BDPM)
    df = df.where(pd.notnull(df), None)
    df = df[["cis", "nom"]]
    return df


def get_denom_linked_to_specialite(df: pd.DataFrame, specialite: str) -> pd.DataFrame:
    produit_specialite = specialite.split()[0]
    forme_specialite = specialite.split()[-1]

    # Return dataframe containing denominations that contain:
    # 1) product name (eg: doliprane)
    # 2) pharmaceutical form (eg: comprimé)
    return df[
        (df.denomination.str.startswith(produit_specialite))
        & (df.denomination.str.contains(forme_specialite))
    ]


# # Choix de la spécialité

# In[3]:


specialite = "valium roche 2 mg, comprimé sécable"


# In[4]:


df_mesusage = get_mesusage_dataframe()


# In[5]:


df_spe = get_specialite_dataframe()


# In[6]:


df = get_denom_linked_to_specialite(df_mesusage, specialite)


# In[7]:


list(df.denomination.unique())


# # Graphes

# ##

# In[8]:


BAR_CHART_COLORS = [
    "rgba(51,171,102,1)",
    "rgba(102,192,140,1)",
    "rgba(153,213,179,1)",
    "rgba(204,234,217,1)",
    "rgba(191,213,60,1)",
    "rgba(207,223,109,1)",
    "rgba(223,234,157,1)",
    "rgba(239,244,206,1)",
    "rgba(51,194,214,1)",
    "rgba(102,209,224,1)",
]

BAR_LAYOUT = {
    "xaxis": dict(
        showgrid=False,
        showline=False,
        showticklabels=False,
        zeroline=False,
    ),
    "yaxis": dict(
        showgrid=False,
        showline=False,
        zeroline=False,
        autorange="reversed",
        ticks="outside",
        tickcolor="white",
        ticklen=1,
    ),
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(l=0, r=0, t=0, b=0),
    "barmode": "group",
    "bargap": 0.10,
    "bargroupgap": 0.0,
    "font": {"size": 12, "color": "black"},
}


# In[9]:


df.iloc[0]


# ### Lieu

# In[10]:


df_lieu = df.groupby('lieu_erreur').id.count().reset_index()
df_lieu.id = df_lieu.apply(lambda x: x.id / df_lieu.id.sum() * 100, axis=1)
df_lieu = df_lieu.rename(columns={'id': 'number'})
df_lieu = df_lieu.sort_values(by=['number'], ascending=False)


# In[11]:


fig = go.Figure(
    go.Bar(
        y=df_lieu.lieu_erreur,
        x=df_lieu.number,
        orientation="h",
        marker=dict(color=BAR_CHART_COLORS),
    )
)
fig.update_layout(BAR_LAYOUT)


# ### Population

# In[12]:


df_pop = df.groupby('population_erreur').id.count().reset_index()
df_pop.id = df_pop.apply(lambda x: x.id / df_pop.id.sum() * 100, axis=1)
df_pop = df_pop.rename(columns={'id': 'number'})
df_pop = df_pop.sort_values(by=['number'], ascending=False)


# In[13]:


fig = go.Figure(
    go.Bar(
        y=df_pop.population_erreur,
        x=df_pop.number,
        orientation="h",
        marker=dict(color=BAR_CHART_COLORS),
    )
)
fig.update_layout(BAR_LAYOUT)


# ### Camemberts

# In[14]:


PIE_COLORS = ["#DFD4E5", "#BFAACB", "#5E2A7E"]

PIE_LAYOUT = {
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}


# #### Cause

# In[15]:


df_cause = df.groupby('cause_erreur').id.count().reset_index()
#df_cause.id = df_cause.apply(lambda x: x.id / df_cause.id.sum() * 100, axis=1)
df_cause = df_cause.rename(columns={'id': 'number'})
df_cause = df_cause.sort_values(by=['number'], ascending=False)


# In[16]:


fig = go.Figure(
    go.Pie(
        labels=df_cause.cause_erreur,
        values=df_cause.number,
        name="",
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# #### Nature

# In[17]:


df_nature = df.groupby('nature_erreur').id.count().reset_index()
#df_cause.id = df_cause.apply(lambda x: x.id / df_cause.id.sum() * 100, axis=1)
df_nature = df_nature.rename(columns={'id': 'number'})
df_nature = df_nature.sort_values(by=['number'], ascending=False)


# In[18]:


fig = go.Figure(
    go.Pie(
        labels=df_nature.nature_erreur,
        values=df_nature.number,
        name="",
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)
fig.update_layout(title="Nature de l'erreur", title_x=0, title_y=0.5)

fig.show()


# #### Initial 

# In[19]:


df_init = df.groupby('initial_erreur').id.count().reset_index()
#df_init.id = df_init.apply(lambda x: x.id / df_init.id.sum() * 100, axis=1)
df_init = df_init.rename(columns={'id': 'number'})
df_init = df_init.sort_values(by=['number'], ascending=False)


# In[20]:


fig = go.Figure(
    go.Pie(
        labels=df_init.initial_erreur,
        values=df_init.number,
        name="",
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# #### Gravité

# In[21]:


df_gravite = df.groupby('gravite').id.count().reset_index()
#df_gravite.id = df_gravite.apply(lambda x: x.id / df_gravite.id.sum() * 100, axis=1)
df_gravite = df_gravite.rename(columns={'id': 'number'})
df_gravite = df_gravite.sort_values(by=['number'], ascending=False)


# In[22]:


fig = go.Figure(
    go.Pie(
        labels=df_gravite.gravite,
        values=df_gravite.number,
        name="",
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)
fig.update_layout(title="Gravité du cas", title_x=0, title_y=0.5)

fig.show()


# ### Sunburst

# #### Gravité

# In[23]:


df_cause_gravite = df.groupby(['cause_erreur', 'gravite']).id.count().reset_index()
df_cause_gravite.id = df_cause_gravite.apply(lambda x: x.id / df_cause_gravite.id.sum() * 100, axis=1)
df_cause_gravite = df_cause_gravite.rename(columns={'id': 'pourcentage'})
df_cause_gravite = df_cause_gravite.sort_values(by=['cause_erreur'], ascending=False)


# In[24]:


df_cause_gravite


# In[25]:


import plotly.express as px

fig = px.sunburst(df_cause_gravite, path=['cause_erreur', 'gravite'],
                  values='pourcentage', branchvalues='total')
fig.update_layout(hovermode="x unified")

fig.show()


# In[26]:


df_cause_gravite.gravite.tolist()


# In[27]:


df_cause_gravite.cause_erreur.tolist()


# In[28]:


fig2 =go.Figure(
    go.Sunburst(
        labels=df_cause_gravite.gravite.tolist(),
        parents=df_cause_gravite.cause_erreur.tolist(),
        values=df_cause_gravite.pourcentage.tolist(),
    )
)

fig2.update_layout(margin = dict(t=0, l=0, r=0, b=0))
fig2.show()


# In[29]:


fig2 =go.Figure(
    go.Sunburst(
        labels=fig['data'][0]['labels'].tolist(),
        parents=fig['data'][0]['parents'].tolist(),
        textinfo='label+percent entry',
    )
)

fig2.update_layout(margin = dict(t=0, l=0, r=0, b=0))
fig2.show()


# ### Stacked bar chart

# In[30]:


STACKED_BAR_CHART_LAYOUT = {
    "xaxis": dict(
        showgrid=False,
        showline=False,
        zeroline=False,
    ),
    "yaxis": dict(
        showgrid=False,
        showline=False,
        zeroline=False,
        ticks="outside",
        tickcolor="white",
        ticklen=1,
    ),
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(l=0, r=0, t=0, b=0),
    "font": {"size": 12, "color": "black"},
}


# In[31]:


fig = px.bar(df_cause_gravite, x="cause_erreur", y="pourcentage", color="gravite",
             labels={'pourcentage':'Proportion (%)', 'cause_erreur': "Cause de l'erreur médicamenteuse"},
             color_discrete_sequence=PIE_COLORS)
fig.update_layout(STACKED_BAR_CHART_LAYOUT)

fig.show()


# In[ ]:




