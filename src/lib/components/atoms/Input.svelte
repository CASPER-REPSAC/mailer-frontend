<script>
    export let type = "text";
    export let value = "";
    export let placeholder = "";
    export let label = "";
    export let error = "";
    export let id = "";
    export let name = "";
    export let required = false;
    export let disabled = false;
    export let readonly = false;
    export let autocomplete = "on";
    export let size = "md";
    export let helpText = "";
    let focused = false;
    const sizeClasses = {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-2 text-base",
        lg: "px-4 py-3 text-lg",
    };
</script>

<div class={$$props.class || ""}>
    {#if label}
        <label for={id} class="block text-sm font-medium text-neutral-800 mb-1">
            {label}{required ? " *" : ""}
        </label>
    {/if}
    <div class="relative">
        <input
            {id}
            {name}
            {type}
            bind:value
            {placeholder}
            {autocomplete}
            {disabled}
            {readonly}
            {required}
            on:focus={() => (focused = true)}
            on:blur={() => (focused = false)}
            class="block w-full {sizeClasses[size]} bg-white
          border border-neutral-300 rounded-md shadow-sm
          text-neutral-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
          {error ? 'border-red-500  pr-10' : ''}"
            {...$$restProps}
        />
        {#if error}
            <div
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
                <svg
                    class="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                </svg>
            </div>
        {/if}
    </div>
    {#if error}
        <p class="mt-1 text-sm text-red-600">{error}</p>
    {:else if helpText}
        <p class="mt-1 text-sm text-neutral-500">{helpText}</p>
    {/if}
</div>
