(async function (){

    const formElement = document.querySelector('form');

    const json = {};

    formElement.querySelectorAll('input, textarea').forEach(e => {

        if (e.value.trim() !== '') {

            const parentTagName = e.parentElement.tagName.toLowerCase();
            if (!json[parentTagName]) {
                json[parentTagName] = {};
            }
            json[parentTagName] = e.value;

        }

    });

    json.name = 'content_update'
    json.token = JSON.parse(sessionStorage.getItem('token'))
    json.id = JSON.parse(sessionStorage.getItem('contents_id'))

    try {
        const data = await supabase_fetch(json);
        // Faça algo com os dados, se necessário
        load('/js/contents/content.js')
    } catch (error) {
        console.error('Ocorreu um erro durante a chamada supabase_fetch:', error);
        // Lidar com o erro de alguma forma, por exemplo, exibindo uma mensagem para o usuário
    }

})()