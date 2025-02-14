(async function (){ 
    speedj('/js/videocall/videocall.css')
    // Remove o elemento videocall se já existir
    let existing_videocall = document.querySelector('videocall');
    if (existing_videocall) {
        existing_videocall.remove();
    }

    let videocall = jsonToObject({
        tag: 'videocall'
    });

    let videocall_domparser = new DOMParser().parseFromString('<user><video id="preview-player" autoplay muted></video></user>', 'text/html');

    let video = videocall_domparser.body.childNodes[0];

    // Inserindo o elemento videocall no início do body
    document.body.insertBefore(videocall, document.body.firstChild);

    document.querySelector('videocall').append(video);    
    const data = {
        room: 'mehfius',
        user: JSON.parse(localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token')).user.app_metadata.name, 
        room_name: 'Sala Mehfius',
        card_date: new Date().toISOString() // Formato ISO para banco de dados
    };

    start(data);
})();