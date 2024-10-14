import type {WeekDayViewDto} from "@/models/WeekDayViewDto";

export declare type CurrentWeatherDto = WeekDayViewDto & {
    temperature?: string,
    apparentTemperature?: string
}