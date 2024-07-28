import {EnglishMonths} from "@/lib/defaultData";
import {useI18n} from "@/locales/client";

export const UrduDate = (sourceDate) =>{

    const tempDate = new Date(sourceDate);
    const t = useI18n()

    const extractedDate = {
        year: tempDate.getFullYear(),
        day: tempDate.getDate(),
        month: EnglishMonths[tempDate.getMonth()],
        hours: String(tempDate.getHours()).padStart(2, '0'),
        minutes: String(tempDate.getMinutes()).padStart(2, '0'),
        seconds: String(tempDate.getSeconds()).padStart(2, '0')
    }

    return {
        day: `${extractedDate.day} ${t(`months.${extractedDate.month.toLowerCase()}`) + t('months.comma')} ${extractedDate.year}`,
        time: `${extractedDate.hours}:${extractedDate.minutes}:${extractedDate.minutes}`
    }
}