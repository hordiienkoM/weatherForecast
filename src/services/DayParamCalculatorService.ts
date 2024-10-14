import type {DayWeather} from "@/models/DayWeather";
import type {TemperatureRange} from "@/models/TemperatureRange";
import type {Dictionary} from "@/internationalization/abstract/Dictionary";
import type {WeekDayViewDto} from "@/models/WeekDayViewDto";
import {Language} from "@/components/langSelector/LangSelector";
import cloudClearIco from "@/assets/cloudIcon/clearSky.webp"
import fewCloudsIco from "@/assets/cloudIcon/fewClouds.webp"
import scatteredCloudsIco from "@/assets/cloudIcon/scatteredClouds.webp"
import brokenCloudsIco from "@/assets/cloudIcon/brokenClouds.webp"
import overcastCloudsIco from "@/assets/cloudIcon/overcastClouds.webp"

class DayParamCalculatorService {

    public createWeekDayDto(dayWeather: DayWeather, dictionary: Dictionary): WeekDayViewDto {
        const avgWindSpeed = this.computeWindSpeedAvg(dayWeather)
        const avgWindDirection = this.computeWindDirectionAvg(dayWeather)
        const cloudCover = this.computeDominateCloudState(dayWeather, dictionary)
        const visibility = this.computeAvgVisibility(dayWeather)
        return {
            date: this.dateToViewFormat(dayWeather.date, dictionary.locale), // example Thu, Oct 10
            shortDate: this.formatDateToShort(dayWeather), // MM.DD
            cloudCover: cloudCover,
            windDescription: this.computeWindDescription(avgWindSpeed, dictionary),
            temperatureRange: this.computeTemperatureRange(dayWeather),
            avgTemperature: this.computeAvgTemperature(dayWeather),
            windowDirection: this.convertWindDirection(avgWindDirection, dictionary),
            windowSpeed: this.convertWindSpeedToMSec(avgWindSpeed),
            pressureMsl: this.computeAvgPressure(dayWeather).toFixed(1),
            visibility: this.convertVisibilityToKm(visibility),
            humidity: this.computeAvgHumidity(dayWeather).toFixed(1),
            devPoint: this.computeAvgDewPoint(dayWeather).toFixed(1),
            skyStateIco: this.findCloudStateIco(cloudCover, dictionary),
            hourlyTemperature: this.computeHourlyTemperatureArr(dayWeather)
        }
    }

    private computeTemperatureRange(dayWeather: DayWeather): TemperatureRange {
        let max = dayWeather.hourlyWeather[0].temperature2m
        let min = dayWeather.hourlyWeather[0].temperature2m
        dayWeather.hourlyWeather.forEach(weather => {
            const temperature = weather.temperature2m
            if (temperature > max) {
                max = temperature
            }
            if (temperature < min) {
                min = temperature
            }
        })
        return {
            min: min,
            max: max
        }
    }

    private computeCloudCoverDescription(totalCloudCover, dictionary: Dictionary): string {
        if (totalCloudCover >= 0 && totalCloudCover <= 10) {
            return dictionary.cloudCover.clear
        } else if (totalCloudCover > 10 && totalCloudCover <= 25) {
            return dictionary.cloudCover.fewClouds
        } else if (totalCloudCover > 25 && totalCloudCover <= 50) {
            return dictionary.cloudCover.scatteredClouds
        } else if (totalCloudCover > 50 && totalCloudCover <= 84) {
            return dictionary.cloudCover.brokenClouds
        } else if (totalCloudCover > 84 && totalCloudCover <= 100) {
            return dictionary.cloudCover.overcast
        } else {
            console.error("Invalid cloud cover percentage");
            return ''
        }
    }

    private computeWindDescription(windSpeed: number /* km/h */, dictionary: Dictionary): string {
        if (windSpeed <= 1) {
            return dictionary.windDescriptions.calm;
        } else if (windSpeed <= 5) {
            return dictionary.windDescriptions.lightAir;
        } else if (windSpeed <= 11) {
            return dictionary.windDescriptions.lightBreeze;
        } else if (windSpeed <= 19) {
            return dictionary.windDescriptions.gentleBreeze;
        } else if (windSpeed <= 28) {
            return dictionary.windDescriptions.moderateBreeze;
        } else if (windSpeed <= 38) {
            return dictionary.windDescriptions.freshBreeze;
        } else if (windSpeed <= 49) {
            return dictionary.windDescriptions.strongBreeze;
        } else if (windSpeed <= 61) {
            return dictionary.windDescriptions.nearGale;
        } else if (windSpeed <= 74) {
            return dictionary.windDescriptions.gale;
        } else if (windSpeed <= 88) {
            return dictionary.windDescriptions.strongGale;
        } else if (windSpeed <= 102) {
            return dictionary.windDescriptions.storm;
        } else if (windSpeed <= 117) {
            return dictionary.windDescriptions.violentStorm;
        } else {
            return dictionary.windDescriptions.hurricane;
        }
    }

    private convertWindSpeedToMSec(speedKMSec: number): string {
        const conversionFactor = 1000 / 3600; // 1 km/h equals 1000 meters per 3600 seconds
        return (speedKMSec * conversionFactor).toFixed(1);
    }

    private convertVisibilityToKm(visibilityM: number): string {
        return (visibilityM / 1000).toFixed(1)
    }

    private convertWindDirection(degrees: number, dictionary: Dictionary): string {
        const directionKeys = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        // There are 360 degrees and 16 directions, so each direction covers 22.5 degrees
        const index = Math.round(degrees / 22.5) % 16;
        return dictionary.directions[directionKeys[index]];
    }

    private computeDominateCloudState(dayWeather: DayWeather, dictionary: Dictionary) {
        const cloudStateCounters: Map<string, number> = new Map()
        dayWeather.hourlyWeather.forEach(weather => {
            const weatherState = this.computeCloudCoverDescription(weather.cloudCover, dictionary)
            const currentCounter = (cloudStateCounters.get(weatherState) || 0) + 1
            cloudStateCounters.set(weatherState, currentCounter)
        })
        const stateKeys = Array.from(cloudStateCounters.keys())
        let dominateState = stateKeys[0]
        let dominateStateCounter = cloudStateCounters.get(dominateState)
        stateKeys.forEach(state => {
            const stateCounter = cloudStateCounters.get(state)
            if (stateCounter > dominateStateCounter) {
                dominateState = state
                dominateStateCounter = stateCounter
            }
        })
        return dominateState
    }

    private computeWindSpeedAvg(dayWeather: DayWeather): number {
        const totalWindSpeed = dayWeather.hourlyWeather
            .map(weather => weather.windSpeed10m)
            .reduce((acc, windSpeed) => acc + windSpeed, 0);

        return totalWindSpeed / dayWeather.hourlyWeather.length;
    }

    private capitalizeFirstLetter(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    private dateToViewFormat(date: string, lang: Language): string {
        const locale = lang === Language.UK ? 'uk-UA' : 'en-US';
        const parsedDate = new Date(date);

        let formattedDate = parsedDate.toLocaleDateString(locale, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        formattedDate = formattedDate
            .split(' ')
            .map(word => this.capitalizeFirstLetter(word))
            .join(' ');

        return formattedDate;
    }

    private computeWindDirectionAvg(dayWeather: DayWeather): number {
        const total = dayWeather.hourlyWeather.reduce((acc, weather) => {
            const angle = weather.windDirection10m * Math.PI / 180;
            acc.x += Math.cos(angle);
            acc.y += Math.sin(angle);
            return acc;
        }, {x: 0, y: 0});

        const averageAngle = Math.atan2(total.y, total.x) * 180 / Math.PI; // Конвертация обратно в градусы
        return (averageAngle + 360) % 360;
    }

    private computeAvgPressure(dayWeather: DayWeather): number {
        const totalPressure = dayWeather.hourlyWeather
            .map(weather => weather.pressureMsl)
            .reduce((acc, pressure) => acc + pressure, 0)

        return totalPressure / dayWeather.hourlyWeather.length;
    }

    private computeAvgHumidity(dayWeather: DayWeather): number {
        const totalHumidity = dayWeather.hourlyWeather
            .map(weather => weather.relativeHumidity2m)
            .reduce((acc, humidity) => acc + humidity, 0);

        return totalHumidity / dayWeather.hourlyWeather.length;
    }

    private computeAvgDewPoint(dayWeather: DayWeather): number {
        const totalDewPoint = dayWeather.hourlyWeather
            .map(weather => weather.dewPoint2m)
            .reduce((acc, dewPoint) => acc + dewPoint, 0);

        return totalDewPoint / dayWeather.hourlyWeather.length;
    }

    private findCloudStateIco(cloudCover: string, dictionary: Dictionary) {
        if (cloudCover === dictionary.cloudCover.clear) {
            return cloudClearIco
        }
        if (cloudCover === dictionary.cloudCover.fewClouds) {
            return fewCloudsIco
        }
        if (cloudCover === dictionary.cloudCover.scatteredClouds) {
            return scatteredCloudsIco
        }
        if (cloudCover === dictionary.cloudCover.brokenClouds) {
            return brokenCloudsIco
        }
        if (cloudCover === dictionary.cloudCover.overcast) {
            return overcastCloudsIco
        }
        throw new Error("Cloud cover key not found")
    }

    private computeAvgVisibility(dayWeather: DayWeather): number {
        const totalVisibility = dayWeather.hourlyWeather
            .map(weather => weather.visibility)
            .reduce((acc, visibility) => acc + visibility, 0);

        return totalVisibility / dayWeather.hourlyWeather.length;
    }

    private computeAvgTemperature(dayWeather: DayWeather): number {
        const totalVisibility = dayWeather.hourlyWeather
            .map(weather => weather.temperature2m)
            .reduce((acc, visibility) => acc + visibility, 0);

        return totalVisibility / dayWeather.hourlyWeather.length;
    }

    // MM.DD
    private formatDateToShort(dayWeather: DayWeather): string {
        const dateParams = dayWeather.date.split('-')
        return `${dateParams[1]}.${dateParams[2]}`
    }

    private computeHourlyTemperatureArr(dayWeather: DayWeather): number[] | undefined {
        if (dayWeather.hourlyWeather.length === 1) {
            return undefined // request by currentTemperature. Not a day
        }
        return dayWeather.hourlyWeather.map(weather => weather.temperature2m)
    }

}

const dayParamCalculator = new DayParamCalculatorService()
export default dayParamCalculator