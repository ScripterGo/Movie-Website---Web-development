
function go_home(){
    location.href = "index.html";
}
function go_about(){
    location.href = "#";
}
function go_list(){
    location.href = "#";
}
function go_explorer(){
    location.href = "explorer.html";
}
function go_login(){
    location.href = "#";
}

window.onload = function(){
    let collection = document.getElementsByClassName("lower_nav_btn");
    console.log(collection);
    for(let i = 0; i < collection.length; i++){
        console.log(collection[i]);
    }
};

