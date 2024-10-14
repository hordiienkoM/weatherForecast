import {Language} from "@/components/langSelector/LangSelector";

export abstract class Dictionary {
    abstract locale: Language

    abstract buttonLabels: {
        main: string,
        favorite: string,
        addToFavorite: string,
        day: string,
        week: string,
        yes: string,
        no: string
    }

    abstract placeholder: {
        city: string
    }

    abstract cloudCover: {
        clear: string,
        fewClouds: string,
        scatteredClouds: string,
        brokenClouds: string,
        overcast: string
    }

    abstract chartTitle: {
        day: string,
        week: string
    }

    abstract measurementUnit: {
        meterSecond: string,
        hPa: string,
        km: string
    }

    abstract measurementUnitLabels: {
        humidity: string,
        dewPoint: string,
        visibility: string,
    }

    abstract windDescriptions: {
        calm: string,
        lightAir: string,
        lightBreeze: string,
        gentleBreeze: string,
        moderateBreeze: string,
        freshBreeze: string,
        strongBreeze: string,
        nearGale: string,
        gale: string,
        strongGale: string,
        storm: string,
        violentStorm: string,
        hurricane: string,
    };

    abstract directions: {
        N: string,
        NNE: string,
        NE: string,
        ENE: string,
        E: string,
        ESE: string,
        SE: string,
        SSE: string,
        S: string,
        SSW: string,
        SW: string,
        WSW: string,
        W: string,
        WNW: string,
        NW: string,
        NNW: string
    }

    abstract error: {
        emptyCity: string,
        limitCity: string
    }

    abstract alert: {
        cityWasSaved: string,
        cityAlreadyExists: string,
        sureDeleteCity: string,
        cityWasDeleted: string
    }

    abstract elementMsg: {
        emptyCityList: string
        feelsLike: string
    }
}