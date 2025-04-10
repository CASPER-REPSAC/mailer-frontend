<script>
  import { Button } from "$lib";

  export let error = {};
  export let status = "404 Not Found";
</script>

<svelte:head>
  <title>{status} 오류 | Mail-Manager</title>
</svelte:head>

<div
  class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4"
>
  <div class="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-gradient-to-r from-red-600 to-red-800 px-6 py-4">
      <h1 class="text-2xl font-semibold text-white">오류 {status}</h1>
      <p class="text-red-100 mt-1">
        {#if status === "404 Not Found"}
          페이지를 찾을 수 없습니다.
        {:else}
          Buggus Evanesca!
        {/if}
      </p>
    </div>
    <div class="p-6 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto h-16 w-16 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p class="text-xl text-gray-700 font-medium mt-4">
        {#if status === "404 Not Found"}
          요청하신 페이지를 찾을 수 없습니다.<br />입력하신 주소가 정확한지 다시
          확인해주세요.
        {:else}
          이게 보이면 안되는데…<br />뭔가 잘못된 것 같아요.
        {/if}
      </p>
      {#if error?.message}
        <p class="text-gray-600 mt-2">{error.message}</p>
      {/if}
      <div class="mt-6">
        <Button
          on:click={() => (window.location.href = "/")}
          variant="primary"
          icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z' clip-rule='evenodd'></path></svg>"
        >
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  </div>
</div>
