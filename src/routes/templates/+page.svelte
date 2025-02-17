<script>
    import { onMount } from 'svelte';
    
    let templates = [];
    let loading = false;
    let error = '';
  
    // API에서 템플릿 목록을 불러오는 함수
    async function loadTemplates() {
      loading = true;
      error = '';
      try {
        const res = await fetch('/api/templates');
        if (res.ok) {
          const data = await res.json();
          templates = data.templates;
        } else {
          error = '템플릿 목록을 불러오지 못했습니다.';
        }
      } catch (err) {
        console.error(err);
        error = '템플릿 로드 중 오류가 발생했습니다.';
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
        const resGet = await fetch(`/api/templates/${originalName}`);
        if (!resGet.ok) {
          alert(`템플릿 "${originalName}" 정보를 불러오지 못했습니다.`);
          return;
        }
        const data = await resGet.json();
        const newName = prompt("복제할 새 템플릿 이름을 입력하세요:", `${originalName}_copy`);
        if (!newName) return;
        
        const resPost = await fetch(`/api/templates/${newName}`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: data.content })
        });
        if (resPost.ok) {
          alert(`템플릿이 "${newName}" 이름으로 복제되었습니다.`);
          loadTemplates();
        } else {
          const errText = await resPost.text();
          alert(`복제에 실패했습니다: ${errText}`);
        }
      } catch (err) {
        console.error(err);
        alert(`복제 실행 중 오류 발생: ${err}`);
      }
    }
  
    // DELETE 메서드를 통해 템플릿 삭제 실행
    async function deleteTemplate(name) {
      if (!confirm(`템플릿 "${name}"을(를) 정말 삭제하시겠습니까?`)) return;
      try {
        const res = await fetch(`/api/templates/${name}`, { method: 'DELETE' });
        if (res.ok) {
          alert(`템플릿 "${name}"이 삭제되었습니다.`);
          loadTemplates();
        } else {
          const errText = await res.text();
          alert(`삭제에 실패했습니다: ${errText}`);
        }
      } catch (err) {
        console.error(err);
        alert(`삭제 실행 중 오류 발생: ${err}`);
      }
    }
  
    // 새 템플릿을 생성 (빈 내용 또는 기본 내용을 채워 POST)
    async function createTemplate() {
      const newName = prompt("생성할 템플릿의 이름을 입력하세요:", "");
      if (!newName) return;
      // 이미 같은 이름이 등록되어 있다면 경고
      if (templates.includes(newName)) {
        alert("이미 해당 이름의 템플릿이 존재합니다.");
        return;
      }
      const defaultContent = "<!-- New Template Content -->";
      try {
        const res = await fetch(`/api/templates/${newName}`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: defaultContent })
        });
        if (res.ok) {
          alert(`새 템플릿 "${newName}"이 생성되었습니다.`);
          loadTemplates();
        } else {
          const errText = await res.text();
          alert(`생성에 실패했습니다: ${errText}`);
        }
      } catch (err) {
        console.error(err);
        alert(`새 템플릿 생성 중 오류 발생: ${err}`);
      }
    }
  </script>
  
  <section class="p-4">
    <h2 class="text-2xl font-bold mb-4">Templates</h2>
    
    <button 
      on:click={createTemplate} 
      class="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
      Create New Template
    </button>
    
    {#if loading}
      <p>템플릿을 불러오는 중...</p>
    {:else if error}
      <p class="text-red-500">{error}</p>
    {:else}
      {#if templates.length > 0}
        <ul class="list-disc pl-5 space-y-2">
          {#each templates as tpl}
            <li class="flex items-center space-x-2">
              <a href={`/templates/${tpl}`} class="flex-grow text-blue-500 hover:underline">
                {tpl}
              </a>
              <button 
                on:click={() => duplicateTemplate(tpl)} 
                class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">
                Duplicate
              </button>
              <button 
                on:click={() => deleteTemplate(tpl)} 
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                Delete
              </button>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-gray-600">등록된 템플릿이 없습니다.</p>
      {/if}
    {/if}
  </section>
  