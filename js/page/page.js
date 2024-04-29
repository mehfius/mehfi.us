(async function (){

    var parent = document.querySelector('body')
    var child = document.querySelector('body > login')

    parent.removeChild(child);
    
    load('/css/header.css')
    load('/js/page/header.js');

    load('/css/content.css')
    load('/js/contents/content.js');



});