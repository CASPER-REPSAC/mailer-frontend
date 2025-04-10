<script>
  import { Button, Card, Spinner } from "$lib";
  import { onMount } from "svelte";
  import { user } from "$lib/stores/auth";
  import { createDashboardStore } from "./stores/dashboardStore";

  import TemplateIcon from "$lib/components/icons/TemplateIcon.svelte";
  import UsersIcon from "$lib/components/icons/UsersIcon.svelte";
  import ImageIcon from "$lib/components/icons/ImageIcon.svelte";
  import EmailIcon from "$lib/components/icons/EmailIcon.svelte";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";

  const dashboardStore = createDashboardStore();
  const { stats, loading, errors, loadStats } = dashboardStore;

  onMount(() => {
    loadStats();
  });

  const statCards = [
    {
      key: "templates",
      title: "템플릿",
      href: "/templates",
      icon: TemplateIcon,
      gradient: "from-blue-500 to-blue-600",
      loadingColor: "bg-blue-400",
    },
    {
      key: "users",
      title: "사용자",
      href: "/users",
      icon: UsersIcon,
      gradient: "from-green-500 to-green-600",
      loadingColor: "bg-green-400",
    },
    {
      key: "images",
      title: "이미지",
      href: "/images",
      icon: ImageIcon,
      gradient: "from-purple-500 to-purple-600",
      loadingColor: "bg-purple-400",
    },
  ];
</script>

<svelte:head>
  <title>대시보드 | Mail-Manager</title>
</svelte:head>

<Card padding="none">
  <div
    class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 rounded-t-lg"
  >
    <h1 class="text-3xl font-bold text-white">Mail-Manager 대시보드</h1>
    <p class="text-blue-100 mt-2">
      이메일 템플릿을 효율적으로 관리하고, 사용자 정보를 확인하며, 간편하게
      이메일을 발송할 수 있습니다.
    </p>
  </div>
  <div class="p-6">
    {#if $user}
      <Card variant="primary" class="mb-6">
        <p class="text-blue-800">
          <span class="font-semibold">{$user.name}</span>님 환영합니다! 이메일
          템플릿 관리와 메일 발송을 시작하세요.
        </p>
      </Card>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {#each statCards as cardInfo (cardInfo.key)}
        <Card
          padding="normal"
          class="text-white bg-gradient-to-br {cardInfo.gradient}"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm opacity-80">{cardInfo.title}</p>
              <h3 class="text-2xl font-bold mt-1">
                {#if $loading[cardInfo.key]}
                  <span
                    class="inline-block w-6 h-6 {cardInfo.loadingColor} rounded-full animate-pulse"
                  ></span>
                {:else if $errors[cardInfo.key]}
                  <span title={$errors[cardInfo.key]}>오류</span>
                {:else}
                  {$stats[cardInfo.key]}
                {/if}
              </h3>
            </div>
            <div class="bg-black bg-opacity-10 p-3 rounded-full">
              <svelte:component this={cardInfo.icon} class="h-6 w-6" />
            </div>
          </div>
          <a
            href={cardInfo.href}
            class="mt-4 text-sm opacity-90 hover:opacity-100 hover:underline flex items-center"
          >
            관리하기 <ArrowRightIcon class="h-4 w-4 ml-1" />
          </a>
        </Card>
      {/each}
    </div>

    <div class="flex flex-wrap gap-4 justify-center">
      <a href="/email">
        <Button
          variant="primary"
          size="lg"
          icon="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'><path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'/><path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' /></svg>"
        >
          이메일 발송
        </Button>
      </a>
    </div>
  </div>
</Card>
