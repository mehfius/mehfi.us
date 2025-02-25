(async function () {
    document.body.innerHTML = ''
    const e_login = jsonToObject({ tag: 'login' });
    const e_fields = jsonToObject({ tag: 'fields' });

    e_fields.append(
        jsonToObject({ tag: 'label', innerhtml: 'Email: ' }),
        jsonToObject({ tag: 'input', type: 'text' }),
        jsonToObject({ tag: 'label', innerhtml: 'Senha: ' }),
        jsonToObject({ tag: 'input', type: 'password' })
    );

    const e_buttons = jsonToObject({ tag: 'buttons' });
    e_buttons.append(
        jsonToObject({
            tag: 'button',
            id: 'login',
            innerhtml: 'login'
        }),
        jsonToObject({
            tag: 'button',
            innerhtml: 'Cadastrar'
        }),
        jsonToObject({
            tag: 'button',
            id: 'git_login',
            innerhtml: 'Git Hub'
        }),
        jsonToObject({
            tag: 'button',
            id: 'google_login',
            innerhtml: 'Google'
        })
    );

    e_login.append(e_fields, e_buttons);
    document.body.appendChild(e_login);
})()