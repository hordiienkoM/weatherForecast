import AlertPopup from "@/components/common/alertPopup";
import { createApp, h } from 'vue';
export function alertMessage(message: string, color?: string) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const app = createApp({
        render() {
            return h(AlertPopup, {
                popupText: message,
                color: color,
                onClose: () => {
                    app.unmount();
                    document.body.removeChild(container);
                }
            });
        }
    });

    app.mount(container);
}

export function alertError(message) {
    alertMessage(message, "red")
}