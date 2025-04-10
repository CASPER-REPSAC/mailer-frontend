<script>
  import { onMount } from "svelte";
  import { Button, Card, ResponsiveTable } from "$lib"; // Spinner 제거 (ResponsiveTable이 내부 처리)
  import { createTemplateListStore } from "./stores/templateListStore";
  import TemplateActions from "./components/TemplateActions.svelte";
  import TemplateNameLink from "./components/TemplateNameLink.svelte";

  const templateListStore = createTemplateListStore();
  const {
    templates,
    loading,
    error,
    loadTemplates,
    createTemplate,
    duplicateTemplate,
    renameTemplate,
    deleteTemplate,
  } = templateListStore;

  onMount(() => {
    loadTemplates();
  });

  const columns = [
    { header: "템플릿 이름", field: "name", component: TemplateNameLink },
    { header: "작업", field: "actions", component: TemplateActions },
  ];

  $: tableData = $templates.map((name) => ({
    id: name,
    name: name,
    rename: () => renameTemplate(name),
    duplicate: () => duplicateTemplate(name),
    delete: () => deleteTemplate(name),
  }));
</script>

<svelte:head>
  <title>템플릿 관리 | Mail-Manager</title>
</svelte:head>

<Card>
  <div
    class="bg-gradient-to-r from-blue-600 to-blue-800 -m-5 mb-0 px-6 py-4 rounded-t-lg"
  >
    <h1 class="text-2xl font-semibold text-white">템플릿 관리</h1>
    <p class="text-blue-100 mt-1">
      이메일 템플릿을 생성하고, 수정하며, 복제하거나 삭제할 수 있습니다.
    </p>
  </div>

  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-medium text-gray-800">템플릿 목록</h2>
      <Button
        on:click={createTemplate}
        variant="primary"
        disabled={$loading}
        icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clip-rule='evenodd'></path></svg>"
      >
        새 템플릿 생성
      </Button>
    </div>

    <ResponsiveTable
      {columns}
      data={tableData}
      keyField="id"
      loading={$loading}
      emptyMessage="템플릿이 없습니다. 새 템플릿을 생성하여 시작하세요."
      striped={true}
      hoverEffect={true}
      bordered={true}
      compact={false}
    />

    {#if !$loading && $templates.length === 0}
      <div class="text-center py-10 mt-4">
        <Button
          on:click={createTemplate}
          variant="primary"
          icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clip-rule='evenodd'></path></svg>"
        >
          템플릿 생성하기
        </Button>
      </div>
    {/if}
  </div>
</Card>
