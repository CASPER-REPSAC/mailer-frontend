<svelte:head>
  <title>Images</title>
</svelte:head>
<script>
  import * as api from "$lib/utils/api";
  import { onMount } from "svelte";
  let file = null;
  let imageList = [];
  let err = "";
  let success = "";
  async function fetchImages() {
    try {
      const data = await api.fetchImages();
      imageList = data;
    } catch (e) {
      err = `Fetch error: ${e}`;
    }
  }
  onMount(() => {
    fetchImages();
  });
  async function upload() {
    err = "";
    success = "";
    if (!file) {
      err = "No file selected";
      return;
    }
    try {
      const res = await api.uploadImage(file);
      success = res.message;
      fetchImages();
    } catch (e) {
      err = `Upload error: ${e}`;
    }
  }
  async function del(name) {
    if (!confirm("Delete " + name + "?")) return;
    try {
      await api.deleteImage(name);
      fetchImages();
    } catch (e) {
      alert("Delete error");
    }
  }
</script>

<section class="p-4 max-w-4xl mx-auto">
  <h2 class="text-2xl font-bold mb-4">Images</h2>
  {#if err}
    <p class="text-red-500">{err}</p>
  {/if}
  {#if success}
    <p class="text-green-500">{success}</p>
  {/if}
  <div class="mb-4">
    <input
      type="file"
      accept="image/*"
      on:change={(e) => (file = e.target.files[0])}
    />
    <button
      on:click={upload}
      class="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Upload</button
    >
  </div>
  {#if imageList.length > 0}
    <div class="grid grid-cols-3 gap-4">
      {#each imageList as img}
        <div class="border p-2 text-center">
          <div class="checker w-full h-32 flex items-center justify-center">
            <img
              src={"/api/images/" + img}
              alt={img}
              class="max-h-32 max-w-full object-contain"
            />
          </div>
          <p class="text-sm mt-2">{img}</p>
          <button
            on:click={() => del(img)}
            class="bg-red-500 text-white px-2 py-1 rounded mt-2">Delete</button
          >
        </div>
      {/each}
    </div>
  {:else}
    <p>No images available.</p>
  {/if}
</section>

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
