import { writable } from 'svelte/store';
import * as api from '$lib/utils/api';
import { feedback } from '$lib/stores/feedback';

export function createTemplateListStore() {
  const templates = writable([]);
  const loading = writable(false);
  const error = writable('');

  async function loadTemplates() {
    loading.set(true);
    error.set('');
    try {
      const data = await api.fetchTemplates();
      templates.set(data);
    } catch (err) {
      error.set('템플릿 로드 중 오류가 발생했습니다.');
      feedback.error("템플릿 목록 로드 실패", err.message);
    } finally {
      loading.set(false);
    }
  }

  async function createTemplate() {
    const newName = prompt("생성할 템플릿의 이름을 입력하세요:", "");
    if (!newName) return;

    const currentTemplates = get(templates); // Helper needed or subscribe once
    if (currentTemplates.includes(newName)) {
      feedback.error("이름 중복", "이미 해당 이름의 템플릿이 존재합니다.");
      return;
    }

    loading.set(true);
    try {
      let defaultContent = '<html><head><title>New Template</title></head><body><h1>New Template</h1></body></html>'; // Basic default
      try {
        const defaultTpl = await api.fetchTemplate("default");
        defaultContent = defaultTpl.content;
      } catch {
        // Default template might not exist, use basic default
        console.warn("Default template not found, using basic HTML structure.");
      }

      await api.updateTemplate(newName, defaultContent);
      feedback.success("템플릿 생성 완료", `${newName} 템플릿이 생성되었습니다.`);
      await loadTemplates(); // Refresh list
    } catch (err) {
      feedback.error("템플릿 생성 실패", err.message);
    } finally {
      loading.set(false);
    }
  }

  async function duplicateTemplate(originalName) {
    const newName = prompt("복제할 새 템플릿 이름을 입력하세요:", `${originalName}_copy`);
    if (!newName) return;

    const currentTemplates = get(templates);
    if (currentTemplates.includes(newName)) {
      feedback.error("이름 중복", "이미 해당 이름의 템플릿이 존재합니다.");
      return;
    }
    loading.set(true);
    try {
      const data = await api.fetchTemplate(originalName);
      await api.updateTemplate(newName, data.content);
      feedback.success("템플릿 복제 완료", `${originalName}을(를) ${newName}(으)로 복제했습니다.`);
      await loadTemplates();
    } catch (err) {
      feedback.error("템플릿 복제 실패", err.message);
    } finally {
      loading.set(false);
    }
  }

  async function renameTemplate(originalName) {
    const newName = prompt("변경할 템플릿 이름을 입력하세요:", originalName);
    if (!newName || newName === originalName) return;

    const currentTemplates = get(templates);
    if (currentTemplates.includes(newName)) {
      feedback.error("이름 중복", "이미 해당 이름의 템플릿이 존재합니다.");
      return;
    }
    loading.set(true);
    try {
      const data = await api.fetchTemplate(originalName);
      await api.updateTemplate(newName, data.content); // Create new first
      await api.deleteTemplate(originalName); // Then delete old
      feedback.success("이름 변경 완료", `${originalName}에서 ${newName}(으)로 변경되었습니다.`);
      await loadTemplates();
    } catch (err) {
      feedback.error("이름 변경 실패", err.message);
    } finally {
      loading.set(false);
    }
  }


  async function deleteTemplate(name) {
    if (!confirm(`템플릿 "${name}"을(를) 정말 삭제하시겠습니까?`)) return;
    loading.set(true);
    try {
      await api.deleteTemplate(name);
      feedback.success("템플릿 삭제 완료", `${name} 템플릿이 삭제되었습니다.`);
      await loadTemplates();
    } catch (err) {
      feedback.error("템플릿 삭제 실패", err.message);
    } finally {
      loading.set(false);
    }
  }

  function get(store) {
    let value;
    const unsubscribe = store.subscribe(v => value = v);
    unsubscribe();
    return value;
  }


  return {
    templates,
    loading,
    error,
    loadTemplates,
    createTemplate,
    duplicateTemplate,
    renameTemplate,
    deleteTemplate
  };
}
