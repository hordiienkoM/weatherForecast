import type {HourWeather} from "@/models/HourWeather";

export declare type DayWeather = {
    date: string,
    hourlyWeather: HourWeather[]
}