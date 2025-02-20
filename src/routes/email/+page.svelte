<script>
  import { onMount } from "svelte";
  import * as api from "$lib/utils/api";
  let subject = "";
  let templates = [];
  let selectedTemplate = "";
  let isSending = false;
  let sendError = "";
  let sendSuccess = "";

  async function loadTemplates() {
    try {
      const tpls = await api.fetchTemplates();
      templates = tpls;
      if (tpls.length > 0) {
        selectedTemplate = tpls[0];
        onTemplateChange();
      }
    } catch (error) {
      console.error("템플릿 불러오기 오류:", error);
    }
  }

  function parseTemplateProperties(content) {
    const regex = /{{\s*property\s+"([^"]+)"\s*}}/g;
    let match;
    let props = new Set();
    while ((match = regex.exec(content)) !== null) {
      props.add(match[1].trim());
    }
    return Array.from(props);
  }

  function extractSubjectFromTemplate(templateHTML) {
    const regex = /<title>([\s\S]*?)<\/title>/i;
    const match = templateHTML.match(regex);
    return match ? match[1].trim() : "";
  }

  let allowedProperties = [];
  async function updateAllowedProperties() {
    if (!selectedTemplate) return;
    try {
      const tmplData = await api.fetchTemplate(selectedTemplate);
      allowedProperties = parseTemplateProperties(tmplData.content);
      recipients = recipients.map((r) => {
        let newCustom = { ...r.custom };
        allowedProperties.forEach((key) => {
          if (!(key in newCustom)) newCustom[key] = "";
        });
        Object.keys(newCustom).forEach((key) => {
          if (!allowedProperties.includes(key)) delete newCustom[key];
        });
        return { ...r, custom: newCustom };
      });
    } catch (err) {
      console.error("템플릿 내용 파싱 오류:", err);
    }
  }

  async function onTemplateChange() {
    updateAllowedProperties();
    const tmplData = await api.fetchTemplate(selectedTemplate);
    subject = extractSubjectFromTemplate(tmplData.content);
  }
  let activeTab = "manual"; // "manual" | "bulk" | "select"
  let recipients = []; // 각 요소: { name, email, custom }
  let manualName = "";
  let manualEmail = "";
  function addManualRecipient() {
    const name = manualName.trim();
    const email = manualEmail.trim();
    if (!name || !email) {
      alert("이름과 이메일을 모두 입력하세요.");
      return;
    }
    if (!recipients.find((r) => r.email === email)) {
      let custom = {};
      allowedProperties.forEach((prop) => (custom[prop] = ""));
      recipients = [...recipients, { name, email, custom }];
      manualName = "";
      manualEmail = "";
    } else {
      alert("이미 추가된 사용자입니다.");
    }
  }

  let bulkText = "";
  function addBulkRecipients() {
    const lines = bulkText.trim().split("\n");
    const newRecipients = [];
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      const parts = line.split("\t");
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const email = parts[1].trim();
        const customValues = parts.slice(2);
        if (name && email && !recipients.find((r) => r.email === email)) {
          let custom = {};
          allowedProperties.forEach(
            (prop) => (custom[prop] = customValues.shift() || ""),
          );
          newRecipients.push({ name, email, custom });
        }
      }
    }
    if (newRecipients.length > 0) {
      recipients = [...recipients, ...newRecipients];
      bulkText = "";
    } else {
      alert("추가할 수신자 데이터가 없습니다.");
    }
  }

  let allUsers = [];
  let groups = [];
  let selectedGroup = "";
  let selectedUserEmails = new Set();

  onMount(async () => {
    try {
      const users = await api.fetchUsers();
      allUsers = users;
      const groupSet = new Set();
      users.forEach((u) => {
        if (u.groups_obj && Array.isArray(u.groups_obj)) {
          u.groups_obj.forEach((g) => groupSet.add(g.name));
        }
      });
      groups = Array.from(groupSet).sort();
    } catch (e) {
      console.error("사용자 목록 불러오기 오류:", e);
    }
    loadTemplates();
  });

  $: filteredUsers = selectedGroup
    ? allUsers.filter(
        (user) =>
          user.groups_obj &&
          user.groups_obj.some((g) => g.name === selectedGroup),
      )
    : allUsers;

  function toggleUser(email) {
    if (selectedUserEmails.has(email)) {
      selectedUserEmails.delete(email);
      selectedUserEmails = new Set([...selectedUserEmails]);
    } else {
      selectedUserEmails.add(email);
      selectedUserEmails = new Set([...selectedUserEmails]);
    }
  }

  function addSelectedRecipients() {
    allUsers.forEach((user) => {
      if (selectedUserEmails.has(user.email)) {
        if (!recipients.find((r) => r.email === user.email)) {
          let custom = {};
          allowedProperties.forEach((prop) => (custom[prop] = ""));
          recipients = [
            ...recipients,
            { name: user.name, email: user.email, custom },
          ];
        }
      }
    });
    selectedUserEmails = new Set();
  }

  function removeRecipient(index) {
    recipients = recipients.filter((_, i) => i !== index);
  }

  async function sendEmail() {
    sendError = "";
    sendSuccess = "";
    if (recipients.length === 0) {
      alert("수신자가 없습니다.");
      return;
    }
    if (!selectedTemplate) {
      sendError = "템플릿을 선택하세요.";
      return;
    }
    if (!subject.trim()) {
      sendError = "제목을 입력하세요.";
      return;
    }
    isSending = true;
    try {
      const res = await api.sendEmail({
        template: selectedTemplate,
        subject: subject,
        recipient: recipients,
      });
      sendSuccess = res.message;
    } catch (err) {
      sendError = err.message;
    } finally {
      isSending = false;
    }
  }
</script>

<svelte:head>
  <title>Email</title>
</svelte:head>

<div class="max-w-3xl mx-auto p-4 space-y-6">
  <div class="email-header-section">
    <h3 class="text-xl font-semibold">이메일 발송</h3>
    <div class="space-y-2 mt-2">
      <label for="template-select" class="block font-medium">Template</label>
      <select
        id="template-select"
        bind:value={selectedTemplate}
        on:change={onTemplateChange}
      >
        {#each templates as tpl}
          <option value={tpl}>{tpl}</option>
        {/each}
      </select>
    </div>
    <div class="space-y-2 mt-2">
      <label for="subject" class="block font-medium">Subject</label>
      <input
        id="subject"
        type="text"
        bind:value={subject}
        placeholder="Email subject"
      />
    </div>
  </div>

  <h2 class="text-2xl font-bold mb-4">사용자 추가</h2>
  <div class="tabs">
    <button
      class="tab {activeTab === 'manual' ? 'active' : ''}"
      on:click={() => (activeTab = "manual")}
    >
      수동 추가
    </button>
    <button
      class="tab {activeTab === 'bulk' ? 'active' : ''}"
      on:click={() => (activeTab = "bulk")}
    >
      대량 추가
    </button>
    <button
      class="tab {activeTab === 'select' ? 'active' : ''}"
      on:click={() => (activeTab = "select")}
    >
      기존 사용자 추가
    </button>
  </div>
  {#if activeTab === "manual"}
    <div class="tab-content">
      <h3 class="text-lg font-semibold mb-2">수동 추가</h3>
      <div class="space-y-2">
        <input type="text" placeholder="이름" bind:value={manualName} />
        <input type="email" placeholder="이메일" bind:value={manualEmail} />
      </div>
      <button class="btn-blue mt-2" on:click={addManualRecipient}>추가</button>
    </div>
  {:else if activeTab === "bulk"}
    <div class="tab-content">
      <h3 class="text-lg font-semibold mb-2">대량 추가</h3>
      <textarea
        rows="4"
        bind:value={bulkText}
        placeholder="예: 이름[TAB]이메일&#10;홍길동[TAB]hong@example.com"
      ></textarea>
      <button class="btn-blue mt-2" on:click={addBulkRecipients}>추가</button>
    </div>
  {:else if activeTab === "select"}
    <div class="tab-content">
      <h3 class="text-lg font-semibold mb-2">기존 사용자 추가</h3>
      <select bind:value={selectedGroup}>
        <option value="">전체 그룹</option>
        {#each groups as group}
          <option value={group}>{group}</option>
        {/each}
      </select>
      <div class="user-list mt-2">
        {#each filteredUsers as user}
          <div
            class="user-item {selectedUserEmails.has(user.email)
              ? 'selected'
              : ''}"
            role="button"
            tabindex="0"
            on:click={() => toggleUser(user.email)}
            on:keydown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleUser(user.email);
            }}
          >
            <strong>{user.name}</strong> ({user.email})<br />
            <small
              >{user.groups_obj
                ? user.groups_obj.map((g) => g.name).join(", ")
                : ""}</small
            >
          </div>
        {/each}
        {#if filteredUsers.length === 0}
          <p>해당 그룹의 사용자가 없습니다.</p>
        {/if}
      </div>
      <button class="btn-blue mt-2" on:click={addSelectedRecipients}
        >추가</button
      >
    </div>
  {/if}

  <h3 class="text-xl font-semibold mt-6">추가된 사용자</h3>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="header-cell">Name</th>
          <th class="header-cell">Email</th>
          {#if allowedProperties.length > 0}
            {#each allowedProperties as prop}
              <th class="header-cell">{prop}</th>
            {/each}
          {/if}
          <th class="header-cell">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each recipients as rec, idx}
          <tr>
            <td>
              <input type="text" bind:value={rec.name} placeholder="Name" />
            </td>
            <td>
              <input type="email" bind:value={rec.email} placeholder="Email" />
            </td>
            {#if allowedProperties.length > 0}
              {#each allowedProperties as prop}
                <td>
                  <input
                    type="text"
                    placeholder={prop}
                    value={rec.custom[prop] || ""}
                    on:input={(e) => (rec.custom[prop] = e.target.value)}
                  />
                </td>
              {/each}
            {/if}
            <td>
              <button
                type="button"
                on:click={() => removeRecipient(idx)}
                class="btn-red"
              >
                Remove
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if recipients.length == 0}
    <p>추가된 사용자가 없습니다.</p>
  {/if}

  <div class="email-send-section mt-6">
    <button class="btn-blue mt-2" on:click={sendEmail}>
      {isSending ? "Sending..." : "발송"}
    </button>
    {#if sendError}
      <p class="text-red-500 mt-2">{sendError}</p>
    {/if}
    {#if sendSuccess}
      <p class="text-green-500 mt-2">{sendSuccess}</p>
    {/if}
  </div>
</div>

<style>
  .email-header-section {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 6px;
  }
  .tabs {
    display: flex;
    border-bottom: 1px solid #ccc;
    margin-bottom: 1rem;
  }
  .tab {
    padding: 0.5rem 1rem;
    cursor: pointer;
    border: none;
    background: none;
    font-weight: bold;
    margin-right: 1rem;
  }
  .tab.active {
    border-bottom: 2px solid #007bff;
    color: #007bff;
  }
  .tab-content {
    margin-bottom: 1rem;
  }
  /* 기존 사용자 추가 */
  .user-list {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 0.5rem;
  }
  .user-item {
    padding: 0.5rem;
    border: 1px solid transparent;
    cursor: pointer;
    margin-bottom: 0.5rem;
  }
  .user-item.selected {
    background-color: #d1e7ff;
    border: 1px solid #007bff;
  }
  /* 테이블 */
  .table-container {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    white-space: nowrap;
    text-align: center;
    vertical-align: middle;
  }
  th.header-cell {
    vertical-align: middle;
  }
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-2px);
    }
    40% {
      transform: translateX(2px);
    }
    60% {
      transform: translateX(-2px);
    }
    80% {
      transform: translateX(2px);
    }
    100% {
      transform: translateX(0);
    }
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn-blue {
    background-color: #007bff;
    color: #fff;
  }
  .btn-red {
    background-color: #dc3545;
    color: #fff;
  }
  .mt-2 {
    margin-top: 0.5rem;
  }
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
</style>
