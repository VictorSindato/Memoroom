from bs4 import BeautifulSoup
import urllib

url ='https://www.imdb.com/name/nm0642145/episodes/_ajax?title=tt1442437&category=actor&ref_marker=ttfc_fc_cl_i1&start_index=0'
html = urllib.request.urlopen(url)
soup = BeautifulSoup(html,'html.parser')
characters = {}
appearances = []

all_episodes = soup.find_all('div',class_='filmo-episodes')
got_character_name = False
character_name = ''
start_attach = False

for episode_div in all_episodes:
	episode_name = episode_div.a.string
	episode_text = episode_div.get_text()
	if got_character_name == False:
		for i in range(len(episode_text)):
			if start_attach == True:
				if i+3 >= len(episode_text):
					break
				else:
					if episode_text[i+3] == '\n':
						break
					else:
						character_name += episode_text[i+3]
			else:
				if i+3 >= len(episode_text):
					break
				if episode_text[i:i+3]=='...':
					start_attach = True
		got_character_name = True
		appearances.append(episode_name)
	else:
		appearances.append(episode_name)

characters[character_name] = appearances

print(characters)