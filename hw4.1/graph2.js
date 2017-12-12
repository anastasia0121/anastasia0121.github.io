d3.json("./data/countries_2012.json", function(error, data)
{
    var margin = {top: 50, bottom: 10, left: 300, right: 40};
    var height = 900 - margin.top - margin.bottom;
    var width = 900 - margin.left - margin.right;

    var key = "population"
    var max = d3.max(data, d => d[key]);
    var min = d3.min(data, d => d[key]);

    var node_scale = d3.scale.linear().domain([min, max]).range([0 + 60, height - 60])

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
     
    function tick(d) {
        graph_update(0);
    }
     
    function force_layout() {
        force.nodes(nodes).start();
    }
     
    function graph_update(duration) {
        node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + width/2 + ", " + node_scale(d[key]) + ")";
            });
    }

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
    
    node.append("text")
        .text(d => d["name"])

    var selected = null
    node.append("circle")
        .attr("r", 5)
     
    force_layout();

    d3.select("#sw")
        .on("change", d => {
            var selected = d3.select("#sw").property("value")

            key = selected
            max = d3.max(data, d => d[key]);
            min = d3.min(data, d => d[key]);

            node_scale = d3.scale.linear().domain([min, max]).range([0 + 60, height - 60])

            force_layout();
        })
})
