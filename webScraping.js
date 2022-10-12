const puppeteer = require('puppeteer');
//import {puppeteer} from 'puppeteer'
    //conver dolar to shekel
    async function dolarToShekel(numOfDolars){
     
    const browser = await puppeteer.launch( {headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.hamara.co.il/');
 
    
    await page.type('#SelectCurrencyAmount', numOfDolars); //numOfDolars = 10 defult
    await page.click('input[id =calcsubmit]');
    
    await page.waitForSelector('.FinalAmountText')
    let element = await page.$('.FinalAmountText')
    let value = await page.evaluate(el => el.textContent, element)
   
    console.log(value);
    await browser.close();
    return value;
    
    };

    module.exports = {dolarToShekel};

     //conver shekel to dolar
     async function shekelToDolar(shekel){
          //const puppeteer= require('puppeteer');
        const browser = await puppeteer.launch( {headless: false});
        const page = await browser.newPage();
        await page.goto('https://www.hamara.co.il/');
     
        await page.click('a[class=noselect]')
        await page.type('#SelectCurrencyAmount', shekel); //numOfDolars = 10 defult
        await page.click('input[id =calcsubmit]');
        
        await page.waitForSelector('.FinalAmountText')
        let element = await page.$('.FinalAmountText')
        let value = await page.evaluate(el => el.textContent, element)
       
        console.log(value);
        await browser.close();
        return value;
        
        };

        module.exports = {shekelToDolar};
   /* async function shekelToDolar(numOfShekels){
        const browser = await puppeteer.launch( {headless: false});
        const page = await browser.newPage();
        await page.goto('https://www.bankhapoalim.co.il/he/foreign-currency/calculator');
     
        
      
        await page.type('#main-currency-field', numOfShekels); //numOfDolars = 10 defult
        
        const[el] = await page.$x('//*[@id="second-currency-field"]')
        const txt = el.getProperty('textContent')
        const m = (await txt).jsonValue();

        console.log(m);
        //return value;
       // await browser.close();
        };*/
       //console.log(shekelToDolar("10"))
       // console.log(dolarToShekel("10"));