#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sys

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

sys.path.append('/Users/linerahal/Documents/GitHub/datamed/create_database')
from db import connect_db


# In[2]:


engine = connect_db()


# # Choix de la spécialité

# In[3]:


# specialite = "valium roche 2 mg, comprimé sécable"
specialite = "doliprane 500 mg, comprimé"


# In[4]:


df_spe = pd.read_sql("specialite", con=engine)
df_spe = df_spe.set_index("cis")


# In[5]:


cis = df_spe[df_spe.nom == specialite].index[0]


# In[6]:


df_spe[df_spe.nom == specialite]


# # Graphes

# ## Layouts

# In[7]:


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
    ),
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(l=0, r=0, t=0, b=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}


# # Spécialité

# In[8]:


# DOLIPRANE 500 mg, gélule
# cis = "67119691"


# ## ORDEI

# ### Exposition

# In[9]:


df_expo = pd.read_sql("specialite_exposition", con=engine, index_col="cis")
df_expo.loc[cis]


# ### Sexe

# In[10]:


df_sexe = pd.read_sql("specialite_patient_sexe_ordei", con=engine)
df_sexe[df_sexe.cis == cis].head(2)


# ### Âge

# In[11]:


df_age = pd.read_sql("specialite_patient_age_ordei", con=engine)
df_age.head(2)


# In[12]:


fig = go.Figure(
    go.Pie(
        labels=df_age[df_age.cis == cis].age,
        values=df_age[df_age.cis == cis].pourcentage_patients,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Erreurs médicamenteuses

# ### Effets indésirables

# In[13]:


df_ei = pd.read_sql("erreur_med_effet_indesirable", con=engine)
df_ei.head(2)


# In[14]:


df_ei[df_ei.cis == cis]


# ### Population erreurs med

# In[15]:


df_pop = pd.read_sql("erreur_med_population", con=engine)
df_pop.head(2)


# In[16]:


fig = go.Figure(
    go.Pie(
        labels=df_pop[df_pop.cis == cis].population_erreur,
        values=df_pop[df_pop.cis == cis].pourcentage,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ### Cause des erreurs

# In[17]:


df_cause = pd.read_sql("erreur_med_cause", con=engine)
df_cause[df_cause.cis == cis]


# In[18]:


fig = px.bar(
    df_cause[df_cause.cis == cis],
    x="pourcentage",
    y="cis",
    color="cause_erreur",
    labels={'pourcentage':'Proportion (%)', 'cause_erreur': "Cause"},
    color_discrete_sequence=PIE_COLORS,
    orientation="h"
)
fig.update_layout(STACKED_BAR_CHART_LAYOUT)
fig.update_layout(barmode='stack')

fig.show()


# ### Nature des erreurs

# In[19]:


df_nat = pd.read_sql("erreur_med_nature", con=engine)
df_nat[df_nat.cis == cis]


# In[20]:


fig = px.bar(
    df_nat[df_nat.cis == cis],
    x="pourcentage",
    y="cis",
    color="nature_erreur",
    labels={'pourcentage':'Proportion (%)', 'nature_erreur': "Nature"},
    color_discrete_sequence=PIE_COLORS,
    orientation="h"
)
fig.update_layout(STACKED_BAR_CHART_LAYOUT)
fig.update_layout(barmode='stack')

fig.show()


# ### Liste des dénominations d'erreurs médicamenteuses

# In[21]:


df_denom = pd.read_sql("erreur_med_cis_denomination", con=engine)
df_denom[df_denom.cis == cis]


# # Substances actives correspondant à la spécialité

# In[22]:


df_cis_sub = pd.read_sql("specialite_substance", engine)
df_sub = pd.read_sql("substance", engine)


# In[23]:


df = df_cis_sub[df_cis_sub.cis == cis].merge(df_sub, left_on="code_substance", right_on="code", how="left")
df


# In[ ]:




