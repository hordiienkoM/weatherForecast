import {alertError} from "@/util/alertUtil";
import type {City} from "@/models/City";

class CityService {

    public fetchDefaultCity(): Promise<City> {
        return fetch("https://ipinfo.io/json")
            // @ts-ignore
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    alertError("Error while fetching the city by default IP")
                }
            }).then(parsedResponse => {
                console.log("parsedResponse.loc", parsedResponse.loc)
                const [lat, lon] = parsedResponse.loc.split(",")
                return {
                    name: parsedResponse.city,
                    lat: lat,
                    lon: lon
                }
            });
    }

    public fetchCityByName(name: string): Promise<City | void> {
        return fetch(`https://nominatim.openstreetmap.org/search?q=${name}&format=json&limit=1&accept-language=en`)
            // @ts-ignore
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    alertError(`Error while fetching the city by name: ${name}`)
                }
            })
            // @ts-ignore
            .then(parsedResponse => {
                if (parsedResponse.length < 1) {
                    alertError(`City not found`)
                } else {
                    return {
                        name: name,
                        lat: parsedResponse[0].lat,
                        lon: parsedResponse[0].lon
                    }
                }
            })
    }

}

const cityService = new CityService()
export default cityService