#!/usr/bin/env python
# coding: utf-8

# In[98]:


import sys

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

sys.path.append('/Users/linerahal/Documents/GitHub/datamed/create_database')
from db import connect_db


# In[99]:


engine = connect_db()


# # Choix de la spécialité

# In[100]:


# specialite = "valium roche 2 mg, comprimé sécable"
specialite = "doliprane 500 mg, comprimé"


# In[101]:


df_spe = pd.read_sql("specialite", con=engine)
df_spe = df_spe.set_index("cis")


# In[102]:


cis = df_spe[df_spe.nom == specialite].index[0]


# # Graphes

# ##

# In[103]:


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


# ### Lieu

# In[104]:


df_lieu = pd.read_sql("erreur_med_lieu", con=engine)
df_lieu = df_lieu[df_lieu.cis == cis].sort_values(by=["pourcentage"], ascending=False)


df_lieu


# In[105]:


fig = go.Figure(
    go.Bar(
        y=df_lieu.lieu_erreur,
        x=df_lieu.pourcentage,
        orientation="h",
        marker=dict(color=BAR_CHART_COLORS),
    )
)
fig.update_layout(BAR_LAYOUT)


# In[106]:


fig = go.Figure(
    go.Pie(
        labels=df_lieu.lieu_erreur,
        values=df_lieu.pourcentage,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)
fig.update_layout(title="Lieu de l'erreur", title_x=0, title_y=0.5)

fig.show()


# ### Population

# In[107]:


df_pop = pd.read_sql("erreur_med_population", con=engine)
df_pop = df_pop[df_pop.cis == cis].sort_values(by=["pourcentage"], ascending=False)

df_pop


# In[108]:


fig = go.Figure(
    go.Bar(
        y=df_pop.population_erreur,
        x=df_pop.pourcentage,
        orientation="h",
        marker=dict(color=BAR_CHART_COLORS),
    )
)
fig.update_layout(BAR_LAYOUT)


# In[109]:


fig = go.Figure(
    go.Pie(
        labels=df_pop.population_erreur,
        values=df_pop.pourcentage,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)
fig.update_layout(title="Population", title_x=0, title_y=0.5)

fig.show()


# ### Camemberts

# In[110]:


PIE_COLORS = ["#DFD4E5", "#BFAACB", "#5E2A7E"]

PIE_LAYOUT = {
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}


# #### Cause

# In[111]:


df_cause = pd.read_sql("erreur_med_cause", con=engine)
df_cause = df_cause[df_cause.cis == cis].sort_values(by=["pourcentage"], ascending=False)

df_cause


# In[112]:


fig = go.Figure(
    go.Pie(
        labels=df_cause.cause_erreur,
        values=df_cause.pourcentage,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)
fig.update_layout(title="Cause de l'erreur", title_x=0, title_y=0.5)

fig.show()


# #### Nature

# In[113]:


df_nature = pd.read_sql("erreur_med_nature", con=engine)
df_nature = df_nature[df_nature.cis == cis].sort_values(by=["pourcentage"], ascending=False)

df_nature


# In[114]:


fig = go.Figure(
    go.Pie(
        labels=df_nature.nature_erreur,
        values=df_nature.pourcentage,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)
fig.update_layout(title="Nature de l'erreur", title_x=0, title_y=0.5)

fig.show()


# #### Initial 

# In[115]:


df_init = pd.read_sql("erreur_med_initial", con=engine)
df_init = df_init[df_init.cis == cis].sort_values(by=["pourcentage"], ascending=False)

df_init


# In[116]:


fig = go.Figure(
    go.Pie(
        labels=df_init.initial_erreur,
        values=df_init.pourcentage,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)
fig.update_layout(title="Erreur initiale", title_x=0, title_y=0.5)

fig.show()


# #### Gravité

# In[ ]:


df_gravite = df.groupby('gravite').id.count().reset_index()
#df_gravite.id = df_gravite.apply(lambda x: x.id / df_gravite.id.sum() * 100, axis=1)
df_gravite = df_gravite.rename(columns={'id': 'number'})
df_gravite = df_gravite.sort_values(by=['number'], ascending=False)


# In[ ]:


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

# In[ ]:


df_cause_gravite = df.groupby(['cause_erreur', 'gravite']).id.count().reset_index()
df_cause_gravite.id = df_cause_gravite.apply(lambda x: x.id / df_cause_gravite.id.sum() * 100, axis=1)
df_cause_gravite = df_cause_gravite.rename(columns={'id': 'pourcentage'})
df_cause_gravite = df_cause_gravite.sort_values(by=['cause_erreur'], ascending=False)


# In[ ]:


df_cause_gravite


# In[ ]:



fig = px.sunburst(df_cause_gravite, path=['cause_erreur', 'gravite'],
                  values='pourcentage', branchvalues='total')
fig.update_layout(hovermode="x unified")

fig.show()


# In[ ]:


df_cause_gravite.gravite.tolist()


# In[ ]:


df_cause_gravite.cause_erreur.tolist()


# In[ ]:


fig2 =go.Figure(
    go.Sunburst(
        labels=df_cause_gravite.gravite.tolist(),
        parents=df_cause_gravite.cause_erreur.tolist(),
        values=df_cause_gravite.pourcentage.tolist(),
    )
)

fig2.update_layout(margin = dict(t=0, l=0, r=0, b=0))
fig2.show()


# In[ ]:


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

# In[117]:


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


# #### Cause

# In[118]:


df_cause = pd.read_sql("erreur_med_cause", con=engine)
df_cause = df_cause[df_cause.cis == cis].sort_values(by=["pourcentage"], ascending=False)

df_cause


# In[119]:


fig = px.bar(df_cause, x="cause_erreur", y="pourcentage", color="gravite",
             labels={'pourcentage':'Proportion (%)', 'cause_erreur': "Cause de l'erreur médicamenteuse"},
             color_discrete_sequence=PIE_COLORS)
fig.update_layout(STACKED_BAR_CHART_LAYOUT)

fig.show()


# #### Nature

# In[120]:


df_nature = pd.read_sql("erreur_med_nature", con=engine)
df_nature = df_nature[df_nature.cis == cis].sort_values(by=["pourcentage"], ascending=False)

df_nature


# In[121]:


fig = px.bar(df_nature, x="nature_erreur", y="pourcentage", color="gravite",
             labels={'pourcentage':'Proportion (%)', 'cause_erreur': "Cause de l'erreur médicamenteuse"},
             color_discrete_sequence=PIE_COLORS)
fig.update_layout(STACKED_BAR_CHART_LAYOUT)

fig.show()


# #### Initial

# In[122]:


df_init = pd.read_sql("erreur_med_initial", con=engine)
df_init = df_init[df_init.cis == cis].sort_values(by=["pourcentage"], ascending=False)

df_init


# In[123]:


fig = px.bar(df_init, x="initial_erreur", y="pourcentage", color="gravite",
             labels={'pourcentage':'Proportion (%)', 'cause_erreur': "Cause de l'erreur médicamenteuse"},
             color_discrete_sequence=PIE_COLORS)
fig.update_layout(STACKED_BAR_CHART_LAYOUT)

fig.show()


# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:




