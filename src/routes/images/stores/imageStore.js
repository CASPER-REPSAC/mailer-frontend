import { writable } from 'svelte/store';
import * as api from '$lib/utils/api';
import { feedback } from '$lib/stores/feedback';

export function createImageStore() {
  const images = writable([]);
  const loading = writable(false);
  const error = writable('');
  const success = writable('');
  const uploading = writable(false);

  async function fetchImages() {
    loading.set(true);
    error.set('');
    try {
      const data = await api.fetchImages();
      images.set(data);
    } catch (e) {
      error.set(`Fetch error: ${e.message}`);
      feedback.error("이미지 불러오기 실패", e.message);
    } finally {
      loading.set(false);
    }
  }

  async function uploadImage(file) {
    if (!file) {
      error.set("No file selected");
      feedback.error("선택된 파일이 없습니다");
      return;
    }
    uploading.set(true);
    error.set('');
    success.set('');
    try {
      const res = await api.uploadImage(file);
      success.set(res.message);
      feedback.success("이미지 업로드 성공", res.message);
      await fetchImages(); // Refresh list
    } catch (e) {
      error.set(`Upload error: ${e.message}`);
      feedback.error("업로드 실패", e.message);
    } finally {
      uploading.set(false);
    }
  }

  async function deleteImage(filename) {
    if (!confirm(`이미지 "${filename}"을(를) 삭제하시겠습니까?`)) return;
    error.set('');
    success.set('');
    try {
      await api.deleteImage(filename);
      success.set(`${filename} 이미지가 삭제되었습니다`);
      feedback.success("이미지 삭제 성공", `${filename} 이미지가 삭제되었습니다`);
      await fetchImages(); // Refresh list
    } catch (e) {
      error.set(`Delete error: ${e.message}`);
      feedback.error("삭제 실패", e.message);
    }
  }

  function getImageUrl(filename) {
    return api.getImageUrl(filename);
  }

  return {
    images,
    loading,
    error,
    success,
    uploading,
    fetchImages,
    uploadImage,
    deleteImage,
    getImageUrl,
  };
}