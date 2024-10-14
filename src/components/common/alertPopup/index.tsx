import {Component, Emit, Prop, TSX, Vue} from "vue-facing-decorator";
import styles from "./index.module.scss";
interface Props {
    popupText: string
    color?: string
}

interface Emits {
    close: void
}

@Component
export default class AlertPopup extends TSX<Props, Emits>()(Vue) {
    @Prop({required: true}) popupText!: string
    @Prop color?: string

    mounted() {
        window.addEventListener('keydown', this.close);
    }

    unmounted() {
        window.removeEventListener('keydown', this.close);
    }

    @Emit("close")
    public close(event: Event) {
        event.preventDefault();
    }

    render() {
        const messageTextStyle = this.color? `color: ${this.color}` : ""
        return <>
            <div class={styles.alert__popup_page}>
                <div class={styles.content__container}>
                    <div class={styles.alert__popup_text_container} style={messageTextStyle}>
                        {this.popupText}
                    </div>
                    <div class={styles.button__container}>
                        <button class={"short__blue_button"} onClick={this.close}>
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </>
    }
}