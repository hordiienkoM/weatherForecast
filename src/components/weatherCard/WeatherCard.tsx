import {Component, Emit, Prop, TSX, Vue, Watch} from "vue-facing-decorator";
import styles from "./weatherCard.module.scss"
import navStyles from "../mainTabBar/mainTabBar.module.scss"
import type {Dictionary} from "@/internationalization/abstract/Dictionary";
import type {City} from "@/models/City";
import weatherService from "@/services/WeatherService";
import type {WeekDayViewDto} from "@/models/WeekDayViewDto";
import dayParamCalculator from "@/services/DayParamCalculatorService";
import type {DayWeather} from "@/models/DayWeather";
import type {WeatherChartSettings} from "@/components/chart/WeatherChart";
import type {CurrentWeather} from "@/models/CurrentWeather";
import type {CurrentWeatherDto} from "@/models/CurrentWeatherDto";
import DayCard from "@/components/dayCard/DayCard";

enum WeatherType {
    DAY = 'DAY',
    WEAK = 'WEEK'
}

interface Props {
    dictionary: Dictionary
    city: City
}

interface Emits {
    updChartSettings: WeatherChartSettings
    nightAnCity: boolean
}

@Component
export default class WeatherCard extends TSX<Props, Emits>()(Vue) {
    @Prop({required: true}) private dictionary: Dictionary
    @Prop({required: true}) private city: City
    private weatherType: WeatherType = WeatherType.DAY
    private weekWeather: DayWeather[] = []
    private weekWeatherDto: WeekDayViewDto[] = []
    private currentWeather: CurrentWeather
    private currentWeatherDto: CurrentWeatherDto
    private intervalId: number | undefined
    unmounted() {
        clearInterval(this.intervalId)
    }

    private dayChartLabels: string[] = [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ]

    @Watch("dictionary", {deep: true})
    private handleDictionaryChange() {
        this.handleWeekChanges()
        this.handleChangeCurrentWeather()
    }

    @Watch("weatherType")
    private handleWeatherType() {
        this.handleWeekChanges()
        this.handleChangeCurrentWeather()
    }


    @Watch("weekWeather", {deep: true})
    private handleWeekChanges() {
        if (this.weekWeather?.length > 0) {
            this.weekWeatherDto = this.weekWeather
                .map(weather => dayParamCalculator.createWeekDayDto(weather, this.dictionary))
            this.updCurrentWeatherTemperatureSet()
            this.updWeatherChartSettings()
        }
    }

    @Watch("currentWeather")
    private handleChangeCurrentWeather() {
        if (!this.currentWeather) {
            this.currentWeatherDto = undefined
            return
        }
        this.currentWeatherDto = dayParamCalculator.createWeekDayDto(this.currentWeather, this.dictionary)
        this.updCurrentWeatherTemperatureSet()
        this.currentWeatherDto.temperature = this.currentWeather.hourlyWeather[0].temperature2m
        this.currentWeatherDto.apparentTemperature = this.currentWeather.hourlyWeather[0].apparentTemperature
        this.updWeatherChartSettings()
        this.checkNightAtCity()
    }

    @Watch("city", {deep: true})
    private handleChangeCity() {
        if (this.city) {
            this.updCityWeather()
        }
    }

    mounted() {
        this.updCityWeather()
        setInterval(() => {
            this.updCityWeather()
        }, 60 * 1000 * 15) // weather updates every 15 minutes
    }

    private computeBtnStyle(type: WeatherType) {
        return this.weatherType === type ? navStyles.mainTabBar__btn_selected : navStyles.mainTabBar__btn
    }

    private updCurrentWeatherTemperatureSet() {
        if (!this.currentWeatherDto || !this.weekWeatherDto?.length > 0) {
            return
        }
        this.weekWeatherDto.forEach(dayWeather => {
            if (dayWeather.date === this.currentWeatherDto.date) {
                this.currentWeatherDto.hourlyTemperature = dayWeather.hourlyTemperature
                return
            }
        })
    }

    private updCityWeather() {
        if (!this.city) {
            return
        }
        weatherService.fetchWeekWeather(this.city.lat, this.city.lon)
            .then(weekWeather => {
                if (weekWeather && weekWeather.length > 0) {
                    this.weekWeather = weekWeather
                }
            })
        weatherService.fetchCurrentWeather(this.city.lat, this.city.lon)
            .then(currentWeather => {
                if (currentWeather?.date) {
                    this.currentWeather = currentWeather
                }
            })
    }


    private updWeatherChartSettings(): void {
        let chartSettings: WeatherChartSettings
        if (this.weatherType === WeatherType.DAY && this.currentWeather) {
            chartSettings = this.computeDayChartSettings()
        } else {
            chartSettings = this.computeWeekChartSettings()
        }
        if (chartSettings?.data?.length > 1) {
            this.emitChartSettings(chartSettings)
        } else {
            console.log("incorrect char settings", chartSettings)
        }
    }

    @Emit('updChartSettings')
    private emitChartSettings(settings: WeatherChartSettings): WeatherChartSettings {
        return settings
    }

    private computeDayChartSettings(): WeatherChartSettings {
        return {
            title: this.dictionary.chartTitle.day,
            labels: this.dayChartLabels,
            data: this.currentWeatherDto.hourlyTemperature
        }
    }

    private computeWeekChartSettings(): WeatherChartSettings {
        const labels: string[] = []
        const data: number[] = []
        this.weekWeatherDto.forEach(dto => {
            labels.push(dto.shortDate)
            data.push(dto.avgTemperature)
        })
        return {
            title: this.dictionary.chartTitle.week,
            labels: labels,
            data: data
        }
    }

    @Emit('nightAtCity')
    private checkNightAtCity() {
        let cityHours = this.currentWeather.hourlyWeather[0].time.split(":")[0];
        const currentTime = Number(cityHours);
        return  currentTime >= 22 || currentTime < 4;
    }

    private clearInterval() {
        clearInterval(this.intervalId)
    }

    render() {
        return <>
            <div class={styles.weatherCard}>
                <nav class={`${navStyles.mainTabBar} ${styles.weatherCard__navContainer}`}>
                    <button class={this.computeBtnStyle(WeatherType.DAY)}
                            onClick={() => this.weatherType = WeatherType.DAY}>
                        {this.dictionary?.buttonLabels?.day}
                    </button>
                    <button class={this.computeBtnStyle(WeatherType.WEAK)}
                            onClick={() => this.weatherType = WeatherType.WEAK}>
                        {this.dictionary?.buttonLabels?.week}
                    </button>
                </nav>
                {this.weatherType === WeatherType.WEAK && <div class={styles.weekContainer}>
                    {this.weekWeatherDto?.map((weekDayDto) => {
                        return <div class={styles.weekContainer__shortView}>
                            <div>{weekDayDto.date}</div>
                            <img src={weekDayDto.skyStateIco} alt={"cloudState"}/>
                            <div>{`${weekDayDto.temperatureRange.max.toFixed(0)}/${weekDayDto.temperatureRange.min.toFixed(0)}°C`}</div>
                            <div>{weekDayDto.cloudCover}</div>
                        </div>
                    })}
                </div>}
                {this.weatherType === WeatherType.DAY && this.currentWeatherDto && <>
                    <DayCard day={this.currentWeatherDto}
                             city={this.city}
                             dictionary={this.dictionary}
                             time={this.currentWeather.hourlyWeather[0].time} />
                </>}
            </div>
        </>
    }
}