<script>
  import { Textarea, Button, Spinner } from "$lib";
  import { createTemplateEditorStore } from "./stores/templateEditorStore";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  export let data;

  const templateEditorStore = createTemplateEditorStore(data.template);
  const {
    name,
    content,
    previewHTML,
    isSaving,
    isLoadingPreview,
    error,
    updatePreview,
    saveTemplate,
  } = templateEditorStore;

  let debounceTimer;
  function debouncedUpdatePreview() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updatePreview();
    }, 500);
  }
  $: if ($content) {
    debouncedUpdatePreview();
  }
</script>

<svelte:head>
  <title>템플릿 편집: {$name} | Mail-Manager</title>
</svelte:head>

<section
  class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
>
  <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-white">
        템플릿 편집: {$name}
      </h1>
      <Button
        on:click={() => window.history.back()}
        variant="ghost"
        size="sm"
        class="text-white hover:bg-blue-700"
      >
        ← 목록으로
      </Button>
    </div>
    <p class="text-blue-100 mt-1">
      HTML 코드를 수정하고 실시간으로 미리보기를 확인하세요
    </p>
  </div>

  <div class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Textarea
          label="템플릿 내용 (HTML)"
          id="content"
          name="content"
          bind:value={$content}
          resize="none"
          class="font-mono text-sm h-[70vh] w-full"
          placeholder="여기에 HTML 코드를 입력하세요..."
        />
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 mb-1"
          for="preview"
        >
          실시간 미리보기
          {#if $isLoadingPreview}
            <Spinner size="xs" color="blue" class="ml-2 inline-block" />
          {/if}
        </label>
        <div
          class="border border-gray-300 rounded-md shadow-sm bg-white relative"
        >
          {#if $isLoadingPreview && !$previewHTML}
            <div
              class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50"
            >
              <Spinner size="md" />
            </div>
          {/if}
          <iframe
            title="Template Preview"
            name="preview"
            srcdoc={$previewHTML}
            class="w-full rounded-md h-[70vh] border-0"
          ></iframe>
        </div>
      </div>
      <div class="mt-4">
        <Button
          on:click={saveTemplate}
          variant="primary"
          loading={$isSaving}
          disabled={$isSaving || !$content.trim()}
        >
          {$isSaving ? "저장 중..." : "템플릿 저장"}
        </Button>
      </div>
    </div>
  </div>
</section>
