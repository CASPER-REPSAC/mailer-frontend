// src/lib/utils/api.js

const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * 템플릿 목록을 불러옵니다.
 */
export async function fetchTemplates() {
  const res = await fetch(`${API_BASE}/api/templates`);
  if (!res.ok) throw new Error("Failed to fetch templates");
  return await res.json();
}

/**
 * 특정 템플릿 정보를 불러옵니다.
 * @param {string} name 템플릿 이름
 */
export async function fetchTemplate(name) {
  const res = await fetch(`${API_BASE}/api/templates/${name}`);
  if (!res.ok) throw new Error(`Failed to fetch template: ${name}`);
  return await res.json();
}

/**
 * 사용자 목록을 불러옵니다.
 */
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/api/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
}

/**
 * 이메일 발송 요청을 보냅니다.
 * @param {Object} data { template, subject, recipient }
 */
export async function sendEmail({ template, subject, recipient }) {
  const res = await fetch(`${API_BASE}/api/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template, subject, recipient })
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Failed to send email: ${errorData}`);
  }
  return await res.json();
}
