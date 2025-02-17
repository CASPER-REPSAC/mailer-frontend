<script>
    // load 함수에서 반환된 데이터는 data에 담겨 전달됩니다.
    export let data;
    const { template } = data;
  
    // 템플릿 내용을 편집하기 위한 로컬 변수
    let content = template?.content ?? "";
    // 백엔드 미리보기로부터 받은 HTML (초기값은 빈 문자열)
    let previewHTML = "";
  
    // 백엔드의 미리보기 엔드포인트 호출 (POST /api/templates/preview/{name})
    async function updatePreview() {
      try {
        const res = await fetch(`/api/templates/preview/${template.name}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ content })
        });
        if (res.ok) {
          previewHTML = await res.text();
        } else {
          const errText = await res.text();
          previewHTML = `<p style="color: red;">Preview error: ${errText}</p>`;
        }
      } catch (error) {
        previewHTML = `<p style="color: red;">Error: ${error}</p>`;
      }
    }
  
    // 컴포넌트 마운트 시 최초 미리보기 요청
    updatePreview();
  
    // 저장 버튼 클릭 시 템플릿 저장 함수
    async function saveTemplate() {
      const res = await fetch(`/api/templates/${template.name}`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        alert("Template saved successfully!");
      } else {
        alert("Failed to save template.");
      }
    }
  </script>
  
  <section class="p-4">
    <h2 class="text-xl font-bold mb-4">Editing Template: {template.name}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 편집 영역 -->
      <div>
        <label class="block font-medium mb-1">Template Content (HTML)</label>
        <textarea
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
        <label class="block font-medium mb-1">Live Preview</label>
        <iframe
          srcdoc={previewHTML}
          class="w-full border border-gray-300 rounded"
          style="min-height: 65vh;"
        ></iframe>
      </div>
    </div>
  </section>
  