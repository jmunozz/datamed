#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sys

import folium
import pandas as pd

sys.path.append('/Users/ansm/Documents/GitHub/datamed')

from create_database.models import connect_db


# # Load EDL data

# In[2]:


engine = connect_db()  # establish connection
connection = engine.connect()


# In[3]:


df = pd.read_sql_table('production', connection)

df = df.drop(['dci', 'type_amm', 'sites_production', 'sites_conditionnement_primaire',
              'sites_conditionnement_secondaire', 'sites_importation', 'sites_controle',
              'sites_echantillotheque', 'sites_certification', 'substance_active', 'pgp',
              'filename'], axis=1)

df = df.dropna(how='all')
df = df.drop_duplicates()

df.head(2)


# # Countries

# In[4]:


path = '/Users/ansm/Documents/GitHub/datamed/create_database/data/countries_by_address.csv'
df_address = pd.read_csv(path, sep=';')
df_address.head(1)


# In[5]:


df_pays = pd.read_sql_table('pays', connection)
df_pays = df_pays.rename(columns={'country': 'country_en'})
df_pays.head(1)


# In[6]:


df = df[['cis', 'substance_active_id', 'sites_fabrication_substance_active']]
df = df.merge(df_address, left_on='sites_fabrication_substance_active', right_on='address', how='left')
df = df.drop(['address'], axis=1)

df.head(1)


# In[7]:


countries = df_pays.address.unique()


# In[8]:


api_by_country = [
    {'country': country, 'nb_substances': df[country].sum()} 
    for country in countries
]

df_api_by_country = pd.DataFrame(
    api_by_country, columns=['country', 'nb_substances']
).sort_values(by=['nb_substances'], ascending=False)

df_api_by_country.head(3)


# In[9]:


df_countries = pd.merge(df_api_by_country, df_pays,
                        left_on='country', right_on='address', how='left')
df_countries = df_countries.drop(['address'], axis=1)

len(df_countries), len(df_api_by_country)


# In[10]:


df_countries.head(1)


# In[11]:


state_geo = 'world-countries.json'

m = folium.Map(location=[48, 2], zoom_start=4)

# Add the color for the chloropleth:
folium.Choropleth(
    geo_data=state_geo,
    name='choropleth',
    data=df_countries,
    columns=['country_en', 'nb_substances'],
    key_on='feature.properties.name',
    fill_color='YlOrRd',
    fill_opacity=0.7,
    line_opacity=0.2,
    nan_fill_color=0,
    nan_fill_opacity=0,
    legend_name='Nb de substance actives fabriquees (spe commercialisees en France en 2019)'
).add_to(m)

folium.LayerControl().add_to(m)

m


# # ATC, voie

# In[12]:


df_spe = pd.read_sql_table('specialite', connection)
df_spe = df_spe[['cis', 'name', 'atc', 'voie_admin']]


# In[13]:


# Merge avec df_spe pour récupérer l'ATC et la voie d'administration
df = df.merge(df_spe, on='cis', how='left')


# In[14]:


# Les principales voies d'administration
voies = ['orale', 'intraveineuse', 'cutanée', 'sous-cutanée', 'ophtalmique']


# In[15]:


df.head(1)


# In[16]:


df['atc2'] = df.atc.apply(lambda x: x[:3] if x else None)
df['voie'] = df.voie_admin.apply(lambda x: 'autre' if x not in voies else x)


# In[17]:


df_by_cis = df.groupby(['atc2', 'voie', 'cis']).sum().reset_index()
for country in countries:
    df_by_cis[country] = df_by_cis[country].apply(lambda x: 1 if x > 1 else x)
    
df_atc_voie = df_by_cis.groupby(['atc2', 'voie']).agg({c: 'sum' for c in countries}).reset_index()
df_atc_voie.head(2)
    
# df[df.cis == '60781361']


# In[18]:


country_en_list = df_pays.to_dict(orient='records')
country_en_dict = {d['address'] : d['country_en'] for d in country_en_list}

api_by_country_atc_voie = df_atc_voie.to_dict(orient='records')
api_by_country_atc_voie = [
    {
        'country': country_en_dict[country],
        'nb_substances': d[country],
        'atc2': d['atc2'],
        'voie': d['voie']
    }
    for d in api_by_country_atc_voie
    for country in countries
    if d[country] != 0
]

df_api_by_country = pd.DataFrame(api_by_country_atc_voie)
df_api_by_country.head(3)


# In[19]:


atc2 = 'L01'
voie = 'orale'

state_geo = 'world-countries.json'

m = folium.Map(location=[48, 2], zoom_start=4)

# Add the color for the chloropleth:
folium.Choropleth(
    geo_data=state_geo,
    name='choropleth',
    data=df_api_by_country[(df_api_by_country.atc2 == atc2) & (df_api_by_country.voie == voie)],
    columns=['country', 'nb_substances'],
    key_on='feature.properties.name',
    fill_color='YlOrRd',
    fill_opacity=0.7,
    line_opacity=0.2,
    nan_fill_color=0,
    nan_fill_opacity=0,
    reset=True,
    highlight = True,
    legend_name='ATC {} - voie : {} - Nb de spe ayant au moins un site de fab dans le pays'.format(atc2, voie),
    tooltip=folium.features.GeoJsonTooltip(
        fields=['country','nb_substances'],
        aliases=['Country: ','Nb substances produced'],
        style=("background-color: white; color: #333333; font-family: arial; font-size: 12px; padding: 10px;") 
    )
).add_to(m)

style_function = lambda x: {'fillColor': '#ffffff', 
                            'color':'#000000', 
                            'fillOpacity': 0.1, 
                            'weight': 0.1}

highlight_function = lambda x: {'fillColor': '#000000', 
                                'color':'#000000', 
                                'fillOpacity': 0.50, 
                                'weight': 0.1}
NIL = folium.features.GeoJson(
    state_geo,
    style_function=style_function, 
    control=False,
    highlight_function=highlight_function, 
    tooltip=folium.features.GeoJsonTooltip(
        fields=['name'],
        aliases=['Country: '],
        style=("background-color: white; color: #333333; font-family: arial; font-size: 12px; padding: 10px;") 
    )
)
m.add_child(NIL)
m.keep_in_front(NIL)

folium.LayerControl().add_to(m)

m


# # Par substance active

# In[20]:


df.substance_active_id = df.substance_active_id.apply(lambda x: 4751 if x == 4748 else x)


# In[ ]:


df_nb_sites = df.groupby(['substance_active_id', 'sites_fabrication_substance_active']).sum().reset_index()

country_by_api = [
    {
        'substance_active_id': sa_id,
        'country': country,
        'nb_fabricants': df_nb_sites[df_nb_sites.substance_active_id == sa_id][country].sum()
    }
    for country in countries for sa_id in df_nb_sites.substance_active_id.unique()
    if df_nb_sites[df_nb_sites.substance_active_id == sa_id][country].sum() > 0
]


# In[ ]:


df_api = pd.DataFrame(country_by_api)
df_api.country = df_api.country.apply(lambda x: country_en_dict[x])
df_api.head()


# In[ ]:


# df[(df.substance_active_id == 4751) & (df.chine == 1)]


# In[ ]:


sa_id = 4751

state_geo = 'world-countries.json'

m = folium.Map(location=[48, 2], zoom_start=4)

# Add the color for the chloropleth:
folium.Choropleth(
    geo_data=state_geo,
    name='choropleth',
    data=df_api[df_api.substance_active_id == sa_id],
    columns=['country', 'nb_fabricants'],
    key_on='feature.properties.name',
    fill_color='YlOrRd',
    fill_opacity=0.7,
    line_opacity=0.4,
    nan_fill_color=0,
    nan_fill_opacity=0,
    reset=True,
    highlight = True,
    legend_name='Nombre de sites fabriquant du Paracetamol par pays',
).add_to(m)

folium.LayerControl().add_to(m)

m


# In[ ]:




