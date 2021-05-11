import { wrap, Remote } from "comlink";

import { ApiService } from "./ApiService";
import ApiServiceWorker from "worker-loader!./ApiServiceWorker";
import { AnalyzeService } from "./AnalyzeService";
import AnalyzeServiceWorker from "worker-loader!./AnalyzeService";

const createWorker = async <T>(Worker: any): Promise<Remote<T>> => {
  const worker = new Worker();
  const WrappedService = await wrap<T>(worker);
  return new (WrappedService as any)();
};

let apiServiceInstance: Remote<ApiService>;

export const getApiService = async () => {
  return (
    apiServiceInstance ||
    (apiServiceInstance = await createWorker<ApiService>(ApiServiceWorker))
  );
};

let analyzeServiceInstance: Remote<AnalyzeService>;

export const getAnalyzeService = async () => {
  return (
    analyzeServiceInstance ||
    (analyzeServiceInstance = await createWorker<AnalyzeService>(
      AnalyzeServiceWorker,
    ))
  );
};
