<script>
  import { createEventDispatcher } from "svelte";
  import Select from "$lib/components/atoms/Select.svelte";
  import * as api from "$lib/utils/api";
  export let templates = [];
  export let selectedTemplate = "";
  export let error = "";
  const dispatch = createEventDispatcher();
  $: templateOptions = templates.map((tpl) => ({ value: tpl, label: tpl }));
  async function onTemplateChange() {
    if (!selectedTemplate) return;
    try {
      const tmplData = await api.fetchTemplate(selectedTemplate);
      const content = tmplData.content;
      const allowedProperties = parseTemplateProperties(content);
      const subject = extractSubjectFromTemplate(content);
      dispatch("templateChange", {
        template: selectedTemplate,
        subject,
        allowedProperties,
      });
    } catch (err) {
      console.error("템플릿 변경 중 오류:", err);
    }
  }
  function parseTemplateProperties(content) {
    const regex = /{{\s*property\s+"([^"]+)"\s*}}/g;
    let match;
    let props = new Set();
    while ((match = regex.exec(content)) !== null) {
      props.add(match[1].trim());
    }
    return Array.from(props);
  }
  function extractSubjectFromTemplate(templateHTML) {
    const regex = /<title>([\s\S]*?)<\/title>/i;
    const match = templateHTML.match(regex);
    return match ? match[1].trim() : "";
  }
</script>

<Select
  id="template-select"
  label="이메일 템플릿"
  bind:value={selectedTemplate}
  options={templateOptions}
  placeholder="템플릿 선택..."
  {error}
  on:change={onTemplateChange}
  required={true}
  helpText={templates.length === 0 ? "사용 가능한 템플릿이 없습니다" : ""}
  class="w-full"
/>
