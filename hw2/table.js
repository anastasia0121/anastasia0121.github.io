function drow_table(data)
{
    var table = d3.select("body").append("table"), thead = table.append("thead").attr("class", "thead");
    tbody = table.append("tbody")
    table.append("caption").html("World Countries Ranking");

    var desired_columns = ["name", "continent", "gdp", "life_expectancy", "population", "year"]
    thead.append("tr")
        .selectAll("th")
        .data(desired_columns)
        .enter()
        .append("th")
        .text(function(d) { return d; })
        .on("click", function(header, i) {
               var direction = "arrow-up"
               if (this.childNodes.length > 1) {
                   direction = (this.childNodes[1].className == "arrow-up" ? "arrow-down" : "arrow-up")
               }
               d3.select("th span").remove()
               d3.selectAll("th").style("cursor", "s-resize")
               d3.select(this).append("span").attr("class", direction)
               if (direction == "arrow-up") {
                   tbody.selectAll("tr").sort(function(a, b) {
                       if (header == "continent") { return d3.ascending(a[header] + a['name'], b[header] + b['name']); }
                       d3.ascending(a[header], b[header]);
                   });
                   d3.select(this).style("cursor", "n-resize")
               } else {
                   tbody.selectAll("tr").sort(function(a, b) {
                       if (header == "continent") { return d3.descending(a[header] + a['name'], b[header] + b['name']); }
                       return d3.descending(a[header], b[header]); });
               }
           })

    var gdp_format = d3.format(".3s");
    var life_exp_format = d3.format(".1f");
    var population_format = d3.format(",");

    var rows = tbody
        .selectAll("tr.row")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", "row")

    var cells = rows.selectAll("td")
        .data(function(row) {
            return d3.range(desired_columns.length)
                .map(function(column, i) {
                    if (desired_columns[i] == "gdp") {
                        return gdp_format(row[desired_columns[i]]);
                    } else if (desired_columns[i] == "population") {
                        return population_format(row[desired_columns[i]]);
                    } else if (desired_columns[i] == "life_expectancy") {
                        return life_exp_format(row[desired_columns[i]]);
                    }
                    return row[desired_columns[i]];
                });
        })
        .enter()
        .append("td")
        .text(function(d) { return d; })
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
    
    d3.selectAll('input[type=checkbox]').on("change", update_all);
    d3.selectAll('input[type=radio]').on("change", update_all);
    d3.selectAll('input[type=range]').on("change", update_all);
    
    function update_all()
    {
        d3.select('thead').remove();
        d3.select('tbody').remove();
        d3.select('caption').remove();

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
        
        drow_table(new_data)
    }   

    update_all();
    
});
