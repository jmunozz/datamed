#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sys

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

sys.path.append('/Users/linerahal/Documents/GitHub/datamed/datamed_dash/')
from db import fetch_data


# # Choix de la spécialité

# In[2]:


# specialite = "valium roche 2 mg, comprimé sécable"
specialite = "doliprane 500 mg, comprimé"


# In[3]:


df_spe = fetch_data.fetch_table("specialite", "cis")


# In[4]:


cis = "60234100"   # df_spe[df_spe.nom == specialite].index[0]


# In[5]:


df_spe[df_spe.nom == specialite]


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

PIE_COLORS = ["#DFD4E5", "#BFAACB", "#5E2A7E"]

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
        visible=False,
        showticklabels=False,
    ),
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(l=0, r=0, t=0, b=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "barmode": "stack",
}


# # Spécialité

# In[7]:


# DOLIPRANE 500 mg, gélule
# cis = "67119691"


# ## ORDEI

# ### Exposition

# In[8]:


df_expo = fetch_data.fetch_table("specialite_exposition", "cis")
df_expo.loc[cis].exposition


# ### Sexe

# In[9]:


df_sexe = fetch_data.fetch_table("specialite_patient_sexe_ordei", "cis")
df_sexe.loc[cis].head(2)


# ### Âge

# In[10]:


df_age = fetch_data.fetch_table("specialite_patient_age_ordei", "cis")
df_age.head(2)


# In[11]:


fig = go.Figure(
    go.Pie(
        labels=df_age.loc[cis].age,
        values=df_age.loc[cis].pourcentage_patients,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Erreurs médicamenteuses

# ### Effets indésirables

# In[12]:


df_ei = fetch_data.fetch_table("erreur_med_effet_indesirable", "cis")
df_ei.head(2)


# In[13]:


df_ei.loc[cis]


# ### Population erreurs med

# In[14]:


df_pop = fetch_data.fetch_table("erreur_med_population", "cis")
df_pop.head(2)


# In[15]:


fig = go.Figure(
    go.Pie(
        labels=df_pop.loc[cis].population_erreur,
        values=df_pop.loc[cis].pourcentage,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ### Cause des erreurs

# In[16]:


df_cause = fetch_data.fetch_table("erreur_med_cause", "cis")
df_cause.loc[cis]


# In[17]:


fig = px.bar(
    df_cause.loc[cis],
    x="pourcentage",
    color="cause_erreur",
    labels={'pourcentage':'Proportion (%)', 'cause_erreur': "Cause"},
    color_discrete_sequence=PIE_COLORS,
    orientation="h",
    height=250,
)
fig.update_layout(STACKED_BAR_CHART_LAYOUT)

fig.show()


# ### Nature des erreurs

# In[18]:


df_nat = fetch_data.fetch_table("erreur_med_nature", "cis")
df_nat.loc[cis]


# In[19]:


fig = px.bar(
    df_nat.loc[cis],
    x="pourcentage",
    color="nature_erreur",
    labels={'pourcentage':'Proportion (%)', 'nature_erreur': "Nature"},
    color_discrete_sequence=PIE_COLORS,
    orientation="h"
)
fig.update_layout(STACKED_BAR_CHART_LAYOUT)

fig.show()


# ### Liste des dénominations d'erreurs médicamenteuses

# In[20]:


df_denom = fetch_data.fetch_table("erreur_med_cis_denomination", "cis")
df_denom.loc[cis].columns


# # Substances actives correspondant à la spécialité

# In[21]:


df_cis_sub = fetch_data.fetch_table("specialite_substance", "cis").reset_index()
df_sub = fetch_data.fetch_table("substance", "code").reset_index()


# In[22]:


df = df_cis_sub[df_cis_sub.cis == cis].merge(df_sub, left_on="code_substance", right_on="code", how="left")


# In[23]:


substances_list = df.nom.unique()


# In[24]:


substances_list[0].capitalize()


# In[ ]:




