import { hymnsData } from './hymns.js';

const STORAGE_KEYS = {
  users: 'psaltos_users',
  currentUserId: 'psaltos_current_user_id',
  likes: 'psaltos_likes',
  playlists: 'psaltos_playlists',
};

let runtimeUploads = [];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readJson(STORAGE_KEYS.users, []);
}

function setUsers(users) {
  writeJson(STORAGE_KEYS.users, users);
}

function getCurrentUserId() {
  const raw = localStorage.getItem(STORAGE_KEYS.currentUserId);
  return raw ? Number(raw) : null;
}

function setCurrentUserId(userId) {
  if (userId === null || userId === undefined) {
    localStorage.removeItem(STORAGE_KEYS.currentUserId);
    return;
  }
  localStorage.setItem(STORAGE_KEYS.currentUserId, String(userId));
}

function nextId(list) {
  return list.length ? Math.max(...list.map((item) => item.id || 0)) + 1 : 1;
}

function getCurrentUserRecord() {
  const userId = getCurrentUserId();
  if (!userId) return null;
  return getUsers().find((u) => u.id === userId) || null;
}

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profile: {
      display_name: user.profile?.display_name || user.username,
      avatar: user.profile?.avatar || '',
    },
  };
}

function buildCatalog() {
  const base = hymnsData().map((hymn, index) => ({
    id: index + 1,
    title: hymn.englishTitle,
    audio_url: hymn.audioFileLink,
  }));

  return [...base, ...runtimeUploads];
}

function findHymnById(hymnId) {
  const id = Number(hymnId);
  if (!Number.isFinite(id)) return null;
  return buildCatalog().find((h) => h.id === id) || null;
}

function getLikesStore() {
  return readJson(STORAGE_KEYS.likes, {});
}

function setLikesStore(store) {
  writeJson(STORAGE_KEYS.likes, store);
}

function getPlaylistsStore() {
  return readJson(STORAGE_KEYS.playlists, {});
}

function setPlaylistsStore(store) {
  writeJson(STORAGE_KEYS.playlists, store);
}

function requireAuth() {
  const user = getCurrentUserRecord();
  if (!user) throw new Error('Please sign in first.');
  return user;
}

async function fileToDataUrl(file) {
  if (!file) return '';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

function formatLike(userId, hymnId, id) {
  const hymn = findHymnById(hymnId);
  return {
    id,
    user: userId,
    hymn: hymn
      ? {
          id: hymn.id,
          title: hymn.title,
          audio_url: hymn.audio_url,
        }
      : null,
  };
}

function hydratePlaylist(playlist) {
  const itemIds = Array.isArray(playlist.item_hymn_ids) ? playlist.item_hymn_ids : [];
  const items = itemIds
    .map((hymnId, index) => {
      const hymn = findHymnById(hymnId);
      return {
        id: index + 1,
        hymn: hymn
          ? {
              id: hymn.id,
              title: hymn.title,
              audio_url: hymn.audio_url,
            }
          : null,
      };
    })
    .filter((item) => item.hymn !== null);

  return {
    id: playlist.id,
    title: playlist.title,
    is_public: Boolean(playlist.is_public),
    thumbnail: playlist.thumbnail || '',
    items,
  };
}

export async function ensureCsrf() {
  return null;
}

export function resolveMediaUrl(path) {
  if (!path) return '';
  return path;
}

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://127.0.0.1:8000';

export function proxyAudioUrl(url) {
  if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('/')) return url;
  let normalized = url;
  if (normalized.startsWith('http://media.tasbeha.org')) {
    normalized = normalized.replace('http://media.tasbeha.org', 'https://media.tasbeha.org');
  }

  try {
    const parsed = new URL(normalized);
    const backendOrigin = new URL(BACKEND_BASE_URL).origin;
    if (parsed.origin === backendOrigin) return normalized;
  } catch (err) {
    return normalized;
  }

  return `${BACKEND_BASE_URL}/api/proxy/?url=${encodeURIComponent(normalized)}`;
}

export async function register({ username, email, password, display_name }) {
  if (!email || !password) throw new Error('Email and password are required.');

  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = (username || email.split('@')[0] || '').trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  if (normalizedUsername && users.some((u) => u.username.toLowerCase() === normalizedUsername)) {
    throw new Error('This username is already taken.');
  }

  const newUser = {
    id: nextId(users),
    username: normalizedUsername || `user${users.length + 1}`,
    email: normalizedEmail,
    password,
    profile: {
      display_name: (display_name || '').trim() || normalizedUsername || normalizedEmail,
      avatar: '',
    },
  };

  users.push(newUser);
  setUsers(users);
  setCurrentUserId(newUser.id);

  return { authenticated: true, user: toPublicUser(newUser) };
}

export async function login({ username_or_email, password }) {
  const users = getUsers();
  const value = (username_or_email || '').trim().toLowerCase();
  const user = users.find(
    (u) => u.email.toLowerCase() === value || u.username.toLowerCase() === value
  );

  if (!user || user.password !== password) {
    throw new Error('Invalid email/username or password.');
  }

  setCurrentUserId(user.id);
  return { authenticated: true, user: toPublicUser(user) };
}

export async function logout() {
  setCurrentUserId(null);
  return null;
}

export async function me() {
  const user = getCurrentUserRecord();
  if (!user) {
    return { authenticated: false, user: null };
  }
  return { authenticated: true, user: toPublicUser(user) };
}

export async function getPlaylists() {
  const user = requireAuth();
  const store = getPlaylistsStore();
  const list = Array.isArray(store[user.id]) ? store[user.id] : [];
  return list.map(hydratePlaylist);
}

export async function updatePlaylist(playlistId, { title, is_public, thumbnail }) {
  const user = requireAuth();
  const store = getPlaylistsStore();
  const list = Array.isArray(store[user.id]) ? [...store[user.id]] : [];
  const index = list.findIndex((p) => p.id === Number(playlistId));

  if (index < 0) throw new Error('Playlist not found.');

  const updated = { ...list[index] };
  if (title !== undefined) updated.title = String(title).trim() || updated.title;
  if (is_public !== undefined) updated.is_public = Boolean(is_public);
  if (thumbnail) updated.thumbnail = await fileToDataUrl(thumbnail);

  list[index] = updated;
  store[user.id] = list;
  setPlaylistsStore(store);

  return hydratePlaylist(updated);
}

export async function createPlaylist({ title, is_public, thumbnail }) {
  const user = requireAuth();
  const trimmedTitle = String(title || '').trim();
  if (!trimmedTitle) throw new Error('Playlist title is required.');

  const store = getPlaylistsStore();
  const list = Array.isArray(store[user.id]) ? [...store[user.id]] : [];
  const created = {
    id: nextId(list),
    title: trimmedTitle,
    is_public: Boolean(is_public),
    thumbnail: thumbnail ? await fileToDataUrl(thumbnail) : '',
    item_hymn_ids: [],
  };

  list.push(created);
  store[user.id] = list;
  setPlaylistsStore(store);

  return hydratePlaylist(created);
}

export async function addPlaylistItem(playlistId, hymnId) {
  const user = requireAuth();
  const hymn = findHymnById(hymnId);
  if (!hymn) throw new Error('Hymn not found.');

  const store = getPlaylistsStore();
  const list = Array.isArray(store[user.id]) ? [...store[user.id]] : [];
  const index = list.findIndex((p) => p.id === Number(playlistId));
  if (index < 0) throw new Error('Playlist not found.');

  const currentIds = Array.isArray(list[index].item_hymn_ids) ? [...list[index].item_hymn_ids] : [];
  if (!currentIds.includes(hymn.id)) currentIds.push(hymn.id);
  list[index] = { ...list[index], item_hymn_ids: currentIds };

  store[user.id] = list;
  setPlaylistsStore(store);

  return hydratePlaylist(list[index]);
}

export async function removePlaylistItem(playlistId, hymnId) {
  const user = requireAuth();
  const store = getPlaylistsStore();
  const list = Array.isArray(store[user.id]) ? [...store[user.id]] : [];
  const index = list.findIndex((p) => p.id === Number(playlistId));
  if (index < 0) throw new Error('Playlist not found.');

  const currentIds = Array.isArray(list[index].item_hymn_ids) ? list[index].item_hymn_ids : [];
  list[index] = {
    ...list[index],
    item_hymn_ids: currentIds.filter((id) => id !== Number(hymnId)),
  };

  store[user.id] = list;
  setPlaylistsStore(store);

  return null;
}

export async function getLikes() {
  const user = requireAuth();
  const store = getLikesStore();
  const ids = Array.isArray(store[user.id]) ? store[user.id] : [];
  return ids
    .map((hymnId, index) => formatLike(user.id, hymnId, index + 1))
    .filter((like) => like.hymn !== null);
}

export async function likeHymn(hymnId) {
  const user = requireAuth();
  const hymn = findHymnById(hymnId);
  if (!hymn) throw new Error('Hymn not found.');

  const store = getLikesStore();
  const ids = Array.isArray(store[user.id]) ? [...store[user.id]] : [];
  if (!ids.includes(hymn.id)) ids.push(hymn.id);

  store[user.id] = ids;
  setLikesStore(store);

  return formatLike(user.id, hymn.id, ids.indexOf(hymn.id) + 1);
}

export async function unlikeHymn(hymnId) {
  const user = requireAuth();
  const store = getLikesStore();
  const ids = Array.isArray(store[user.id]) ? store[user.id] : [];
  store[user.id] = ids.filter((id) => id !== Number(hymnId));
  setLikesStore(store);
  return null;
}

export async function uploadHymn({ title, audio_file }) {
  requireAuth();

  if (!audio_file) throw new Error('Audio file is required.');

  const catalog = buildCatalog();
  const created = {
    id: nextId(catalog),
    title: String(title || '').trim() || audio_file.name || 'Uploaded hymn',
    audio_url: URL.createObjectURL(audio_file),
  };

  runtimeUploads = [...runtimeUploads, created];
  return created;
}

export async function getHymns() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/hymns/`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch hymns (${response.status})`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return buildCatalog();
  }
}

export async function updateProfile({ display_name, avatar }) {
  const user = requireAuth();
  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index < 0) throw new Error('User not found.');

  const updated = { ...users[index], profile: { ...users[index].profile } };
  if (display_name !== undefined) {
    const trimmed = String(display_name).trim();
    if (!trimmed) throw new Error('Display name cannot be empty.');
    updated.profile.display_name = trimmed;
  }
  if (avatar) {
    updated.profile.avatar = await fileToDataUrl(avatar);
  }

  users[index] = updated;
  setUsers(users);

  return toPublicUser(updated);
}
