<script>
    export let value = "";
    export let placeholder = "";
    export let label = "";
    export let error = "";
    export let id = "";
    export let name = "";
    export let required = false;
    export let disabled = false;
    export let readonly = false;
    export let rows = 4;
    export let resize = "vertical";
    export let helpText = "";
    const resizeClasses = {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
    };
</script>

<div class={$$props.class || ""}>
    {#if label}
        <label for={id} class="block text-sm font-medium text-neutral-800 mb-1">
            {label}{required ? " *" : ""}
        </label>
    {/if}
    <textarea
        {id}
        {name}
        bind:value
        {placeholder}
        {disabled}
        {readonly}
        {required}
        rows={rows || 0}
        class="block w-full px-3 py-2 rounded-md shadow-sm
        bg-white
        border border-neutral-300
        text-neutral-800
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
        {resizeClasses[resize]}
        {error ? 'border-red-500 ' : ''} {$$restProps.class || ''}"
        {...(({ class: _, ...rest }) => rest)($$restProps)}
    ></textarea>
    {#if error}
        <p class="mt-1 text-sm text-red-600">{error}</p>
    {:else if helpText}
        <p class="mt-1 text-sm text-neutral-500">{helpText}</p>
    {/if}
</div>
