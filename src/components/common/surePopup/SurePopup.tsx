import {Component, Emit, Prop, TSX, Vue} from "vue-facing-decorator";
import styles from "./surePopup.module.scss";
import closeButton from "@/ui/svg/close.svg";
import type {Dictionary} from "@/internationalization/abstract/Dictionary";

interface Props {
    popupText: string
    dictionary: Dictionary
}

interface Emits {
    disagree: void
    agree: void
}

@Component
export default class SurePopup extends TSX<Props, Emits>()(Vue) {
    @Prop({required: true}) popupText!: number
    @Prop({required: true}) private dictionary: Dictionary

    @Emit("disagree")
    public disagree() {}

    @Emit("agree")
    public agree() {}

    render() {
        return <>
            <div class={styles.delete__popup_page}>
                <div class={styles.content__container}>
                    <div class={styles.delete__popup_header}>
                        <img src={closeButton} class={styles.close__button} alt={"close.svg"} onClick={this.disagree}/>
                    </div>
                    <div class={styles.delete__popup_text_container}>
                        {this.popupText}
                    </div>
                    <div class={styles.button__container}>
                        <button onClick={this.disagree}>
                            {this.dictionary.buttonLabels.no}
                        </button>
                        <button onClick={this.agree}>
                            {this.dictionary.buttonLabels.yes}
                        </button>
                    </div>
                </div>
            </div>
        </>
    }
}