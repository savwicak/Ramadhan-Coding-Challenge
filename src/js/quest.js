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
    this.render();
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
  }
};

//tampilin updatan
function render() {
  app.updateDate();
  app.renderPuasa();
  app.renderShalat();
  app.loadQuranInputs();
  app.updateAll();
}

app.updateDate = function() {
  const today = new Date();
  const ramadhanStart = new Date(2026, 1, 19); 
  //langsung detik per hari
  const dayNum = Math.floor((today - ramadhanStart) / 86400000) + 1;

  document.getElementById('dayNumber').textContent = dayNum;
  document.getElementById('dateDisplay').textContent = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

app.renderPuasa = function() {
  const grid = document.getElementById('checklistGrid');
  grid.innerHTML = '';

  for (let i = 1; i <= 30; i++) {
    const isDone = this.data.puasa[`day-${i}`] || false;
    
    const box = document.createElement('div');
    box.textContent = i;
    box.className = `
      w-full h-14 flex items-center justify-center 
      border-2 rounded-lg cursor-pointer font-bold text-lg
      transition-all duration-300 transform hover:scale-90
      ${isDone 
        ? 'bg-green/80 text-white border-green/10 shadow-lg' 
        : 'bg-white text-gray-700 border-gray-300 hover:border-green/60 hover:shadow-md'
      }
    `;
    
    box.onclick = () => {
      this.data.puasa[`day-${i}`] = !this.data.puasa[`day-${i}`];
      this.saveData();
      this.renderPuasa();
      this.updateAll();
    };

    grid.appendChild(box);
  }
};

app.renderShalat = function() {
  const items = document.querySelectorAll('.shalat-item');

  items.forEach((item, idx) => {
    const name = this.shalatNames[idx];
    const isDone = this.data.shalat[name] || false;
    const checkbox = item.querySelector('.shalat-checkbox');

    checkbox.checked = isDone;
    item.classList.toggle('bg-green/80', isDone);
    item.classList.toggle('bg-gray-400', !isDone);

    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);

    newItem.onclick = () => {
      this.data.shalat[name] = !this.data.shalat[name];
      this.saveData();
      this.renderShalat();
      this.updateAll();
    };
  });
};

app.loadQuranInputs = function() {
  document.getElementById('targetPage').value = this.data.quranTarget || '';
  document.getElementById('readPage').value = this.data.quranRead || '';
};

//renew ui
app.updateAll = function() {
  this.updateProgress();
  this.updateQuran();
  this.updateCheckboxes();
};

app.updateProgress = function() {
  const quranDone = this.data.quranTarget > 0 && this.data.quranRead > 0;
  const puasaDone = Object.values(this.data.puasa).some(v => v);
  const shalatDone = Object.values(this.data.shalat).filter(v => v).length === 5;

  let completed = 0;
  if (quranDone) completed++;
  if (puasaDone) completed++;
  if (shalatDone) completed++;

  const percent = (completed / 3) * 100;

  document.getElementById('progressGreen').style.width = percent + '%';
  document.getElementById('progressRed').style.width = (100 - percent) + '%';
  document.getElementById('progressText').textContent = `${completed}/3`;
};

app.updateQuran = function() {
  const percent = this.data.quranTarget === 0 
    ? 0 
    : Math.min((this.data.quranRead / this.data.quranTarget) * 100, 100);

  document.getElementById('quranPercent').textContent = Math.round(percent) + '%';

  const circle = document.getElementById('quranCircle');
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  //update shalat progress
  const shalatCount = Object.values(this.data.shalat).filter(v => v).length;
  const shalatPercent = (shalatCount / 5) * 100;
  document.getElementById('shalatBar').style.width = shalatPercent + '%';
  document.getElementById('shalatText').textContent = `${shalatCount}/5`;
};

app.updateCheckboxes = function() {
  const quranDone = this.data.quranTarget > 0 && this.data.quranRead > 0;
  const puasaCount = Object.values(this.data.puasa).filter(v => v).length;
  const shalatCount = Object.values(this.data.shalat).filter(v => v).length;

  document.getElementById('quranCheck').checked = quranDone;
  document.getElementById('puasaCheck').checked = puasaCount > 0;
  document.getElementById('shalatCheck').checked = shalatCount === 5;
};



app.setupEvents = function() {
  document.getElementById('targetPage').addEventListener('input', (e) => {
    this.data.quranTarget = parseInt(e.target.value) || 0;
    this.saveData();
    this.updateAll();
  });

  document.getElementById('readPage').addEventListener('input', (e) => {
    this.data.quranRead = parseInt(e.target.value) || 0;
    this.saveData();
    this.updateAll();
  });
};

//save progress
function saveChecklist() {
  app.saveData();
  const count = Object.values(app.data.puasa).filter(v => v).length;
  showNotif(`${count} hari puasa tersimpan!`);
}

function saveShalat() {
  app.saveData();
  showNotif('Shalat tersimpan!');
}

function saveProgress() {
  app.saveData();
  showNotif('Quran progress tersimpan!');
}

function showNotif(msg) {
  const notif = document.createElement('div');
  notif.textContent = msg;
  notif.className = 'fixed top-4 right-4 px-6 py-3 bg-greens text-white rounded-lg font-bold shadow-lg z-50';
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2000);
}

app.render = render;
document.addEventListener('DOMContentLoaded', () => app.init());