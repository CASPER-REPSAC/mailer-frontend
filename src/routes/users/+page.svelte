<script>
    import { onMount } from 'svelte';
    let users = [];
  
    // 예시로 /api/users 엔드포인트에서 사용자 리스트를 불러옵니다.
    onMount(async () => {
      const res = await fetch('/api/users');
      if (res.ok) {
        users = await res.json();
      }
    });
  </script>
  
  <section>
    <h2 class="text-2xl font-bold mb-4">User List</h2>
    {#if users.length > 0}
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Email</th>
            <th class="py-2 px-4 border-b">Group</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr>
              <td class="py-2 px-4 border-b">{user.name}</td>
              <td class="py-2 px-4 border-b">{user.email}</td>
                <td class="py-2 px-4 border-b">{user.groups_obj.map(group => group.name).join(', ')}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p class="text-gray-600">No users found.</p>
    {/if}
  </section>
  