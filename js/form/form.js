(async function () {

    document.body.setAttribute("loading", "");
    document.querySelector('content').innerHTML = '';

    let rawResponse;
    let isNewRecord = false; // Flag to indicate if it's a new record

    if (!sessionStorage.contents_id || sessionStorage.contents_id === "undefined" || sessionStorage.contents_id === "") {
        // New record: no need to fetch data
        isNewRecord = true;
        console.log("Creating a new record.");
    } else {
        // Existing record: fetch data from the server
        console.log(`Fetching data for record ID: ${sessionStorage.contents_id}`);
        rawResponse = await fetch(`https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/content?id=eq.${sessionStorage.contents_id}`, {
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
            return; // Stop execution if there is an error getting data
        } else {
            sessionStorage.contents_form = JSON.stringify((await rawResponse.json())[0]);
        }
    }

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

    if (document.querySelector('window')) {
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

})();
