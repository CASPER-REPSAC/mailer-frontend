<script>
    import { createEventDispatcher } from "svelte";
    export let value = "";
    export let options = [];
    export let placeholder = "";
    export let label = "";
    export let error = "";
    export let id = "";
    export let name = "";
    export let required = false;
    export let disabled = false;
    export let size = "md";
    export let helpText = "";
    const sizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };
    const dispatch = createEventDispatcher();
    function handleChange(event) {
        dispatch("change", {
            value: event.target.value,
            id,
            name,
        });
    }
</script>

<div class={$$props.class || ""}>
    {#if label}
        <label for={id} class="block text-sm font-medium text-neutral-800 mb-1">
            {label}{required ? " *" : ""}
        </label>
    {/if}
    <div class="relative">
        <select
            {id}
            {name}
            bind:value
            on:change={handleChange}
            {disabled}
            {required}
            class="block w-full rounded-md bg-white shadow-sm
            border border-neutral-300
            text-neutral-800
            appearance-none
            py-2 pl-3 pr-10 {sizeClasses[size]}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
            {error ? 'border-red-500 ' : ''} {$$restProps.class || ''}"
            {...(({ class: _, ...rest }) => rest)($$restProps)}
        >
            {#if placeholder}
                <option value="" disabled>{placeholder}</option>
            {/if}
            {#each options as option}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
        <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
            <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            >
                <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
            </svg>
        </div>
    </div>
    {#if error}
        <p class="mt-1 text-sm text-red-600">{error}</p>
    {:else if helpText}
        <p class="mt-1 text-sm text-neutral-500">{helpText}</p>
    {/if}
</div>
