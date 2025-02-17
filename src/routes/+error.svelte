<!-- src/routes/+error.svelte -->
<script>
    // SvelteKit은 오류 발생 시 error와 status props를 전달합니다.
    export let error;
    export let status;
  </script>
  
  <svelte:head>
    <title>{status} 오류 – Mail-Manager</title>
  </svelte:head>
  
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <h1 class="text-4xl font-bold text-red-600 mb-4">{status}</h1>
    <p class="text-xl text-gray-700 mb-2">
      죄송합니다. 예기치 않은 오류가 발생했습니다.
    </p>
    {#if error?.message}
      <p class="text-gray-600 mb-4">{error.message}</p>
    {/if}
    <a
      href="/"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      홈으로 이동
    </a>
  </div>
  