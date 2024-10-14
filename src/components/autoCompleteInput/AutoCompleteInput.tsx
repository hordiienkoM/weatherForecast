import {Component, Emit, Prop, TSX, Vue, Watch} from "vue-facing-decorator";
import styles from "./autoCompleteInput.module.scss"
import {alertError} from "@/util/alertUtil";
import type {Dictionary} from "@/internationalization/abstract/Dictionary";
import {citiesEn} from "@/internationalization/cities/citiesEN";
import {citiesUK} from "@/internationalization/cities/citiesUK";

interface Props {
    defaultCity: string
    dictionary: Dictionary
}

interface Emits {
    selectCity: string
}

@Component
export default class AutoCompleteInput extends TSX<Props, Emits>()(Vue) {
    @Prop({required: true}) private dictionary: Dictionary
    @Prop private defaultCity: string
    private selectedCity: string | undefined
    private cityList = [...citiesEn, ...citiesUK]
    private cityOptions = []
    private showCityOptions = false
    private mountedIsFinished = false

    @Watch("selectedCity")
    private updCityOptions() {
        this.cityOptions = []
        if (!this.selectedCity || !this.mountedIsFinished) {
            this.mountedIsFinished = true
            return;
        }
        const options: string[] = []
        const selectedCity: string = this.selectedCity?.toLowerCase()
        for (const city of this.cityList) {
            if (city.toLowerCase().startsWith(selectedCity)) {
                options.push(city)
                if (options.length === 3) {
                    this.cityOptions = options
                    return
                }
            }
        }
        if (options.length > 0) {
            this.cityOptions = options
            this.showCityOptions = true
        } else {
            setTimeout(() => this.showCityOptions = false, 10)
        }
    }

    @Watch("defaultCity")
    private initSelectedCity() {
        if (this.defaultCity) {
            this.selectedCity = this.defaultCity
        }
    }

    mounted() {
        this.selectedCity = this.defaultCity
    }

    private handleSelectCity() {
        if (!this.selectedCity || this.selectedCity.length === 0) {
            alertError(this.dictionary.error.emptyCity)
            return
        }
        this.selectCity()
    }

    @Emit("selectCity")
    private selectCity() {
        this.cityOptions = []
        return this.selectedCity
    }

    render() {
        return <>
            <span class={styles.autoInput}>
                <input placeholder={"City"} v-model={this.selectedCity} />
                <button onClick={this.handleSelectCity}>&#128269;</button>

                {this.showCityOptions && this.cityOptions.length > 0 && <div class={styles.optionContainer}>
                    {this.cityOptions.map(city => {
                        return <div class={styles.option}
                                    onClick={() => {
                                        this.selectedCity = city
                                        setTimeout(() => this.showCityOptions = false, 50)
                                    }}>
                            {city}
                        </div>
                    })}
                </div>}
            </span>
        </>
    }
}