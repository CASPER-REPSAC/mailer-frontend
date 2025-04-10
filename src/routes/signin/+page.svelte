<script>
  import { onMount } from "svelte";
  import { user, loadUser } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { Button } from "$lib";
  onMount(async () => {
    await loadUser();
    if ($user) {
      goto("/");
    }
  });
</script>

<svelte:head>
  <title>로그인 | Mail-Manager</title>
</svelte:head>
<section
  class="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10"
>
  <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
    <h1 class="text-2xl font-semibold text-white">로그인</h1>
    <p class="text-blue-100 mt-1">
      Mail-Manager 서비스를 이용하려면 로그인하세요
    </p>
  </div>
  <div class="p-6">
    <p class="text-gray-600 mb-6">
      아래 버튼을 클릭하면 OIDC 공급자의 인증 페이지로 이동합니다.
    </p>
    <div class="flex justify-center">
      <Button
        on:click={() => (window.location.href = "/login")}
        variant="primary"
        size="lg"
        icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'><path fill-rule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clip-rule='evenodd'></path></svg>"
      >
        OIDC 계정으로 로그인
      </Button>
    </div>
  </div>
</section>
