export async function load({ fetch, params }) {
    const res = await fetch(`/api/templates/${params.name}`);
    if (res.ok) {
      const templateData = await res.json();
      return { template: templateData || { name: params.name, content: "" } };
    }
    return { template: { name: params.name, content: "" } };
  }