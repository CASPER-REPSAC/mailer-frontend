<script>
  import * as api from "$lib/utils/api";
  export let data;
  const { template } = data;

  let content = template?.content ?? "";
  let previewHTML = "";

  async function updatePreview() {
    try {
      previewHTML = await api.previewTemplate(template.name, content);
    } catch (error) {
      previewHTML = `<p style="color: red;">Error: ${error}</p>`;
    }
  }

  updatePreview();

  async function saveTemplate() {
    try {
      await api.updateTemplate(template.name, content);
      alert("Template saved successfully!");
    } catch (error) {
      alert(`Failed to save template: ${error}`);
    }
  }
</script>

<svelte:head>
  <title>Template Editor</title>
</svelte:head>

<section class="p-4">
  <h2 class="text-xl font-bold mb-4">Editing Template: {template.name}</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- 편집 영역 -->
    <div>
      <label class="block font-medium mb-1" for="content"
        >Template Content (HTML)</label
      >
      <textarea
        name="content"
        bind:value={content}
        rows="25"
        class="w-full p-2 border border-gray-300 rounded"
        on:input={updatePreview}
      ></textarea>
      <button
        on:click={saveTemplate}
        class="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Template
      </button>
    </div>
    <!-- 미리보기 영역 (iframe 채택) -->
    <div>
      <label class="block font-medium mb-1" for="preview">Live Preview</label>
      <iframe
        name="preview"
        srcdoc={previewHTML}
        class="w-full border border-gray-300 rounded"
        style="min-height: 65vh;"
        title="Live Preview"
      ></iframe>
    </div>
  </div>
</section>
