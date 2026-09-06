const objectButtons = document.querySelectorAll('.object');
const selectedObject = document.querySelector('#selectedObject');
const solutionIcon = document.querySelector('#solutionIcon');
const formObject = document.querySelector('#consultForm select');

objectButtons.forEach((button) => {
  button.addEventListener('click', () => {
    objectButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    selectedObject.textContent = button.dataset.object;
    solutionIcon.textContent = button.dataset.icon;
    formObject.value = button.dataset.object;
  });
});

document.querySelector('.choose-btn').addEventListener('click', () => {
  formObject.value = selectedObject.textContent.charAt(0).toUpperCase() + selectedObject.textContent.slice(1);
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
  const service = String(formData.get('object') || '').trim();
  const message = [
    'Здравствуйте! Хочу получить консультацию по услугам охраны.',
    '',
    `Имя: ${name}`,
    `Телефон: ${phoneNumber}`,
    `Услуга: ${service}`,
  ].join('\n');

  window.open(`https://wa.me/79531117313?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

document.querySelectorAll('.card-gallery').forEach((gallery, index) => {
  const images = [...gallery.querySelectorAll('img')];
  const sectionName = gallery.closest('section')?.querySelector('.kicker')?.textContent?.trim() || 'Фотографии';
  const galleryId = `service-gallery-${index + 1}`;

  gallery.id = galleryId;
  gallery.tabIndex = 0;
  gallery.setAttribute('role', 'region');
  gallery.setAttribute('aria-label', `Карточки: ${sectionName}`);

  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  controls.innerHTML = `
    <span class="gallery-hint">Листайте карточки</span>
    <div class="gallery-navigation">
      <button class="gallery-arrow gallery-prev" type="button" aria-label="Предыдущие карточки" aria-controls="${galleryId}">←</button>
      <span class="gallery-counter" aria-live="polite">1–2 / ${images.length}</span>
      <button class="gallery-arrow gallery-next" type="button" aria-label="Следующие карточки" aria-controls="${galleryId}">→</button>
    </div>`;
  gallery.before(controls);

  const previousButton = controls.querySelector('.gallery-prev');
  const nextButton = controls.querySelector('.gallery-next');
  const counter = controls.querySelector('.gallery-counter');
  let updateFrame;

  const visibleCount = () => window.matchMedia('(max-width: 700px)').matches ? 1 : 2;
  const cardStep = () => {
    const cardWidth = images[0]?.getBoundingClientRect().width || gallery.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(gallery).gap) || 0;
    return cardWidth + gap;
  };

  const updateControls = () => {
    const step = cardStep();
    const firstVisible = Math.min(images.length - 1, Math.max(0, Math.round(gallery.scrollLeft / step)));
    const lastVisible = Math.min(images.length, firstVisible + visibleCount());
    const maxScroll = Math.max(0, gallery.scrollWidth - gallery.clientWidth);

    counter.textContent = `${firstVisible + 1}–${lastVisible} / ${images.length}`;
    previousButton.disabled = gallery.scrollLeft <= 2;
    nextButton.disabled = gallery.scrollLeft >= maxScroll - 2;
  };

  const moveGallery = (direction) => {
    gallery.scrollBy({
      left: direction * cardStep() * visibleCount(),
      behavior: 'smooth'
    });
  };

  previousButton.addEventListener('click', () => moveGallery(-1));
  nextButton.addEventListener('click', () => moveGallery(1));
  gallery.addEventListener('scroll', () => {
    cancelAnimationFrame(updateFrame);
    updateFrame = requestAnimationFrame(updateControls);
  }, { passive: true });
  window.addEventListener('resize', updateControls);
  images.forEach((image) => image.addEventListener('load', updateControls, { once: true }));
  updateControls();
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
