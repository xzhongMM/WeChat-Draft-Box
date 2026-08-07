import type { Draft } from "../types/Draft";

const API_URL = "http://localhost:3000";

export async function getDrafts(): Promise<Draft[]> {
    const response = await fetch(`${API_URL}/drafts`);
    return response.json();
}

export async function createDraft(draft: Draft) {
    const response = await fetch(`${API_URL}/drafts`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(draft),
        }
    );

    return response.json();
}

export async function updateDraft(draft: Draft){
    const response = await fetch(`${API_URL}/drafts/${draft.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
    });
    return response.json();
}

export async function removeDraft(id: string) {
    const response = await fetch(`${API_URL}/drafts/${id}`, {
        method: "DELETE",
    });
    return response.json();
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();

  for (const file of files) {
    formData.append("images", file);
  }

  const response = await fetch(`${API_URL}/images`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  return data.imageUrls.map(
    (url: string) => `${API_URL}${url}`
  );
}

export async function removeImage(imageUrl: string) {
  const response = await fetch(`${API_URL}/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });

  return response.json();
}