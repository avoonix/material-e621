import { useUrlStore } from "@/services";

export const getE6PostUrl = (id: number) => {
  const url = useUrlStore();
  return `${url.e621Url}post/show/${id}`;
};

export const openInStandaloneWindow = (url: string) => {
  const win = window.open(url, "_blank");
  if (win) win.focus();
};

export const openE6PostInStandaloneWindow = (id: number) =>
  openInStandaloneWindow(getE6PostUrl(id));
