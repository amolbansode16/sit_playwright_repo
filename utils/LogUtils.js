export class LogUtils{

    //print test start message
    static testStart(testName)
    {
        console.log(`\n========== Test Started : ${testName} ==========`);
    }

    //print test end message
    static testEnd(testName)
    {
        console.log(`========== Test Ended : ${testName} ==========\n`);
    }

    //print message with time, data is optional
    static info(message,data = "")
    {
        const time = new Date().toLocaleTimeString();
        console.log(`[${time}] ${message}`, data);
    }

}
