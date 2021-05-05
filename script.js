
var base_url = "https://image.tmdb.org/t/p/original"
var in_list = [];

function is_in_list(movie_obj){
    for(let i = 0; i < in_list.length; i++){
        if(in_list[i].id == movie_obj.id) return true;
    }
    return false;
}

function go_home(){
    location.href = "index.html";
}
function go_about(){
    location.href = "#";
}
function go_list(){
    location.href = "list.html";
}
function go_explorer(){
    location.href = "explorer.html";
}
function go_login(){
    location.href = "login.html";
}

function create_movie_display_block(title, desc, poster_url, button_text="Add to list", button_color = "btn-success", hide_btn = false, on_click_func){
    let top_div = document.createElement("div");
    top_div.setAttribute("class", "row explorer_display_block bg-danger");
    
    let col_div_4 = document.createElement("div");
    col_div_4.setAttribute("class", "col-md-4");
    top_div.appendChild(col_div_4);

    let poster_img = document.createElement("img");
    poster_img.setAttribute("class", "bg-light");
    poster_img.setAttribute("alt", "Movie Poster");
    poster_img.style.height = "300px";
    col_div_4.appendChild(poster_img);

    let col_div_8 = document.createElement("div");
    col_div_8.setAttribute("class", "col-md-8");
    let title_h = document.createElement("h1");
    title_h.setAttribute("class", "explorer_display_block_title");
    col_div_8.appendChild(title_h);
    top_div.appendChild(col_div_8);

    let movie_desc = document.createElement("p");
    movie_desc.setAttribute("class", "movie_description");
    let bold_tag = document.createElement("b");
    movie_desc.appendChild(bold_tag);
    col_div_8.appendChild(movie_desc);

    let btn = document.createElement("button");
    btn.setAttribute("class", "btn text-black-50 mt-3 " + button_color);
    btn.onclick = function(event){
        on_click_func(event, btn);
    }
    let bold_tag_2 = document.createElement("b");
    bold_tag_2.innerText = button_text;
    btn.appendChild(bold_tag_2);
    col_div_4.appendChild(btn);
    btn.hidden = hide_btn;

    poster_img.setAttribute("src", poster_url);
    title_h.innerText = title;
    bold_tag.innerText = desc;
    return top_div;
}

function reset_displayed_movies(container_id="explorer_list_display"){
    let list_div = document.getElementById(container_id);
    while(list_div.firstElementChild != null){
        list_div.removeChild(list_div.firstElementChild);
    }
}

async function make_explorer_request(s){
    let key = "8a094be969d17e65edca9b7734927f29";
    var url = "https://api.themoviedb.org/3/search/movie?api_key=" + key + "&query=" + s;
    let response = await fetch(url);
    let json_obj = await response.json();
    return json_obj;
}

async function explorer_search_bar_btn_on_click(){
    let search_bar = document.getElementById("explorer_search_bar");
    let display_list = document.getElementById("explorer_list_display");
    let s = search_bar.value;
    let results = (await make_explorer_request(s)).results;
    let n = 10;
    reset_displayed_movies("explorer_list_display");
    console.log(results);

    for(let i = 0; i < Math.min(n, results.length); i++){
        let movie_obj = results[i]
        let already_in_list = is_in_list(movie_obj);
        let new_movie_element = create_movie_display_block(movie_obj.title, movie_obj.overview, base_url + movie_obj.backdrop_path, "Add to list", "btn-success", already_in_list, function(event, button_obj){
            in_list.push(movie_obj);
            button_obj.hidden = true;
            console.log("clicked!");
        });
        display_list.appendChild(new_movie_element);
    }
}

/*
f(i,j) = min(f(i,j-1) + 1, f(i-1, j) + 1, f(i-1, j-1) + 1)

*/

function string_edit_distance(a, b){
    let table = []; //[a][b];
    for(let i = 0; i < a.length; i++){
        let row = [];
        for(let j = 0;  j < b.length; j++){
            row.push(10000);
        }
        table.push(row);
    }
    for(let i = 0; i <= a.length; i++){
        table[i][0] = i;
    }
    for(let j = 0; j <= b.length; j++){
        table[0][j] = j;
    }

    for(let i = 1; i <= a.length; i++){
        for(let j = 1; j <= b.length; j++){
            table[i][j] = Math.min(table[i][j], table[i-1][j] + 1, table[i][j-1] + 1);
            if(a[i-1] == b[j-1]){
                table[i][j] = Math.min(table[i][j], table[i-1][j-1])
            }else{
                table[i][j] = Math.min(table[i][j], table[i-1][j-1] + 1);
            }
        }
    }
    return table[a.length][b.length];
}



function list_search_bar_btn_on_click(){
    let search_bar = document.getElementById("list_search_bar");
    let display_list = document.getElementById("list_list_display");
    let s = search_bar.value;
    let distances = [];
    reset_displayed_movies("list_list_display");
    console.log(in_list.length);
    for(let i = 0; i < in_list.length; i++){
        distances.push([i, string_edit_distance(s, in_list[i])]);
    }
    distances.sort(function(a,b){
        return a[1] - b[1];
    })

    for(let i = 0; i < distances.length; i++){
        let movie_obj = in_list[distances[i][0]];
        let new_movie_element = create_movie_display_block(movie_obj.title, movie_obj.overview, base_url + movie_obj.poster_path, "Remove from list", "btn-success", false, function(event, button_obj){
            in_list.splice(in_list.indexOf(movie_obj), 1);
            button_obj.hidden = true;
            console.log("clicked!");
            console.log(event);
        });
        display_list.appendChild(new_movie_element);
    }

}
console.log("test");

window.onload = function(){
    
};

