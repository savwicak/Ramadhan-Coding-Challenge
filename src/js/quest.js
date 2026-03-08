const app = {
  data: {
    puasa: {},
    shalat: {},
    quranTarget: 0,
    quranRead: 0
  },

  shalatNames: ['Shubuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'],

  init() {
    this.loadData();
    this.renderAll();
    this.setupEvents();
  },

  loadData() {
    const saved = localStorage.getItem('ramadhan_data');
    if (saved) {
      const loaded = JSON.parse(saved);
      this.data = { ...this.data, ...loaded };
    }
  },

  saveData() {
    localStorage.setItem('ramadhan_data', JSON.stringify(this.data));
  },

  renderAll() {
    this.updateDateDisplay();
    this.renderPuasaChecklist();
    this.renderShalatList();
    this.updateProgressBar();
    this.updateQuranCircle();
    this.updateShalatProgress();
    this.updatePuasaCheckbox();
    this.loadQuranInputs();
    this.updateQuranCheckbox();
  },

  updateDateDisplay() {
    const today = new Date();
    const day = 17;

    document.getElementById('dayNumber').textContent = day;
    document.getElementById('dateDisplay').textContent = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  },

  renderPuasaChecklist() {
    const grid = document.getElementById('checklistGrid');
    grid.innerHTML = '';

    for (let i = 1; i <= 30; i++) {
      const isChecked = this.data.puasa[`day-${i}`] || false;
      
      const box = document.createElement('div');
      box.textContent = i;
      box.className = `w-14 h-14 border-2 rounded-lg cursor-pointer flex items-center justify-center font-bold text-lg transition-all ${
        isChecked 
          ? 'bg-green-500 text-white border-green-600' 
          : 'bg-gray-200 text-gray-800 border-gray-400'
      }`;

      box.onclick = () => {
        this.data.puasa[`day-${i}`] = !this.data.puasa[`day-${i}`];
        this.saveData();
        this.renderPuasaChecklist();
        this.updateProgressBar();
        this.updatePuasaCheckbox();
      };

      grid.appendChild(box);
    }
  },

  updatePuasaCheckbox() {
    const puasaCount = Object.values(this.data.puasa).filter(v => v).length;
    document.getElementById('puasaCheck').checked = puasaCount > 0;
  },

  updateQuranCheckbox() {
    const quranCheck = document.getElementById('quranCheck');
    quranCheck.checked = this.data.quranTarget > 0 && this.data.quranRead > 0;
  },

  renderShalatList() {
    const items = document.querySelectorAll('.shalat-item');

    items.forEach((item, index) => {
      const name = this.shalatNames[index];
      const isChecked = this.data.shalat[name] || false;
      const checkbox = item.querySelector('.shalat-checkbox');

      checkbox.checked = isChecked;

      if (isChecked) {
        item.classList.remove('bg-gray-400');
        item.classList.add('bg-green-500');
      } else {
        item.classList.add('bg-gray-400');
        item.classList.remove('bg-green-500');
      }

      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);

      newItem.onclick = () => {
        this.data.shalat[name] = !this.data.shalat[name];
        this.saveData();
        this.renderShalatList();
        this.updateShalatProgress();
        this.updateProgressBar();
      };
    });

    this.updateShalatProgress();
  },

  updateShalatProgress() {
    const count = Object.values(this.data.shalat).filter(v => v).length;
    const percent = (count / 5) * 100;

    document.getElementById('shalatBar').style.width = percent + '%';
    document.getElementById('shalatText').textContent = `${count}/5`;
  },

  updateQuranCircle() {
    const percent = this.data.quranTarget === 0 
      ? 0 
      : Math.min((this.data.quranRead / this.data.quranTarget) * 100, 100);

    document.getElementById('quranPercent').textContent = Math.round(percent) + '%';

    const circle = document.getElementById('quranCircle');
    if (circle) {
      const radius = 60;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }
  },

  updateProgressBar() {
    const quran = this.data.quranTarget > 0 && this.data.quranRead > 0;
    const puasa = Object.values(this.data.puasa).filter(v => v).length > 0;
    const shalat = Object.values(this.data.shalat).filter(v => v).length === 5;

    let completed = 0;
    if (quran) completed++;
    if (puasa) completed++;
    if (shalat) completed++;

    const percent = (completed / 3) * 100;

    document.getElementById('progressGreen').style.width = percent + '%';
    document.getElementById('progressRed').style.width = (100 - percent) + '%';
    document.getElementById('progressText').textContent = `${completed}/3`;
  },

  loadQuranInputs() {
    document.getElementById('targetPage').value = this.data.quranTarget || '';
    document.getElementById('readPage').value = this.data.quranRead || '';
  },

  setupEvents() {
    document.getElementById('targetPage').addEventListener('input', (e) => {
      this.data.quranTarget = parseInt(e.target.value) || 0;
      this.saveData();
      this.updateQuranCircle();
      this.updateProgressBar();
      this.updateQuranCheckbox();
    });

    document.getElementById('readPage').addEventListener('input', (e) => {
      this.data.quranRead = parseInt(e.target.value) || 0;
      this.saveData();
      this.updateQuranCircle();
      this.updateProgressBar();
      this.updateQuranCheckbox();
    });
  }
};

function saveChecklist() {
  app.saveData();
  const count = Object.values(app.data.puasa).filter(v => v).length;
  app.updateProgressBar();
  app.updatePuasaCheckbox();
  showNotification(`✅ ${count} hari puasa tersimpan!`);
}

function saveShalat() {
  app.saveData();
  app.updateProgressBar();
  app.updateShalatProgress();
  app.renderShalatList();
  showNotification('✅ Shalat tersimpan!');
}

function saveProgress() {
  app.saveData();
  app.updateQuranCircle();
  app.updateProgressBar();
  app.updateQuranCheckbox();
  showNotification('✅ Quran progress tersimpan!');
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.textContent = message;
  notif.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-bold bg-green-500 shadow-lg z-50';
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});