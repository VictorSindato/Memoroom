

# Memoroom
Memoroom is an ongoing project whose current focus is developing an interface for Alzheimer’s patients that'll enable interaction with and reinforcement of their memories about objects, people, and places. The motivation behind the project is designing an engaging, reliable, and fluid interface that can be used on a daily basis to counter the memory loss brought resulting from Alzheimer’s disease. Thus, the core components of memoroom are its data-driven interactive visualizations for graphs.

<p align="center">
	<img src="https://github.com/VictorSindato/Memoroom/blob/master/assets/memoroom.jpg" alt="memoroom interface"/>
</p>

## Getting Started

### Modules:
>
> <u>**d3.js**</u>:
> The d3.js library, developed by Mike Bostock, is extensively used in creating data-driven visualizations.
> A working knowledge of this library is crucial in being able to make sense of the code.
>
> *Learning resources*:
> - [Documentation](https://github.com/d3/d3/wiki)
> - [Tutorials](https://github.com/d3/d3/wiki/Tutorials)
> - d3 force layout :  [d3-force repo](https://github.com/d3/d3-force), [d3-v4](https://github.com/d3/d3/wiki/Tutorials#d3-v4), [extra-features](http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/)
>
> <u>**networkx**</u>:
> networkx is an easy-to-use python library used for creating graphs from scratch or generating graphs using pre-existing data stored in json, csv, ... files. In the context of this project, networkx has been used for generating graphs relating objects, people, and places. These graphs then become the engines driving the visualizations that the patients interact with.
>
> *Learning resources*:
> - [Documentation](https://networkx.github.io/documentation/stable/reference/index.html)
> - [Tutorials](https://networkx.github.io/documentation/stable/tutorial.html)
>
><u>**beautifulsoup4**</u>: 
>Beautiful Soup is a Python library for pulling data out of HTML and XML files. In this project, beautiful soup was crucial in scraping each of the modern family character's profile information such as full name, age, origin, and number of appearances.
>*Learning resources*:
> - [Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
>  - [Tutorials](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#quick-start)




### Installing modules:  
> __networkx__ : Visit <a href="https://networkx.github.io/documentation/stable/install.html">here</a> for detailed instructions.
> 
> __d3.js__ : Visit <a href="https://github.com/d3/d3/wiki#installing">here</a> for detailed instructions.
>
>__dat.gui.js__ : dat.gui, a lightweight controller library for javascript, is already included in this repo in the folder 'libraries'. It's included as a link to the <a href="https://github.com/dataarts/dat.gui"> original dat.gui repo</a> .
>
>__beautifulsoup4__: Visit [here](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#installing-beautiful-soup) for detailed instructions.

## Navigating repo:
The _data_ folder contains 3 files that were used, in one way or another, to generate or store the data that is behind the visualizations.

__characters.json__: This json file stores the characters’ profiles. A character’s name and their profile are stored in a key-value relationship. The profile stores character attributes such as full name, age, origin, relationships, and episodes they’ve appeared in.
> 
__network-generator. py__: This python file uses _characters.json_ together with the _networkx_ library to generate and store the _Modern Family_ social graph inside the file named _network.json._
>  
 __network.json__: This json file stores and represents the social graph relating all characters. This graph is represented by 5 five main keys in the json’s key-value pairs : directed, multigraph, graph, nodes, and links. 
> ***nodes***: An array of objects each representing the profile of a character. Most of the profile attributes are similar to those found in character.json however a few stand out. display_name, ego, profileImage, color_mapping, nodePadding, id
>
>***links***: An array of objects each representing the connection between two nodes. Each of these objects consists of 3 attributes : weight, source, and target. The weight represents the “strength” of the relationship between two nodes. For our purposes, this value will be proportional to the number of scenes that the two characters represented by the nodes, source and target, have appeared in together.
>
>***graph***: Gives general overview of the entire social graph such as the graph's name and its nodes' attributes.
>
>***directed***: This attribute is characteristic of the relationship between two nodes. If the relationship represented between nodes goes both ways, then the relationship is *undirected*. However, if it only goes one way, it is called *directed*. For our purposes, the relationship between any two characters is undirected since it goes both ways. Consider two nodes representing Alex Dunphy and Phil Dunphy. Alex is related to Phil with the relationship of ‘daughter’. At the same time, Phil is related to Alex with the relationship of ‘father’. 

## Collaborators
	Hajime Kuwayama(github.mit.edu/kuwayama)
	Neo Mohsenvand (github.com/NeoVand)
	Xinting Gong (github.com/gxtgong)