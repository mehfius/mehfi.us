(async function (){

  // Função para decodificar JWT
  function decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erro ao decodificar JWT:', e);
      return null;
    }
  }

  // Função genérica para login com OAuth
  async function signInWithOAuth(provider) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({ provider });

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

  // Funções específicas para cada provedor
  const signInWithGitHub = () => signInWithOAuth('github');
  const signInWithGoogle = () => signInWithOAuth('google');

  // Função para logout
  async function signOut(event) {
    event.preventDefault();
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw new Error(error.message);

      console.log('Logout realizado com sucesso');
      sessionStorage.removeItem('user_name');
      sessionStorage.removeItem('access_token');
      document.getElementById('logout_button')?.remove();
      checkAuthState();
    } catch (err) {
      console.error('Erro ao fazer logout:', err.message);
    }
  }

  // Função para criar campo de formulário
  function createFormField(tag, label_text, input_type) {
    const field = jsonToObject({ tag });
    field.append(
      jsonToObject({ tag: 'label', innerhtml: label_text }),
      jsonToObject({ tag: 'input', type: input_type })
    );
    return field;
  }

  // Função para criar botão
  function createButton(id, text, onclick) {
    return jsonToObject({ 
      tag: 'button', 
      id, 
      innerhtml: text, 
      onclick 
    });
  }

  // Função para criar formulário de login
  function createLoginForm() {
    const e_login = jsonToObject({ tag: 'login' });
    const e_fields = jsonToObject({ tag: 'fields' });

    e_fields.append(
      createFormField('email', 'Email: ', 'text'),
      createFormField('password', 'Senha: ', 'password')
    );

    const e_buttons = jsonToObject({ tag: 'buttons' });
    e_buttons.append(
      createButton(null, 'login', 'rota_login()'),
      createButton('git_login', 'Git Hub', signInWithGitHub),
      createButton('google_login', 'Google', signInWithGoogle)
    );

    e_login.append(e_fields, e_buttons);
    return e_login;
  }

  // Função principal para verificar estado de autenticação
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
        rota_contents();
        document.body.append(
          createButton('logout_button', 'Logout', signOut)
        );
      } else {
        console.log('Nenhuma sessão ativa, por favor faça login.');
        document.body.innerHTML = ''; // Limpa o body antes de adicionar o formulário
        document.body.appendChild(createLoginForm());
      }
    } catch (err) {
      console.error('Erro ao verificar estado da autenticação:', err);
    }
  }

  // Inicialização
  document.addEventListener('DOMContentLoaded', checkAuthState);

})();