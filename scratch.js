const pupeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');

const json = res => res.json();
const url = 'http://www.grubstreet.com/2018/07/best-cheap-eats-nyc-2018.html';
const api = 'https://api.yelp.com/v3/graphql';
const token = 'Lv4gL140swTCiiZtR84ZptdOsvWAmM-kecrVKvpN6xXLaLLTWyphhJMbSuAUOzfzmNal0ABMLhdtldXPOwFIyIrZXpVhXiFqTE6nDHtsTC_P5rSCHHiGxoyJAU5fW3Yx';
const query = `
  query restaurant($name: String!) {
    search(term: $name, location: "New York", categories: "food,bars,restaurants", limit: 1) {
      business {
        name,
        location {
          formatted_address
        },
        coordinates {
          latitude
          longitude
        }
      }
    }
  }`;

(async () => {
  const browser = await pupeteer.launch();
  const page = await browser.newPage();

  let data = [];

  await page.goto(url);

  const results = await page.evaluate(() => {
    return [...document.querySelectorAll('.clay-paragraph a strong')]
      .map(x => x.innerText)
      .filter(x => x)
      .slice(0, -1);
  });

  for (let name of results) {
    let res;

    // sleep
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      res = await fetch(api, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          variables: { name }
        })
      }).then(json)
    } catch (e) {
      console.log(e);
    }

    if (res.data.search.business.length) {
      console.log('pushing ', name);
      data.push(res.data.search.business[0]);
    }
  }

  if (Object.values(data).length) {
    fs.writeFileSync(process.env.OUTPUT_NAME, JSON.stringify(data, null, 2));
  }

  await browser.close();
})();
