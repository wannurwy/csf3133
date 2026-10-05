const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});

mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
});

document.getElementById('year').textContent = new Date().getFullYear();

const topicSearch = document.getElementById('topicSearch');
const topicCards = [...document.querySelectorAll('.topic-card')];
const topicCount = document.getElementById('topicCount');
const noTopics = document.getElementById('noTopics');

topicSearch.addEventListener('input', () => {
  const query = topicSearch.value.trim().toLowerCase();
  let visible = 0;
  topicCards.forEach(card => {
    const text = `${card.innerText} ${card.dataset.search || ''}`.toLowerCase();
    const match = text.includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  topicCount.textContent = `${visible} learning area${visible === 1 ? '' : 's'}`;
  noTopics.hidden = visible !== 0;
});

const generateSummary = document.getElementById('generateSummary');
const copySummary = document.getElementById('copySummary');
const summaryTitle = document.getElementById('summaryTitle');
const summaryText = document.getElementById('summaryText');
const summaryCriteria = document.getElementById('summaryCriteria');
const copyStatus = document.getElementById('copyStatus');
let latestSummary = '';

generateSummary.addEventListener('click', () => {
  const website = document.getElementById('websiteName').value.trim() || 'Website not specified';
  const observations = document.getElementById('observations').value.trim();
  const criteria = [...document.querySelectorAll('.check-item input:checked')].map(input => input.value);
  if (!criteria.length) {
    summaryTitle.textContent = 'Choose at least one criterion';
    summaryText.textContent = 'Tick the design criteria your group discussed, then generate the summary again.';
    summaryCriteria.innerHTML = '';
    copySummary.disabled = true;
    latestSummary = '';
    return;
  }
  summaryTitle.textContent = website;
  summaryText.textContent = observations || 'No written observations yet. Add your group’s findings in the notes field to make the summary more useful.';
  summaryCriteria.innerHTML = '';
  criteria.forEach(item => {
    const tag = document.createElement('span');
    tag.textContent = item;
    summaryCriteria.appendChild(tag);
  });
  latestSummary = `CSF3133 Website Evaluation\nWebsite: ${website}\nCriteria reviewed: ${criteria.join(', ')}\nGroup observations: ${observations || 'Not added yet.'}`;
  copySummary.disabled = false;
  copyStatus.textContent = 'Summary generated. You can copy it for your presentation notes.';
});

copySummary.addEventListener('click', async () => {
  if (!latestSummary) return;
  try {
    await navigator.clipboard.writeText(latestSummary);
    copyStatus.textContent = 'Copied to clipboard!';
  } catch (error) {
    const area = document.createElement('textarea');
    area.value = latestSummary;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand('copy');
    area.remove();
    copyStatus.textContent = copied ? 'Copied to clipboard!' : 'Copy unavailable. Select and copy the summary manually.';
  }
});
