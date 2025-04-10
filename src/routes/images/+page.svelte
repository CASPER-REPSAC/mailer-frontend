<script>
  import { onMount } from "svelte";
  import { Button, Input, Card, Spinner, Feedback } from "$lib";
  import { createImageStore } from "./stores/imageStore";

  const imageStore = createImageStore();
  const {
    images,
    loading,
    error,
    success,
    uploading,
    fetchImages,
    uploadImage,
    deleteImage,
    getImageUrl,
  } = imageStore;

  let fileInput;
  let selectedFile = null;

  onMount(() => {
    fetchImages();
  });

  function handleFileChange(event) {
    selectedFile = event.target.files[0];
  }

  async function handleUpload() {
    await uploadImage(selectedFile);
    if (!$error && fileInput) {
      selectedFile = null;
      fileInput.value = ""; // Reset file input
    }
  }

  function copyUrl(url) {
    navigator.clipboard
      .writeText(url)
      .then(() =>
        imageStore.feedback.success("URL이 클립보드에 복사되었습니다."),
      )
      .catch(() => imageStore.feedback.error("URL 복사에 실패했습니다."));
  }
</script>

<svelte:head>
  <title>이미지 관리 | Mail-Manager</title>
</svelte:head>

<Card>
  <div
    class="bg-gradient-to-r from-blue-600 to-blue-800 -m-5 mb-0 px-6 py-4 rounded-t-lg"
  >
    <h1 class="text-2xl font-semibold text-white">이미지 관리</h1>
    <p class="text-blue-100 mt-1">
      이메일 템플릿에 사용할 이미지를 업로드하고 효율적으로 관리하세요.
    </p>
  </div>

  <div class="p-6 border-b border-gray-200">
    <div class="flex flex-wrap items-center gap-4">
      <label
        class="relative cursor-pointer bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:border-blue-500 focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600"
      >
        <span class="block text-xs font-medium text-gray-500">이미지 선택</span>
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          on:change={handleFileChange}
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <span class="text-sm text-gray-700"
          >{selectedFile ? selectedFile.name : "파일 없음"}</span
        >
      </label>

      <Button
        on:click={handleUpload}
        disabled={!selectedFile || $uploading}
        loading={$uploading}
        variant="primary"
      >
        업로드
      </Button>
    </div>
  </div>

  <div class="p-6">
    {#if $loading}
      <div class="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    {:else if $images.length > 0}
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {#each $images as img (img)}
          <Card
            bordered={true}
            padding="none"
            class="hover:shadow-md transition-shadow duration-200"
          >
            <div
              class="checker w-full h-36 flex items-center justify-center p-2"
            >
              <img
                src={getImageUrl(img)}
                alt={img}
                class="max-h-32 max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <div class="p-3 bg-gray-50 border-t border-gray-100">
              <p class="text-sm text-gray-600 truncate mb-2" title={img}>
                {img}
              </p>
              <div class="flex justify-between items-center">
                <Button
                  on:click={() => copyUrl(getImageUrl(img))}
                  variant="outline"
                  size="sm"
                >
                  URL 복사
                </Button>
                <Button
                  on:click={() => deleteImage(img)}
                  variant="danger"
                  size="sm"
                >
                  삭제
                </Button>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {:else}
      <div
        class="text-center py-10 bg-gray-50 rounded-lg border border-gray-200"
      >
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          이미지가 없습니다
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          이미지를 업로드하여 이메일 템플릿에 사용해보세요.
        </p>
      </div>
    {/if}
  </div>
</Card>

<style>
  .checker {
    background-color: #fff;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 20px 20px;
    background-position:
      0 0,
      0 10px,
      10px -10px,
      -10px 0;
  }
</style>
