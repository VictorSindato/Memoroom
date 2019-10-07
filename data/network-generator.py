import json
import os
import networkx as nx
from networkx.readwrite import json_graph 


with open('characters.json') as file:
   # Converting json object to python dictionary
   data = json.load(file)

family_groups = []

''' Testing purposes '''
color_mapping = {"Delgado":0,"Dunphy":1,"Other":2,"Pritchett":3,"Ramirez":4,"Tucker":5,"Tucker-Pritchett":6}

for character,profile in data.items():
   data[character]["color_mapping"] = 0
   if type(profile["group"])==str:
      data[character]["color_mapping"] = color_mapping[profile["group"]]
   else:
      data[character]["color_mapping"] = color_mapping[profile["group"][0]]

co_appearance = {}

character_list = list(data)

for character in character_list:
   try:
      os.mkdir("./Characters/Individual/"+character)
   except FileExistsError:
      print("Folder ",character," already exists")

co_appearances = 0

for character in character_list:
   data[character]["co_appearances"] = {}
   for actor, profile in data.items():
      if character==actor:
         pass
      else:
         standard = data[character]["episodes"]
         compared = data[actor]["episodes"]
         for s_episode in standard:
            for c_episode in compared:
               if s_episode==c_episode:
                  co_appearances += 1
               else:
                  pass
         data[character]["co_appearances"][actor] = co_appearances
         co_appearances = 0

attribute_list = ["age","appearances","caregiver","gender","group","origin","profileImage","color_mapping"]

graph = nx.Graph(name="Modern Family", node_attributes=attribute_list)

for character, profile in data.items():
   for co_character, episodes_together in profile["co_appearances"].items():
      graph.add_edge(character,co_character, weight=episodes_together)

   display_name = ""
   for i in range(len(character)):
      if character[i] == "_":
         display_name += " "
      else:
         display_name += character[i]

   graph.add_node(character)
   graph.nodes[character]["display_name"] = display_name
   for attribute, value in profile.items():
      if attribute in attribute_list:
         graph.nodes[character][attribute] = value
      graph.nodes[character]["ego"] = False
      graph.nodes[character]["profileImage"] = "./Characters/ProfileImages/"+character+"/2.jpg"

data = json_graph.node_link_data(graph)

with open('network.json','w') as file:
   # Converting networkx object to json file
   json.dump(data,file,indent=4,ensure_ascii=False)