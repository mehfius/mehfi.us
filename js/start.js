const jkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd25ucWJwb2hobGRmcm9vZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTc2MjgsImV4cCI6MjAyODQzMzYyOH0.Mrxll-WATVuV0NXB36Tf2LJBf5KDZRsXSqFhLmTVbME"
const jurl = "https://kgwnnqbpohhldfroogmm.supabase.co/"
const json = { "key": jkey, "url": jurl }

sessionStorage.setItem("supabasekey", jkey);
sessionStorage.setItem("supabaseurl", jurl);

const contents_tipos = [
    { id: "4", icon_code: "f084", icon: "fa-key", label: "Autenticação" },
    { id: "3", icon_code: "f552", icon: "fa-toolbox", label: "Configuração" },
    { id: "2", icon_code: "f15b", icon: "fa-file", label: "Arquivo" },
    { id: "1", icon_code: "f6e2", icon: "fa-ghost", label: "Sem tipo" },
    { id: "5", icon_code: "f477", icon: "fa-file-medical", label: "Prescrição" },
    { id: "6", icon_code: "f6dd", icon: "fa-file-csv", label: "CSV" },
    { id: "7", icon_code: "f1c1", icon: "fa-file-pdf", label: "PDF" },
    { id: "8", icon_code: "f1c1", icon: "fa-file-audio", label: "Youtube" }
];

sessionStorage.setItem('contents_tipos', JSON.stringify(contents_tipos));

function get_session_storage(key) {
    var storage = JSON.parse(sessionStorage.getItem(key));
    return storage;
}

const loading_box = async function (label, url) {

    let loading_box = document.querySelector('loading_box');
    let icon = document.createElement('icon')
    icon.setAttribute('classe', 'fa-solid fa-spinner')
    let item = document.createElement('item');
    item.textContent = label;
    item.setAttribute('url', url)
    loading_box.append(icon, item)

}

const load_html = async function (url, e) {
    if (!url.startsWith('https')) {
        if (window.location.href.includes("mehfi.us")) {
            url = 'https://mehfi.us/' + url;
        } else {
            url = 'http://127.0.0.1:3001/' + url;
            url = url + '?v=' + new Date().getTime();
        }
    }
    fetch(url)
        .then(response => {

            if (!response.ok) {
                throw new Error('Falha ao carregar o arquivo HTML');
            }

            return response.text();
        })
        .then(html => {

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');


            const objetoHTML = doc;



            e.innerHTML = '';

            e.append(objetoHTML.body.childNodes[0])

        })
        .catch(error => {
            console.error('Erro:', error);
        });

}

function jsonToObject(json) {

    var field = document.createElement(json.tag);

    Object.entries(json).forEach(([key, value]) => {

        switch (key) {
            case 'innerhtml': field.innerHTML = json.innerhtml; break;
            case 'tag': break;
            case 'textnode': field.appendChild(document.createTextNode(json.textnode)); break;
            case 'pattern': field.setAttribute(key, value); break;
            case 'value':
                if (json.tag === 'textarea') {
                    field.appendChild(document.createTextNode(json.value));
                } else {
                    field.setAttribute("value", json.value);
                }
                break;
            case 'onclick': field.onclick = value; break;
            case 'onchange': field.onchange = value; break;
            case 'onkeyup': field.onkeyup = value; break;
            case 'onkeypress': field.onkeypress = value; break;
            case 'onclickold': field.setAttribute('onclick', value); break;
            default: field.setAttribute(key, value);
        }

    })

    return field;

}
const supabase_fetch_rls = function (data, filtro = null, valor = null) {

    const myHeaders = new Headers();
    myHeaders.append("Apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd25ucWJwb2hobGRmcm9vZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTc2MjgsImV4cCI6MjAyODQzMzYyOH0.Mrxll-WATVuV0NXB36Tf2LJBf5KDZRsXSqFhLmTVbME");
    myHeaders.append("Content-Type", "application/json");

    const auth_token = localStorage.getItem('sb-kgwnnqbpohhldfroogmm-auth-token');

    if (auth_token) {
        try {
            const token_json = JSON.parse(auth_token);

            if (token_json && token_json.access_token) {
                myHeaders.append("Authorization", `Bearer ${token_json.access_token}`);
            }
        } catch (error) {
            console.error('Erro ao parsear token:', error);
        }
    }

    let url = "https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/" + data.name;

    if (filtro && valor) {
        url += `?${filtro}=eq.${valor}`;
    }

    if (url.includes('?')) {
        url += '&order=created_at.desc';
    } else {
        url += '?order=created_at.desc';
    }

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));

}

const supabase_fetch = function (data) {

    const myHeaders = new Headers();
    myHeaders.append("Apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd25ucWJwb2hobGRmcm9vZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NTc2MjgsImV4cCI6MjAyODQzMzYyOH0.Mrxll-WATVuV0NXB36Tf2LJBf5KDZRsXSqFhLmTVbME");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ data });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch("https://kgwnnqbpohhldfroogmm.supabase.co/rest/v1/rpc/" + data.name, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));

}

const supabase_fetch_doctor = function (data) {

    const myHeaders = new Headers();
    myHeaders.append("Apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbGh1cXF6am1na2Roamd4em5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE5MDE1NzIsImV4cCI6MTk3NzQ3NzU3Mn0.h8KOM1CCXPY80ImmmsrLmGp0Wib0z8C80KNFFGjzcn8");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ data });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch("https://vflhuqqzjmgkdhjgxzni.supabase.co/rest/v1/rpc/" + data.name, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));

}

/* function rota_contents() { speedj('/js/contents/content.js'); } */
/* function rota_formlogin() { speedj('/js/autenticacao/form_login.js') }
function rota_form() { speedj('/js/form/form.js') }
function rota_contents_delete() { speedj('/js/contents/content_delete.js'); }
function rota_header() { speedj('/js/page/header.js') }
function rota_login() { speedj('/js/autenticacao/login.js') }
function include_contents_csv() { speedj('/js/contents/content_csv.js') } */

var getUserMedia
var myStream
var socket
const users = new Map()

async function start(data) {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        screenStream.getAudioTracks().forEach(track => {
            screenStream.addTrack(track);
        });

        myStream = screenStream;
        document.getElementById('preview-player').srcObject = myStream;
        socket = initServerConnection(data);
    } catch (err) {
        console.log(err);
        alert(err);
    }
}

function initServerConnection(data) {

    var socket = io('https://socket-io-7yss.onrender.com', {
        query: {
            room: data.room,
            user: data.user,
            room_name: data.room_name,
            card_date: data.card_date
        }
    })

    document.querySelector('videocall').setAttribute("status", "entrando")

    socket.on('disconnect-user', function (data) {
        var user = users.get(data.id)
        if (user) {
            users.delete(data.id)
            user.selfDestroy()
        }
    })

    socket.on('call', function (data) {

        let user = new User(data.id)
        user.pc = createPeer(user)
        users.set(data.id, user)

        createOffer(user, socket)
    })

    socket.on('offer', function (data) {

        var user = users.get(data.id)
        if (user) {
            answerPeer(user, data.offer, socket)
        } else {
            let user = new User(data.id)
            user.pc = createPeer(user)
            users.set(data.id, user)
            answerPeer(user, data.offer, socket)
        }
    })

    socket.on('answer', function (data) {

        var user = users.get(data.id)
        if (user) {
            user.pc.setRemoteDescription(data.answer)
        }
    })

    socket.on('candidate', function (data) {
        var user = users.get(data.id)
        if (user) {
            user.pc.addIceCandidate(data.candidate)
        } else {
            let user = new User(data.id)
            user.pc = createPeer(user)
            user.pc.addIceCandidate(data.candidate)
            users.set(data.id, user)
        }
    })

    socket.on('connect', function () {
        document.querySelector('videocall').setAttribute("status", "conectando")
    })

    socket.on('connect_error', function (error) {

        console.log('Connection ERROR!')
        console.log(error)
        document.querySelector('videocall').setAttribute("status", "erro")

        setTimeout(() => {

            document.querySelector('videocall').setAttribute("status", "reconectando")
            socket.connect();

        }, 1000);

        leave()
    })

    return socket
}

function leave() {
    socket.close()
    for (var user of users.values()) {
        user.selfDestroy()
    }
    users.clear()

}

function addVideoPlayer(stream) {

    var template = new DOMParser().parseFromString('<user><video autoplay volume="10"></video></user>', 'text/html')
    template.getElementsByTagName('video')[0].srcObject = stream

    var divPlayer = template.body.childNodes[0]
    var videocall = document.querySelector("videocall");

    videocall.appendChild(divPlayer);

    return divPlayer
}

class User {
    constructor(id) {
        this.id = id;
    }

    selfDestroy() {
        if (this.player) {
            this.player.remove()
        }

        if (this.pc) {
            this.pc.close()
            this.pc.onicecandidate = null
            this.pc.ontrack = null
            this.pc = null
        }
    }

    sendMessage(message) {
        if (this.dc) {
            this.dc.send(message)
        }
    }
}

const { RTCPeerConnection } = window;

function createPeer(user) {
    const rtcConfiguration = {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    }
    var pc = new RTCPeerConnection(rtcConfiguration)
    pc.onicecandidate = function (event) {
        if (!event.candidate) {
            return
        }

        socket.emit('candidate', {
            id: user.id,
            candidate: event.candidate
        })
    }

    for (const track of myStream.getTracks()) {
        pc.addTrack(track, myStream);
    }

    pc.ontrack = function (event) {
        if (user.player) {
            return
        }
        user.player = addVideoPlayer(event.streams[0])
    }

    pc.ondatachannel = function (event) {
        user.dc = event.channel
        setupDataChannel(user.dc)
    }

    return pc
}

function createOffer(user, socket) {
    user.dc = user.pc.createDataChannel('chat')
    setupDataChannel(user.dc)

    user.pc.createOffer().then(function (offer) {
        user.pc.setLocalDescription(offer).then(function () {
            socket.emit('offer', {
                id: user.id,
                offer: offer
            })
        })
    })
}

function answerPeer(user, offer, socket) {
    user.pc.setRemoteDescription(offer).then(function () {
        user.pc.createAnswer().then(function (answer) {
            user.pc.setLocalDescription(answer).then(function () {
                socket.emit('answer', {
                    id: user.id,
                    answer: answer
                })
            })
        })
    })
}

function setupDataChannel(dataChannel) {
    dataChannel.onopen = checkDataChannelState
    dataChannel.onclose = checkDataChannelState
    dataChannel.onmessage = function (e) {
        addMessage(e.data)
    }
}

function checkDataChannelState(dataChannel) {
    console.log('WebRTC channel state is:', dataChannel.type)
}