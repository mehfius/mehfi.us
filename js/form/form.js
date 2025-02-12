(async function () {

    document.body.setAttribute("loading","");  
    document.querySelector('content').innerHTML = '';
    const rawResponse = await fetch(`https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/content?id=eq.${sessionStorage.contents_id}`, {
        method: 'GET',
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json', 
            'Apikey': sessionStorage.supabasekey,
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).access_token}`
        },
    });

    if (rawResponse.status !== 200) {
        const errorMessage = await rawResponse.text();
        alert(`Erro: Não foi possível obter a resposta do servidor. Mensagem: ${errorMessage}`);
        document.body.removeAttribute("loading");
        
    } else { 
        
        sessionStorage.contents_form = await rawResponse.text();

        let window = jsonToObject({ 
            tag: 'window'
        });

        let header = jsonToObject({
            tag: 'header'
        });

        let form = jsonToObject({
            tag: 'form'
        });

        let footer = jsonToObject({
            tag: 'footer'
        });

        window.append(header, form, footer);

        if(document.querySelector('window')){
            console.log('Blocked')
            document.body.removeAttribute("loading");               
            return;
        }

        document.body.appendChild(window);

        await speedj('js/form/form.css');
        await speedj('js/form/header.js');
        
        const fields = [
            'tipo',
            'label',
            'description'
        ];

        for (const field of fields) {
            await speedj(`js/form/fields/${field}.js`);
        }
        
        await speedj('js/form/footer.js');

        document.body.removeAttribute("loading");   
        
    }

})();