# .py scraping with drop-down bug

from bs4 import BeautifulSoup
import urllib

html = urllib.request.urlopen('https://www.imdb.com/title/tt1442437/fullcredits?ref_=tt_ql_1')
SoupTree = BeautifulSoup(html,'html.parser')

table_container = SoupTree.find('table',class_='cast_list')
rows_container = table_container.find_all('tr',class_='odd',limit=18) + table_container.find_all('tr',class_='even',limit=18)

appearances = {}
count = 0

for row in rows_container:
	if count==0:
		character_attr = {}
		character = row.find('td',class_='character').find('a').string
		occurrences = row.find('td',class_='character').find('a',class_='toggle-episodes').get_text() #!!
		no_times = ''
		for c in occurrences:
			if c==' ':
				break
			else:
				no_times+=c
		occurrences = int(no_times)
		character_attr["occurrences"] = occurrences
		count = 1
	elif count==1:
		# Get episodes
		# print(row.find('td'))
		episodes_container = row.find('td')
		print(episodes_container)
		episodes = []
		for div in episodes_container:
			try:
				episode = div.get_text()
				episodes.append(episode)
			except:
				pass
		character_attr["episodes"] = episodes
		appearances[character] = character_attr
		count = 0

print(appearances)