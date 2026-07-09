const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const ssFolder = path.join(__dirname, 'ss_saya');
  if (!fs.existsSync(ssFolder)) {
    fs.mkdirSync(ssFolder);
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for a nice desktop screenshot
  await page.setViewport({ width: 1440, height: 900 });

  const baseUrl = 'http://localhost:3000';

  try {
    // 1. Dashboard
    console.log('Capturing Dashboard...');
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    // Wait an extra second for any animations (like skeleton loading) to settle
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ssFolder, '1_Dashboard_Overview.png') });

    // 2. Data Master (Inventory)
    console.log('Capturing Data Master...');
    await page.goto(`${baseUrl}/inventory`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ssFolder, '2_Data_Master_Inventory.png') });

    // 3. Reports
    console.log('Capturing Audit Logs...');
    await page.goto(`${baseUrl}/reports`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ssFolder, '3_Log_Audit_Reports.png') });

    console.log('Screenshots captured successfully!');
  } catch (error) {
    console.error('Failed to capture screenshots:', error);
  } finally {
    await browser.close();
  }
})();
