import {Component, Emit, Prop, TSX, Vue, Watch} from "vue-facing-decorator";
import styles from "./mainTabBar.module.scss"
import type {Dictionary} from "@/internationalization/abstract/Dictionary";
import LangSelector, {Language} from "@/components/langSelector/LangSelector";
import {ActiveWindow} from "@/models/ActiveWindow";
import cityStorage from "@/services/CityStorageService";

interface Props {
    dictionary: Dictionary
    favoriteListLength: number
}

interface Emits {
    selectLang: Language
    selectTab: ActiveWindow
}

@Component
export default class MainTabBar extends TSX<Props, Emits>()(Vue) {
    @Prop({required: true}) private dictionary: Dictionary
    @Prop({required: true}) private favoriteListLength: number
    private activeWindow: ActiveWindow = ActiveWindow.MAIN

    private computeTabStyle(tab: ActiveWindow) {
        return this.activeWindow === tab ? styles.mainTabBar__btn_selected : styles.mainTabBar__btn
    }

    @Emit("selectLang")
    private selectLang(lang: Language) {
        return lang
    }

    @Emit("selectTab")
    private selectTab(tab: ActiveWindow) {
        this.activeWindow = tab
        return tab
    }

    render() {
        return <>
            <div class={styles.mainTabBar}>
                <button class={this.computeTabStyle(ActiveWindow.MAIN)}
                        onClick={() => this.selectTab(ActiveWindow.MAIN)}>
                    {this.dictionary?.buttonLabels?.main}
                </button>
                <button class={this.computeTabStyle(ActiveWindow.FAVORITE)}
                        onClick={() => this.selectTab(ActiveWindow.FAVORITE)}>
                    {`${this.dictionary?.buttonLabels?.favorite}(${this.favoriteListLength})`}
                </button>
                <LangSelector onSelectLang={this.selectLang} />
            </div>
        </>
    }
}