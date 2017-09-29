var array = [];
var quotes = {};
var i = 0;
var author = "";
var of = false;

/**
 * delete all quotes
 */
function clear()
{
    var main_div = document.getElementById("main_div");
    var length = main_div.children.length;
    for (var j = length - 1; j >= 0; --j) {
        var child = main_div.children[j];
        if (child.className == "quote") {
            main_div.removeChild(child);
        }
    }
}


/**
 * get next quote, increace counter
 */
function next_quote()
{
    var tmp;

    if (author == "") {
        if (i >= array.length) {
            i = 0;
        }
        var tmp = array[i++];

        return tmp.quoteText + " - " + (tmp.quoteAuthor == "" ? "Unknown" : tmp.quoteAuthor);
    }

    let arr = Array.from(quotes[author])

    if (i >= arr.length) {
        i = 0;
    }

    if (i + 1 == arr.length) {
        of = true;
    }

    return arr[i++] + " - " + author; 
}

/**
 * change quote of the day
 */
function change_quote()
{
    var divs = document.getElementsByClassName("quote");
    for (var j = 0; j < divs.length; ++j) {
        divs[j].innerHTML = next_quote();
    }
    return true;
}

/**
 * add quote to list of quotes
 */
function add_quote()
{
    // disable opportunity changing of qoute
    document.getElementById("change").disabled = true;

    var main_div = document.getElementById("main_div");

    // add new quote
    var sub_div = document.createElement("div");
    sub_div.classList.add('quote');
    sub_div.innerHTML = next_quote();

    if (of) {
        document.getElementById("add").disabled = true
    }
    
    main_div.appendChild(sub_div);
}

/**
 * load the first quote
 */
window.onload = function()
{
    parse_json();
    change_quote();
    document.getElementById('author_selector').selectedIndex = -1;
}

/**
 * sort quotes on the page
 */
function sort_quotes()
{
    // get all quotes
    var divs = document.getElementsByClassName("quote");

    // sort quotes
    var arr = [].slice.call(divs), frag = document.createDocumentFragment();
    arr.sort(function(l, r){ return ((l.innerHTML > r.innerHTML) ? 1 : -1); });

    arr.forEach(frag.appendChild, frag);

    // add sorting quotes
    var main_div = document.getElementById("main_div");
    main_div.appendChild(frag);
}

/**
 * Delete all quotes, load new
 */
function reset()
{
    clear();

    author = "";
    document.getElementById('author_selector').selectedIndex = -1;

    // add new quote
    add_quote();

    // enable button of the day
    document.getElementById("change").disabled = false;
    of = false;
    document.getElementById("add").disabled = false;
    
    return true;
}

var mock = false;

/**
 * load quotes from jason
 */
function parse_json()
{
    if (mock) {
        array.push({ quoteAuthor: "aut1", quoteText: "Quo1"});
        array.push({ quoteAuthor: "aut1", quoteText: "Quo2"});
        array.push({ quoteAuthor: "aut1", quoteText: "Quo3"});
        array.push({ quoteAuthor: "aut2", quoteText: "Quo1"});
        array.push({ quoteAuthor: "aut2", quoteText: "Quo2"});
        array.push({ quoteAuthor: "aut2", quoteText: "Quo3"});
        array.push({ quoteAuthor: "aut3", quoteText: "Quo1"});
    }
    else {
        var request = new XMLHttpRequest();
        request.open("GET", "https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json", false);
        request.send(null)
        array = JSON.parse(request.responseText);
    }
        
    for (var j = 0; j < array.length; ++j) {

        var tmp = array[j];
        var author = (tmp.quoteAuthor == "" ? "Unknown" : tmp.quoteAuthor);
        var quote = tmp.quoteText;

        if (author in quotes) {
            quotes[author].add(quote);
        } else {
            quotes[author] = new Set();
            quotes[author].add(quote);
        }
    }

    add_options();
}

/**
 * full authors
 */
function add_options()
{
    select = document.getElementById('author_selector');

    for (var key in quotes) {
        var option = document.createElement('option');
        option.value = key;
        option.innerHTML = key;
        select.appendChild(option);
    }
}

/**
 * select one author
 */
function select_author()
{
    clear();
    select = document.getElementById('author_selector');
    author = select.options[select.selectedIndex].value; 

    i = 0;

    // enable adding
    of = false;
    document.getElementById("add").disabled = false;

    add_quote();

    // enable button of the day
    document.getElementById("change").disabled = false;
}
