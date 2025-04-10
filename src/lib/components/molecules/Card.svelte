<script>
  export let title = "";
  export let subtitle = "";
  export let elevated = false;
  export let padding = "normal";
  export let clickable = false;
  export let bordered = false;
  export let variant = "default";

  const paddingClasses = {
    none: "p-0",
    compact: "p-3",
    normal: "p-5",
    large: "p-6",
  };

  const variantClasses = {
    default: "bg-white border-neutral-200",
    primary: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    danger: "bg-red-50 border-red-200",
  };
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
  class="rounded-lg overflow-hidden {paddingClasses[padding]} {variantClasses[
    variant
  ]} 
  {elevated ? 'shadow-md' : ''} 
  {bordered ? 'border' : ''}
  {clickable
    ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200'
    : ''} 
  {$$props.class || ''}"
  on:click
  on:keydown
  role={clickable ? "button" : undefined}
  tabindex={clickable ? "0" : undefined}
>
  {#if title || subtitle}
    <div class={padding === "none" ? "p-4" : ""}>
      {#if title}
        <h3 class="text-lg font-medium text-neutral-800">
          {title}
        </h3>
      {/if}
      {#if subtitle}
        <p class="text-sm text-neutral-500 mt-1">
          {subtitle}
        </p>
      {/if}
    </div>
  {/if}
  <div class={title || subtitle ? "mt-2" : ""}>
    <slot />
  </div>
  {#if $$slots.footer}
    <div class="mt-4 pt-3 border-t border-neutral-200">
      <slot name="footer" />
    </div>
  {/if}
</div>
