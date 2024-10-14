import {Component, Emit, TSX, Vue} from "vue-facing-decorator";
import styles from "./langSelector.module.scss";
import triangle from "@/ui/svg/triangle.svg"
export enum Language {
    EN = 'EN',
    UK = 'UK'
}

interface Props {

}

interface Emits {
    selectLang: Language
}
@Component
export default class LangSelector extends TSX<Props, Emits>()(Vue) {
    private showOptions: boolean = false
    private selected: Language = Language.UK

    private computeBtnStyle() {
        const stateStyle = this.showOptions
            ? styles.langSelector__btn_opened
            : ''
        return `${styles.langSelector__btn} ${stateStyle}`
    }

    @Emit("selectLang")
    private selectLang(lang: Language) {
        this.selected = lang
        this.showOptions = false
        return lang
    }
    render() {
        return <>
            <div class={styles.langSelector}>
                <button class={this.computeBtnStyle()}
                        onClick={() => this.showOptions = !this.showOptions}>
                    {this.selected}
                    <img src={triangle} alt={"triangle.svg"} />
                </button>
                {this.showOptions &&
                    <div class={styles.langSelector__options}>
                        <div class={styles.langSelector__option}
                             onClick={() => this.selectLang(Language.EN)}>
                            {Language.EN}
                        </div>
                        <div class={styles.langSelector__option}
                             onClick={() => this.selectLang(Language.UK)}>
                            {Language.UK}
                        </div>
                    </div>
                }
            </div>
        </>
    }
}