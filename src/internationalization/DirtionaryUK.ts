import {Dictionary} from "@/internationalization/abstract/Dictionary";
import {Language} from "@/components/langSelector/LangSelector";

export class DictionaryUK extends Dictionary {
    public locale = Language.UK

    public buttonLabels = {
        main: "Головна",
        favorite: "Обране",
        addToFavorite: "Додати в обр.",
        day: "День",
        week: "Тиждень",
        yes: "Так",
        no: "Ні"
    }

    public placeholder: {
        city: "Місто"
    }

    public chartTitle = {
        day: "Температура протягом доби",
        week: "Температура протягом тижня"
    }

    public measurementUnit = {
        meterSecond: "м/с",
        hPa: "гПа",
        km: "км"
    }

    public measurementUnitLabels = {
        humidity: "Вологість",
        dewPoint: "Точка роси",
        visibility: "Видимість",
    }

    public cloudCover = {
        clear: "Ясне небо",                     // 0-10%
        fewClouds: "Мало хмар",                 // 11-25%
        scatteredClouds: "Розсіяні хмари",      // 26-50%
        brokenClouds: "Рвані хмари",            // 51-84%
        overcast: "Похмуро"                     // 85-100%
    }

    public windDescriptions = {
        calm: "Штиль",                     // 0-1 km/h
        lightAir: "Легкий вітерець",       // 1-5 km/h
        lightBreeze: "Слабкий бриз",       // 6-11 km/h
        gentleBreeze: "Легкий бриз",       // 12-19 km/h
        moderateBreeze: "Помірний бриз",   // 20-28 km/h
        freshBreeze: "Свіжий бриз",        // 29-38 km/h
        strongBreeze: "Сильний бриз",      // 39-49 km/h
        nearGale: "Майже шторм",           // 50-61 km/h
        gale: "Шторм",                     // 62-74 km/h
        strongGale: "Сильний шторм",       // 75-88 km/h
        storm: "Штормовий вітер",          // 89-102 km/h
        violentStorm: "Жорсткий шторм",    // 103-117 km/h
        hurricane: "Ураган"                // 118 km/h
    };

    public directions = {
        N: "Пн",
        NNE: "ПнПнСх",
        NE: "ПнСх",
        ENE: "СхПнСх",
        E: "Сх",
        ESE: "СхПдСх",
        SE: "ПдСх",
        SSE: "ПдПдСх",
        S: "Пд",
        SSW: "ПдПдЗх",
        SW: "ПдЗх",
        WSW: "ЗхПдЗх",
        W: "Зх",
        WNW: "ЗхПнЗх",
        NW: "ПнЗх",
        NNW: "ПнПнЗх"
    }

    public error = {
        emptyCity: "Введіть ім'я міста",
        limitCity: "Можна зберегти в обране лише 5 міст. Видаліть будьласка одне з обраних міст перед тим як додати нове"
    }

    public alert = {
        cityWasSaved: "Місто додане до обраного",
        cityAlreadyExists: "Це місто вже є серед обраних",
        sureDeleteCity: "Ви впевнені, що бажаєте видалити це місто?",
        cityWasDeleted: "Місто успішно видалене"
    }

    public elementMsg = {
        emptyCityList: "Ви поки не обрали жодного міста",
        feelsLike: "Відчувається як"
    }
}

const dictionaryUK = new DictionaryUK();
export default dictionaryUK;