#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sys

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

sys.path.append('/Users/linerahal/Documents/GitHub/datamed/create_database')
from db import connect_db


# In[2]:


engine = connect_db()


# # Choix de la substance

# In[3]:


substance = "paracétamol"


# In[4]:


df_sub = pd.read_sql("substance", con=engine, index_col="code")


# In[5]:


code = df_sub[df_sub.nom == substance].index[0]


# # Graphes

# ## Layouts

# In[6]:


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

PIE_COLORS = ["#F599B5", "#FACCDA", "#EF6690"]

PIE_LAYOUT = {
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    #"hovermode": False,
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

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
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

CURVE_LAYOUT = {
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "yaxis2_showgrid": False,
    "hovermode": "x unified",
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}


# # Substance

# In[7]:


substance, code


# ## ORDEI

# ### Exposition

# In[8]:


df_expo = pd.read_sql("substance_exposition", con=engine, index_col="code")
df_expo.loc[code]


# ### Sexe

# In[9]:


df_sexe = pd.read_sql("substance_patient_sexe_ordei", con=engine, index_col="code")
df_sexe.loc[code]


# ### Âge

# In[10]:


df_age = pd.read_sql("substance_patient_age_ordei", con=engine, index_col="code")
df_age.loc[code]


# In[11]:


PIE_LAYOUT = {
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

fig = go.Figure(
    go.Pie(
        labels=df_age.loc[code].age,
        values=df_age.loc[code].pourcentage_patients,
        marker_colors=PIE_COLORS,
        hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ### Déclarations

# In[12]:


df_decla = pd.read_sql("substance_ordei", engine, index_col="code")


# In[13]:


declarations = df_decla.loc[code].cas.unique()[0]
declarations


# ### Taux déclaration

# In[14]:


taux_cas = df_decla.loc[code].taux_cas.unique()[0]
taux_cas


# ### Courbes

# In[15]:


df_decla.loc[code]


# In[16]:


fig = make_subplots(specs=[[{"secondary_y": True}]])

if df_decla.loc[code].cas_annee.min() > 10:
    fig.add_trace(
        go.Scatter(
            x=df_decla.loc[code].annee,
            y=df_decla.loc[code].cas_annee,
            mode="lines",
            name="Cas déclarés",
            line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#F599B5"},
        ),
        secondary_y=False,
    )

fig.add_trace(
    go.Scatter(
        x=df_decla.loc[code].annee,
        y=df_decla.loc[code].conso_annee,
        mode="lines",
        name="Patients traités",
        line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#EA336B"},
        hoverlabel={"namelength" :-1},
        hovertemplate="%{y:int}",
    ),
    secondary_y=True,
)

fig.update_yaxes(title_text="Déclarations d'effets indésirables",
                 color="#F599B5",
                 secondary_y=False)
fig.update_yaxes(title_text="Patients traités", color="#EA336B", secondary_y=True)
fig.update_xaxes(title_text="Années")
fig.update_xaxes(nticks=len(df_decla.loc[code]))
fig.update_layout(CURVE_LAYOUT)
fig.show()


# ### Notificateurs

# In[17]:


df_notif = pd.read_sql("substance_notif_ordei", con=engine, index_col="code")
df_notif.loc[code]


# ### Effets indésirables par système d'organe
# #### On n'affiche que le top 10

# In[18]:


df_soc = pd.read_sql("substance_soclong_ordei", con=engine, index_col="code")
df_soc.loc[code].sort_values(by="pourcentage_cas", ascending=False)


# In[19]:


top_soc_long = df_soc.loc[code].sort_values(by="pourcentage_cas", ascending=False).head(10).soc_long.tolist()


# In[20]:


TREE_COLORS = [
    "#E50046",
    "#EA336B",
    "#EF6690",
    "#F599B5",
    "#FACCDA",
    "#A03189",
    "#B35AA1",
    "#C683B8",
    "#D9ADD0",
    "#ECD6E7",
]

fig = px.treemap(
    df_soc.loc[code].sort_values(by="pourcentage_cas", ascending=False).head(10),
    path=["soc_long"],
    values="pourcentage_cas",
    color_discrete_sequence=TREE_COLORS,
    hover_name="soc_long",
)

fig.update_layout(
    {
        "xaxis_showgrid": False,
        "yaxis_showgrid": False,
        "hovermode": "x unified",
        "plot_bgcolor": "#FAFAFA",
        "paper_bgcolor": "#FAFAFA",
        "margin": dict(t=0, b=0, l=0, r=0),
        "font": {"size": 12, "color": "black"},
        "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    }
)

fig.update_traces(texttemplate="%{label}<br>%{value:.0f}%", textposition='middle center', textfont_size=18,
                 hovertemplate='<b>%{label}</b> <br> %{value:.0f}%')
#fig.update_layout(uniformtext=dict(minsize=14, mode="show"))
#fig.update_layout(font={"size": 18})

fig.show()


# ### Effets indésirables par système d'organe + liste des HLT

# #### Ici, le fait de cliquer sur un des carrés soc_long ouvrira une modale avec le treemap des effets HLT correspondant à ce soc_long
# #### On n'affiche que le top 10

# In[21]:


# Sélection d'un soc_long
soc_long = "Affections de la peau et du tissu sous-cutané"


# In[22]:


df_hlt = pd.read_sql("substance_hlt_ordei", con=engine, index_col="code")


# In[23]:


df_hlt[df_hlt.soc_long == soc_long].loc[code].sort_values(by="pourcentage_cas", ascending=False)


# In[24]:


fig = px.treemap(
    df_hlt[df_hlt.soc_long == soc_long]
    .loc[code]
    .sort_values(by="pourcentage_cas", ascending=False)
    .head(10),
    path=["soc_long", "effet_hlt"],
    values="pourcentage_cas",
    color_discrete_sequence=TREE_COLORS,
    hover_name="effet_hlt"
)

fig.update_layout(
    {
        "xaxis_showgrid": False,
        "yaxis_showgrid": False,
        "hovermode": "x unified",
        "plot_bgcolor": "#FAFAFA",
        "paper_bgcolor": "#FAFAFA",
        "margin": dict(t=0, b=0, l=0, r=0),
        "font": {"size": 12, "color": "black"},
        "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    }
)

fig.update_traces(texttemplate="%{label}<br>%{value:.0f}%", textposition='middle center', textfont_size=18,
                 hovertemplate='<b>%{label}</b> <br> %{value:.0f}%')

fig.show()


# #### Treemap plus complexe

# In[25]:


df_hlt = pd.read_sql("substance_hlt_ordei", con=engine, index_col="code").reset_index()
df_soc = pd.read_sql("substance_soclong_ordei", con=engine, index_col="code")
df_soc = df_soc.loc[code].sort_values(by="pourcentage_cas", ascending=False).head(5).reset_index()

df_soc = df_soc.merge(df_hlt, on=["code", "soc_long"], how="left", suffixes=('_soclong', '_hlt'))
df_soc.pourcentage_cas_hlt = df_soc.pourcentage_cas_soclong * df_soc.pourcentage_cas_hlt / 100

df_soc.pourcentage_cas_hlt = df_soc.apply(
    lambda x: x.pourcentage_cas_hlt
    if x.effet_hlt in df_soc[df_soc.soc_long == x.soc_long].sort_values(
        by="pourcentage_cas_hlt", ascending=False
    ).head(5).effet_hlt.unique()
    else None,
    axis=1
)

df_soc = df_soc.set_index("code")


# In[26]:


fig = px.treemap(
    #df_hlt[df_hlt.soc_long == soc_long]
    df_soc
    .loc[code]
    .sort_values(by="pourcentage_cas_hlt", ascending=False),
    path=["soc_long", "effet_hlt"],
    values="pourcentage_cas_hlt",
    color_discrete_sequence=TREE_COLORS,
    hover_name="effet_hlt"
)

fig.update_layout(
    {
        "xaxis_showgrid": False,
        "yaxis_showgrid": False,
        "hovermode": "x unified",
        "plot_bgcolor": "#FAFAFA",
        "paper_bgcolor": "#FAFAFA",
        "margin": dict(t=0, b=0, l=0, r=0),
        "font": {"size": 12, "color": "black"},
        "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    }
)

fig.update_traces(texttemplate="%{label}<br>%{value:.0f}%", textposition='middle center', textfont_size=18,
                 hovertemplate='<b>%{label}</b> <br> %{value:.0f}%')

fig.show()


# ### Cas graves

# In[27]:


dfg = pd.read_sql("substance_cas_grave_ordei", con=engine, index_col="code")


# In[28]:


dfg.head()


# In[29]:


PIE_LAYOUT = {
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

fig = go.Figure(
    go.Pie(
        labels=dfg.loc[code].grave,
        values=dfg.loc[code].cas,
        marker_colors=PIE_COLORS,
        hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
    )
).update_layout(PIE_LAYOUT)

fig.show()


# In[ ]:




