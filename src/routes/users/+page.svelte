<script>
  import { onMount } from "svelte";
  import { Card, ResponsiveTable } from "$lib";
  import { createUserStore } from "./stores/userStore";
  import UserGroupBadges from "./components/UserGroupBadges.svelte";
  import UserNameDisplay from "./components/UserNameDisplay.svelte";

  const userStore = createUserStore();
  const { users, loading, error, fetchUsers } = userStore;

  onMount(() => {
    fetchUsers();
  });

  const columns = [
    {
      header: "이름",
      field: "name",
      component: UserNameDisplay,
    },
    {
      header: "이메일",
      field: "email",
    },
    {
      header: "그룹",
      field: "groups_obj",
      component: UserGroupBadges,
    },
  ];

  $: tableData = $users.map((user) => ({ ...user, id: user.email }));
</script>

<svelte:head>
  <title>사용자 목록 | Mail-Manager</title>
</svelte:head>

<Card>
  <div
    class="bg-gradient-to-r from-blue-600 to-blue-800 -m-5 mb-0 px-6 py-4 rounded-t-lg"
  >
    <h1 class="text-2xl font-semibold text-white">사용자 관리</h1>
    <p class="text-blue-100 mt-1">
      시스템에 등록된 모든 사용자 목록을 확인하고 관리합니다.
    </p>
  </div>

  <div class="p-6">
    <ResponsiveTable
      {columns}
      data={tableData}
      keyField="id"
      loading={$loading}
      emptyMessage="시스템에 등록된 사용자가 없습니다."
      striped={true}
      hoverEffect={true}
      bordered={false}
      compact={false}
      class="mt-4"
    />
  </div>
</Card>
