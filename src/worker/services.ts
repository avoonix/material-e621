import { wrap, Remote } from "comlink";

// import { TsWorkerExports } from "./TsWorker";
// import TsWorker from "worker-loader!./TsWorker";
import { ApiService } from "./ApiService";
import ApiServiceWorker from "worker-loader!./ApiServiceWorker";
import { AnalyzeService } from "./AnalyzeService";
import AnalyzeServiceWorker from "worker-loader!./AnalyzeService";

// export function takeALongTimeToDoSomething() {
//   const worker = new TsWorker();
//   const api = wrap<TsWorkerExports>(worker);
//   return api.doStuff("my str");
// }

// let instance1: any, instance2: any;
// async function showState() {
//   console.log(
//     `instance1.counter = ${await instance1.counter}, instance2.counter = ${await instance2.counter}`,
//   );
// }

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
