import type {DayWeather} from "@/models/DayWeather";
import type {HourWeather} from "@/models/HourWeather";
import type {CurrentWeather} from "@/models/CurrentWeather";

class WeatherService {
    // 49.9808&longitude=36.2527 - Kharkiv
    public fetchWeekWeather(latitude: string, longitude: string): Promise<DayWeather[] | void> {
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m&timezone=auto`)
            .then(response => response.json())
            // @ts-ignore
            .then(parsedResponse => {
                return this.parseWeekWeather(parsedResponse)
            })
    }

    private parseWeekWeather(parsedResponse): DayWeather[] {
        const timeArr = parsedResponse?.hourly?.time
        const temperature2mArr = parsedResponse?.hourly?.temperature_2m
        const relativeHumidity2mArr = parsedResponse?.hourly?.relative_humidity_2m
        const dewPoint2mArr = parsedResponse?.hourly?.dew_point_2m
        const weatherCodeArr = parsedResponse?.hourly?.weather_code
        const pressureMslArr = parsedResponse?.hourly?.pressure_msl
        const cloudCoverArr = parsedResponse?.hourly?.cloud_cover
        const visibilityArr = parsedResponse?.hourly?.visibility
        const windSpeed10mArr = parsedResponse?.hourly?.wind_speed_10m
        const windDirection10mArr = parsedResponse?.hourly?.wind_direction_10m

        if (timeArr?.length > 0) {
            let prevDay = timeArr[0].split('T')[0]
            let hourlyWeatherArr: HourWeather[] = []
            const weekWeather: DayWeather[] = []
            for (let i = 0; i < 120; i++) {
                const [day, time] = timeArr[i].split('T')
                if (i !== 0 && i % 24 === 0) {
                    weekWeather.push({
                        date: prevDay,
                        hourlyWeather: hourlyWeatherArr,
                    })
                    hourlyWeatherArr = []
                }
                prevDay = day
                hourlyWeatherArr.push({
                    time: time,
                    temperature2m: temperature2mArr[i],
                    relativeHumidity2m: relativeHumidity2mArr[i],
                    dewPoint2m: dewPoint2mArr[i],
                    weatherCode: weatherCodeArr[i],
                    pressureMsl: pressureMslArr[i],
                    cloudCover: cloudCoverArr[i],
                    visibility: visibilityArr[i],
                    windSpeed10m: windSpeed10mArr[i],
                    windDirection10m: windDirection10mArr[i]
                })
            }
            weekWeather.push({
                date: prevDay,
                hourlyWeather: hourlyWeatherArr,
            })
            return weekWeather
        }
    }

    public fetchCurrentWeather(latitude: string, longitude: string): Promise<CurrentWeather> {
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,dew_point_2m,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m&timezone=auto`)
            .then(response => response.json())
            // @ts-ignore
            .then(parsedResponse => {
                const [date, time] = parsedResponse?.current?.time.split('T')
                return {
                    date: date,
                    hourlyWeather: [{
                        time: time,
                        temperature2m: parsedResponse?.current?.temperature_2m,
                        relativeHumidity2m: parsedResponse?.current?.relative_humidity_2m,
                        dewPoint2m: parsedResponse?.current?.dew_point_2m,
                        weatherCode: parsedResponse?.current?.weather_code,
                        pressureMsl: parsedResponse?.current?.pressure_msl,
                        cloudCover: parsedResponse?.current?.cloud_cover,
                        visibility: parsedResponse?.current?.visibility,
                        windSpeed10m: parsedResponse?.current?.wind_speed_10m,
                        windDirection10m: parsedResponse?.current?.wind_direction_10m,
                        apparentTemperature: parsedResponse?.current?.apparent_temperature
                    }]
                }
            })
    }
}

const weatherService = new WeatherService()
export default weatherService