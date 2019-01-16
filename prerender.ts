import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import { AppPrerenderModuleNgFactory } from './dist/prerender/main';

enableProdMode();

const document = require("html-loader!./dist/browser/index.html");

const routes = ['/dashboard', '/heroes', '/detail/12'];

async function driver(n: number, urls: Array<string>) {
  const startTime = Date.now();
  for (let i = 0; i < n; ++i) {
    for (const url of urls) {
      await renderModuleFactory(AppPrerenderModuleNgFactory, {url, document});
    }
  }
  return Date.now() - startTime;
}

async function main() {
  // Warmup
  console.log('Warming up...');
  await driver(1, routes);
  await driver(10, routes);
  await driver(100, routes);
  console.log('Warmed up...');

  // Testing
  const time = await driver(100, routes);
  console.log(`Time: ${time} ms.`);
}

main().catch(console.error);
