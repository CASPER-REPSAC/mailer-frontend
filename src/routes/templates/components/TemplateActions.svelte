<script>
  import { Button } from "$lib";
  export let row; // Contains { id, name, rename, duplicate, delete }
</script>

<div class="flex items-center space-x-2 justify-end">
  <Button
    on:click={row.rename}
    variant="secondary"
    size="sm"
    icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'></path></svg>"
    aria-label="{row.name} 이름 변경"
  >
    이름변경
  </Button>
  <Button
    on:click={row.duplicate}
    variant="secondary"
    size="sm"
    icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'></path></svg>"
    aria-label="{row.name} 복제"
  >
    복제
  </Button>
  <Button
    on:click={row.delete}
    variant="danger"
    size="sm"
    icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'></path></svg>"
    aria-label="{row.name} 삭제"
  >
    삭제
  </Button>
</div>
