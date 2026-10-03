const objectButtons = document.querySelectorAll('.object');
const selectedObject = document.querySelector('#selectedObject');
const solutionIcon = document.querySelector('#solutionIcon');
const formService = document.querySelector('#consultForm select[name="service"]');
const formFacility = document.querySelector('#consultForm select[name="facility"]');
const chooseButton = document.querySelector('.choose-btn');
const objectLabels = {
  'Квартира': 'квартиры',
  'Дом': 'дома',
  'Магазин': 'магазина',
  'Офис': 'офиса',
  'Склад': 'склада'
};
let selectedSolutionObject = 'Квартира';

const updateSelectedObject = (button) => {
  objectButtons.forEach((item) => {
    const isActive = item === button;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });

  selectedSolutionObject = button.dataset.object;
  selectedObject.textContent = selectedSolutionObject;
  solutionIcon.textContent = button.dataset.icon;
  chooseButton.textContent = `Получить расчёт для ${objectLabels[selectedSolutionObject]}`;
};

objectButtons.forEach((button) => {
  button.addEventListener('click', () => updateSelectedObject(button));
});

chooseButton.addEventListener('click', () => {
  formService.value = 'Пультовая охрана';
  formFacility.value = selectedSolutionObject;
  document.querySelector('#consult').scrollIntoView({ behavior: 'smooth' });
});

const phone = document.querySelector('input[name="phone"]');
phone.addEventListener('input', (event) => {
  let value = event.target.value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
  if (!value) return event.target.value = '';
  if (value[0] !== '7') value = '7' + value;
  const parts = ['+7'];
  if (value.length > 1) parts.push(' (' + value.slice(1, 4));
  if (value.length >= 4) parts.push(') ' + value.slice(4, 7));
  if (value.length >= 7) parts.push('-' + value.slice(7, 9));
  if (value.length >= 9) parts.push('-' + value.slice(9, 11));
  event.target.value = parts.join('');
});

document.querySelector('#consultForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = String(formData.get('name') || '').trim();
  const phoneNumber = String(formData.get('phone') || '').trim();
  const service = String(formData.get('service') || '').trim();
  const facility = String(formData.get('facility') || '').trim();
  const message = [
    'Здравствуйте! Нужен расчёт охраны.',
    '',
    `Имя: ${name}`,
    `Телефон: ${phoneNumber}`,
    `Услуга: ${service}`,
    `Объект: ${facility}`,
  ].filter(Boolean).join('\n');

  window.open(`https://wa.me/79531117313?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

const menuToggle = document.querySelector('.nav-menu-toggle');
const mainNavigation = document.querySelector('#mainNavigation');

const setMenuOpen = (isOpen) => {
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  mainNavigation.classList.toggle('is-open', isOpen);
};

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

mainNavigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav')) setMenuOpen(false);
});

const faqTabs = [...document.querySelectorAll('.faq-tab')];
const faqPanels = [...document.querySelectorAll('.faq-panel')];

const activateFaqTab = (activeTab) => {
  const target = activeTab.dataset.faqTarget;

  faqTabs.forEach((tab) => {
    const isActive = tab === activeTab;
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  faqPanels.forEach((panel) => {
    panel.hidden = panel.dataset.faqPanel !== target;
  });
};

faqTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateFaqTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + faqTabs.length) % faqTabs.length;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % faqTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = faqTabs.length - 1;

    faqTabs[nextIndex].focus();
    activateFaqTab(faqTabs[nextIndex]);
  });
});

document.querySelectorAll('.faq-panel .faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    item.closest('.faq-panel').querySelectorAll('.faq-item[open]').forEach((openItem) => {
      if (openItem !== item) openItem.open = false;
    });
  });
});

const messengerFloat = document.querySelector('.messenger-float');
const messengerFloatToggle = document.querySelector('.messenger-float-toggle');
const messengerFloatPanel = document.querySelector('#messengerFloatPanel');

const setMessengerFloatOpen = (isOpen) => {
  messengerFloatToggle.setAttribute('aria-expanded', String(isOpen));
  messengerFloatPanel.hidden = !isOpen;
};

messengerFloatToggle.addEventListener('click', () => {
  setMessengerFloatOpen(messengerFloatToggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('click', (event) => {
  if (!messengerFloat.contains(event.target)) setMessengerFloatOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  setMenuOpen(false);
  setMessengerFloatOpen(false);
  if (document.activeElement && messengerFloat.contains(document.activeElement)) messengerFloatToggle.focus();
});
