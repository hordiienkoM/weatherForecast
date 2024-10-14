import {Component, Prop, TSX, Vue} from "vue-facing-decorator";
import styles from "./dayCard.module.scss"
import type {WeekDayViewDto} from "@/models/WeekDayViewDto";
import type {CurrentWeatherDto} from "@/models/CurrentWeatherDto";
import type {City} from "@/models/City";
import type {Dictionary} from "@/internationalization/abstract/Dictionary";

interface Props {
    day: WeekDayViewDto | CurrentWeatherDto
    time?: string
    city: City,
    dictionary: Dictionary
}

@Component
export default class DayCard extends TSX<Props>()(Vue) {
    @Prop({required: true}) private day: WeekDayViewDto | CurrentWeatherDto
    @Prop({required: true}) private city: City
    @Prop({required: true}) private dictionary: Dictionary
    @Prop private time: string

    render() {
        return <>
            <div class={styles.dayCard}>
                <div class={styles.dayCard__dateTime}>
                    {`${this.day.date.replace(".", "")}, ${this.time || ''}`}
                </div>
                <div class={styles.dayCard__cityName}>
                    {this.city.name}
                </div>
                <div class={styles.dayCard__cloudTemperature}>
                    <img src={this.day.skyStateIco} alt={'cloudIco'} />
                    {`${this.day?.temperature}°C`}
                </div>
                <div class={styles.dayCard__shortDescription}>
                    {`${this.dictionary.elementMsg.feelsLike} ${this.day.apparentTemperature}, ${this.day.cloudCover}. ${this.day.windDescription}`}
                </div>
                <div class={styles.dayCard__stats}>
                    <div class={styles.dayCard__statsRow}>
                        <span>{`${this.day.windowSpeed}${this.dictionary.measurementUnit.meterSecond} ${this.day.windowDirection}`}</span>
                        <span>{`${this.day.pressureMsl}${this.dictionary.measurementUnit.hPa}`}</span>
                    </div>
                    <div class={styles.dayCard__statsRow}>
                        <span>{`${this.dictionary.measurementUnitLabels.humidity}: ${this.day.humidity}%`}</span>
                        <span>{`${this.dictionary.measurementUnitLabels.dewPoint}: ${this.day.devPoint}°C`}</span>
                    </div>
                    <div class={styles.dayCard__statsRow}>
                        <span>{`${this.dictionary.measurementUnitLabels.visibility}: ${this.day.visibility}${this.dictionary.measurementUnit.km}`}</span>
                    </div>
                </div>
            </div>
        </>
    }
}