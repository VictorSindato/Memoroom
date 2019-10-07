// Global variables
var characters = ['Alex_Dunphy', 'Andy_Bailey', 'Cameron_Tucker', 'Claire_Dunphy', 'Dylan', 'Frank_Dunphy', 'Gloria_Pritchett', 'Haley_Dunphy', 'Jay_Pritchett', 'Joe_Pritchett', 'Lily_Tucker-Pritchett', 'Longines', 'Luke_Dunphy', 'Manny_Delgado', 'Mitchell_Pritchett', 'Pam_Tucker', 'Phil_Dunphy', 'Reuben', 'Stella', 'Frances', 'Larry', 'Scout', 'Dr._Arvin_Fennerman', 'Ted_Durkas', 'DeDe_Pritchett', 'Sonia_Ramirez', 'Javier_Delgado', 'Ben', 'Amber_LaFontaine', 'Andre_(Season_3)', 'Andrew', 'Barb_Tucker', 'Beth', 'Bethenny', 'Brett', 'Brian', 'Charlie_Bingham', 'Connor', 'Craig', 'Crispin', 'Darlene', 'Dr.Miura', 'Duane_Bailey', 'Earl_Chambers', 'Erica', 'Gavin_Sinclair', 'Gil_Thorpe', 'Jason_Miller', 'Jerry', 'Leon', 'Merle_Tucker', 'Michael', 'Mrs.Barrow', 'Neil', 'Nina_Patel', 'Pam', 'Pepper_Saltzman', 'Pilar_Ramirez', 'Principal_Balaban', 'Principal_Brown', 'Rainer_Shine', 'Reuben_Rand', 'Rhonda', 'Ronaldo', 'Ronnie_LaFontaine', 'Sal', 'Sanjay_Patel', 'Stefan', 'Steven', 'Sydney_Barrow', 'Tammy_LaFontaine', 'Vincent', 'Vish_Patel', 'Walt_Kleezak']


// Setting up svg
var width = document.querySelector("#layout").clientWidth;
var height = document.querySelector("#layout").clientHeight;

var svg = d3.select("#layout")
	.append("svg")
	.attr("width",width)
	.attr("height",height);


// Setting up patterns for filling svg circles with images
var defs = svg.append("defs");
function pattern(id,imageWidth,imageHeight,character){
	d3.select("defs")
	 .append("pattern")
	  .attr("id",id)
	  .attr("height","100%")
	  .attr("width","100%")
	  .attr("patternContentUnits","objectBoundingBox")
	  .append("image")
	   .attr("height",imageHeight)
	   .attr("width",imageWidth)
	   .attr("preserveAspectRatio","none")
	   .attr("xmnls:xlink","http://www.w3.org/1999/xlink")
	   .attr("xlink:href", `./assets/Characters/ProfileImages/${character}/profile.jpg`)
}
for (i=0;i<characters.length;i++){
	pattern(characters[i],1,1,characters[i]);
}


// Laying out simulation before inserting the data
var simulation = d3.forceSimulation()
	.force("charge",d3.forceManyBody().strength(0))
	.force("center",d3.forceCenter(width/2, height/2));


// Importing and using data from network.json file
d3.json("./data/network.json", function(error, graph){

	if(error) throw error;

	// Handling svg node size
	function size(r,d,m){
		return Math.pow(r,1/d)*m;
	}
	var initialScalingFactor = 1;
	var initialDimensionality = 2;

	// Appending nodes data from network.json to svg circles
	let node = svg.append("g")
		.attr("class","nodes")
        .attr("stroke","#727272")
        .attr("stroke-width",1)
		.selectAll("circle")
		.data(graph.nodes)
		.enter().append("circle")
			.attr("fill",function(d){
				return `url(#${d.id})`;
			})
			.attr("id",function(d){
				return d.id;
			})
			.attr("ego", function(d){
				return d.ego;
			})
			.attr("r", function(d){return size(d.appearances,initialDimensionality,initialScalingFactor)});

	// Appending links data from network.json to svg lines
	let link = svg.append("g")
		.attr("class","links")
		.selectAll("line")
		.data(graph.links)
		.enter().append("line")
			.attr("stroke-width",0)
			//.attr("stroke-width",function(d){return Math.sqrt(Math.sqrt(d.weight));})
			.attr("stroke","black");

	// Adding nodes, forces, and tick eventListener to simulation
	simulation
	   .nodes(graph.nodes)
	   .force("link", d3.forceLink(graph.links).id(function(d){return d.id;}).distance(function(d){
	   		if(d.weight===0){
	   			return 4;
	   		} else {
	   			//console.log(5/Math.pow(d.weight,1/4));
	   			return 5/Math.pow(d.weight,1/4);
	   		}
	   }).strength(1))
	   .force("collide", d3.forceCollide(graph.nodes).radius(function(d){return size(d.appearances,initialDimensionality,initialScalingFactor) + d.nodePadding;}).iterations(3))
	   .force("xAxis", d3.forceX(width/2))
	   .force("yAxis", d3.forceY(height/2))
	   .on("tick",tick);


	// Handling drag events
	var dragHandler = d3.drag()
		.on("drag",function(d){

			d3.select(this)
				.attr("cx", d.x = d3.event.x )
				.attr("cy", d.y = d3.event.y )
				.attr("ego", true)

			simulation
				.restart()
				.force("charge", d3.forceManyBody().strength(-350));
		})
		.on("end",function(d){
			var egoCenterThreshold = 30; // Value should depend on dimensionality and radius on control pane

			var dragged = d3.select(this)
								.attr("cx", d3.event.x)
								.attr("cy", d3.event.y);

			var draggedX = dragged.attr("cx");
			var draggedY = dragged.attr("cy");
			var distanceFromCenter = Math.sqrt(Math.pow((width/2 - draggedX),2)+Math.pow(height/2-draggedY,2))

			if(distanceFromCenter<=egoCenterThreshold){
				dragged
					.attr("cx", d.fx = width/2)
					.attr("cy", d.fy = height/2)
					.attr("stroke","green")
					.attr("stroke-width",5);
			} else {
				dragged
					.attr("cx", d.x)
					.attr("cy", d.y);
			}

			console.log(distanceFromCenter);

			simulation
				.alpha(0.1).restart()
				.force("link", d3.forceLink(graph.links).id(function(d){return d.id;}).distance(function(d){
					if(d.weight===0){
			   			return 1;
			   		} else {
			   			return 5/Math.pow(d.weight,1/4);
			   		}
				}))
				.force("center",d3.forceCenter(width/2,height/2));
		})

	dragHandler(node);

	// Handling simulation's tick event
	function tick(){
		node
			.attr("cx",function(d){ return d.x; })
			.attr("cy",function(d){ return d.y; })

		link
			.attr("x1", function(d){ return d.source.x; })
			.attr("y1", function(d){ return d.source.y; })
			.attr("x2", function(d){ return d.target.x; })
			.attr("y2", function(d){ return d.target.y; })
	}

	// Centering ego & modifying nodes' and links' positions accordingly
	function centerEgo(){
		node
			.attr("cx",function(d){
				if(d.ego){
					d.x = width/2;
					return d.x;
				} else {
					return d.x;
				}
			})
			.attr("cy", function(d){
				if(d.ego){
					d.y = height/2;
					return d.y;
				} else {
					return d.y;
				}
			});

		link
			.attr("x1", function(d){
				if(d.ego){
					d.source.x = width/2;
					return d.source.x;
				} else {
					return d.source.x;
				}
			})
			.attr("y1", function(d){
				if(d.ego){
					d.source.y = height/2;
					return d.source.y;
				} else {
					return d.source.y;
				}
			})
			.attr("x2", function(d){
				return d.target.x;
			})
			.attr("y2", function(d){
				return d.target.y;
			})
	}

	// Event handling

	// Zoom node's inside image on hover
	const nodes = document.querySelectorAll("svg g circle");
	for (var i=0; i<nodes.length; i++){
		//nodes[i].addEventListener("mouseover",function(){console.log("Hover happened!")},false);
	}


	// Centering and colouring border of ego node
	node
		/*
		Check each circle's id. If its id matches the id of the node that has been dblclick'd, change its stroke and stroke-width.
		Otherwise, set stroke and stroke-width to standard style.
		*/
		.on("dblclick",function(d){
				var circles = document.querySelectorAll("svg g circle");
				var circle;
				var egoCircleId;
				for (var i=0; i<circles.length; i++){
					circle = circles[i];
					if (circle.id===d.id){
						egoCircleId = circle.id;
						circle.setAttribute("stroke","green");
						circle.setAttribute("stroke-width",5);
						circle.setAttribute("ego",true);
					} else {
						circle.setAttribute("stroke","#727272");
						circle.setAttribute("stroke-width",1);
						circle.setAttribute("ego",false);
					}
				}

				/*
				Get node with same id as egoCircleId and set its ego attribute to true. If id differs, change it to false.
				At any given time, there is only one ego
				*/
				var nodeId;
				for(var n=0; n<graph.nodes.length; n++){
					nodeId = graph.nodes[n].id;
					if (nodeId===egoCircleId){
						graph.nodes[n].ego = true;
					} else {
						graph.nodes[n].ego = false;
					}
				}

				// Restarting simulation
				simulation
					.alpha(0.5).restart()
					.force("charge",d3.forceManyBody())
					.nodes(graph.nodes)
		   			.force("link",d3.forceLink(graph.links).id(function(d){return d.id;}))
		   			.force("collide", d3.forceCollide(graph.nodes).radius(function(d){return size(d.appearances,controls.dimensionality,controls.radius) + d.nodePadding;}).iterations(3))
					.on("tick", centerEgo);
		});



	//// dat.GUI ////

	// Creating object to be used with dat.GUI
	var controls;
	var controlTemplate = function(){
		this.radius = 1;
		this.dimensionality = 2;
		this.message = "Automaton";
		this.Delgado = false;
		this.Dunphy = false;
		this.Pritchett = false;
		this.Ramirez = false;
		this.Tucker = false;
		this.Other = false;
	}
	controls = new controlTemplate;
	controls["Tucker-Pritchett"] = false;

	// Creating the dat.GUI interface
	var controlPane = new dat.GUI();
	var dimensionalityController = controlPane.add(controls,'dimensionality',2,4);
	dimensionalityController.onFinishChange(dimensionalityHandler);
	var radiusController = controlPane.add(controls,'radius',1,10);
	radiusController.onFinishChange(radiusHandler);
	var famFolder = controlPane.addFolder("Families");
	famFolder.add(controls,"Delgado").onChange();
	famFolder.add(controls,"Dunphy").onChange();
	famFolder.add(controls,"Pritchett").onChange();
	famFolder.add(controls,"Ramirez").onChange();
	famFolder.add(controls,"Tucker").onChange();
	famFolder.add(controls,"Tucker-Pritchett").onChange();
	famFolder.add(controls,"Other").onChange();

	function dimensionalityHandler(){
		circlesNo = document.querySelectorAll("svg g circle").length;
		//console.log(circlesNo);
		for(var i=0; i<circlesNo; i++){
			document.querySelectorAll("svg g circle")[i].setAttribute("r",size(graph.nodes[i].appearances,controls.dimensionality,controls.radius));
			//console.log(graph.nodes[i]);
		}

		// Restart simulation
		simulation
			.alpha(1).restart()
			.force("charge",d3.forceManyBody())
			.nodes(graph.nodes)
   			.force("link",d3.forceLink(graph.links).id(function(d){return d.id;}).distance(function(d){
   				if(d.weight===0){
		   			return 4;
		   		} else {
		   			//console.log(5/Math.pow(d.weight,1/4));
		   			return 5/Math.pow(d.weight,1/4);
		   		}
   			}))
   			.force("collide", d3.forceCollide(graph.nodes).radius(function(d){return size(d.appearances,controls.dimensionality,controls.radius) + d.nodePadding;}).iterations(3))
			.on("tick", tick);
	}
	// Handling change in radius on GUI control pane
	function radiusHandler(){
		// Draw nodes with chosen preference
		//console.log(controls.radius);
		circlesNo = document.querySelectorAll("svg g circle").length;
		//console.log(circlesNo);
		for(var i=0; i<circlesNo; i++){
			document.querySelectorAll("svg g circle")[i].setAttribute("r",size(graph.nodes[i].appearances,controls.dimensionality,controls.radius));
			//console.log(graph.nodes[i]);
		}

		// Restart simulation
		simulation
			.alpha(1).restart()
			.force("charge",d3.forceManyBody())
			.nodes(graph.nodes)
   			.force("link",d3.forceLink(graph.links).id(function(d){return d.id;}).distance(function(d){
   				if(d.weight===0){
		   			return 4;
		   		} else {
		   			//console.log(5/Math.pow(d.weight,1/4));
		   			return 5/Math.pow(d.weight,1/4);
		   		}
   			}))
   			.force("collide", d3.forceCollide(graph.nodes).radius(function(d){return size(d.appearances,controls.dimensionality,controls.radius) + d.nodePadding;}).iterations(3))
			.on("tick", tick);
	}

});
