<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib";
  import { feedback } from "$lib/stores/feedback";
  export let recipients = [];
  export let allowedProperties = [];
  const dispatch = createEventDispatcher();
  $: recipientsByDomain = recipients.reduce((acc, r) => {
    const domain = r.email.split("@")[1];
    if (domain) acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});
  function removeRecipient(index) {
    dispatch("removeRecipient", { index });
  }
  function removeAllRecipients() {
    if (recipients.length === 0) return;
    if (confirm(`모든 수신자 ${recipients.length}명을 제거하시겠습니까?`)) {
      dispatch("removeAll");
    }
  }
  function updateRecipient(index, field, event) {
    const value = event.target.value;
    dispatch("updateRecipient", { index, field, value });
  }
  function updateCustomProperty(recipientIndex, property, event) {
    const value = event.target.value;
    dispatch("updateCustomProperty", { recipientIndex, property, value });
  }
</script>

<div class="p-6 border-b border-gray-200">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-medium text-gray-800">수신자 목록</h2>

    {#if recipients.length > 0}
      <div class="flex space-x-2 text-sm items-center">
        <span class="text-gray-600">총 {recipients.length}명</span>
        <button
          type="button"
          on:click={removeAllRecipients}
          class="text-red-600 hover:text-red-800 font-medium flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          모두 제거
        </button>
      </div>
    {/if}
  </div>
  {#if recipients.length === 0}
    <div class="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        등록된 이메일 수신자가 없어요.
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        상단 탭에서 원하시는 방식으로 이메일 수신자를 추가해 주세요.
      </p>
    </div>
  {:else}
    {#if Object.keys(recipientsByDomain).length > 0}
      <div class="mb-4 bg-blue-50 p-3 rounded-md border border-blue-100">
        <p class="text-xs text-blue-700 mb-1">도메인별 발송 통계:</p>
        <div class="flex flex-wrap gap-2">
          {#each Object.entries(recipientsByDomain) as [domain, count]}
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {domain}: {count}명
            </span>
          {/each}
        </div>
      </div>
    {/if}
    <div class="overflow-x-auto shadow-sm rounded-md border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              이름
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              이메일
            </th>
            {#if allowedProperties.length > 0}
              {#each allowedProperties as prop}
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {prop}
                </th>
              {/each}
            {/if}
            <th
              scope="col"
              class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              작업
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each recipients as recipient, idx}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-2 whitespace-nowrap">
                <input
                  type="text"
                  value={recipient.name}
                  placeholder="이름"
                  on:input={(e) => updateRecipient(idx, "name", e)}
                  class="block w-full px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <input
                  type="email"
                  value={recipient.email}
                  placeholder="이메일"
                  on:input={(e) => updateRecipient(idx, "email", e)}
                  class="block w-full px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              {#if allowedProperties.length > 0}
                {#each allowedProperties as prop}
                  <td class="px-4 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      placeholder={prop}
                      value={recipient.custom[prop] || ""}
                      on:input={(e) => updateCustomProperty(idx, prop, e)}
                      class="block w-full px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                {/each}
              {/if}
              <td class="px-4 py-2 whitespace-nowrap text-right">
                <button
                  type="button"
                  on:click={() => removeRecipient(idx)}
                  class="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Remove recipient {recipient.name}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
