var array = [];
var i = 0;

/**
 * get next quote, increace counter
 */
function next_quote()
{
    if (i >= array.length) {
        i = 0;
    }

    var tmp = array[i++];

    return tmp.quoteText + " - " + tmp.quoteAuthor;
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

    main_div.appendChild(sub_div);

//    var node = document.createTextNode("This is new.");
}

/**
 * load the first quote
 */
window.onload = function()
{
    parse_json();
    change_quote(); 
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
 * delete all quotes, load new
 */
function reset()
{
    var main_div = document.getElementById("main_div");
    var length = main_div.children.length;
    for (var j = length - 1; j >= 0; --j) {
        var child = main_div.children[j];
        if (child.className == "quote") {
            main_div.removeChild(child);
        }
    }

    // add new quote
    add_quote();

    // enable button of the day
    button = document.getElementById("change");
    button.disabled = false;

    return true;
}

function parse_json()
{
    var request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json", false);
    request.send(null)
    array= JSON.parse(request.responseText);
}
