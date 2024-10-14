import type {City} from "@/models/City";
import {alertError, alertMessage} from "@/util/alertUtil";
import type {Dictionary} from "@/internationalization/abstract/Dictionary";

class CityStorageService {
    private storageKey: string = 'cities';
    public getCities(): City[] {
        const citiesJson = localStorage.getItem(this.storageKey)
        return citiesJson ? JSON.parse(citiesJson) : []
    }

    private saveCities(cities: City[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(cities))
    }

    public addCity(city: City, dictionary: Dictionary): boolean {
        const cities = this.getCities()
        if (this.checkCityAlreadySaved(city, cities)) {
            alertMessage(dictionary.alert.cityAlreadyExists)
            return false
        }
        if (cities.length === 5) {
            alertError(dictionary.error.limitCity)
            return false
        }
        cities.push(city)
        this.saveCities(cities)
        alertMessage(dictionary.alert.cityWasSaved)
        return true
    }

    private checkCityAlreadySaved(newCity: City, cities: City[]) {
        for (const city of cities) {
            if (city.name === newCity.name) {
                return true
            }
        }
        return false
    }

    public removeCity(cityName: string): void {
        let cities = this.getCities()
        cities = cities.filter(city => city.name !== cityName)
        this.saveCities(cities)
    }
}

const cityStorage = new CityStorageService()
export default cityStorage