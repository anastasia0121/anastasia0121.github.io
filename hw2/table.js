d3.json("countries_2012.json", function(error, data)
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
                   tbody.selectAll("tr").sort(function(a, b) { return d3.ascending(a[header], b[header]); });
                   d3.select(this).style("cursor", "n-resize")
               } else {
                   tbody.selectAll("tr").sort(function(a, b) { return d3.descending(a[header], b[header]); });
               }
           })

    var format = d3.format(",0s");
    console.log(format(1990000000))

    
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
                        return format(row[desired_columns[i]]);
                    } else if (desired_columns[i] == "population") {
                        return format(row[desired_columns[i]]);
                    } else if (desired_columns[i] == "life_expectancy") {
                        return format(row[desired_columns[i]]);
                    }
                    return row[desired_columns[i]];
                });
        })
        .enter()
        .append("td")
        .text(function(d) { return d; })
});
