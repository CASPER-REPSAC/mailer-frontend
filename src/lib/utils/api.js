const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * 백엔드의 /api/me 엔드포인트를 호출하여 현재 로그인한 사용자의 정보를 가져옵니다.
 * Method: GET
 */
export async function fetchUser() {
  const res = await fetch(`${API_BASE}/api/me`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return await res.json();
}

/**
 * 백엔드의 /login 엔드포인트로 리디렉션하여 OIDC 로그인 프로세스를 시작합니다.
 */
export function login() {
  window.location.href = `${API_BASE}/login`;
}

/**
 * 백엔드의 /logout 엔드포인트를 호출하여 사용자 로그아웃을 수행합니다.
 * Method: POST
 */
export async function logout() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Logout failed");
  return await res.json();
}

/**
 * 백엔드의 /api/templates 엔드포인트를 호출하여 템플릿 목록을 가져옵니다.
 * Method: GET
 */
export async function fetchTemplates() {
  const res = await fetch(`${API_BASE}/api/templates`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch templates");
  return (await res.json()).templates.sort();
}

/**
 * 백엔드의 /api/templates/:name 엔드포인트를 호출하여 특정 템플릿의 상세 정보를 가져옵니다.
 * Method: GET
 * @param {string} name - 템플릿 이름
 */
export async function fetchTemplate(name) {
  if(fetchTemplate.cache && fetchTemplate.cache[name]) {
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

/**
 * 백엔드의 /api/templates/:name 엔드포인트를 호출하여 템플릿 내용을 업데이트합니다.
 * Method: POST
 * @param {string} name - 템플릿 이름
 * @param {string} content - 업데이트할 템플릿 HTML 내용
 */
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

/**
 * 백엔드의 /api/templates/:name 엔드포인트를 호출하여 템플릿을 삭제합니다.
 * Method: DELETE
 * @param {string} name - 삭제할 템플릿 이름
 */
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

/**
 * 백엔드의 /api/templates/preview/:name 엔드포인트를 호출하여 템플릿 미리보기를 생성합니다.
 * Method: POST
 * @param {string} name - 미리보기할 템플릿 이름
 * @param {string} content - 미리보기할 템플릿 HTML 내용
 */
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
  // 미리보기로 생성된 HTML 문자열을 반환합니다.
  return await res.text();
}

/**
 * 백엔드의 /api/users 엔드포인트를 호출하여 사용자 목록을 가져옵니다.
 * Method: GET
 */
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/api/users`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  const users = await res.json();
  return users ? users.sort((a, b) => a.name.localeCompare(b.name)) : [];
}

/**
 * 백엔드의 /api/email 엔드포인트를 호출하여 이메일 발송 요청을 보냅니다.
 * Method: POST
 * @param {Object} param0 - 이메일 발송 정보
 * @param {string} param0.template - 사용 템플릿 이름
 * @param {string} param0.subject - 이메일 제목
 * @param {Array} param0.recipient - 수신자 목록 (객체 배열, 예: { name, email })
 */
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

/**
 * 백엔드의 /api/images/upload 엔드포인트를 호출하여 이미지를 업로드합니다.
 * Method: POST (multipart/form-data)
 * @param {File} file - 업로드할 이미지 파일
 */
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

/**
 * 백엔드의 /api/images/ 엔드포인트를 호출하여 업로드된 이미지 목록을 가져옵니다.
 * Method: GET
 */
export async function fetchImages() {
  const res = await fetch(`${API_BASE}/api/images/`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch images");
  const images = await res.json();
  return images.images ? images.images.sort() : [];
}

/**
 * 백엔드의 /api/images/:filename 엔드포인트를 호출하여 특정 이미지를 삭제합니다.
 * Method: DELETE
 * @param {string} filename - 삭제할 이미지 파일명
 */
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

/**
 * 주어진 이미지 파일명에 대한 전체 URL을 반환합니다.
 * @param {string} filename - 이미지 파일명
 */
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