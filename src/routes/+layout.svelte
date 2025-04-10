<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { user, loadUser, logout } from "$lib/stores/auth";
  import Footer from "$lib/components/organisms/Footer.svelte";
  import Feedback from "$lib/components/molecules/Feedback.svelte";
  import { page } from "$app/stores";
  import { Button, Spinner } from "$lib";
  import DashboardIcon from "$lib/components/icons/DashboardIcon.svelte";
  import TemplateIcon from "$lib/components/icons/TemplateIcon.svelte";
  import ImageIcon from "$lib/components/icons/ImageIcon.svelte";
  import UsersIcon from "$lib/components/icons/UsersIcon.svelte";
  import EmailIcon from "$lib/components/icons/EmailIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import MailIcon from "$lib/components/icons/MailIcon.svelte";
  import UserIcon from "$lib/components/icons/UserIcon.svelte";

  let sidebarOpen = false;
  let isScrolled = false;
  let showUserMenu = false;

  const navItems = [
    { href: "/", label: "Dashboard", icon: DashboardIcon },
    { href: "/templates", label: "Templates", icon: TemplateIcon },
    { href: "/images", label: "Images", icon: ImageIcon },
    { href: "/users", label: "Users", icon: UsersIcon },
    { href: "/email", label: "Email", icon: EmailIcon },
  ];

  $: activeRoute = (itemHref) =>
    $page.url.pathname === itemHref ||
    ($page.url.pathname.startsWith(itemHref) && itemHref !== "/");

  onMount(() => {
    loadUser();
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };
    window.addEventListener("scroll", handleScroll);
    const handleClickOutside = (event) => {
      if (
        showUserMenu &&
        !event.target.closest("#user-menu-button") &&
        !event.target.closest("#user-menu-dropdown")
      ) {
        showUserMenu = false;
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  });
</script>

<header
  class="fixed top-0 left-0 right-0 z-30 bg-white transition-all duration-200 {isScrolled
    ? 'shadow-md'
    : 'shadow-sm'}"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <Button
          variant="ghost"
          class="md:hidden mr-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          on:click={() => (sidebarOpen = !sidebarOpen)}
          aria-label="Open main menu"
          aria-expanded={sidebarOpen}
        >
          <MenuIcon class="h-6 w-6" />
        </Button>
        <a href="/" class="flex items-center flex-shrink-0">
          <MailIcon class="h-8 w-8 text-blue-600 mr-2" />
          <span class="text-xl font-bold text-gray-900 hidden sm:inline"
            >Mail-Manager</span
          >
        </a>
      </div>
      <nav class="hidden md:flex md:items-center md:space-x-1 lg:space-x-4">
        {#each navItems as item}
          <a
            href={item.href}
            class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
				{activeRoute(item.href)
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}"
            aria-current={activeRoute(item.href) ? "page" : undefined}
          >
            <svelte:component
              this={item.icon}
              class="mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center">
        {#if $user === undefined}
          <Spinner size="sm" color="blue" />
        {:else if $user}
          <div class="ml-3 relative">
            <Button
              id="user-menu-button"
              variant="ghost"
              class="flex text-sm rounded-full p-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              on:click={() => (showUserMenu = !showUserMenu)}
              aria-label="Open user menu"
              aria-haspopup="true"
              aria-expanded={showUserMenu}
            >
              <div
                class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium"
              >
                {$user.name ? $user.name.charAt(0).toUpperCase() : "?"}
              </div>
            </Button>

            {#if showUserMenu}
              <div
                id="user-menu-dropdown"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div
                  class="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100"
                >
                  <p class="font-medium">{$user.name}</p>
                  <p class="text-xs text-gray-500 truncate">{$user.email}</p>
                </div>
                <button
                  on:click={() => {
                    logout();
                    showUserMenu = false;
                  }}
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  role="menuitem"
                >
                  로그아웃
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <Button href="/signin" variant="primary" size="sm">로그인</Button>
        {/if}
      </div>
    </div>
  </div>
</header>

{#if sidebarOpen}
  <div
    class="fixed inset-0 flex z-40 md:hidden"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-75"
      on:click={() => (sidebarOpen = false)}
    ></div>

    <div
      class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white shadow-xl"
    >
      <div class="absolute top-0 right-0 -mr-12 pt-2">
        <Button
          variant="ghost"
          class="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          on:click={() => (sidebarOpen = false)}
          aria-label="Close sidebar"
        >
          <CloseIcon class="h-6 w-6" />
        </Button>
      </div>

      <div class="flex-shrink-0 flex items-center px-4 mb-5">
        <MailIcon class="h-8 w-8 text-blue-600 mr-2" />
        <span class="text-xl font-bold text-gray-900">Mail-Manager</span>
      </div>

      <nav class="mt-5 flex-1 h-0 overflow-y-auto px-2 space-y-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150
				  {activeRoute(item.href)
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}"
            on:click={() => (sidebarOpen = false)}
            aria-current={activeRoute(item.href) ? "page" : undefined}
          >
            <svelte:component
              this={item.icon}
              class="mr-4 flex-shrink-0 h-6 w-6"
              aria-hidden="true"
            />
            {item.label}
          </a>
        {/each}
      </nav>

      {#if $user}
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex items-center">
            <div
              class="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium"
            >
              {$user.name ? $user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">{$user.name}</p>
              <button
                on:click={() => {
                  logout();
                  sidebarOpen = false;
                }}
                class="text-xs font-medium text-red-600 hover:text-red-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div class="flex-shrink-0 w-14" aria-hidden="true">
      <!-- Dummy element to force sidebar to shrink to fit close icon -->
    </div>
  </div>
{/if}

<main class="pt-16 min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <slot />
  </div>
</main>

<Footer />
<Feedback />
