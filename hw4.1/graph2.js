d3.json("./data/countries_2012.json", function(error, data)
{
    var margin = {top: 50, bottom: 10, left: 300, right: 40};
    var height = 2000 - margin.top - margin.bottom;
    var width = 2000 - margin.left - margin.right;

    var key = "population"
    var max = d3.max(data, d => d[key]);
    var min = d3.min(data, d => d[key]);

	var xy_scale = d3.scale.linear().domain([-125,125]).range([-2,2]);
	
	var continents = ["Americas","Africa","Asia","Europe","Oceania"];
	
	var sort_circular = "population"
	
    var node_scale = d3.scale.linear().domain([min, max]).range([0 + 60, height - 60])
	
	var scatter_key = "gdp"
	var max = d3.max(data, d => d.population)
	var min = d3.min(data, d => d.population)
	var scatter_scale_y = d3.scale.linear().domain([max, min]).range([10, height - 60]);
		
	var max = d3.max(data, d => d.gdp)
	var min = d3.min(data, d => d.gdp)
	var scatter_scale_x = d3.scale.linear().domain([min, max]).range([10, width - 60]);

    var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);
     
    var nodes = d3.values(data)
     
    // Generate the force layout
    var force = d3.layout.force()
        .size([width, height])
        .charge(-50)
        .linkDistance(10)
        .on("tick", tick)
        .on("start", function(d) {})
        .on("end", function(d) {})
     
	var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
	 
	var r = Math.min(height, width)/4;
	var arc = d3.svg.arc().outerRadius(r);
    var pie = d3.layout.pie().value(function(d, i) { return 1; });
    var centroid_xy = [{x: 0, y: 0},{x: 0, y: 0},{x: 0, y: 0},{x: 0, y: 0},{x: 0, y: 0}]      
	var centroid_xy	= pie(centroid_xy).map(function(d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            d.x = arc.centroid(d)[0];
            d.y = arc.centroid(d)[1];    
            return d;
        })
	 
    function tick(d) {
		if (group_layout && d != NaN && d.alpha != 0) {
			var k = 10 * d.alpha;
            nodes.forEach(function(o, i) {
            switch(o.continent){
                case continents[0]: 
                    o.x -= k*2;
                    break;
                 case continents[1]: 
                    o.x -= k;
                    break;
                case continents[2]: 
                    //o.x +- 0
                    break;
                case continents[3]: 
                    o.x += k;
                    break;
                case continents[4]:
                    o.x += k*2;
                    break;             
            }
        });
		}
		else if (group_circle && d != NaN && d.alpha != 0) {
			var k = 10 * d.alpha;
			nodes.forEach(function(o, i) {
              switch(o.continent){
                  case continents[0]:
                      o.x += xy_scale(centroid_xy[0].x)*k
                      o.y += xy_scale(centroid_xy[0].y)*k
                      break;
                  case continents[1]:
                      o.x += xy_scale(centroid_xy[1].x)*k
                      o.y += xy_scale(centroid_xy[1].y)*k
                      break;
                  case continents[2]:
                      o.x += xy_scale(centroid_xy[2].x)*k
                      o.y += xy_scale(centroid_xy[2].y)*k
                      break;
                  case continents[3]:
                      o.x += xy_scale(centroid_xy[3].x)*k
                      o.y += xy_scale(centroid_xy[3].y)*k
                      break;
                  case continents[4]:
                      o.x += xy_scale(centroid_xy[4].x)*k
                      o.y += xy_scale(centroid_xy[4].y)*k
                      break;
                }
          });
		}
		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    }
     
	function line_layout() {
		force.stop();

		nodes.forEach(function(d, i) {
			d.x = width/2;
			d.y = node_scale(d[key]);
		})
		graph_update(500);
	}
	
	function list_layout() {
		force.stop();

		var h = 20;
		nodes.forEach(function(d, i) {
			d.x = width/2;
			d.y = h;
			h += 15;
		})
		graph_update(500);
	}
	     
	function circular_layout() {

		force.stop();

		var r = Math.min(height, width)/2;
		var arc = d3.svg.arc().outerRadius(r);

		var pie = d3.layout.pie()
			  .sort(function(a, b) { return a[sort_circular] - b[sort_circular];}) // Sorting by categories
			  .value(function(d, i) { 
				return 1;  // We want an equal pie share/slice for each point
			  });

		nodes = pie(nodes).map(function(d, i) {
			// Needed to caclulate the centroid
			d.innerRadius = 0;
			d.outerRadius = r;

			// Building the data object we are going to return
			d.data.x = arc.centroid(d)[0]+width/2;
			d.data.y = arc.centroid(d)[1]+height/2;

			return d.data;
		})

		graph_update(500);
	}
	
	function circular_group() {
   
		force.stop();

		var r2 = 150;
		var arc2 = d3.svg.arc().outerRadius(r2);
		for (i in centroid_xy){
			var pie2 = d3.layout.pie()
				.sort(function(a, b) { return a[sort_circular] - b[sort_circular];})
				.value(function(d) { return 1; });
			var cx = centroid_xy[i].x + width/2;
			var cy = centroid_xy[i].y + height/2;
			var temp_name = continents[i];
			nodes = pie2(nodes).map(function(d) {
				d.innerRadius = 0;
				d.outerRadius = r2;
				if (d.data.continent == temp_name){
					d.data.x = arc2.centroid(d)[0]+cx;
					d.data.y = arc2.centroid(d)[1]+cy;
				}
				return d.data;
			})
		}
		
		graph_update(500);
	}	
	
	function scatter_map(){
		
		force.stop();

		if (scatter_key == "gdp") {
			nodes.forEach(function(d) {
				d.y = 10 + scatter_scale_y(d.population);
				d.x = 10 + scatter_scale_x(d.gdp);
			})
		} else {
			nodes.forEach(function(d) {
				d.y = 10 + scatter_scale_y(d.latitude);
				d.x = 10 + scatter_scale_x(d.longitude);
			})
		}
		
		graph_update(500);
	}

	function forse_layout(){
		force.nodes(nodes).start();
	}
	
	var group_layout = false;
	var group_circle = false;
	function draw_layout(type) {
		group_layout = false;
		group_circle = false;
		if (type == "line") {
			line_layout();
		} else if (type == "circular") {
			circular_layout();
		} else if (type == "list") {
			list_layout();
		} else if (type == "scatter") {
			scatter_map();
		} else if (type == "forse") {
			forse_layout();
		} else if (type == "group") {
			group_layout = true;
			forse_layout();
		} else if (type == "force_circular_gruped") {
			group_circle = true;
			forse_layout();
		} else if (type == "circular_gruped") {
			circular_group();
		}
	}
	 

    function graph_update(duration) {
		node.transition()
			.duration(duration)
			.attr("transform", function(d) {
				return "translate(" + d.x + ", " + d.y + ")";
			});
    }
    
    node.append("text")
        .text(d => d["name"])

    var selected = null
    node.append("circle")
        .attr("r", 5)
     
	force.nodes(nodes).start();
    var type = d3.select('input[type=radio]:checked').node().value
	draw_layout(type)
	
	d3.selectAll('input[type=radio]').on("change", function(d) { draw_layout(this.value); })
	
    d3.select("#sw")
        .on("change", d => {
            var selected = d3.select("#sw").property("value")

            key = selected
            max = d3.max(data, d => d[key]);
            min = d3.min(data, d => d[key]);

            node_scale = d3.scale.linear().domain([min, max]).range([0 + 60, height - 60])

			var type = d3.select('input[type=radio]:checked').node().value
			draw_layout(type)		
        })
		
	   d3.select("#sw1")
        .on("change", d => {
            scatter_key = d3.select("#sw1").property("value")

			if (scatter_key == "gdp") {			
				var max = d3.max(nodes, d => d.population)
				var min = d3.min(nodes, d => d.population)
				scatter_scale_y = d3.scale.linear().domain([max, min]).range([10, height - 60]);

				var max = d3.max(nodes, d => d.gdp)
				var min = d3.min(nodes, d => d.gdp)
				scatter_scale_x = d3.scale.linear().domain([min, max]).range([10, width - 60]);
			} else {
				var max = d3.max(nodes, d => d.latitude)
				var min = d3.min(nodes, d => d.latitude)
				scatter_scale_y = d3.scale.linear().domain([max, min]).range([10, height - 60]);

				var max = d3.max(nodes, d => d.longitude)
				var min = d3.min(nodes, d => d.longitude)
				scatter_scale_x = d3.scale.linear().domain([min, max]).range([10, width - 60]);
			}

			var type = d3.select('input[type=radio]:checked').node().value
			draw_layout(type)		
        })
		
		d3.select("#sw2")
        .on("change", d => {
            sort_circular = d3.select("#sw2").property("value")

			var type = d3.select('input[type=radio]:checked').node().value
			draw_layout(type)		
        })
		d3.select("#sw3")
        .on("change", d => {
            sort_circular = d3.select("#sw3").property("value")

			var type = d3.select('input[type=radio]:checked').node().value
			draw_layout(type)		
        })
})
