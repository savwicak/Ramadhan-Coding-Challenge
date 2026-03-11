async function loadCities() {
  const citySelect = document.getElementById('citySelect');
  
  try {
    const response = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
    const data = await response.json();
    
    console.log(data);
    
    data.data.forEach(city => {
      const option = document.createElement('option');
      option.value = city.id;
      option.textContent = city.lokasi;
      citySelect.appendChild(option);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function loadSchedule(cityId) {
  if (!cityId) return;
  
  const tableSection = document.getElementById('tableSection');
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const tableBody = document.getElementById('tableBody');
  const cityName = document.getElementById('cityName');
  
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');
  tableSection.classList.add('hidden');
  tableBody.innerHTML = '';
  
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    
    const url = `https://api.myquran.com/v2/sholat/jadwal/${cityId}/${year}/${month}`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(data);
    
    if (!data.status) {
      throw new Error('data gk valid');
    }

    cityName.textContent = data.data.lokasi;
    
    //bikin tabel
    const today_iso = new Date().toISOString().split("T")[0];
    
    data.data.jadwal.forEach(item => {
      const row = document.createElement('tr');
      const isToday = item.date === today_iso;
      
      if (isToday) {
        row.classList.add('bg-yellow');
        row.classList.add('text-white');
      }
      
      row.innerHTML = `
        <td class="border-2 border-black p-3 hover:bg-blue/10">${item.tanggal}</td>
        <td class="border-2 border-black p-3 hover:bg-blue/10">${item.imsak}</td>
        <td class="border-2 border-black p-3 hover:bg-blue/10">${item.subuh}</td>
        <td class="border-2 border-black p-3 hover:bg-blue/10">${item.dzuhur}</td>
        <td class="border-2 border-black p-3 hover:bg-blue/10">${item.ashar}</td>
        <td class="border-2 border-black p-3 hover:bg-blue/10">${item.maghrib}</td>
        <td class="border-2 border-black p-3 hover:bg-blue/10">${item.isya}</td>
      `;
      
      tableBody.appendChild(row);
    });
    
    loadingState.classList.add('hidden');
    tableSection.classList.remove('hidden');
    
  } catch (error) {
    console.error('Error:', error);
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadCities();
  
  document.getElementById('citySelect').addEventListener('change', (e) => {
    loadSchedule(e.target.value);
  });
});