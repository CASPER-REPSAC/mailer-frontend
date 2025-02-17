
export async function load({ fetch, params }) {
    console.log(params);
    const res = await fetch(`/api/templates/${params.name}`);
    if (res.ok) {
      const templateData = await res.json();
      return { template: templateData || { name: params.name, content: "" } };
    }
    // API 호출 실패 시 기본값 반환
    return { template: { name: params.name, content: "" } };
  }