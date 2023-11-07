import { useUrlStore } from "@/services";

export const getE6PostUrl = (id: number) => {
  const url = useUrlStore();
  return `${url.e621Url}post/show/${id}`;
};

export const openUrlInNewTab = (url: string) => {
    if ("__TAURI__" in window) {
        window.__TAURI__.shell.open(url);
        return;
    }
    const win = window.open(url, "_blank", "noopener");
    if (win) {
        win.opener = null;
        win.focus();
    }
}

export const openE6PostInStandaloneWindow = (id: number) =>
  openUrlInNewTab(getE6PostUrl(id));

