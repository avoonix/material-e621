import { readonly, ref } from "vue";

// very little support (https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation)

export interface INetworkInfo {
  type:
    | "bluetooth"
    | "cellular"
    | "ethernet"
    | "none"
    | "wifi"
    | "wimax"
    | "other"
    | "unknown";
  saveData: boolean;

  typeSupported: boolean;
}

const nav = navigator as any;

const getInfo = (): INetworkInfo => {
  const saveData = nav.connection?.saveData;
  const type = nav.connection?.type;
  return {
    saveData: saveData || false,
    typeSupported: typeof type === "string",
    type: type || "unknown",
  };
};

const info = ref<INetworkInfo>(getInfo());

export const useDataSaverInfo = () => {
  return {
    dataSaverInfo:(info),
  };
};

let timeoutId: any = null;
const twoMinutesInMs = 2 * 60 * 1000;

const handleChange = () => {
  info.value = getInfo();
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(handleChange, twoMinutesInMs);
};

// event not supported for all browsers
(nav.connection || {}).onchange = handleChange();
nav.connection?.addEventListener("change", handleChange);

handleChange();
