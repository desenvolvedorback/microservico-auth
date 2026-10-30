// Aponta para o microsserviço de Auth na porta 3001
const authApi = axios.create({
  baseURL: 'http://localhost:3007/api/auth'
});

const statusMensagem = document.getElementById('statusMensagem');

function exibirFeedback(texto, sucesso = true) {
  if (!statusMensagem) return;
  statusMensagem.style.display = 'block';
  statusMensagem.style.backgroundColor = sucesso ? '#d4edda' : '#f8d7da';
  statusMensagem.style.color = sucesso ? '#155724' : '#721c24';
  statusMensagem.textContent = texto;
}


// EVENTO: CADASTRO DE USUÁRIO (cadastro.html)

const formCadastro = document.getElementById('formCadastro');
if (formCadastro) {
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      nome: document.getElementById('nome').value,
      sobrenome: document.getElementById('sobrenome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value
    };

    try {
      const response = await authApi.post('/cadastro', payload);
      exibirFeedback(response.data.mensagem, true);

      // Limpa os campos e redireciona após 2 segundos
      formCadastro.reset();
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);

    } catch (error) {
      const msg = error.response?.data?.erro ||
        (error.request ? 'Não foi possível conectar à API. Verifique se o servidor está ativo na porta 3007.' : 'Erro ao realizar o cadastro.');
      exibirFeedback(msg, false);
    }
  });
}


// EVENTO: LOGIN DE USUÁRIO (login.html)

const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value
    };

    try {
      const response = await authApi.post('/login', payload);
      exibirFeedback(`Bem-vindo(a), ${response.data.usuario.nome}!`, true);

      // Salva os dados do usuário autenticado na sessão do navegador
      sessionStorage.setItem('usuarioLogado', JSON.stringify(response.data.usuario));

      // Redireciona para o sistema principal de produtos após 1.5s
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (error) {
      const msg = error.response?.data?.erro ||
        (error.request ? 'Não foi possível conectar à API. Verifique se o servidor está ativo na porta 3007.' : 'Erro ao tentar autenticar.');
      exibirFeedback(msg, false);
    }
  });
}