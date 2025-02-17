<script>
  import { onMount } from 'svelte';
  import { user, loadUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  // 앱 시작 시 백엔드의 /api/me를 호출하여 이미 로그인된 사용자인지 체크합니다.
  onMount(async () => {
    await loadUser();
    if ($user) {
      // 이미 로그인된 상태라면 대시보드로 이동
      goto('/');
    }
  });
</script>

<section class="max-w-md mx-auto p-4">
  <h2 class="text-xl font-bold mb-4">Sign In</h2>
  <p class="mb-4">
    아래 버튼을 클릭하면 OIDC 공급자의 인증 페이지로 이동합니다.
  </p>
  <!-- 버튼 클릭 시 백엔드의 /login 엔드포인트로 리디렉션 -->
  <button
    on:click={() => window.location.href = '/login'}
    class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    Login with OIDC
  </button>
</section>
