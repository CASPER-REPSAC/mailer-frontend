import { writable, derived } from 'svelte/store';
import * as api from "$lib/utils/api";

export function createEmailStore() {
  const subject = writable("");
  const templates = writable([]);
  const selectedTemplate = writable("");
  const recipients = writable([]);
  const allowedProperties = writable([]);
  const isSending = writable(false);
  const sendError = writable("");
  const sendSuccess = writable("");
  const formErrors = writable({});
  const isFormValid = derived(
    [subject, selectedTemplate, recipients],
    ([$subject, $selectedTemplate, $recipients]) => {
      return !!$subject.trim() && !!$selectedTemplate && $recipients.length > 0;
    }
  );
  async function loadTemplates() {
    try {
      const tpls = await api.fetchTemplates();
      templates.set(tpls);

      if (tpls.length > 0) {
        selectedTemplate.set(tpls[0]);
        await updateSelectedTemplate(tpls[0]);
      }

      return tpls;
    } catch (error) {
      console.error("템플릿 불러오기 오류:", error);
      throw error;
    }
  }
  async function updateSelectedTemplate(templateName) {
    if (!templateName) return;
    console.log("템플릿 변경:", templateName);

    try {
      const tmplData = await api.fetchTemplate(templateName);
      const content = tmplData.content;
      const extractedSubject = extractSubjectFromTemplate(content);
      if (extractedSubject) {
        subject.set(extractedSubject);
      }
      const props = parseTemplateProperties(content);
      allowedProperties.set(props);
      recipients.update($recipients => {
        return $recipients.map(r => {
          let newCustom = { ...r.custom };
          props.forEach(key => {
            if (!(key in newCustom)) newCustom[key] = "";
          });
          Object.keys(newCustom).forEach(key => {
            if (!props.includes(key)) delete newCustom[key];
          });
          return { ...r, custom: newCustom };
        });
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
  function validateForm() {
    const errors = {};
    const $subject = get(subject);
    const $selectedTemplate = get(selectedTemplate);
    const $recipients = get(recipients);

    if (!$subject.trim()) errors.subject = "이메일 제목을 입력하세요";
    if (!$selectedTemplate) errors.template = "이메일 템플릿을 선택하세요";
    if ($recipients.length === 0) errors.recipients = "최소 한 명 이상의 수신자가 필요합니다";

    formErrors.set(errors);
    return Object.keys(errors).length === 0;
  }
  function addRecipients(newRecipients) {
    recipients.update($recipients => {
      const existingEmails = new Set($recipients.map(r => r.email));
      const filteredNew = newRecipients.filter(r => !existingEmails.has(r.email));

      return [...$recipients, ...filteredNew];
    });
  }
  function removeRecipient(index) {
    recipients.update($recipients => {
      return $recipients.filter((_, i) => i !== index);
    });
  }
  function removeAllRecipients() {
    recipients.set([]);
  }
  function updateRecipient(index, field, value) {
    recipients.update($recipients => {
      const updated = [...$recipients];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }
  function updateCustomProperty(recipientIndex, property, value) {
    recipients.update($recipients => {
      const updated = [...$recipients];
      updated[recipientIndex] = {
        ...updated[recipientIndex],
        custom: {
          ...updated[recipientIndex].custom,
          [property]: value
        }
      };
      return updated;
    });
  }
  async function sendEmail() {
    if (!validateForm()) {
      return false;
    }

    isSending.set(true);
    sendError.set("");
    sendSuccess.set("");

    try {
      const $subject = get(subject);
      const $selectedTemplate = get(selectedTemplate);
      const $recipients = get(recipients);

      const res = await api.sendEmail({
        template: $selectedTemplate,
        subject: $subject,
        recipient: $recipients
      });

      sendSuccess.set(res.message);
      return true;
    } catch (err) {
      sendError.set(err.message);
      throw err;
    } finally {
      isSending.set(false);
    }
  }
  function get(store) {
    let value;
    const unsubscribe = store.subscribe(v => value = v);
    unsubscribe();
    return value;
  }
  return {
    subject,
    templates,
    selectedTemplate,
    recipients,
    allowedProperties,
    isSending,
    sendError,
    sendSuccess,
    formErrors,
    isFormValid,
    loadTemplates,
    setSelectedTemplate: (template) => {
      selectedTemplate.set(template);
      return updateSelectedTemplate(template);
    },
    updateSubject: (value) => subject.set(value),
    updateAllowedProperties: (props) => allowedProperties.set(props),
    addRecipients,
    removeRecipient,
    removeAllRecipients,
    updateRecipient,
    updateCustomProperty,
    validateForm,
    sendEmail
  };
}
