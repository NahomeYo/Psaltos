const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api';
const MEDIA_BASE = API_BASE.replace(/\/api\/?$/, '');

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export async function ensureCsrf() {
  await fetch(`${API_BASE}/auth/csrf/`, {
    credentials: 'include',
  });
}

export function resolveMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${MEDIA_BASE}${path}`;
}

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers || {};
  const isForm = options.body instanceof FormData;

  if (!isForm) {
    headers['Content-Type'] = 'application/json';
  }

  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = 'Request failed';
    try {
      const data = await res.json();
      errorDetail = data.detail || JSON.stringify(data);
    } catch (err) {
      // ignore
    }
    throw new Error(errorDetail);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function register({ username, email, password, display_name }) {
  await ensureCsrf();
  return apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, display_name }),
  });
}

export async function login({ username_or_email, password }) {
  await ensureCsrf();
  return apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username_or_email, password }),
  });
}

export async function logout() {
  await ensureCsrf();
  return apiFetch('/auth/logout/', { method: 'POST', body: JSON.stringify({}) });
}

export async function me() {
  return apiFetch('/auth/me/');
}

export async function getPlaylists() {
  return apiFetch('/playlists/');
}

export async function createPlaylist({ title, is_public, thumbnail }) {
  await ensureCsrf();
  const form = new FormData();
  form.append('title', title);
  form.append('is_public', is_public ? 'true' : 'false');
  if (thumbnail) form.append('thumbnail', thumbnail);
  return apiFetch('/playlists/', { method: 'POST', body: form });
}

export async function addPlaylistItem(playlistId, hymnId) {
  await ensureCsrf();
  return apiFetch(`/playlists/${playlistId}/items/`, {
    method: 'POST',
    body: JSON.stringify({ hymn_id: hymnId }),
  });
}

export async function removePlaylistItem(playlistId, hymnId) {
  await ensureCsrf();
  return apiFetch(`/playlists/${playlistId}/items/`, {
    method: 'DELETE',
    body: JSON.stringify({ hymn_id: hymnId }),
  });
}

export async function getLikes() {
  return apiFetch('/likes/');
}

export async function likeHymn(hymnId) {
  await ensureCsrf();
  return apiFetch('/likes/', { method: 'POST', body: JSON.stringify({ hymn_id: hymnId }) });
}

export async function unlikeHymn(hymnId) {
  await ensureCsrf();
  return apiFetch(`/likes/${hymnId}/`, { method: 'DELETE' });
}

export async function uploadHymn({ title, audio_file }) {
  await ensureCsrf();
  const form = new FormData();
  form.append('title', title);
  form.append('audio_file', audio_file);
  return apiFetch('/hymns/', { method: 'POST', body: form });
}

export async function updateProfile({ display_name, avatar }) {
  await ensureCsrf();
  const form = new FormData();
  if (display_name !== undefined) form.append('display_name', display_name);
  if (avatar) form.append('avatar', avatar);
  return apiFetch('/profile/', { method: 'PUT', body: form });
}
