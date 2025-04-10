<script>
  export let size = "md";
  export let color = "blue";
  export let label = "로딩 중...";
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };
  const colorClasses = {
    blue: "text-blue-500",
    white: "text-white",
    gray: "text-gray-500",
    red: "text-red-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    indigo: "text-indigo-500",
    purple: "text-purple-500",
  };
</script>

<div class="inline-flex {$$props.class || ''}" role="status" aria-label={label}>
  <svg
    class="animate-spin {sizeClasses[size]} {colorClasses[color]}"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
  {#if $$slots.default}
    <span class="ml-2">
      <slot />
    </span>
  {/if}
</div>
