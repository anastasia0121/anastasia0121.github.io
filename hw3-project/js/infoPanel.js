/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
        this.host = d3.select("#host");
        this.winner = d3.select("#winner");
        this.silver = d3.select("#silver");
        this.teams = d3.select("#teams");
    }

    clear() {
        this.host.text("");
        this.winner.text("");
        this.silver.text("");
        d3.selectAll(".team").remove()
    }
    
    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year
        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.
        // Set Labels

        if (oneWorldCup == null) {
            this.clear();
            return;
        }
        
        this.host.text(oneWorldCup.host);
        this.winner.text(oneWorldCup.winner);
        this.silver.text(oneWorldCup.runner_up);

        d3.selectAll(".li").remove()

        this.teams.selectAll("li")
            .data(oneWorldCup.teams_names)
            .enter()
            .append("li")
            .attr("class", "li")
            .text(d=>d)
    }
}
