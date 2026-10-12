import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const rootHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const distHtml = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const rootScript = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const distScript = readFileSync(new URL('../dist/script.js', import.meta.url), 'utf8');

for (const [name, html] of [['index.html', rootHtml], ['dist/index.html', distHtml]]) {
  assert.match(html, /г\. Краснодар, ул\. Вологодская, 8/, `${name}: указан новый адрес`);
  assert.doesNotMatch(html, /Новороссийская/, `${name}: старый адрес удалён`);
  assert.match(html, /MAX/, `${name}: указан мессенджер MAX`);
  assert.match(html, /\+7 \(918\) 164-25-00/, `${name}: указан номер MAX`);
  assert.match(html, /tel:\+79181642500/, `${name}: номер MAX кликабелен`);
  assert.doesNotMatch(html, /\+7 \(861\) 212-7-313|tel:\+78612127313/, `${name}: старый телефон полностью удалён`);
  assert.match(html, /class="nav-phone" href="tel:\+79181642500">\+7 \(918\) 164-25-00<\/a>/, `${name}: телефон в шапке обновлён`);
  assert.match(html, /mobile-contact-bar[^>]*>[\s\S]*?href="tel:\+79181642500">Позвонить<\/a>/, `${name}: мобильная кнопка звонка использует новый номер`);
  assert.doesNotMatch(html, /WhatsApp|wa\.me|Telegram/i, `${name}: WhatsApp и Telegram удалены`);
}

for (const [name, script] of [['script.js', rootScript], ['dist/script.js', distScript]]) {
  assert.doesNotMatch(script, /WhatsApp|wa\.me|Telegram/i, `${name}: старый мессенджер удалён`);
  assert.match(script, /tel:\+79181642500/, `${name}: форма использует новый контакт`);
}

assert.equal(rootHtml, distHtml, 'корневая и публикуемая HTML-версии совпадают');
assert.equal(rootScript, distScript, 'корневой и публикуемый JavaScript совпадают');

console.log('site contact details: OK');
