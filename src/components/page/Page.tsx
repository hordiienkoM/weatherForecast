import {Component, TSX, Vue, Watch} from "vue-facing-decorator";
import styles from "./page.module.scss";
import Header from "@/components/header/Header";
import MainTabBar from "@/components/mainTabBar/MainTabBar";
import InfoPanel from "@/components/infoPanel/InfoPanel";
import dictionaryUK from "@/internationalization/DirtionaryUK";
import type {Dictionary} from "@/internationalization/abstract/Dictionary";
import {Language} from "@/components/langSelector/LangSelector";
import dictionaryEN from "@/internationalization/DictionaryEN";
import {ActiveWindow} from "@/models/ActiveWindow";
import Favorite from "@/components/favorite/Favorite";
import cityStorage from "@/services/CityStorageService";

@Component
export default class Page extends TSX()(Vue) {
    private dictionary: Dictionary = dictionaryUK
    private selectedTab: ActiveWindow = ActiveWindow.MAIN
    private favoriteListLength = 0
    private nightMode: boolean = false

    private selectLang(lang: Language) {
        if (lang === Language.UK) {
            this.dictionary = dictionaryUK
        } else if (lang === Language.EN) {
            this.dictionary = dictionaryEN
        }
    }

    mounted() {
        this.updateCitiesCounter()
    }

    private updateCitiesCounter() {
        this.favoriteListLength = cityStorage.getCities().length
    }

    render() {
        return <>
            <div class={styles.page}>
                <div class={styles.padding__top} /> {/* because little problem with adaptive. Don't have time to fix. */}
                <Header />
                <MainTabBar dictionary={this.dictionary}
                            favoriteListLength={this.favoriteListLength}
                            onSelectTab={tab => this.selectedTab = tab}
                            onSelectLang={this.selectLang} />
                {this.selectedTab === ActiveWindow.MAIN
                    && <InfoPanel dictionary={this.dictionary}
                                  onChangeCityList={this.updateCitiesCounter} />}
                {this.selectedTab === ActiveWindow.FAVORITE &&
                    <Favorite dictionary={this.dictionary}
                              onChangeCityList={this.updateCitiesCounter} />}
            </div>
        </>
    }
}