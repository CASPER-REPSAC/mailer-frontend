<script>
  import { onMount } from "svelte";
  import * as api from "$lib/utils/api";
  import { feedback } from "$lib/stores/feedback";
  import { Button, Card, Input } from "$lib";
  import TemplateSelector from "./components/TemplateSelector.svelte";
  import RecipientTabs from "./components/RecipientTabs.svelte";
  import RecipientList from "./components/RecipientList.svelte";
  import EmailSummary from "./components/EmailSummary.svelte";
  import { createEmailStore } from "./stores/emailStore";
  const emailStore = createEmailStore();

  let {
    subject,
    templates,
    selectedTemplate,
    recipients,
    allowedProperties,
    isSending,
    sendError,
    sendSuccess,
    isFormValid,
    formErrors,
  } = emailStore;
  function handleTemplateChange(event) {
    emailStore.selectedTemplate.set(event.detail.template);
    emailStore.updateSubject(event.detail.subject);
    emailStore.updateAllowedProperties(event.detail.allowedProperties);
  }

  function handleAddRecipients(event) {
    emailStore.addRecipients(event.detail.recipients);
  }

  function handleRemoveRecipient(event) {
    emailStore.removeRecipient(event.detail.index);
  }

  function handleRemoveAllRecipients() {
    emailStore.removeAllRecipients();
  }

  function handleUpdateRecipient(event) {
    const { index, field, value } = event.detail;
    emailStore.updateRecipient(index, field, value);
  }

  function handleUpdateCustomProperty(event) {
    const { recipientIndex, property, value } = event.detail;
    emailStore.updateCustomProperty(recipientIndex, property, value);
  }
  onMount(async () => {
    try {
      await emailStore.loadTemplates();
    } catch (error) {
      feedback.error("템플릿 불러오기 실패", error.message);
    }
  });

  async function sendEmail() {
    if (!emailStore.validateForm()) {
      const errorMessage = Object.values($formErrors).join(", ");
      feedback.error("이메일을 발송할 수 없습니다", errorMessage);
      return;
    }

    try {
      await emailStore.sendEmail();
      feedback.success(
        "이메일이 성공적으로 발송되었습니다",
        `${$recipients.length}명에게 발송됨`,
      );
    } catch (err) {
      feedback.error("이메일 발송 실패", err.message);
    }
  }
</script>

<svelte:head>
  <title>이메일 발송 | Mail-Manager</title>
</svelte:head>

<section
  class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
>
  <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
    <h1 class="text-2xl font-semibold text-white">이메일 발송</h1>
    <p class="text-blue-100 mt-1">
      이메일 템플릿을 선택하고 수신자를 추가한 후 이메일을 발송하세요.
    </p>
  </div>

  <Card padding="normal" bordered={false} class="border-b border-gray-200">
    <div class="grid md:grid-cols-2 gap-5">
      <TemplateSelector
        templates={$templates}
        selectedTemplate={$selectedTemplate}
        error={$formErrors.template}
        on:templateChange={handleTemplateChange}
      />
      <Input
        id="subject"
        type="text"
        bind:value={$subject}
        label="이메일 제목"
        placeholder="이메일 제목을 입력하세요"
        error={$formErrors.subject}
      />
    </div>
  </Card>
  <RecipientTabs
    allowedProperties={$allowedProperties}
    on:addRecipients={handleAddRecipients}
  />
  <RecipientList
    recipients={$recipients}
    allowedProperties={$allowedProperties}
    on:updateRecipient={handleUpdateRecipient}
    on:updateCustomProperty={handleUpdateCustomProperty}
    on:removeRecipient={handleRemoveRecipient}
    on:removeAll={handleRemoveAllRecipients}
  />
  <div class="p-6">
    <div class="flex items-center justify-end">
      <EmailSummary success={$sendSuccess} error={$sendError} />
      <Button
        on:click={sendEmail}
        disabled={!$isFormValid || $isSending}
        variant="primary"
        loading={$isSending}
        icon={$isSending
          ? ""
          : `<svg
          class="mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
          />
        </svg>`}
      >
        {$isSending ? "발송 중..." : `이메일 발송 (${$recipients.length}명)`}
      </Button>
    </div>
  </div>
</section>
