import {Component, Prop, TSX, Vue, Watch} from "vue-facing-decorator";
import styles from "./weatherChart.module.scss"
import WeatherChartBasedOnVue from "@/components/chart/WeatherChartBasedOnVue.vue";

export declare type WeatherChartSettings = {
    title: string
    labels: string[]
    data: number[]
}

interface Props {
    settings: WeatherChartSettings
}

@Component
export default class WeatherChart extends TSX<Props>()(Vue) {
    @Prop private settings: WeatherChartSettings | undefined
    private chartData: Object
    private chartMax: number = 0
    private chartMin: number = 0

    private options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    boxWidth: 6,
                    boxHeight: 6
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: this.chartMax,
                min: this.chartMin
            },
        },
    }

    mounted() {
        this.settingsUpd()
    }

    @Watch("settings", {deep: true})
    private settingsUpd() {
        if (!this.settings) {
            this.chartData = undefined
            return
        }
        console.log("settingsUpd", this.settings)
        this.updateMinMax()
        this.chartData = {
            labels: this.settings.labels,
            datasets: [
                {
                    label: this.settings.title,
                    backgroundColor: '#f87979',
                    data: this.settings.data.map(temperature => temperature.toFixed(1)),
                    tension: 0.3
                }
            ]
        }
    }

    private updateMinMax() {
        this.options.scales.y.min = Math.round(Math.min(...this.settings?.data || [0]) - 2)
        this.options.scales.y.max = Math.round(Math.max(...this.settings?.data || [0]) + 2)
    }

    render() {
        return <>
            <div class={styles.weatherChart}>
                {this.settings && this.chartData && <WeatherChartBasedOnVue chartData={this.chartData}
                                                          options={this.options}/>}
            </div>
        </>
    }
}
