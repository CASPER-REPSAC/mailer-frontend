<script>
  import { onMount } from "svelte";
  import { fetchTemplates, fetchUsers, sendEmail } from "$lib/utils/api";
  let templates = [];
  let selectedTemplate = "";
  let subject = "";

  let manualRecipients = [{ name: "", email: "" }];
  let users = [];
  let groups = [];
  let selectedGroup = "";
  let selectedUserIds = new Set();
  $: groupFilteredUsers = selectedGroup
    ? users.filter(u => u.groups_obj && u.groups_obj.some(g => g.name === selectedGroup))
    : users;
  let isLoading = false;
  let successMsg = "";
  let errorMsg = "";
  onMount(async () => {
    try {
      const tmplData = await fetchTemplates();
      templates = tmplData.templates || [];
      if (templates.length > 0) {
        selectedTemplate = templates[0];
      }
    } catch (e) {
      console.error("템플릿 불러오기 실패:", e);
    }
    try {
      const res = await fetch("/api/users", { credentials: "include" });
      if (res.ok) {
        users = await res.json();
        const groupSet = new Set();
        users.forEach(u => {
          if (u.groups_obj && Array.isArray(u.groups_obj)) {
            u.groups_obj.forEach(g => groupSet.add(g.name));
          }
        });
        groups = Array.from(groupSet);
        groups.sort();
      }
    } catch (e) {
      console.error("사용자 목록 불러오기 실패:", e);
    }
  });

  function addManualRecipient() {
    manualRecipients = [...manualRecipients, { name: "", email: "" }];
  }

  function removeManualRecipient(index) {
    manualRecipients = manualRecipients.filter((_, i) => i !== index);
  }

  function toggleUserSelection(email) {
    if (selectedUserIds.has(email)) {
      selectedUserIds.delete(email);
      selectedUserIds = new Set(selectedUserIds);
    } else {
      selectedUserIds.add(email);
      selectedUserIds = new Set(selectedUserIds);
    }
  }

  async function submitEmail(event) {
    event.preventDefault();
    let recipients = [];

    manualRecipients.forEach(r => {
      if (r.name.trim() && r.email.trim()) {
        recipients.push({ name: r.name.trim(), email: r.email.trim() });
      }
    });

    groupFilteredUsers.forEach(u => {
      if (selectedUserIds.has(u.email)) {
        recipients.push({ name: u.name, email: u.email });
      }
    });

    if (!selectedTemplate) {
      errorMsg = "템플릿을 선택해주세요.";
      return;
    }
    if (!subject.trim()) {
      errorMsg = "제목을 입력해주세요.";
      return;
    }
    if (recipients.length === 0) {
      errorMsg = "최소 하나의 수신자를 입력하거나 선택하세요.";
      return;
    }
    isLoading = true;
    errorMsg = "";
    successMsg = "";
    try {
      const response = await sendEmail({
        template: selectedTemplate,
        subject,
        recipient: recipients
      });
      successMsg = response.message;
    } catch (e) {
      errorMsg = e.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<section class="max-w-2xl mx-auto p-4 space-y-6">
  <h2 class="text-2xl font-bold mb-4">Send Email</h2>
  
  <form on:submit|preventDefault={submitEmail} class="space-y-6">
    <!-- 템플릿 드롭다운 -->
    <div>
      <label class="block font-medium mb-1">Template</label>
      <select bind:value={selectedTemplate} class="w-full border border-gray-300 p-2 rounded">
        {#each templates as tmpl}
          <option value={tmpl}>{tmpl}</option>
        {/each}
      </select>
    </div>
    
    <!-- 제목 입력 -->
    <div>
      <label class="block font-medium mb-1">Subject</label>
      <input type="text" bind:value={subject} class="w-full border border-gray-300 p-2 rounded" />
    </div>
    
    <!-- Manual Recipient 입력란 -->
    <div>
      <h3 class="font-semibold mb-2">Manual Recipients</h3>
      {#each manualRecipients as rec, index}
        <div class="flex space-x-2 mb-2">
          <input type="text" placeholder="Name" bind:value={rec.name} class="flex-grow border border-gray-300 p-2 rounded" />
          <input type="email" placeholder="Email" bind:value={rec.email} class="flex-grow border border-gray-300 p-2 rounded" />
          {#if index > 0}
            <button type="button" on:click={() => removeManualRecipient(index)} class="bg-red-500 hover:bg-red-700 text-white px-2 rounded">
              Remove
            </button>
          {/if}
        </div>
      {/each}
      <button type="button" on:click={addManualRecipient} class="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Add Recipient
      </button>
    </div>
    
    <!-- Group-based Recipient 선택 -->
    <div>
      <h3 class="font-semibold mb-2">Select Recipients by Group</h3>
      <div class="mb-2">
        <label class="block font-medium mb-1">Group</label>
        <select bind:value={selectedGroup} class="w-full border border-gray-300 p-2 rounded">
          <option value="">전체 사용자</option>
          {#each groups as group}
            <option value={group}>{group}</option>
          {/each}
        </select>
      </div>
      <div>
        <p class="mb-1 font-medium">Users</p>
        {#if groupFilteredUsers.length > 0}
          <ul class="max-h-48 overflow-y-auto border border-gray-300 p-2 rounded">
            {#each groupFilteredUsers as user}
              <li class="flex items-center">
                <input
                  type="checkbox"
                  id={user.email}
                  checked={selectedUserIds.has(user.email)}
                  on:change={() => toggleUserSelection(user.email)}
                  class="mr-2"
                />
                <label for={user.email}>
                  {user.name} ({user.email})
                </label>
              </li>
            {/each}
          </ul>
        {:else}
          <p>No users found.</p>
        {/if}
      </div>
    </div>
    
    {#if errorMsg}
      <p class="text-red-500">{errorMsg}</p>
    {/if}
    {#if successMsg}
      <p class="text-green-500">{successMsg}</p>
    {/if}
    
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      disabled={isLoading}
    >
      {#if isLoading}
        Sending...
      {:else}
        Send Email
      {/if}
    </button>
  </form>
</section>
