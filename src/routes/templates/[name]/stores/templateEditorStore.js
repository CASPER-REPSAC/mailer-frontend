import { writable } from 'svelte/store';
import * as api from '$lib/utils/api';
import { feedback } from '$lib/stores/feedback';

export function createTemplateEditorStore(initialTemplate) {
  const name = writable(initialTemplate?.name ?? '');
  const content = writable(initialTemplate?.content ?? '');
  const previewHTML = writable('');
  const isSaving = writable(false);
  const isLoadingPreview = writable(false);
  const error = writable('');

  async function updatePreview() {
    isLoadingPreview.set(true);
    error.set('');
    try {
      const currentContent = get(content);
      const currentName = get(name);
      if (!currentName) return; // Don't preview if name isn't set
      const html = await api.previewTemplate(currentName, currentContent);
      previewHTML.set(html);
    } catch (err) {
      const errorMessage = `미리보기 생성 실패: ${err.message}`;
      previewHTML.set(`<p style="color: red;">${errorMessage}</p>`);
      error.set(errorMessage);
      feedback.error("미리보기 생성 실패", err.message); // Maybe too noisy on every keystroke?
    } finally {
      isLoadingPreview.set(false);
    }
  }

  async function saveTemplate() {
    const currentContent = get(content);
    const currentName = get(name);
    if (!currentContent.trim()) {
      feedback.error("템플릿 내용이 비어있습니다");
      return;
    }
    if (!currentName) {
      feedback.error("템플릿 이름이 없습니다.");
      return;
    }

    isSaving.set(true);
    error.set('');
    try {
      await api.updateTemplate(currentName, currentContent);
      feedback.success("템플릿이 저장되었습니다");
    } catch (err) {
      const errorMessage = `템플릿 저장 실패: ${err.message}`;
      error.set(errorMessage);
      feedback.error("템플릿 저장 실패", err.message);
    } finally {
      isSaving.set(false);
    }
  }

  function get(store) {
    let value;
    const unsubscribe = store.subscribe(v => value = v);
    unsubscribe();
    return value;
  }
  if (initialTemplate?.name && initialTemplate?.content) {
    updatePreview();
  }


  return {
    name,
    content,
    previewHTML,
    isSaving,
    isLoadingPreview,
    error,
    updatePreview,
    saveTemplate,
    setContent: (newContent) => content.set(newContent)
  };
}