<script>
  import { onMount } from "svelte";
  import * as api from "$lib/utils/api";

  let templates = [];
  let loading = false;
  let error = "";

  // API에서 템플릿 목록을 불러오는 함수
  async function loadTemplates() {
    loading = true;
    error = "";
    try {
      const res = await api.fetchTemplates();
      templates = res;
    } catch (err) {
      console.error(err);
      error = "템플릿 로드 중 오류가 발생했습니다.";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadTemplates();
  });

  // 기존 템플릿 내용을 GET한 후, 새 이름으로 POST하여 복제 실행
  async function duplicateTemplate(originalName) {
    try {
      const data = await api.fetchTemplate(originalName);
      const newName = prompt(
        "복제할 새 템플릿 이름을 입력하세요:",
        `${originalName}_copy`,
      );
      if (!newName) return;
      if (templates.includes(newName)) {
        alert("이미 해당 이름의 템플릿이 존재합니다.");
        return;
      }
      await api.updateTemplate(newName, data.content);
    } catch (err) {
      console.error(err);
      alert(`복제 실행 중 오류 발생: ${err}`);
    }
  }

  async function deleteTemplate(name) {
    if (!confirm(`템플릿 "${name}"을(를) 정말 삭제하시겠습니까?`)) return;
    try {
      await api.deleteTemplate(name);
      loadTemplates();
    } catch (err) {
      console.error(err);
      alert(`삭제 실행 중 오류 발생: ${err}`);
    }
  }

  // 새 템플릿을 생성 (빈 내용 또는 기본 내용을 채워 POST)
  async function createTemplate() {
    const newName = prompt("생성할 템플릿의 이름을 입력하세요:", "");
    if (!newName) return;
    if (templates.includes(newName)) {
      alert("이미 해당 이름의 템플릿이 존재합니다.");
      return;
    }
    const defaultContent = (await api.fetchTemplate("default")).content;
    try {
      await api.updateTemplate(newName, defaultContent);
      alert(`새 템플릿 "${newName}"이 생성되었습니다.`);
      loadTemplates();
    } catch (err) {
      console.error(err);
      alert(`새 템플릿 생성 중 오류 발생: ${err}`);
    }
  }
</script>

<svelte:head>
  <title>Templates</title>
</svelte:head>

<section class="p-4">
  <h2 class="text-2xl font-bold mb-4">Templates</h2>

  <button
    on:click={createTemplate}
    class="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
  >
    Create New Template
  </button>

  {#if loading}
    <p>템플릿을 불러오는 중...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if templates.length > 0}
    <ul class="list-disc pl-5 space-y-2">
      {#each templates as tpl}
        <li class="flex items-center space-x-2">
          <a
            href={`/templates/${tpl}`}
            class="flex-grow text-blue-500 hover:underline"
          >
            {tpl}
          </a>
          <button
            on:click={() => duplicateTemplate(tpl)}
            class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
          >
            Duplicate
          </button>
          <button
            on:click={() => deleteTemplate(tpl)}
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Delete
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-gray-600">등록된 템플릿이 없습니다.</p>
  {/if}
</section>
