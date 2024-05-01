(async function (){
    
    let json = {}

    json.name = 'content_delete'
    json.token = JSON.parse(sessionStorage.getItem('token'))
    json.id = JSON.parse(sessionStorage.getItem('contents_id'))

    try {

        const data = await supabase_fetch(json);
        rota_contents();

    } catch (error) {
        
        console.error('Ocorreu um erro durante a chamada supabase_fetch:', error);

    }

})()