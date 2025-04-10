const API_BASE = import.meta.env.VITE_API_BASE || "";
export async function fetchUser() {
  const res = await fetch(`${API_BASE}/api/me`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return await res.json();
}
export function login() {
  window.location.href = `${API_BASE}/login`;
}
export async function logout() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Logout failed");
  return await res.json();
}
export async function fetchTemplates() {
  const res = await fetch(`${API_BASE}/api/templates`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch templates");
  return (await res.json()).templates.sort();
}
export async function fetchTemplate(name) {
  if (fetchTemplate.cache && fetchTemplate.cache[name]) {
    return fetchTemplate.cache[name];
  }
  const res = await fetch(`${API_BASE}/api/templates/${encodeURIComponent(name)}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error(`Failed to fetch template: ${name}`);
  const template = await res.json();
  fetchTemplate.cache = fetchTemplate.cache || {};
  fetchTemplate.cache[name] = template;
  return template;
}
export async function updateTemplate(name, content) {
  const res = await fetch(`${API_BASE}/api/templates/${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update template ${name}: ${errorText}`);
  }
  return await res.json();
}
export async function deleteTemplate(name) {
  const res = await fetch(`${API_BASE}/api/templates/${encodeURIComponent(name)}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete template ${name}: ${errorText}`);
  }
  return await res.json();
}
export async function previewTemplate(name, content) {
  const res = await fetch(`${API_BASE}/api/templates/preview/${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to generate preview for template ${name}: ${errorText}`);
  }
  return await res.text();
}
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/api/users`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  const users = await res.json();
  return users ? users.sort((a, b) => a.name.localeCompare(b.name)) : [];
}
export async function sendEmail({ template, subject, recipient }) {
  const res = await fetch(`${API_BASE}/api/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ template, subject, recipient })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }
  return await res.json();
}
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE}/api/images/upload`, {
    method: "POST",
    credentials: "include",
    body: formData
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Image upload failed: ${errorText}`);
  }
  return await res.json();
}
export async function fetchImages() {
  const res = await fetch(`${API_BASE}/api/images/`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch images");
  const images = await res.json();
  return images.images ? images.images.sort() : [];
}
export async function deleteImage(filename) {
  const res = await fetch(`${API_BASE}/api/images/${encodeURIComponent(filename)}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete image ${filename}: ${errorText}`);
  }
  return await res.json();
}
export function getImageUrl(filename) {
  return `${API_BASE}/api/images/${filename}`;
}
export default {
  fetchUser,
  login,
  logout,
  fetchTemplates,
  fetchTemplate,
  updateTemplate,
  deleteTemplate,
  previewTemplate,
  fetchUsers,
  sendEmail,
  uploadImage,
  fetchImages,
  deleteImage,
  getImageUrl
};