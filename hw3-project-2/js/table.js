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

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null;

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

        var width = 130
        var height = 20
        var max_wins = d3.max(this.teamData, d => d.value.Wins) + 1;
        var max_losses = d3.max(this.teamData, d => d.value.Losses) + 1;
        var max_total_games = d3.max(this.teamData, d => d.value.TotalGames) + 1;
        var max = d3.max([max_wins, max_losses, max_total_games]);

        // remove old rows
        var rows = this.table.selectAll("tr")
        rows.remove()

        // add rows
        rows = rows
            .data(this.tableElements, d => d)
            .enter()
            .append("tr")
            .attr('title', function(d) {
                var total_score = d.value.Wins * 3 + (d.value.TotalGames - d.value.Wins - d.value.Losses) * 1;
                return "Total Score: " + total_score;
            })

        // add cells
        var cells = rows.selectAll("td")
             .data(row => [
                { type: row.value.type, value: [row.key], vis: "text" },
                { type: row.value.type, value: [+row.value["Goals Made"], +row.value["Goals Conceded"]], vis: 'goals' },
                { type: row.value.type, value: [row.value.Result.label], vis: "text" },
                { type: row.value.type, value: [row.value.Wins], vis: 'wins' },
                { type: row.value.type, value: [row.value.Losses], vis: 'loses' },
                { type: row.value.type, value: [row.value.TotalGames], vis: 'total_games' },
             ])
            .enter()
            .append("td")
            .text(function(d){ return d.vis == "text" ? d.value : "" })
            .attr("class", function(d){ return d.type == 'game' ? "game" : "" });

        var color_scale = d3.scaleLinear()
            .domain([1, max])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#ece2f0"), d3.rgb('#016450')]);
        
        var g = cells
            .filter(d => d.vis != "text" && d.vis != "goals")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")

        g.append("rect")
            .attr("width", function(d){ return width / (max - 1) * d.value[0] })
            .attr("height", height)
            .attr("fill", d => color_scale(d.value[0]))
      
        g.append("text")
            .attr('x', function (d) { return width / (max - 1) * d.value[0] - 4; })
            .attr('y', 13)
            .attr('font-size', 12)
            .attr('text-anchor', 'end')
            .attr("fill", "white")
            .text(d => d.value[0])        
    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
