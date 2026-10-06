import{test,expect} from '@playwright/test';
import { DataFormPage } from '../pages/DataFormPage.po';
import { userData } from '../test-data/userData';
import { DateUtils } from '../utils/DateUtils';
import { ApiUtils } from '../utils/ApiUtils';
import { LogUtils } from '../utils/LogUtils';
import { apiUrls, newProduct } from '../test-data/productData';

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


    test("SIT:002 | Verify product list API",async({request}) =>{
        LogUtils.testStart("SIT:002");

        // Step 1 : Send GET request
        const response = await ApiUtils.getRequest(request, apiUrls.productList);

        // Step 2 : Check status code
        expect(response.status).toBe(200);

        // Step 3 : Check product list is not empty
        const products = response.body.products;
        LogUtils.info("Total products :", products.length);
        expect(products.length).toBeGreaterThan(0);

        // Step 4 : Check second product
        const secondProduct = products[1];
        LogUtils.info("Second product :", secondProduct.name + " | " + secondProduct.price);
        expect(secondProduct).toHaveProperty('price');

        LogUtils.testEnd("SIT:002");
    })


    test("SIT:003 | Verify single product API",async({request}) =>{
        LogUtils.testStart("SIT:003");

        // Step 1 : Send GET request
        const response = await ApiUtils.getRequest(request, apiUrls.singleProduct);

        // Step 2 : Check status code
        expect(response.status).toBe(200);

        // Step 3 : Verify product details (one product is inside "data")
        const product = response.body.data;
        LogUtils.info("Product :", product);
        expect(product.id).toBe(1);
        expect(product.name).toBeDefined();
        expect(product.price).toBeGreaterThan(0);

        LogUtils.testEnd("SIT:003");
    })


    test("SIT:004 | Verify create product API",async({request}) =>{
        LogUtils.testStart("SIT:004");

        // Step 1 : Send POST request with product from test data
        const response = await ApiUtils.postRequest(request, apiUrls.products, newProduct);

        // Step 2 : Check status code (201 means created)
        expect(response.status).toBe(201);

        // Step 3 : Verify created product (product is inside "data")
        const createdProduct = response.body.data;
        LogUtils.info("Created product :", createdProduct);
        expect(createdProduct.id).toBeDefined();
        expect(createdProduct.name).toBe(newProduct.name);
        expect(createdProduct.price).toBe(newProduct.price);
        expect(createdProduct.category).toBe(newProduct.category);
        expect(createdProduct.stock).toBe(newProduct.stock);

        LogUtils.testEnd("SIT:004");
    })


    test("SIT:005 | Update product using PUT",async({request}) =>{
        LogUtils.testStart("SIT:005");

        // Step 1 : Send PUT request with product from test data
        const response = await ApiUtils.putRequest(request, apiUrls.singleProduct, newProduct);

        // Step 2 : Check status code
        expect(response.status).toBe(200);

        // Step 3 : Verify updated product (product is inside "data")
        const updatedProduct = response.body.data;
        LogUtils.info("Updated product :", updatedProduct);
        expect(updatedProduct.id).toBe(1);
        expect(updatedProduct.name).toBe(newProduct.name);
        expect(updatedProduct.price).toBe(newProduct.price);
        expect(updatedProduct.category).toBe(newProduct.category);
        expect(updatedProduct.stock).toBe(newProduct.stock);

        LogUtils.testEnd("SIT:005");
    })

})
