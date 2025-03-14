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