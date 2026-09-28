export class DateUtils{



    //get todays date 
//for not adding to git
    static getTodayDate()
    {
        const date = new Date();
        return date.toLocaleDateString();
    }

    static getPreviousDate(days)
    {
        const date = new Date();
        date.setDate(date.getDate()-days)
        return date.toLocaleDateString();
    }


        static getAfterDate(days)
    {
        const date = new Date();
        date.setDate(date.getDate()+days)
        return date.toLocaleDateString();
    }


}