<script>
	import "../app.css";
	import { onMount } from "svelte";
	import { user, loadUser, logout } from "$lib/stores/auth";
	import Footer from "$lib/components/Footer.svelte";
	import Feedback from "$lib/components/Feedback.svelte";

	onMount(() => {
		loadUser();
	});
</script>

<svelte:head>
	<title>Main Page</title>
</svelte:head>

<header class="bg-gray-800 text-white p-4 flex items-center justify-between">
	<h1 class="text-xl font-bold">Mail-Manager Dashboard</h1>
	<nav>
		<ul class="flex space-x-4 items-center">
			<li><a href="/" class="hover:underline">Dashboard</a></li>
			<li><a href="/templates" class="hover:underline">Templates</a></li>
			<li><a href="/images" class="hover:underline">Images</a></li>
			<li><a href="/users" class="hover:underline">Users</a></li>
			<li><a href="/email" class="hover:underline">Email</a></li>
			{#if $user}
				<!-- 로그인 상태인 경우 로그아웃 버튼 노출 -->
				<li>
					<button
						on:click={logout}
						class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
					>
						Logout
					</button>
				</li>
			{:else}
				<li><a href="/signin" class="hover:underline">Login</a></li>
			{/if}
		</ul>
	</nav>
</header>

<main class="container mx-auto p-4">
	<slot />
</main>

<Footer />
<Feedback />
