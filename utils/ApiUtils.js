import { LogUtils } from './LogUtils';

export class ApiUtils{

    //send GET request and return status code and response body
    static async getRequest(request,url)
    {
        LogUtils.info("GET request URL :", url);
        const response = await request.get(url);
        const body = await response.json();
        LogUtils.info("Status code :", response.status());
        return { status: response.status(), body: body };
    }

    //send POST request and return status code and response body
    static async postRequest(request,url,requestBody)
    {
        LogUtils.info("POST request URL :", url);
        LogUtils.info("Request body :", requestBody);
        const response = await request.post(url, { data: requestBody });
        const body = await response.json();
        LogUtils.info("Status code :", response.status());
        return { status: response.status(), body: body };
    }

    //send PUT request and return status code and response body
    static async putRequest(request,url,requestBody)
    {
        LogUtils.info("PUT request URL :", url);
        LogUtils.info("Request body :", requestBody);
        const response = await request.put(url, { data: requestBody });
        const body = await response.json();
        LogUtils.info("Status code :", response.status());
        return { status: response.status(), body: body };
    }

}
