// time	"iso8601"
// temperature_2m	"°C"
// relative_humidity_2m	"%"
// dew_point_2m	"°C"
// apparent_temperature	"°C"
// weather_code	"wmo code"
// pressure_msl	"hPa"
// cloud_cover	"%"
// visibility	"m"
// wind_speed_10m	"km/h"
// wind_direction_10m	"°"

export declare type HourWeather = {
    time: string,
    temperature2m: number,
    apparentTemperature?: string
    relativeHumidity2m: number,
    dewPoint2m: number,
    weatherCode: string,
    pressureMsl: number,
    cloudCover: number,
    visibility: number,
    windSpeed10m: number,
    windDirection10m: number
}