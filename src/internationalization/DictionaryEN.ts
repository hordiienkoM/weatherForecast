import {Dictionary} from "@/internationalization/abstract/Dictionary";
import {Language} from "@/components/langSelector/LangSelector";

export class DictionaryEN extends Dictionary {
    public locale = Language.EN

    public buttonLabels = {
        main: "Main",
        favorite: "Favorite",
        addToFavorite: "Add to fav.",
        day: "Day",
        week: "Week",
        yes: "Yes",
        no: "No"
    }

    public placeholder: {
        city: "City"
    }

    public chartTitle = {
        day: "Temperature throughout the day",
        week: "Temperature throughout the week"
    }

    public cloudCover = {
        clear: "Clear sky",                  // 0-10%
        fewClouds: "Few clouds",             // 11-25%
        scatteredClouds: "Scattered clouds", // 26-50%
        brokenClouds: "Broken clouds",       // 51-84%
        overcast: "Overcast clouds"          // 85-100%
    }

    public directions = {
        N: "N",
        NNE: "NNE",
        NE: "NE",
        ENE: "ENE",
        E: "E",
        ESE: "ESE",
        SE: "SE",
        SSE: "SSE",
        S: "S",
        SSW: "SSW",
        SW: "SW",
        WSW: "WSW",
        W: "W",
        WNW: "WNW",
        NW: "NW",
        NNW: "NNW"
    }

    public windDescriptions = {
        calm: "Calm",                     // 0-1 km/h
        lightAir: "Light Air",            // 1-5 km/h
        lightBreeze: "Light Breeze",      // 6-11 km/h
        gentleBreeze: "Gentle Breeze",    // 12-19 km/h
        moderateBreeze: "Moderate Breeze",// 20-28 km/h
        freshBreeze: "Fresh Breeze",      // 29-38 km/h
        strongBreeze: "Strong Breeze",    // 39-49 km/h
        nearGale: "Near Gale",            // 50-61 km/h
        gale: "Gale",                     // 62-74 km/h
        strongGale: "Strong Gale",        // 75-88 km/h
        storm: "Storm",                   // 89-102 km/h
        violentStorm: "Violent Storm",    // 103-117 km/h
        hurricane: "Hurricane"            // 118 km/h
    }

    public error = {
        emptyCity: "Enter the name of the city",
        limitCity: "You can only save up to 5 favorite cities. Please delete one of the selected cities before adding a new one"
    }

    public alert = {
        cityWasSaved: "The city has been added to favorites",
        cityAlreadyExists: "This city is already in your favorites",
        sureDeleteCity: "Are you sure you want to delete this city?",
        cityWasDeleted: "The city has been successfully deleted"
    }

    public elementMsg = {
        emptyCityList: "You haven't selected any cities yet",
        feelsLike: "Feels like"
    }

    public measurementUnit = {
        meterSecond: "m/s",
        hPa: "hPa",
        km: "km"
    }

    public measurementUnitLabels = {
        humidity: "Humidity",
        dewPoint: "Dew point",
        visibility: "Visibility",
    }

}

const dictionaryEN = new DictionaryEN()
export default dictionaryEN