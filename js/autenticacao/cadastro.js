(async function () {

    speedj('js/autenticacao/login.css')

    document.body.innerHTML = ''
    const e_login = jte({ tag: 'login' });
    const e_fields = jte({ tag: 'fields' });

    e_fields.append(
        jte({ tag: 'label', innerhtml: 'Nome Completo: ' }),
        jte({ tag: 'input', type: 'text', id: 'full_name', required: 'true' }),
        jte({ tag: 'label', innerhtml: 'Email: ' }),
        jte({ tag: 'input', type: 'text', id: 'email' }),
        jte({ tag: 'label', innerhtml: 'Senha: ' }),
        jte({ tag: 'input', type: 'password', id: 'password' })
    );

    const e_actions = jte({ tag: 'actions' });
    e_actions.append(
        jte({
            tag: 'button',
            id: 'login',
            innerhtml: 'Send',
            onclick: async function () {
                try {
                    const full_name = document.getElementById('full_name').value;
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;

                    const { data, error } = await supabaseClient.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: {
                                full_name: full_name
                            }
                        }
                    });

                    if (error) throw error;

                    console.log("Cadastro realizado com sucesso:", data);
                    alert('Cadastro realizado! Verifique seu email para confirmar.');

                } catch (err) {
                    console.error("Erro ao cadastrar:", err.message);
                    alert('Erro ao cadastrar: ' + err.message);
                }
            }
        })
    );

    const e_buttons = jte({ tag: 'buttons' });
    e_buttons.append(
        jte({
            tag: 'button',
            id: 'insert',
            innerhtml: 'Sign In',
            onclick: async function () {
                speedj('js/autenticacao/login.js')
            }
        }),
        jte({
            tag: 'button',
            id: 'git_login',
            innerhtml: 'Git Hub',
            onclick: () => {
                signInWithGitHub();
            }
        }),
        jte({
            tag: 'button',
            id: 'google_login',
            innerhtml: 'Google',
            onclick: () => {
                signInWithGoogle();
            }
        })
    );

    e_login.append(e_fields, e_actions, e_buttons);
    document.body.appendChild(e_login);
})()