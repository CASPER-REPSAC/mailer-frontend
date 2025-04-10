<script>
  export let type = "button";
  export let disabled = false;
  export let variant = "primary";
  export let size = "md";
  export let loading = false;
  export let fullWidth = false;
  export let icon = null;
  export let iconPosition = "left";
  export let rounded = "md";
  export let ariaLabel = undefined;
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
    xl: "px-6 py-3 text-xl",
  };
  const iconSizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7",
  };
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };
  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm  :bg-blue-600 :ring-blue-400",
    secondary:
      "bg-neutral-500 text-white hover:bg-neutral-600 focus:ring-neutral-400 shadow-sm  :bg-neutral-700",
    outline:
      "bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-sm    :bg-blue-900 :bg-opacity-25",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm  :bg-red-600",
    ghost:
      "bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900  :bg-neutral-800 :text-white",
    link: "bg-transparent text-blue-600 hover:underline hover:text-blue-800 p-0  :text-blue-300",
  };
</script>

<button
  {type}
  disabled={disabled || loading}
  aria-label={ariaLabel}
  aria-busy={loading}
  class="inline-flex items-center justify-center transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white :ring-offset-neutral-900
    {variant !== 'link' ? sizeClasses[size] : 'p-0'}
    {variantClasses[variant]}
    {roundedClasses[rounded]}
    {disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    {fullWidth ? 'w-full' : ''}
    {$$props.class || ''}"
  on:click
  on:focus
  on:blur
  on:keydown
  {...$$restProps}
>
  {#if loading}
    <span
      class="{iconPosition === 'right' ? 'order-2 ml-2' : 'mr-2'} inline-block"
    >
      <svg class="animate-spin {iconSizeClasses[size]}" viewBox="0 0 24 24">
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
    </span>
  {/if}
  {#if icon && iconPosition === "left" && !loading}
    <span class="{$$slots.default ? 'mr-2' : ''} {iconSizeClasses[size]}"
      >{@html icon}</span
    >
  {/if}
  {#if $$slots.default}
    <span class="inline-block">
      <slot />
    </span>
  {/if}
  {#if icon && iconPosition === "right" && !loading}
    <span class="{$$slots.default ? 'ml-2' : ''} {iconSizeClasses[size]}"
      >{@html icon}</span
    >
  {/if}
</button>
