import {Component, Emit, Prop, TSX, Vue} from "vue-facing-decorator";
import styles from "./favorite.module.scss"
import type {City} from "@/models/City";
import cityStorage from "@/services/CityStorageService";
import type {Dictionary} from "@/internationalization/abstract/Dictionary";
import InfoPanel from "@/components/infoPanel/InfoPanel";

interface Props {
    dictionary: Dictionary
}

interface Emits {
    changeCityList: void
}

@Component
export default class Favorite extends TSX<Props, Emits>()(Vue) {
    @Prop({required: true}) private dictionary: Dictionary
    private cities: City[]

    mounted() {
        this.updCities()
    }

    private updCities() {
        this.cities = cityStorage.getCities()
    }

    private handleChangeCityList() {
        this.updCities()
        this.changeCityList()
    }

    @Emit("changeCityList")
    private changeCityList() {}

    render() {
        return <>
            <div class={styles.favoriteList}>
                {!this.cities || !this.cities.length > 0 && <div class={styles.favoriteList__emptyMsg}>
                    {this.dictionary.elementMsg.emptyCityList}
                </div>}
                {this.cities?.length > 0 && this.cities.map(city => {
                    return <InfoPanel dictionary={this.dictionary}
                                      defaultCity={city}
                                      onChangeCityList={this.handleChangeCityList} />
                })}
            </div>
        </>
    }
}