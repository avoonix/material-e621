import { wrap, Remote } from "comlink";
import { ApiService } from "./ApiService";
import { AnalyzeService } from "./AnalyzeService";
import { DashboardService } from "./DashboardService";

// const workerOptions = import.meta.env.PROD ? {} : { type: "module" as const };

const wrapWorker = async <T>(worker: Worker): Promise<Remote<T>> => {
  const WrappedService = await wrap<T>(worker);
  return new (WrappedService as any)();
};

let apiServiceInstance: Remote<ApiService>;

export const getApiService = async () => {
  return (
    apiServiceInstance ||
    (apiServiceInstance = await wrapWorker<ApiService>(
      new Worker(new URL("./ApiServiceWorker", import.meta.url), {
        type: "module",
      }),
    ))
  );
};

let analyzeServiceInstance: Remote<AnalyzeService>;

export const getAnalyzeService = async () => {
  return (
    analyzeServiceInstance ||
    (analyzeServiceInstance = await wrapWorker<AnalyzeService>(
      new Worker(new URL("./AnalyzeService", import.meta.url), {
        type: "module",
      }),
    ))
  );
};

let dashboardServiceInstance: Remote<DashboardService>;

export const getDashboardService = async () => {
  return (
    dashboardServiceInstance ||
    (dashboardServiceInstance = await wrapWorker<DashboardService>(
      new Worker(new URL("./DashboardService", import.meta.url), {
        type: "module",
      }),
    ))
  );
};
