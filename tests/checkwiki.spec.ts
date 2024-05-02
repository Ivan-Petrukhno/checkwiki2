import { test, expect } from '@playwright/test';

test('Знайти статтю у Вікіпедії', async ({ page }) => {
  // Відкрити головну сторінку Вікіпедії
  await page.goto('https://en.wikipedia.org/');

  //Ввести запит у поле пошуку
  await page.fill('input[name="search"]', 'Playwright');

// Натиснути кнопку пошуку
 
let click = page.getByRole('button', { name: 'Search' });

 //Зачекати завантаження результатів пошуку
  await page.waitForSelector('//div[@id="mw-content-text"]');

   //Отримати текст усіх результатів пошуку
   const searchResults = await page.$$('//div[@class="mw-search-result-heading"]');
   const searchResultsText = await Promise.all(searchResults.map(async (result) => {
     return result.textContent();
   }));

    // Перевірити, що відображаються результати пошуку, відповідного запиту
  const searchTerm = 'Playwright';
  const isSearchTermInResults = searchResultsText.some((text) => text.includes(searchTerm));
});


test('Navigate to a link within an article on Wikipedia', async ({ page }) => {
    // Відкрити випадкову статтю у Вікіпедії
    await page.goto('https://en.wikipedia.org/wiki/Special:Random');
  
     // Знайти посилання в середині статьи
     const articleLinks = await page.$$('div#content a');
   
   
  

  
  
    //Перевірити, що перехід здійснюється коректно, і відкрити нову сторінку
    const newPageTitle = await page.title();
    expect(newPageTitle).not.toContain('404'); // Впевнетись, що нова сторінка не є сторінкою з помилкою 404
  });


  test('View edit history of the article on Wikipedia using XPath locator', async ({ page }) => {
    //Вшдкрити статью про "Історії комп'ютерів" у Вікіпедії
    await page.goto('https://en.wikipedia.org/wiki/History_of_computing');
  
   // Знайти посилання на історію правок статті
    const editHistoryLink = await page.waitForSelector('//a[contains(@href, "action=history")]');
    expect(editHistoryLink).not.toBeNull();
  
    
     //Натиснуть на посилання історії правок
    await editHistoryLink.click();
  
   
  
    
  
    // Перевірити, чи заголовок сторінки містить текст "Revision history"
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Revision history');
  });

  test('Шукати відому людину у Вікіпедії', async ({ page }) => {
    // Відкрити головну сторінку Вікіпедії
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');
  
    // Ввести запит "Альберт Ейнштейн" у полі пошуку
    await page.fill('//input[@name="search"]', 'Albert Einstein');
  
    //Натиснути кнопку пошуку
    let press = page.getByRole('button', { name: 'Search' });
  
  
    // Дочекатися завантаження результатів пошуку
    await page.waitForSelector('div#mw-content-text');
  
    // Перевірити, що результати пошуку містять статтю про Альберта Ейнштейна
    const searchResults = await page.$$eval('div.mw-search-result-heading', (results) => {
      return results.map((result) => result.textContent);
    });
  
    const isEinsteinFound = searchResults.some((result) => result.includes('Albert Einstein'));
    
  });
  
    
   test('Check Wikipedia homepage title', async ({ page }) => {
    // Відкрит головну сторінку Вікіпедшї
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');
  
    // Отримати заголовок сторінки
    const title = await page.title();
  
    // Проверить, что заголовок содержит слово "Вікіпедія"
    expect(title).toContain('Wikipedia');
  });



  test('View image of a bear on Wikipedia', async ({ page }) => {
    // Відкрити статтю про "Ведмеді" на Вікіпедії
    await page.goto('https://en.wikipedia.org/wiki/Bear');
  
  
    //Знайти зображення ведмедя у статті
  let picture = page.locator('td').first()
  
    
    
  });


test('Переглянути зовнішні посилання у статті Вікіпедії про Інтернет', async ({ page }) => {
  //Відкрити статтю про "Інтернет" на Вікіпедії
  await page.goto('https://en.wikipedia.org/wiki/Internet');



  // Знайти список зовнішніх посилань наприкінці статті
  const externalLinks = await page.$$('div#content a[rel="nofollow external"]');

  // Перевірити, чи є посилання на офіційний сайт Інтернету
  const officialSiteLink = externalLinks.find(async (link) => {
    const text = await link.textContent();
    return text && text.toLowerCase().includes('official website');
  });

  
});

  
test('Перевірка переходу на сторінку результатів пошуку під час введення запиту', async ({ page }) => {
  await page.goto('https://wikipedia.org/');
  await page.fill('input[name="search"]', 'JavaScript');
  await page.press('input[name="search"]', 'Enter');
  await expect(page).toHaveURL(/\/wiki\/JavaScript/);
});





test('Перевірка коректності відображення різних мовних версій статті', async ({ page }) => {
  await page.goto('https://de.wikipedia.org/wiki/JavaScript');
  await page.click('a.interlanguage-link-target[hreflang="en"]');
  await expect(page).toHaveURL('https://en.wikipedia.org/wiki/JavaScript');
});




test('Перевірка функціональності створення нової статті (чи доступно лише для зареєстрованих користувачів)', async ({ page }) => {
  await page.goto('https://en.wikipedia.org/');
  const createPageLink = await page.$('a[title="Создать страницу"]');
  if (createPageLink) {
    await createPageLink.click();
    await page.waitForSelector('input[name="wpTitle"]');
    const titleInput = await page.$('input[name="wpTitle"]');
    await titleInput.type('Нова_стаття');
    const contentTextarea = await page.$('textarea[name="wpTextbox1"]');
    await contentTextarea.type('n.');

    
    await page.click('input[name="wpSave"]');
    await page.waitForNavigation();
    const newPageURL = page.url();
    expect(newPageURL).toContain('https://en.wikipedia.org/wiki/%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F_%D1%81%D1%82%D0%B0%D1%82%D1%8C%D1%8F_%D0%B0%D0%B2%D1%82%D0%BE%D1%82%D0%B5%D1%81%D1%82');
  } else {
    console.log('Перевірка функціональності створення нової статті (чи доступна лише зареєстрованим користувачам.');
  }
});