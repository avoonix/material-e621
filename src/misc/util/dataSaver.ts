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
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  effectiveTypeSupported: boolean;
  typeSupported: boolean;
}

const nav = navigator as any;

const getInfo = (): INetworkInfo => {
  const saveData = nav.connection?.saveData;
  const type = nav.connection?.type;
  const effectiveType = nav.connection?.effectiveType;
  return {
    saveData: saveData || false,
    typeSupported: typeof type === "string",
    type: type || "unknown",
    effectiveType,
    effectiveTypeSupported: typeof effectiveType === "string",
  };
};

const info = ref<INetworkInfo>(getInfo());

export const useDataSaverInfo = () => {
  return {
    dataSaverInfo: info,
  };
};

let timeoutId: any = null;
const minute = 60 * 1000;

const handleChange = () => {
  info.value = getInfo();
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(handleChange, 2 * minute);
};

// event not supported for all browsers
(nav.connection || {}).onchange = handleChange();
nav.connection?.addEventListener("change", handleChange);

handleChange();
