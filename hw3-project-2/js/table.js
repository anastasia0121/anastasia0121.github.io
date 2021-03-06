/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        this.table = d3.select('#matchTable > tbody');
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******
        // Update Scale Domains
        // Create the x axes for the goalScale.
        // add GoalAxis to header of col 1.

        // ******* TODO: PART V *******
        // Set sorting callback for clicking on headers
        // Clicking on headers should also trigger collapseList() and updateTable(). 


        var width = 130
        var height = 20
        var max = d3.max(this.teamData, d => d.value["Goals Made"]);

        var x_scale = d3.scaleLinear().domain([0, max]).range([0, width]).nice()
        var x_axis = d3.axisTop().tickValues(d3.range(0, max + 1, 2)).scale(x_scale);
        this.goalScale = x_scale;
        
        d3.select("#goalHeader")
            .append("svg")
            .attr("height", height + 5)
            .attr("width", width + 20)
            .append("g")
            .attr("transform", "translate(10, 20)")
            .attr("width", width)
            .attr("height", height)
            .call(x_axis)
        
        d3.select("#team_sort")
            .on("click", d => {
                this.collapseList();
                this.sort = (this.sort == "team_up" ? "team_down" : "team_up");
                this.tableElements = this.tableElements.sort((a, b) => {
                    return (this.sort === "team_up") ? d3.ascending(a.key,b.key) : d3.descending(a.key, b.key);
                })
                this.updateTable();
            })
        d3.select("#goals_sort")
            .on("click", d => {
                this.collapseList();
                this.sort = (this.sort == "goals_up" ? "goals_down" : "goals_up");
                this.tableElements = this.tableElements.sort((a, b) => {
                    return (this.sort === "goals_up") ? d3.ascending( +a.value["Goals Made"], +b.value["Goals Made"] ) : d3.descending( +a.value["Goals Made"], +b.value["Goals Made"]);
                })
                this.updateTable();
            });
        d3.select("#wins_sort")
            .on('click', d => {
                this.collapseList();
                this.sort = (this.sort == "win_up" ? "win_down" : "win_up")
                this.tableElements = this.tableElements.sort((a, b) => {
                    return this.sort === "win_up" ?  d3.ascending( a.value["Wins"], b.value["Wins"]) :  d3.descending( a.value["Wins"], b.value["Wins"]);
                })
                this.updateTable();
            });
        d3.select("#losses_sort")
            .on("click", d => {
                this.collapseList();
                this.sort = (this.sort == "losses_up" ? "losses_down" : "losses_up")
                this.tableElements = this.tableElements.sort((a, b) => {
                    return this.sort === "losses_up" ?  d3.ascending( a.value["Losses"], b.value["Losses"]) :  d3.descending( a.value["Losses"], b.value["Losses"]);
                })
                this.updateTable();
            });
        d3.select("#total_sort")
            .on("click", d => {
                this.collapseList();
                this.sort = (this.sort == "sort_up" ? "sort_down" : "sort_up")
                this.tableElements = this.tableElements.sort((a, b) => {
                    return this.sort === "sort_up" ?  d3.ascending( a.value["TotalGames"], b.value["TotalGames"]) :  d3.descending( a.value["TotalGames"], b.value["TotalGames"]);
                })
                this.updateTable();
            });
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        //Append th elements for the Team Names
        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        //Add scores as title property to appear on hover
        //Populate cells (do one type of cell at a time )
        //Create diagrams in the goals column
        //Set the color of all games that tied to light gray

        var width = 150
        var height = 20
        var max_wins = d3.max(this.teamData, d => d.value.Wins) + 1;
        var max_losses = d3.max(this.teamData, d => d.value.Losses) + 1;
        var max_total_games = d3.max(this.teamData, d => d.value.TotalGames) + 1;
        var max = d3.max([max_wins, max_losses, max_total_games]);
        
        // remove old rows
        var rows = this.table.selectAll("tr")
        rows.remove()
        rows = this.table.selectAll("tr")
        
        // add rows
        rows = rows
            .data(this.tableElements, d => d.value.type == "game" ? d.unique : d.key)
            .enter()
            .append("tr")
            .attr("title", function(d) {
                if (d.value.type != "game") {
                    var total_score = d.value.Wins * 3 + (d.value.TotalGames - d.value.Wins - d.value.Losses) * 1;
                    return "Total Score: " + total_score;
                }
            })
            .attr("class", d => d.value.type)
            .on("click", (d) => {
                if (d.value.type == "game") {
                    this.tree.updateTree(d);
                }
                if (d.value.type == "aggregate") {
                    for (var i = 0; i < this.tableElements.length; ++i) {
                        var elem = this.tableElements[i]
                        if (d.key === elem.key) {
                            this.updateList(i);
                            this.selected = d.key;
                            this.tree.updateTree(d);
                        }
                    }
                }
            })
        
        // add cells
        var cells = rows.selectAll("td")
             .data(row => [
                { type: row.value.type, value: [row.key], vis: "title" },
                { type: row.value.type, value: [+row.value["Goals Made"], +row.value["Goals Conceded"]], vis: 'goals' },
                { type: row.value.type, value: [row.value.Result.label], vis: "text" },
                { type: row.value.type, value: [row.value.Wins], vis: "chart" },
                { type: row.value.type, value: [row.value.Losses], vis: "chart" },
                { type: row.value.type, value: [row.value.TotalGames], vis: "chart" },
             ])
            .enter()
            .append("td")
            .text(function(d){ return d.vis == "text" || d.vis == "title" ? d.value : "" })
            .attr("class", function(d){
                if (d.type == "game") {
                    if (d.vis == "title")
                        return "title_game game"
                    return "game"
                } else if (d.vis == "title") {
                    return "title"
                }
            })

        var g = cells.filter(d => d.vis != "text" && d.vis != "title")
            .append("svg")
            .attr("width", d => d.vis == "chart" ? 70 : 150)
            .attr("height", height)
            .append("g")

        // bar charts: wins, losses, total game
        var color_scale = d3.scaleLinear()
            .domain([1, max])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#ece2f0"), d3.rgb('#016450')]);

        var charts = g.filter(d => (d.vis != "goals" && d.type == "aggregate"))
        charts.append("rect")
            .attr("width", function(d){ return 70 / (max - 1) * d.value[0] })
            .attr("height", height)
            .attr("fill", d => color_scale(d.value[0]))
        charts.append("text")
            .attr("x", function (d) { return 70 / (max - 1) * d.value[0] - 4; })
            .attr("y", 13)
            .attr("font-size", 12)
            .attr("text-anchor", "end")
            .attr("fill", "white")
            .text(d => d.value[0])

        // goals
        var trash = g.filter(d => d.vis == "goals" && d.value[0] != d.value[1])
            .attr("class", d => d.type)
        
        trash.append("rect")
            .attr("class", d => d.value[0] < d.value[1] ? "negative" : "positive")
            .attr("width", d => {
                let max_min = d3.extent(d.value);
                return this.goalScale(max_min[1] - max_min[0]);
            })
            .attr("x", d => d.type == "game" ? this.goalScale(d3.min(d.value)) + 2 : this.goalScale(d3.min(d.value)) + 6)

        trash.append("circle")
            .attr("class", d => d3.max(d.value) == d.value[0] ? "negative" : "positive")
            .attr('cx', d => this.goalScale(d3.min(d.value)) + 6)

        trash.append("circle")
            .attr("class", d => d3.max(d.value) == d.value[1] ? "negative " : "positive")
            .attr('cx', d => this.goalScale(d3.max(d.value)) + 5)

        // grey trash
        g.filter(d => d.vis == "goals" && +d.value[0] == +d.value[1])
            .attr("class", d => d.type)
            .append("circle")
            .attr("class", "draw")
            .attr("cx", d => this.goalScale(d3.min(d.value)) + 5)
    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
        //Only update list for aggregate clicks, not game clicks
        var sub = this.collapseList(i)
        i = i - sub;

        let data = this.tableElements[i];
        
        let games = data.value.games.map(g => {
            return { key: 'x' + g.key, value: g.value, unique: g.key + "-" + data.key };
        })

        games.unshift(0);
        games.unshift(i + 1);

        this.tableElements.splice.apply(this.tableElements, games);
        this.updateTable();

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList(j) {
        // ******* TODO: PART IV *******
        var sub = 0;
        for (let i = 0; i < this.tableElements.length; i++) {
            let game = this.tableElements[i];

            if (game.value.type == "game") {
                this.tableElements.splice(i, 1);
                i--;
                if (i < j) {
                    sub++;
                }
            }
        }
        return sub;
    }


}
