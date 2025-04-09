export const debug = (namespace: string) => (...args: any[]) => {
    if (!import.meta.env.PROD) return;
    console.log(namespace, ...args);
}
