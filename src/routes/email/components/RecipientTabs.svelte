<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { Button } from "$lib";
  import * as api from "$lib/utils/api";
  import { feedback } from "$lib/stores/feedback";
  export let allowedProperties = [];
  const dispatch = createEventDispatcher();
  let activeTab = "manual";
  let manualName = "";
  let manualEmail = "";
  let touchedFields = { manualName: false, manualEmail: false };
  let bulkText = "";
  let allUsers = [];
  let groups = [];
  let selectedGroup = "";
  let selectedUserEmails = new Set();
  let isLoadingUsers = false;
  $: filteredUsers = selectedGroup
    ? allUsers.filter(
        (user) =>
          user.groups_obj &&
          user.groups_obj.some((g) => g.name === selectedGroup),
      )
    : allUsers;
  onMount(async () => {
    try {
      isLoadingUsers = true;
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
      feedback.error("사용자 목록을 불러올 수 없습니다", e.message);
    } finally {
      isLoadingUsers = false;
    }
  });
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  function addManualRecipient() {
    const name = manualName.trim();
    const email = manualEmail.trim();
    let errors = {};
    if (!name) errors.name = "이름을 입력하세요";
    if (!email) errors.email = "이메일을 입력하세요";
    else if (!validateEmail(email))
      errors.email = "유효한 이메일 주소를 입력하세요";
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((key) => {
        feedback.error(errors[key]);
      });
      return;
    }
    let custom = {};
    allowedProperties.forEach((prop) => (custom[prop] = ""));
    dispatch("addRecipients", {
      recipients: [{ name, email, custom }],
    });
    manualName = "";
    manualEmail = "";
    feedback.success("수신자가 추가되었습니다");
  }
  function addBulkRecipients() {
    const lines = bulkText.trim().split("\n");
    const newRecipients = [];
    const errors = [];
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      const parts = line.split("\t");
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const email = parts[1].trim();

        if (!name) {
          errors.push(`이름 누락: ${line}`);
          continue;
        }

        if (!email || !validateEmail(email)) {
          errors.push(`유효하지 않은 이메일: ${line}`);
          continue;
        }

        const customValues = parts.slice(2);
        let custom = {};
        allowedProperties.forEach(
          (prop, index) => (custom[prop] = customValues[index] || ""),
        );
        newRecipients.push({ name, email, custom });
      } else {
        if (line)
          errors.push(`형식 오류 (이름과 이메일을 탭으로 구분): ${line}`);
      }
    }
    if (errors.length > 0) {
      feedback.warning(
        `일부 항목이 추가되지 않았습니다. (${errors.length}개 오류)`,
      );
    }
    if (newRecipients.length > 0) {
      dispatch("addRecipients", { recipients: newRecipients });
      bulkText = "";
      feedback.success(`${newRecipients.length}명의 수신자가 추가되었습니다`);
    } else {
      feedback.error("추가할 수신자가 없습니다");
    }
  }
  function toggleUser(email) {
    if (selectedUserEmails.has(email)) {
      selectedUserEmails.delete(email);
    } else {
      selectedUserEmails.add(email);
    }
    selectedUserEmails = new Set([...selectedUserEmails]);
  }
  function addSelectedRecipients() {
    const selectedUsers = allUsers.filter((user) =>
      selectedUserEmails.has(user.email),
    );
    if (selectedUsers.length > 0) {
      const recipients = selectedUsers.map((user) => {
        let custom = {};
        allowedProperties.forEach((prop) => (custom[prop] = ""));
        return { name: user.name, email: user.email, custom };
      });
      dispatch("addRecipients", { recipients });
      feedback.success(`${recipients.length}명의 수신자가 추가되었습니다`);
      selectedUserEmails = new Set();
    }
  }
</script>

<div class="p-6 border-b border-gray-200">
  <h2 class="text-lg font-medium text-gray-800 mb-4">수신자 추가</h2>
  <div class="border-b border-gray-200">
    <nav class="flex space-x-6 -mb-px">
      <button
        class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
            {activeTab === 'manual'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => (activeTab = "manual")}
      >
        수동 추가
      </button>
      <button
        class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
            {activeTab === 'bulk'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => (activeTab = "bulk")}
      >
        대량 추가
      </button>
      <button
        class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
            {activeTab === 'select'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
        on:click={() => (activeTab = "select")}
      >
        기존 사용자 선택
      </button>
    </nav>
  </div>
  <div class="mt-4">
    {#if activeTab === "manual"}
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="manual-name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              이름
            </label>
            <input
              id="manual-name"
              type="text"
              bind:value={manualName}
              on:blur={() => (touchedFields.manualName = true)}
              placeholder="수신자 이름"
              class="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              class:input-error={touchedFields.manualName && !manualName.trim()}
            />
          </div>
          <div>
            <label
              for="manual-email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일
            </label>
            <input
              id="manual-email"
              type="email"
              bind:value={manualEmail}
              on:blur={() => (touchedFields.manualEmail = true)}
              placeholder="수신자 이메일"
              class="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              class:input-error={touchedFields.manualEmail &&
                (!manualEmail.trim() || !validateEmail(manualEmail))}
            />
          </div>
        </div>
        <div class="flex justify-end">
          <Button
            on:click={addManualRecipient}
            variant="primary"
            size="md"
            icon="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z' clip-rule='evenodd'/></svg>"
          >
            수신자 추가
          </Button>
        </div>
      </div>
    {:else if activeTab === "bulk"}
      <div class="space-y-4">
        <div>
          <label
            for="bulk-text"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            수신자 목록 (탭으로 구분)
          </label>
          <div class="mt-1 mb-2">
            <p class="text-xs text-gray-500">
              형식: 이름[Tab]이메일[Tab]옵션1[Tab]옵션2...
            </p>
            <p class="text-xs text-gray-500">예: 홍길동[Tab]hong@example.com</p>
          </div>
          <textarea
            id="bulk-text"
            rows="6"
            bind:value={bulkText}
            placeholder="홍길동&#9;hong@example.com&#10;김철수&#9;kim@example.com"
            class="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <Button
            on:click={addBulkRecipients}
            disabled={!bulkText.trim()}
            variant="primary"
            size="md"
            icon="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'><path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'/></svg>"
          >
            대량 추가
          </Button>
        </div>
      </div>
    {:else if activeTab === "select"}
      <div class="space-y-4">
        <div>
          <label
            for="group-select"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            그룹 필터링
          </label>
          <select
            id="group-select"
            bind:value={selectedGroup}
            class="block w-full pl-3 pr-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">모든 사용자</option>
            {#each groups as group}
              <option value={group}>{group}</option>
            {/each}
          </select>
        </div>
        <div class="border border-gray-200 rounded-md">
          <div
            class="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200"
          >
            <span class="text-sm font-medium text-gray-700">
              {selectedGroup ? `${selectedGroup} 그룹 사용자` : "모든 사용자"}
              ({filteredUsers.length}명)
            </span>
            <span class="text-sm font-medium text-blue-600">
              {selectedUserEmails.size}명 선택됨
            </span>
          </div>
          {#if isLoadingUsers}
            <div class="flex justify-center items-center p-6">
              <svg
                class="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          {:else if filteredUsers.length === 0}
            <div class="p-4 text-center text-gray-500">사용자가 없습니다</div>
          {:else}
            <div class="max-h-64 overflow-y-auto p-1">
              {#each filteredUsers as user (user.email)}
                <div
                  class="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors duration-150 h-16
                  {selectedUserEmails.has(user.email)
                    ? 'bg-blue-50 border border-blue-200'
                    : ''}"
                  on:click={() => toggleUser(user.email)}
                  on:keydown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleUser(user.email);
                  }}
                  tabindex="0"
                  role="checkbox"
                  aria-checked={selectedUserEmails.has(user.email)}
                  aria-label="Select user {user.name}"
                >
                  <div class="flex-shrink-0 mr-2">
                    <div
                      class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div class="flex-shrink-0 ml-2">
                    {#if selectedUserEmails.has(user.email)}
                      <svg
                        class="h-5 w-5 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    {:else}
                      <div
                        class="h-5 w-5 border-2 border-gray-300 rounded-full"
                      ></div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
        <div class="flex justify-end">
          <Button
            on:click={addSelectedRecipients}
            disabled={selectedUserEmails.size === 0}
            variant="primary"
            size="md"
          >
            선택한 {selectedUserEmails.size}명 추가
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
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
  .input-error {
    animation: shake 0.5s;
    border-color: #f56565;
  }
</style>
