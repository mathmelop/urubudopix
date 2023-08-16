const puppeteer = require("puppeteer");
require("dotenv").config();






const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();
    console.log("Iniciando...")
    await page.setDefaultNavigationTimeout(0); 
    await page.goto('https://dashboard.1daybot.com/', { cache: 'no-cache' });

    // Find elements using XPath

    console.log("Fazendo Login...")
    //await page.type('#login-email', 'wesley_becker302@hotmail.com');
    const email = process.env.URUBU_EMAIL
    const senha = process.env.URUBU_SENHA
    await page.type('#login-email', email);
    await page.type('#login-password', senha);
    await page.click('.row.auth-inner.m-0')
    await page.click('.btn >div');
    console.log("Logando...")
    await page.waitForNavigation()
    console.log("Acessando pagina de arbitragem...")
    await page.goto('https://dashboard.1daybot.com/manual-arbitration')


    licenseQtd = 2


    for (let z = 1; z <= licenseQtd; z++) {
      await doTheThing(z)

    }
    
    function just(num) {
      return new Promise((resolve) => setTimeout(resolve, num));
    }
    
    
    async function countElements() {
      //Retorna o numero de elementos
      return await page.evaluate(() => {
        return document.querySelectorAll(`#app > div > div.app-content.content > div.content-wrapper > div.content-body > div > div > div > div`).length;
      });
    
    }


    
    async function doTheThing(licenseNumber) {
      console.log("Usando licença: " + licenseNumber)
      firstElement = 3
      let esseehbao = -1
      let qtdElements = 0;
      // Espera os elementos carregarem
      const tst = `#app > div > div.app-content.content > div.content-wrapper > div.content-body > div > div > div > div:nth-child(4) > div > div > div > div:nth-child(3) > p.h5.text-info`
      await page.waitForSelector(tst)
      
      qtdElements = await countElements();
      
      
      console.log("Encontrados " + qtdElements + " elementos")

      
      //Percorre e busca diferença de 0.4%
      for (let i = firstElement; i <= qtdElements; i++) {
        const seletor = `#app > div > div.app-content.content > div.content-wrapper > div.content-body > div > div > div > div:nth-child(${i}) > div > div > div > div:nth-child(3) > p.h5.text-info`
        const element = await page.$(seletor)

        await page.waitForSelector(seletor)
        const text = await element.evaluate(element => element.textContent);
        console.log(i + " - " + text)
        //Se encontrou
        if ((Number(text.replace('%', '')) >= 0.4)) {
          console.log("Encontrou com a diferença:" + text)
          esseehbao = i
          break;
        }
        if (i == qtdElements) {
          console.log("Não encontrado, atualizando pagina em 3 segundos...")
          await just(3000);
          await page.reload()
          await page.waitForSelector(tst)
          i = firstElement
          qtdElements = await countElements();
        };
      }

      if (esseehbao == -1) {
        console.log("Inicio de um sonho...")
        console.log("...")
        console.log("...")
        console.log("Deu tudo errado...")

      }


      //Clica no maior e seleciona a licença informada
      console.log(esseehbao)
      let vencedor = esseehbao
      const botao = `#app > div > div.app-content.content > div.content-wrapper > div.content-body > div > div > div > div:nth-child(${vencedor}) > div > div > button`
      await just(1000);
      await page.click(botao)
      //licenseBtn = `#modal-manual-operation-43___BV_modal_body_ > div > div.list-group.mt-1 > button:nth-child(${licenseNumber})`
      licenseBtn = `html > body > div:nth-of-type(5) > div:first-of-type > div > div > div > div > div:nth-of-type(2) > button:nth-of-type(${licenseNumber})`
      await page.hover(licenseBtn);
      await just(100);
      await page.click(licenseBtn);
      

      mensagemOk = `html > body > div:nth-of-type(5) > div:first-of-type > div > div > div > div > div:nth-of-type(3) > div`
      await page.waitForSelector(mensagemOk);
      
      const ele = await page.$(mensagemOk)

      const aviso = await ele.evaluate(element => element.textContent);
      erro = "Não é possível fazer uma operação"
      if (aviso.includes(erro)) {
        console.log("Licença em Cooldown")
      } else {
        console.log("KASSINÃAAAAAAAAAO")
      }

      //deu tudo certo
      await page.reload()
      await just(1000);

      res.send(logStatement);
    }
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
    res.send("--Script Finalizado--");
  }
};

module.exports = { scrapeLogic };


