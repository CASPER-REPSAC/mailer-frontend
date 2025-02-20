<script>
  import { feedback } from "$lib/stores/feedback";
  // Svelte의 $ 구문을 사용하면 자동 구독됩니다.
</script>

{#if $feedback.message}
  <div
    class="fixed bottom-4 right-4 z-50 p-4 rounded shadow-lg
      {$feedback.type === 'success' ? 'bg-green-500 text-white' : ''}
      {$feedback.type === 'error' ? 'bg-red-500 text-white' : ''}
      {$feedback.type === 'info' ? 'bg-blue-500 text-white' : ''}
    "
  >
    {$feedback.message}
  </div>
{/if}
