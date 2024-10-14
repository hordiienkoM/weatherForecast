import type {TemperatureRange} from "@/models/TemperatureRange";

export declare type WeekDayViewDto = {
    date: string // example Thu, Oct 10
    shortDate: string // MM.DD
    cloudCover: string
    windDescription: string
    temperatureRange: TemperatureRange
    windowDirection: string
    windowSpeed: string
    pressureMsl: string
    humidity: string
    devPoint: string
    skyStateIco: string
    visibility: string
    avgTemperature: number
    hourlyTemperature?: number[]
}