<script>
  import { onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { feedback } from "$lib/stores/feedback";
  let timeoutId;
  onMount(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  });
  $: if ($feedback.message && $feedback.duration) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      feedback.clear();
    }, $feedback.duration);
  }
  const iconMap = {
    success: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>`,
    error: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
    </svg>`,
    info: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
    </svg>`,
    warning: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
    </svg>`,
  };
  export let position = $feedback.position || "bottom-right";
  const positionClasses = {
    "bottom-right": "fixed bottom-4 right-4",
    "top-right": "fixed top-4 right-4",
    "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2",
    center:
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  };
</script>

{#if $feedback.message}
  <div
    in:fly={{ y: position.startsWith("top") ? -50 : 50, duration: 300 }}
    out:fade={{ duration: 200 }}
    class="z-50 rounded-md shadow-lg max-w-sm w-full flex items-center p-4
      {positionClasses[position]}
      {$feedback.type === 'success'
      ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
      : ''}
      {$feedback.type === 'error'
      ? 'bg-red-50 text-red-800 border-l-4 border-red-500'
      : ''}
      {$feedback.type === 'info'
      ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
      : ''}
      {$feedback.type === 'warning'
      ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500'
      : ''}"
    role="alert"
    aria-live="assertive"
  >
    <div class="flex-shrink-0 mr-3">
      {@html iconMap[$feedback.type] || iconMap.info}
    </div>
    <div class="flex-1">
      <p class="text-sm font-medium">{$feedback.message}</p>
      {#if $feedback.description}
        <p class="mt-1 text-xs opacity-90">{$feedback.description}</p>
      {/if}
    </div>
    <div class="ml-3 flex-shrink-0">
      <button
        on:click={() => feedback.clear()}
        type="button"
        class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="닫기"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  </div>
{/if}
