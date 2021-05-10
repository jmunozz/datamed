#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sys

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime as dt
import unidecode

sys.path.append('/Users/linerahal/Documents/GitHub/datamed/datamed_dash/')
from db import fetch_data


# In[2]:


BAR_CHART_COLORS = [
    "#009640",
    "#66C08C",
    "#99D5B3",
    "#CCEAD9",
    "#AFCA0B",
    "#DFEA9D",
    "#EFF4CE",
    "#CFDF6D",
    "#33C2D6",
    "#66D1E0",
    "#99E1EB",
    "#CCF0F5",
    "#B35AA1",
    "#C683B8"
]


# ## Table ruptures

# In[3]:


df = fetch_data.fetch_table("ruptures", "numero").reset_index()
df.head(2)


# # Nombre de signalements / an

# In[4]:


"{} signalements / an".format(round(len(df) / len(range(2014, dt.now().year + 1))))


# # Signalements par an par classe ATC

# In[5]:


annee = 2019


# In[6]:


df_sig = fetch_data.fetch_table("signalements", "annee")


# In[7]:


df_sig.loc[annee].head(10)


# In[8]:


# set up plotly figure
fig = make_subplots(
    specs=[[{"secondary_y": True}]],
)

# add first bar trace at row = 1, col = 1
fig.add_trace(
    go.Bar(
        x=df_sig.loc[annee].head(10).label,
        y=df_sig.loc[annee].head(10).nb_signalements,
        #orientation="h",
        marker=dict(color=BAR_CHART_COLORS),
        name="Nombre de signalements"
    ),
    secondary_y=False,
)

# add first scatter trace at row = 1, col = 1
fig.add_trace(
    go.Scatter(
        x=df_sig.loc[annee].head(10).label,
        y=df_sig.loc[annee].head(10).nb_presentations,
        line={
            "shape": "spline",
            "smoothing": 1,
            "width": 4,
            "color": "#00B3CC",
        },
        mode="lines",
        name='Nombre de présentations'
    ),
    secondary_y=True,
)

fig.update_layout(
    xaxis=dict(
        showgrid=False,
        showline=False,
        showticklabels=True,
        zeroline=False,
    ),
    yaxis=dict(
        showgrid=False,
        showline=False,
        showticklabels=True,
        zeroline=False,
        ticks="outside", 
        tickcolor='white',
        ticklen=1
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    margin=dict(l=0, r=0, t=0, b=0),
    barmode='group',
    bargap=0.10,
    bargroupgap=0.0,
    font={'size': 12},
    hovermode="x unified",
    hoverlabel={"namelength": -1},
)

#fig.update_xaxes(tickangle=60)
fig.update_yaxes(autorange="reversed")

fig.show()


# # Signalements / an / catégorie

# In[9]:


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


# In[10]:


COLORS = ["#009640", "#00B3CC"]

CURVE_LAYOUT = {
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "hovermode": "x unified",
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "hoverlabel":{"namelength": -1},
}


# In[11]:


df_annee = df.groupby(['annee', 'classification']).numero.count().reset_index()
df_annee = df_annee.rename(columns={'numero': 'nb_signalements'})


# In[12]:


df_annee.head()


# In[13]:


fig = make_subplots()

for idx, status in enumerate(["rupture", "risque de rupture"]):
    df_status = df_annee[df_annee.classification == status]
    fig.add_trace(
        SingleCurve(df_status.annee, df_status.nb_signalements, status, COLORS[idx])
    )

fig.update_layout(CURVE_LAYOUT)

fig.show()


# # Statut des dossiers circuit ville / hôpital

# In[14]:


circuit = "hôpital"


# In[15]:


COLORS = ["#5E2A7E", "#009640"]


# In[16]:


df_circuit = df[df.circuit == circuit].groupby(["annee", "etat"]).numero.count().reset_index()
df_circuit = df_circuit.rename(columns={'numero': 'nombre'})
df_circuit.head(2)


# In[17]:


fig = make_subplots()

for idx, e in enumerate(["ouvert", "clôturé"]):
    df_etat = df_circuit[df_circuit.etat == e]
    fig.add_trace(
        SingleCurve(df_etat.annee, df_etat.nombre, e, COLORS[idx])
    )

fig.update_layout(CURVE_LAYOUT)

fig.show()


# # Évolution des ruptures circuit ville / hôpital

# In[18]:


df_rupture_circuit = df[
    (df.circuit == circuit) & (df.classification == "rupture")
].groupby("annee").numero.count().reset_index()
df_rupture_circuit = df_rupture_circuit.rename(columns={'numero': 'nombre_ruptures'})
df_rupture_circuit.head(2)


# In[19]:


fig = go.Figure(
    SingleCurve(df_rupture_circuit.annee, df_rupture_circuit.nombre_ruptures, "", "#00B3CC")
)

fig.update_layout(CURVE_LAYOUT)

fig.show()


# # Motifs de rupture

# In[20]:


df_cause = df.groupby(["annee", "cause"]).numero.count().reset_index()
df_cause = df_cause.rename(columns={"numero": "nombre_signalements"})


# In[21]:


df_cause.head()


# # Test recherche spécialité

# In[22]:


cis = "69766923"


# In[23]:


df_spe = fetch_data.fetch_table("specialite", "cis")


# In[24]:


specialite = df_spe.loc[cis].nom


# In[25]:


produit = specialite.split()[0]
forme = specialite.split()[-1]


# In[26]:


df_spe.head(1)


# In[27]:


df = df.merge(df_spe.reset_index()[["cis", "nom"]], on="nom", how="left")


# ### Présentation

# In[28]:


df_pres = fetch_data.fetch_table("presentation", "cip13").reset_index()


# In[29]:


df_pres.head(1)


# In[30]:


df = df.merge(df_pres[["cip13", "cis"]], on="cip13", how="left")


# ### Récupérer ruptures liées à la spécialité

# In[31]:


specialite


# In[32]:


df[(df.cis == cis) | df.nom.apply(lambda x: x.split()[0] == produit)]


# In[ ]:


df[df.cis_x.notnull()]


# In[ ]:




