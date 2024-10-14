import {Component, Emit, Prop, TSX, Vue} from "vue-facing-decorator";
import styles from "./infoPanel.module.scss";
import AutoCompleteInput from "@/components/autoCompleteInput/AutoCompleteInput";
import WeatherCard from "@/components/weatherCard/WeatherCard";
import WeatherChart, {WeatherChartSettings} from "@/components/chart/WeatherChart";
import type {City} from "@/models/City";
import cityService from "@/services/CityService";
import type {Dictionary} from "@/internationalization/abstract/Dictionary";
import cityStorage from "@/services/CityStorageService";
import CloseBtn from "@/components/closeBtn/CloseBtn";
import SurePopup from "@/components/common/surePopup/SurePopup";
import {alertMessage} from "@/util/alertUtil";

interface Props {
    dictionary: Dictionary
    defaultCity?: City
}

interface Emits {
    changeCityList: void
}

@Component
export default class InfoPanel extends TSX<Props, Emits>()(Vue) {
    @Prop({required: true}) private dictionary: Dictionary
    @Prop defaultCity: City
    private city: City
    private chartSettings: WeatherChartSettings | undefined
    private chartKey: number = 0
    private showSureDeleteAlert: boolean = false
    private nigthMode: boolean = false

    mounted() {
        if (!this.defaultCity) {
            cityService.fetchDefaultCity()
                .then(city => this.city = city)
        } else {
            this.city = this.defaultCity
        }
    }

    private selectNewCity(name?: string) {
        cityService.fetchCityByName(name)
            .then(city => {
                if (city) {
                    this.city = city
                }
            })
    }


    private addCityToStorage() {
        const savedSuccessfully = cityStorage.addCity(this.city, this.dictionary)
        if (savedSuccessfully) {
            this.changeCityList()
        }
    }

    @Emit('changeCityList')
    private changeCityList() {}

    private deleteCity() {
        this.showSureDeleteAlert = false
        cityStorage.removeCity(this.defaultCity.name)
        this.changeCityList()
    }

    render() {
        return <>
            {this.showSureDeleteAlert
                && <SurePopup dictionary={this.dictionary}
                              popupText={this.dictionary.alert.sureDeleteCity}
                              close={() => this.showSureDeleteAlert = false}
                              onAgree={this.deleteCity}
                              onDisagree={() => this.showSureDeleteAlert = false} />}
            <div class={`${styles.infoPanel} ${this.nigthMode ? styles.infoPanel_nightMode : ""}`}>
                {!this.defaultCity && <nav class={styles.navRow}>
                    <AutoCompleteInput defaultCity={this.city?.name}
                                       dictionary={this.dictionary}
                                       onSelectCity={(city) => {
                                           this.selectNewCity(city)
                                       }}/>
                    <button class={styles.navRow__btn} onClick={this.addCityToStorage}>
                        {this.dictionary?.buttonLabels?.addToFavorite}
                    </button>
                </nav>}
                {this.defaultCity && <nav class={styles.navRow}>
                    <span class={styles.navRow__cityName}>{this.defaultCity.name}</span>
                    <CloseBtn onClick={() => this.showSureDeleteAlert = true} />
                </nav>}
                <div class={styles.weatherInfo}>
                    <WeatherCard dictionary={this.dictionary}
                                 city={this.city}
                                 onNightAtCity={isNight => this.nigthMode = isNight}
                                 onUpdChartSettings={settings => {
                                     this.chartSettings = settings
                                     this.chartKey++
                                 }}/>
                    <WeatherChart key={this.chartKey} settings={this.chartSettings} />
                </div>
            </div>
        </>
    }
}