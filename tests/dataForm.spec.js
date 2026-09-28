import{test,expect} from '@playwright/test';
import { DataFormPage } from '../pages/DataFormPage.po';
import { userData } from '../test-data/userData';
import { DateUtils } from '../utils/DateUtils';

test.describe("User Form Tests", ()=>
{
    // test("SIT:001 | Verify user form detils",async({page}) =>{
    //     const dataFormPage = new DataFormPage(page);
    //     await page.goto("https://testautomationpractice.blogspot.com/");
    //     await dataFormPage.fillUserForm(userData.name,userData.email,userData.phone);
    //     //await dataFormPage.verifyUserDetails("Amol","test@email.com","1234567890");
    //     //await expect(dataFormPage.nameInput).toHaveValue("Amol")
    //     await dataFormPage.selectGender(userData.gender);
    //     await dataFormPage.selectDays(userData.days);
    //     await page.pause();
    // })


    test("SIT:002 | Verify user form detils test",async({page}) =>{
       const date = DateUtils.getTodayDate();
       console.log("Todays Date >> ", date);
       console.log("previous date >>>",DateUtils.getPreviousDate(5));
       console.log("Next date >>>",DateUtils.getAfterDate(6));

        

    })


})
