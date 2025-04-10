<script>
  import GithubIcon from "$lib/components/icons/GithubIcon.svelte";
  import InstagramIcon from "$lib/components/icons/InstagramIcon.svelte";
  import FacebookIcon from "$lib/components/icons/FacebookIcon.svelte";
  import CasperIcon from "$lib/components/icons/CasperIcon.svelte";

  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/CASPER-REPSAC",
      component: GithubIcon,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/casper.cwnu",
      component: InstagramIcon,
    },
    {
      name: "Facebook",
      url: "https://facebook.com/cwnu.casper",
      component: FacebookIcon,
    },
  ];
  const menuLinks = [
    { name: "홈페이지", url: "https://www.casper.or.kr" },
    { name: "지원하기", url: "https://recruit.casper.or.kr" },
  ];
</script>

<footer class="bg-gray-900 text-white pt-10 pb-6">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between mb-8 gap-8">
      <div class="mb-6 md:mb-0">
        <div class="flex items-center gap-2">
          <CasperIcon class="text-white h-8 w-8" />
          <h2 class="text-xl font-bold">CASPER</h2>
        </div>
        <p class="mt-2 text-gray-400 max-w-xs text-sm">
          국립창원대학교 정보보안동아리 CASPER는<br />
          사이버 보안 연구와 교육을 통해 미래 보안 전문가를 양성합니다.
        </p>
      </div>
      <div class="mb-6 md:mb-0">
        <h3 class="text-base font-semibold mb-4 uppercase tracking-wider">
          바로가기
        </h3>
        <ul class="space-y-2">
          {#each menuLinks as link}
            <li>
              <a
                href={link.url}
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {link.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      <div class="mb-6 md:mb-0">
        <h3 class="text-base font-semibold mb-4 uppercase tracking-wider">
          연락처
        </h3>
        <p class="text-gray-400 text-sm">
          국립창원대학교 51호관(공대 1호관) 107호
        </p>
        <p class="text-gray-400 text-sm">경남 창원시 의창구 창원대학로 20</p>
        <p class="text-gray-400 mt-2 text-sm">casper.cwnu@gmail.com</p>
      </div>
    </div>
    <div
      class="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center"
    >
      <p class="text-gray-500 text-sm mb-4 md:mb-0">
        &copy; {currentYear} CASPER. All rights reserved.
      </p>
      <div class="flex space-x-4">
        {#each socialLinks as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label={social.name}
          >
            <svelte:component this={social.component} class="h-5 w-5" />
          </a>
        {/each}
      </div>
    </div>
  </div>
</footer>

<style>
  @keyframes moveUpDown {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
  :global(#casper-icon) {
    animation: moveUpDown 3s infinite;
  }
</style>
