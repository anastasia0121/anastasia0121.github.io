function drow_bar(data, encoded_by)
{
    var margin = {top: 15, bottom: 10, left:200, right: 40};
    var width = 900 - margin.left - margin.right;
    var height = data.length * 15;

    var svg = d3.select("body").append("svg")
                .attr("width", width+margin.left+margin.right)
                .attr("height", height+margin.top+margin.bottom);

    var xScale = d3.scale.linear().range([0, width]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, height], .8, 0);

    //var max = d3.max(data, function(d) { return d.population; } );
    var max = d3.max(data, d => d[encoded_by]);
    var min = 0;

    xScale.domain([min, max]);
    yScale.domain(data.map(function (d) {
        return d.name;
    }));

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var groups = g.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("g");

    groups.append("text")
        .text(d => d.name)
        .attr("x", xScale(min) - 10)
        .attr("y", function (d) {
            return yScale(d.name);
        }).attr("dy", ".35em")
        .attr("text-anchor", "end");

    
    var div = d3.select("body").append("div").attr("class", "toolTip");

    var bars = groups
        .append("rect")
        .attr("width", function(d) { return xScale(d[encoded_by]); })
        .attr("height", 5)
        .attr("x", xScale(min))
        .attr("y", function(d) { return yScale(d.name); })
        .attr("fill", function(d){
            var name = d['continent'];
            if (name == "Americas") { return "red"; }
            if (name == "Africa") { return "blue"; }
            if (name == "Asia") { return "black"; }
            if (name == "Europe") { return "green"; }
            return "#42145f";
        })
}

d3.json("countries_1995_2012.json", function(error, data)
{
    var tmp = [];

    // convert to sipliest format
    for (var i = 0; i < data.length; ++i) {
        for (var j = 0; j < data[i]['years'].length; ++j) {
            obj = {
                'name': data[i]['name'],
                'continent': data[i]['continent'],
                'gdp': data[i]['years'][j]['gdp'],
                'life_expectancy': data[i]['years'][j]['life_expectancy'],
                'population': data[i]['years'][j]['population'],
                'year': data[i]['years'][j]['year']
            }
            tmp.push(obj);
        }
    }
    data = tmp;
            
    var choices = [];
    
    d3.selectAll('input').on("change", update_all);
    
    function update_all()
    {
        // remove old bar
        d3.select('thead').remove();
        d3.select('svg').remove();

        // select name of requared continents
        choices = [];
        d3.selectAll("input[type=checkbox]")
            .each(function(d) {
                 cb = d3.select(this);
                 if(cb.property("checked")){
                     choices.push(cb.property("value"));
                 }});

        if (choices.length == 0) {
            choices = ['Americas', 'Africa', 'Asia', 'Europe', 'Oceania'];
        }

        var year = d3.select('input[type=range]').property('value');
        
        var new_data = data.filter(function(d,i) { return choices.includes(d['continent']) && d['year'] == year; })

        // aggregate data if it need
        r = d3.select("#aggregation");
        if (r.property("checked")) {

            new_data = d3.nest().key(function(d,i) { return d['continent']; })
                .rollup(function(rows) {
                    var aggr_row = {
                        gdp: 0,
                        continent: rows[0]['continent'],
                        name: rows[0]['continent'],
                        life_expectancy: 0,
                        population: 0,
                        year: rows[0]['year']
                    };
                    aggr_row['gdp'] = d3.sum(rows, function(d) { return d['gdp']; });
                    aggr_row['life_expectancy'] = d3.mean(rows, function(d) { return d['life_expectancy']; });
                    aggr_row['population'] = d3.sum(rows, function(d) { return d['population']; });
                    return aggr_row;
                })
                .entries(new_data)

            for (var i = 0; i < new_data.length; ++i) {
                new_data[i] = new_data[i].values;
            }
        }

        //sorting
        var field_name = "";
        d3.selectAll(".sort")
            .each(function(d) {
                 r = d3.select(this);
                 if(r.property("checked")){
                     field_name = r.property("value");
                 }});

        new_data = new_data.sort(function(l, r){ return d3.descending(l[field_name], r[field_name]); });

        //encode by
        var encoded_by = "";
        d3.selectAll(".encoder")
            .each(function(d) {
                 r = d3.select(this);
                 if(r.property("checked")){
                     encoded_by = r.property("value");
                 }});
        
        drow_bar(new_data, encoded_by)
    }   

    update_all();
    
});
