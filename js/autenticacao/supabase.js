(async function () {
   
    function decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Erro ao decodificar JWT:', e);
            return null;
        }
    }

    async function signInWithOAuth(provider) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.href === 'https://mehfi.us' ? 'https://mehfi.us' : 'http://127.0.0.1:3001'
                }
            });

            if (error) throw new Error(error.message);

            if (data.session) {
                const userInfo = await supabaseClient.auth.getUser();
                if (userInfo.data.user) {
                    const user_name = userInfo.data.user.user_metadata.full_name || "Usuário sem nome";
                    const user_email = userInfo.data.user.email || "Email não disponível";
                    const access_token = data.session.access_token;
                    const decoded_token = decodeJWT(access_token);

                    console.log(`Bem-vindo ${user_name} (${user_email}) via ${provider}`);
                    console.log('Access Token:', access_token);
                    console.log('Access Token Decodificado:', decoded_token);
                    sessionStorage.setItem('user_name', user_name);
                    sessionStorage.setItem('access_token', access_token);
                }
            }
        } catch (err) {
            console.error(`Erro ao fazer login com ${provider}:`, err.message);
        }
    }

    const signInWithGitHub = () => signInWithOAuth('github');
    const signInWithGoogle = () => signInWithOAuth('google');

    async function signOut(event) {
        event.preventDefault();
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw new Error(error.message);

            console.log('Logout realizado com sucesso');

            checkAuthState();

        } catch (err) {
            console.error('Erro ao fazer logout:', err.message);
        }
    }

    async function checkAuthState() {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();

            if (session) {
                const user_name = session.user.user_metadata.full_name || "Usuário sem nome";
                const user_email = session.user.email || "Email não disponível";
                const provider = session.user.app_metadata.provider || "plataforma desconhecida";
                const access_token = session.access_token;
                const decoded_token = decodeJWT(access_token);

                console.log(`Bem-vindo de volta ${user_name} (${user_email}) via ${provider}`);
                console.log('Access Token:', access_token);
                console.log('Access Token Decodificado:', decoded_token);   
                     
                await speedj('js/contents/content.js');
        
                const logout_button = document.getElementById('logout_button');
                if (logout_button) {
                    console.log('Botão de logout encontrado, configurando onclick...');
                    logout_button.onclick = signOut;
                }
            } else {

                console.log('Nenhuma sessão ativa, por favor faça login.');
                await speedj('js/autenticacao/login.js');
                        
                const loginButton = document.getElementById('login');
                if (loginButton) {
                    loginButton.onclick = async function() {
                        try {
                            const email = e_fields.querySelector('input[type="text"]').value;
                            const password = e_fields.querySelector('input[type="password"]').value;
                            
                            const { data, error } = await supabaseClient.auth.signInWithPassword({
                                email,
                                password
                            });

                            if (error) throw error;

                            console.log("Login bem-sucedido:", data);

                        } catch (err) {
                            console.error("Erro ao fazer login:", err.message);
                        }
                    };
                }

                const cadastrarButton = document.getElementById('cadastrar');
                if (cadastrarButton) {
                    cadastrarButton.onclick = async function() {
                        try {
                            const email = e_fields.querySelector('input[type="text"]').value;
                            const password = e_fields.querySelector('input[type="password"]').value;
                            await signUpWithEmail(email, password);
                        } catch (err) {
                            console.error("Erro ao cadastrar:", err.message);
                        }
                    };
                }

                const gitLoginButton = document.getElementById('git_login');
                if (gitLoginButton) {
                    gitLoginButton.onclick = () => {
                        signInWithGitHub();
                    };
                }

                const googleLoginButton = document.getElementById('google_login');
                if (googleLoginButton) {
                    googleLoginButton.onclick = () => {
                        signInWithGoogle();
                    };
                }
            }
        } catch (err) {
            console.error('Erro ao verificar estado da autenticação:', err);
        }
    }

    document.addEventListener('DOMContentLoaded', checkAuthState);

})();