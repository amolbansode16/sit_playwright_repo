export class DataFormPage{
    constructor(page)
    {
        this.page=page;

        //Locators

        this.nameInput = page.locator("//input[@id='name']");
        this.emailInput = page.locator("//input[@id='email']");
        this.phoneInput = page.locator("//input[@id='phone']");

        //Gender
        this.maleRadio = page.locator('#male');
        this.femaleRadio = page.locator("#female")

        //Days
        this.daysCheckbox ={
            sunday: page.locator("#sunday"),
            monday: page.locator("#monday"),
            tuesday: page.locator("#tuesday"),
            wednesday: page.locator("#wednesday"),
            thursday: page.locator("#thursday"),
            friday: page.locator("#friday"),
            saturday: page.locator("#saturday"),
        }
    }


    //fill data
    // async fillData(input)
    // {
    //     await this.page.locator("//input[@id="input"]")
    // }

    //Enter name 
    async enterName(name)
    {
        await this.nameInput.fill(name);
    }

     //Enter email 
    async enterEmail(email)
    {
        await this.emailInput.fill(email);
    }

     //Enter phone 
    async enterPhone(phone)
    {
        await this.phoneInput.fill(phone);
    }

    //Clear name
    async clearName()
    {
        await this.nameInput.clear();
    }

    //fill complete form 
    async fillUserForm(name,email,phone)
    {
        await this.enterName(name);
        await this.enterEmail(email);
        await this.enterPhone(phone);

    }

    //verify entered Values
    async verifyUserDetails(name,email,phone)
    {
        await expect.soft(this.nameInput).toHaveValue(name)
        await expect.soft(this.emailInput).toHaveValue(email)
        await expect.soft(this.phoneInput).toHaveValue(phone)
    }


    //Gender
    async selectGender(gender)
    {
        if(gender.toLowerCase() ==='male')
        {
            await this.maleRadio.check();
        }
        else if(gender.toLowerCase ==='female')
        {
            await this.femaleRadio.check();
        }
        else
        {
           console.log("Invali Gender Selected Please select Valid : ",gender)
        }
    }

    //day
    async selectDay(day)
    {
        const checkbox =this.daysCheckbox[day];
        await checkbox.check();
    }

    //days
    async selectDays(days)
    {
        for(const day of days)
        {
            await this.selectDay(day);
        }
    }

}