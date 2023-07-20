'use strict';

const selLang = document.getElementById('selLang');
const selColor = document.getElementById('selColor');
const content = document.getElementById('content');
const dialog = document.querySelector('dialog');

const langMdFiles = {
  ja: ['site_profile_ja'],
  en: ['site_profile_en'],
};

selLang.addEventListener('change', (event) => {
  const lang = selLang.value;
  reloadContent(lang);
});

selColor.addEventListener('change', (event) => {
  const colorMode = selColor.value;
  document.body.dataset.colorMode = colorMode;
});

async function reloadContent(lang) {
  const mdFiles = langMdFiles[lang] ?? [];
  try {
    dialog.showModal();
    let html = '';
    for (const mdFile of mdFiles) {
      html += marked.parse(await (await fetch(`data/${mdFile}.md`)).text(), {
        mangle: false,
        headerIds: false,
      });
    }
    content.innerHTML = html;
  } catch (error) {
    console.error(error);
  } finally {
    dialog.close();
  }
}

function getLanguage() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const lang = urlSearchParams.get('lang') ?? navigator.language;
  return Object.keys(langMdFiles).includes(lang) ? lang : 'en';
}

selLang.value = getLanguage();
selLang.dispatchEvent(new Event('change'));
selColor.dispatchEvent(new Event('change'));
