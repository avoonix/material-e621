import { usePersistanceService } from "@/services";
import type { ISettingsServiceState } from "@/services/types";

type MigrationMessage =
    | { type: "requestMigrationData" }
    | { type: "migrationDataResponse"; migrationData: ISettingsServiceState };

export const useMigrator = () => {
    const persistanceService = usePersistanceService();

    function requestMigrationDataViaIframe(
        oldDomainUrl: string,
        onSuccess: () => void,
        onError: () => void,
        maxRetries = 5,
        retryIntervalMs = 1000,
    ): void {
        const expectedOrigin = new URL(oldDomainUrl).origin;

        const openMigrationWindow = () => {
            let success = false;
            window.addEventListener("message", (event: MessageEvent<MigrationMessage>) => {
                console.log(event)
                if (event.origin !== expectedOrigin) return;
                if (event.data?.type !== "migrationDataResponse") return;
                window.removeEventListener("message", openMigrationWindow);
                persistanceService.setState(event.data.migrationData);
                success = true;
                onSuccess();
                w?.close();
            });
            const w = window.open(oldDomainUrl, "_blank");
            console.log(w, oldDomainUrl)
            setTimeout(() => {
                if (!success) {
                    window.removeEventListener("message", openMigrationWindow);
                    fallbackToIframe();
                    w?.close();
                }
            }, 10000);
        }

        openMigrationWindow();

        const fallbackToIframe = () => {
            const iframe = document.createElement("iframe");
            iframe.src = oldDomainUrl;
            iframe.style.display = "none";
            document.body.appendChild(iframe);

            const messageHandler = (event: MessageEvent<MigrationMessage>) => {
                if (event.origin !== expectedOrigin) return;
                if (event.data?.type !== "migrationDataResponse") return;

                window.removeEventListener("message", messageHandler);
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }

                persistanceService.setState(event.data.migrationData);
                onSuccess();
            };

            window.addEventListener("message", messageHandler);

            let attempts = 0;
            const sendRequest = () => {
                if (attempts >= maxRetries) {
                    window.removeEventListener("message", messageHandler);
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                    onError();
                    return;
                }

                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ type: "requestMigrationData" }, expectedOrigin);
                    attempts++;
                    setTimeout(sendRequest, retryIntervalMs);
                } else {
                    setTimeout(sendRequest, retryIntervalMs);
                }
            };

            iframe.onload = () => {
                sendRequest();
            };
        }
    }

    function setupMigrationDataListener(allowedOrigin: string): void {
        console.log("Setting up migration data listener", allowedOrigin);
        setInterval(() => {
            const state = persistanceService.getState();
            if (state.history.entries.length > 0) {
                console.log("sending state to opener");
                const response: MigrationMessage = {
                    type: "migrationDataResponse",
                    migrationData: state
                };

                window.opener?.postMessage(response, {
                    targetOrigin: allowedOrigin
                });
            }
        }, 1000);
        window.addEventListener("message", (event: MessageEvent<MigrationMessage>) => {
            console.log("received message", event.data);
            if (event.origin !== allowedOrigin) return;

            if (event.data?.type === "requestMigrationData") {
                const state = persistanceService.getState();
                console.log("got state")
                if (state.history.entries.length > 0) {
                    console.log("sending state");
                    const response: MigrationMessage = {
                        type: "migrationDataResponse",
                        migrationData: state
                    };

                    event.source?.postMessage(response, {
                        targetOrigin: allowedOrigin
                    });
                }
            }
        });
    }

    return {
        requestMigrationDataViaIframe,
        setupMigrationDataListener
    };
}
