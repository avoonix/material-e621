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
        maxRetries = 15,
        retryIntervalMs = 1000,
    ): void {
        const expectedOrigin = new URL(oldDomainUrl).origin;

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
                onError();
                window.removeEventListener("message", messageHandler);
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
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

    function setupMigrationDataListener(allowedOrigin: string): void {
        window.addEventListener("message", (event: MessageEvent<MigrationMessage>) => {
            if (event.origin !== allowedOrigin) return;

            if (event.data?.type === "requestMigrationData") {
                const state = persistanceService.getState();

                if (state.history.entries.length > 0) {

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
