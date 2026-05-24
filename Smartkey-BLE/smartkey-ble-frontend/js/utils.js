/**
 * utils.js — Funções auxiliares do SmartKey BLE
 */

/**
 * Retorna o token JWT armazenado (sessionStorage preferido).
 * @returns {string|null}
 */
function getToken() {
  return sessionStorage.getItem('smartkey_token') || localStorage.getItem('smartkey_token');
}

/**
 * Armazena o token JWT.
 * @param {string} token
 * @param {boolean} persistent - true usa localStorage, false usa sessionStorage
 */
function setToken(token, persistent = false) {
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem('smartkey_token', token);
}

/**
 * Remove o token de ambos os storages (logout).
 */
function clearToken() {
  sessionStorage.removeItem('smartkey_token');
  localStorage.removeItem('smartkey_token');
}

/**
 * Verifica (de forma simples) se o JWT ainda é válido checando o campo exp.
 * A validação real deve acontecer no backend.
 * @returns {boolean}
 */
function isTokenValid() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/**
 * Redireciona para a página de login.
 */
function redirectToLogin() {
  clearToken();
  if (window.location.pathname.includes('/smartkey-ble-frontend/')) {
    window.location.href = '../index.html';
  } else if (window.location.pathname.includes('/Smartkey-BLE/')) {
    window.location.href = 'index.html';
  } else {
    window.location.href = 'Smartkey-BLE/index.html';
  }
}

/**
 * Redireciona para o dashboard após autenticação.
 */
function redirectToDashboard() {
  if (window.location.pathname.includes('/smartkey-ble-frontend/')) {
    window.location.href = 'dashboard.html';
  } else if (window.location.pathname.includes('/Smartkey-BLE/')) {
    window.location.href = 'smartkey-ble-frontend/dashboard.html';
  } else {
    window.location.href = 'Smartkey-BLE/smartkey-ble-frontend/dashboard.html';
  }
}

/**
 * Endpoint base da API — altere para a URL real do backend.
 * Em desenvolvimento, pode apontar para http://localhost:3000
 */
const API_BASE = 'https://smartkey-backend-api.onrender.com';
