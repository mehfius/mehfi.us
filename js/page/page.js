(async function (){

    var parent = document.querySelector('body')
    var child = document.querySelector('body > login')

    parent.removeChild(child);
    
    load('/css/header.css')
    rota_header();

    load('/css/content.css')
    rota_contents();



});