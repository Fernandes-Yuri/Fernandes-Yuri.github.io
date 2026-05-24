/**
 * auth.js — Lógica de autenticação do SmartKey BLE
 *
 * Fluxo:
 *   1. Usuário digita senha em index.html e clica em "Entrar"
 *   2. handleLogin() faz POST /api/auth com a senha
 *   3. Backend retorna { token: "..." } em caso de sucesso
 *   4. Token é salvo e o usuário é redirecionado para dashboard.html
 *   5. Em dashboard.html, guardRoute() valida o token antes de renderizar
 */

/**
 * Chamado pelo botão "Entrar" na tela de login.
 * Envia a senha para a API e armazena o token JWT recebido.
 */
async function handleLogin() {
  const input = document.getElementById('senha-input');
  const btn   = document.getElementById('login-btn');
  const error = document.getElementById('login-error');
  const senha = input ? input.value.trim() : '';

  if (!senha) return;

  // Feedback visual — desabilita botão durante a requisição
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
  error.classList.remove('visible');

  try {
    /* -------------------------------------------------------
       Requisição ao backend.
       Em modo de desenvolvimento/mock, você pode substituir
       este bloco por:

         const data = { token: 'mock.jwt.token' };
         if (senha !== 'senhalocal') throw new Error('wrong');

       ------------------------------------------------------- */
    const res = await fetch(`${API_BASE}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!data.token) {
      throw new Error('Token não recebido');
    }

    // Armazena o token e redireciona
    setToken(data.token, false); // false = sessionStorage (fecha guia = logout)
    redirectToDashboard();

  } catch (err) {
    // Exibe mensagem de erro sem recarregar a página
    error.classList.add('visible');
    btn.disabled = false;
    btn.innerHTML = 'Entrar <span class="intro-cta-arrow"><i class="fa-solid fa-arrow-right"></i></span>';
    input.focus();
    input.select();
  }
}

/**
 * Protege o dashboard: redireciona para login se não houver token válido.
 * Deve ser chamado no início do carregamento de dashboard.html.
 */
function guardRoute() {
  if (!isTokenValid()) {
    redirectToLogin();
    return false;
  }
  return true;
}

/**
 * Modo MOCK — usado quando o backend ainda não está disponível.
 * Substitui handleLogin() por uma versão local para testes.
 * Para ativar: defina window.MOCK_MODE = true antes de carregar auth.js.
 */
if (window.MOCK_MODE) {
  window.handleLogin = async function() {
    const input = document.getElementById('senha-input');
    const btn   = document.getElementById('login-btn');
    const error = document.getElementById('login-error');
    const senha = input ? input.value.trim() : '';

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
    error.classList.remove('visible');

    // Simula delay de rede
    await new Promise(r => setTimeout(r, 600));

    if (senha === '424662') {
      // Gera um mock JWT com expiração em 1h
      const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: 'user', exp: Math.floor(Date.now()/1000) + 3600 }));
      const mockToken = `${header}.${payload}.mock_signature`;

      setToken(mockToken, false);
      redirectToDashboard();
    } else {
      error.classList.add('visible');
      btn.disabled = false;
      btn.innerHTML = 'Entrar <span class="intro-cta-arrow"><i class="fa-solid fa-arrow-right"></i></span>';
      input.focus();
      input.select();
    }
  };

  // No modo mock, guardRoute sempre libera (token mock é criado acima)
  window.guardRoute = function() {
    const token = getToken();
    if (!token) { redirectToLogin(); return false; }
    return true;
  };
}
