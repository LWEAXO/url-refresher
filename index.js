const readline = require('readline');
const axios = require('axios');
const colors = require('colors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function clearTerminal() {
  process.stdout.write('\x1Bc');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function refreshUrl(url, count) {
  clearTerminal();
  console.log(colors.green(`\nURL Yenileme Başlatıldı!\n`));
  console.log(colors.blue(`Hedef URL: ${colors.underline(url)}`));
  console.log(colors.blue(`Toplam Yenileme: ${colors.bold(count)}\n`));

  let successfulRequests = 0;
  let failedRequests = 0;

  for (let i = 1; i <= count; i++) {
    try {
      const response = await axios.get(url);
      successfulRequests++;
      process.stdout.write(
        colors.green(`✅ [${i}/${count}] (${Math.round((i/count)*100)}%) `) + 
        colors.white(`Yenilendi - `) +
        colors.yellow(`Durum: ${response.status} `) +
        `\r`
      );
    } catch (error) {
      failedRequests++;
      process.stdout.write(
        colors.red(`❌[${i}/${count}] `) + 
        colors.white(`Hata - `) +
        colors.yellow(`Mesaj: ${error.message} `) +
        `\r`
      );
      console.log(error.message)
      process.exit(1)
    }
    await sleep(500);
  }

  console.log(colors.magenta('\nYenileme işlemi tamamlandı!\n'));
  process.exit(0);
}

function startApp() {
  clearTerminal();
  console.log(colors.yellow(`
██╗     ██╗       ██╗███████╗ █████╗ ██╗  ██╗ █████╗   ██████╗ ███████╗██╗      █████╗  █████╗ ██████╗
██║     ██║  ██╗  ██║██╔════╝██╔══██╗╚██╗██╔╝██╔══██╗  ██╔══██╗██╔════╝██║     ██╔══██╗██╔══██╗██╔══██╗
██║     ╚██╗████╗██╔╝█████╗  ███████║ ╚███╔╝ ██║  ██║  ██████╔╝█████╗  ██║     ███████║██║  ██║██║  ██║
██║      ████╔═████║ ██╔══╝  ██╔══██║ ██╔██╗ ██║  ██║  ██╔══██╗██╔══╝  ██║     ██╔══██║██║  ██║██║  ██║
███████╗ ╚██╔╝ ╚██╔╝ ███████╗██║  ██║██╔╝╚██╗╚█████╔╝  ██║  ██║███████╗███████╗██║  ██║╚█████╔╝██████╔╝
╚══════╝  ╚═╝   ╚═╝  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝ ╚════╝ ╚═════╝
  `));

  rl.question(('Yenilenecek URL: '.blue.bold), (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    rl.question(colors.blue('Yenileme Sayısı: '), async (count) => {
      count = parseInt(count);
      if (isNaN(count) || count <= 0) {
        console.log(colors.red('Geçersiz sayı! Pozitif bir sayı girin.'));
        process.exit(1);
      }

      await refreshUrl(url, count);
    });
  });
}

startApp();