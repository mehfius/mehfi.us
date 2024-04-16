(async function (){


    var parent = document.querySelector('body')
    var child = document.querySelector('body > login')
    
    parent.removeChild(child);

    var json = {};

        json.name = 'content_list'
        json.token = JSON.parse(sessionStorage.getItem('token'))

    const res = await supabase_fetch(json);

/*     var content = document.createElement("div");

    content.textContent = "Olá, mundo! Este é um novo elemento criado com JavaScript.";

        document.body.appendChild(novoElemento);

    res.forEach(function(res) {

        var paragraph = document.createElement("label");
        
        paragraph.textContent = JSON.stringify(pessoa);
        
        outputElement.appendChild(paragraph);

    });     */

})()