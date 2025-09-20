import type { FormData } from "../utils/validation";

let globalModalResolver: ((value: FormData | null) => void) | null = null;

export const openFormModal = (): Promise<FormData | null> => {
  return new Promise((resolve) => {
    globalModalResolver = resolve;

    const event = new CustomEvent('openModal');
    window.dispatchEvent(event);
  });
};

export const resolveModal = (data: FormData | null) => {
  if (globalModalResolver) {
    globalModalResolver(data);
    globalModalResolver = null;
  }
};
