export const getE6PostUrl = (id: number) => `https://e621.net/post/show/${id}`;

export const openInStandaloneWindow = (url: string) => {
  const win = window.open(url, "_blank");
  if (win) win.focus();
};

export const openE6PostInStandaloneWindow = (id: number) =>
  openInStandaloneWindow(getE6PostUrl(id));
