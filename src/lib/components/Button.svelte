<script>
  export let type = "button";
  export let disabled = false;
  export let variant = "primary"; // 'primary', 'secondary', 등
</script>

<button
  {type}
  {disabled}
  class="px-4 py-2 rounded focus:outline-none transition-colors duration-200
      {variant === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
      {variant === 'secondary'
    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    : ''}"
>
  <slot />
</button>
