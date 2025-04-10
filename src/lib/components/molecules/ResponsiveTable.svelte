<script>
    export let columns = [];
    export let data = [];
    export let keyField = "id";
    export let emptyMessage = "사용 가능한 데이터가 없습니다";
    export let loading = false;
    export let striped = false;
    export let bordered = false;
    export let hoverEffect = true;
    export let compact = false;
</script>

<div class="hidden md:block overflow-x-auto">
    {#if loading}
        <div class="flex justify-center py-8">
            <svg
                class="animate-spin h-8 w-8 text-blue-500"
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
        </div>
    {:else if data.length === 0}
        <div class="text-center py-8 text-neutral-500">
            {emptyMessage}
        </div>
    {:else}
        <table
            class="min-w-full divide-y divide-neutral-200 {bordered
                ? 'border border-neutral-200 '
                : ''}"
        >
            <thead class="bg-neutral-50">
                <tr>
                    {#each columns as column}
                        <th
                            scope="col"
                            class="{compact
                                ? 'px-3 py-2'
                                : 'px-6 py-3'} text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                        >
                            {column.header}
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-neutral-200">
                {#each data as row, i}
                    <tr
                        class="{striped && i % 2 === 1 ? 'bg-neutral-50 ' : ''} 
                    {hoverEffect ? 'hover:bg-neutral-100 :bg-neutral-700' : ''}"
                    >
                        {#each columns as column}
                            <td
                                class="{compact
                                    ? 'px-3 py-2'
                                    : 'px-6 py-4'} whitespace-nowrap text-sm text-neutral-800"
                            >
                                {#if column.component}
                                    <svelte:component
                                        this={column.component}
                                        value={row[column.field]}
                                        {row}
                                    />
                                {:else}
                                    {row[column.field]}
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>
<div class="md:hidden space-y-4">
    {#if loading}
        <div class="flex justify-center py-8">
            <svg
                class="animate-spin h-8 w-8 text-blue-500"
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
        </div>
    {:else if data.length === 0}
        <div class="text-center py-8 text-neutral-500">
            {emptyMessage}
        </div>
    {:else}
        {#each data as row}
            <div
                class="bg-white shadow rounded-lg p-4 {bordered
                    ? 'border border-neutral-200 '
                    : ''}"
            >
                {#each columns as column}
                    <div
                        class="{compact ? 'py-1' : 'py-2'} {columns.indexOf(
                            column,
                        ) <
                        columns.length - 1
                            ? 'border-b border-neutral-100 '
                            : ''}"
                    >
                        <div class="text-xs font-medium text-neutral-500">
                            {column.header}
                        </div>
                        <div
                            class="{compact
                                ? 'mt-0.5'
                                : 'mt-1'} text-sm text-neutral-800"
                        >
                            {#if column.component}
                                <svelte:component
                                    this={column.component}
                                    value={row[column.field]}
                                    {row}
                                />
                            {:else}
                                {row[column.field]}
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    {/if}
</div>
