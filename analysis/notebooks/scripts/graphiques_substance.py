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


# # Substance

# In[7]:


substance, code


# ## ORDEI

# ### Exposition

# In[8]:


df_expo = pd.read_sql("substance_ordei", con=engine, index_col="code")
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


fig = go.Figure(
    go.Pie(
        labels=df_age.loc[code].age,
        values=df_age.loc[code].pourcentage_patients,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
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
    fig.add_trace(go.Scatter(x=df_decla.loc[code].annee, y=df_decla.loc[code].cas_annee,
                             mode='lines',
                             name='Cas déclarés',
                             line={'shape': 'spline', 'smoothing': 1, 'width': 4, 'color': "#F599B5"}),
                  secondary_y=False)

fig.add_trace(go.Scatter(x=df_decla.loc[code].annee, y=df_decla.loc[code].conso_annee,
                         mode='lines',
                         name='Patients traités',
                         line={'shape': 'spline', 'smoothing': 1, 'width': 4, 'color': "#EA336B"}),
              secondary_y=True)

fig.update_yaxes(title_text="Déclarations d'effets indésirables", secondary_y=False)
fig.update_yaxes(title_text="Patients traités", secondary_y=True)
fig.update_xaxes(title_text="Années")

fig.update_xaxes(nticks=len(df_decla.loc[code]))
fig.update_layout(xaxis_showgrid=False, yaxis_showgrid=True, yaxis2_showgrid=False, plot_bgcolor='rgba(0,0,0,0)')
fig.show()


# ### Notificateurs

# In[17]:


df_notif = pd.read_sql("substance_notif_ordei", con=engine, index_col="code")
df_notif.loc[code]


# ### Effets indésirables par système d'organe

# In[18]:


df_soc = pd.read_sql("substance_soclong_ordei", con=engine, index_col="code")
df_soc.loc[code].sort_values(by="pourcentage_cas", ascending=False)


# In[19]:


TREE_COLORS = ["#E50046", "#EA336B", "#EF6690", "#F599B5", "#FACCDA",
               "#A03189", "#B35AA1", "#C683B8", "#D9ADD0", "#ECD6E7"]

fig = px.treemap(
    df_soc.loc[code].sort_values(by="pourcentage_cas", ascending=False).head(10),
    path=["soc_long"],
    values='pourcentage_cas',
    color_discrete_sequence=TREE_COLORS,
)

fig.update_layout({
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "hovermode": "x unified",
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
})

fig.data[0].textinfo = 'label+value'

fig.show()


# In[ ]:




