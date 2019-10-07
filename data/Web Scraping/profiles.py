from bs4 import BeautifulSoup
import urllib
import json
import string
import ast

cast = ['Alex_Dunphy','Andy_Bailey','Cameron_Tucker','Claire_Dunphy','Dylan','Frank_Dunphy','Gloria_Pritchett','Haley_Dunphy','Jay_Pritchett','Joe_Pritchett','Lily_Tucker-Pritchett','Longines','Luke_Dunphy','Manny_Delgado','Mitchell_Pritchett','Pam_Tucker','Phil_Dunphy','Reuben']

def get_attr(characters):

	family = {}
	
	for character in characters:

		character_attributes = {}

		html = urllib.request.urlopen('http://modernfamily.wikia.com/wiki/'+character)
		SoupTree = BeautifulSoup(html,'html.parser')

		####################RELATIONSHIPS########################

		# Going down the soup tree for the right 'div'
		wrapper = SoupTree.find('div',class_='WikiaArticle')
		wrapper_child_1 = wrapper.find('div',id='mw-content-text') 
		wrapper_child_2 = wrapper_child_1.find('div',style='width:250px; float:right; clear:right; margin:1em 0 1em 1em; -moz-border-radius:10px; border:1px solid #B30000; background:#AAAAA; padding:10px')
		
		wrapper_child_2_contents = []

		for child in wrapper_child_2.children:
			if child=='\n':
				pass
			else:
				wrapper_child_2_contents.append(child)

		wrapper_child_2.contents = wrapper_child_2_contents

		# 'div' enclosing character's full name
		name_wrapper = wrapper_child_2.contents[5].find('div',style='width:170px;float:left;text-align:right;')
		name = name_wrapper.string

		#'div' enclosing character's age
		origin_wrapper = wrapper_child_2.contents[8].find('div',style='width:220px;float:left;text-align:right;')
		got_age = False
		for origin in origin_wrapper.stripped_strings:
			if got_age==False:
				try:
					age = 2018 - int(origin[len(origin)-4:len(origin)])
					got_age = True
				except ValueError:
					hometown = origin
			else:
				hometown = origin

		# 'div' enclosing character's gender
		gender_wrapper = wrapper_child_2.contents[7].find('div',style='width:170px;float:left;text-align:right;border-top:1px solid #B30000;')
		gender = gender_wrapper.string

		# 'div' enclosing character's appearances
		appearances = []
		appearances_wrapper = wrapper_child_2.contents[11].find('div',style='width:220px;float:left;text-align:right;')
		for link in appearances_wrapper.find_all('a'):
			appearances.append(link.string)

		# 'div' enclosing family relationships
		relationships_wrapper = wrapper_child_2.contents[10].find('div',style='width:170px;float:left;text-align:right;')

		'''Generating list of all links enclosed in the relationships_wrapper 'div'''
		relationships_links = relationships_wrapper.find_all('a')

		relationships = {}

		'''Creating dictionary mapping cast and character's relationship to them'''
		for link in relationships_links:
			raw_value = link.next_sibling
			if raw_value==None:
				raw_value = link.get("title")
			relationships[link.string] = raw_value

		'''Formatting, Cleaning up the dictionary's values'''
		for key,value in relationships.items():
			hyphen_found = False
			
			if '-' not in value:
				pass
			
			else:
				
				for c in value:
					if c == '-' and hyphen_found==False:
						hyphen_found = True
						formatted_value = ''
					elif c == '-' and hyphen_found==True:
						formatted_value += c
					elif c!='-' and hyphen_found==False:
						pass
					else:
						formatted_value += c
				
				relationships[key] = formatted_value

		############---ATTRIBUTES---##############
		character_attributes["full_name"] = name
		character_attributes["age"] = age
		character_attributes["gender"] = gender
		character_attributes["origin"] = hometown
		character_attributes["relationships"] = relationships
		character_attributes["appearances"] = appearances
		
		# Putting everything together!
		family[character] = character_attributes
	
	return family


modern_family = get_attr(cast)

# Convert to json (before proper formatting)
s = str(modern_family)
new_s = s.replace("'",'"')
print(type(ast.literal_eval(new_s)))