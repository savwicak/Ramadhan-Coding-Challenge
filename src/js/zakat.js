const zakatType = document.getElementById('zakatType');
const formSection = document.getElementById('formSection');

const zakatForms = {
    emas: {
        title: 'Zakat Emas',
        fields: [
            { label: 'Berat Emas (gram)', type: 'number', id: 'berat', placeholder: '100 g' },
            { label: 'Harga Emas per gram (Rp)', type: 'number', id: 'harga', placeholder: 'Rp 600.000' }
        ],
        nisab: 85,
        calculation: (data) => {
            const totalValue = data.berat * data.harga;
            const nisabValue = zakatForms.emas.nisab * data.harga;
            if (totalValue < nisabValue) {
                return { 
                    zakat: 0, 
                    message: 'Belum wajib zakat (belum mencapai nisab)',
                    status: 'warning',
                    totalValue,
                    nisabValue
                };
            }
            return { 
                zakat: totalValue * 0.025, 
                message: 'Sudah wajib zakat',
                status: 'success',
                totalValue,
                nisabValue
            };
        }
    },
    penghasilan: {
        title: 'Zakat Penghasilan',
        fields: [
            { label: 'Gaji Bulanan (Rp)', type: 'number', id: 'gaji', placeholder: 'Rp 10.000.000' },
            { label: 'Penghasilan Lain (Rp)', type: 'number', id: 'lainnya', placeholder: 'Rp 5.000.000' },
            { label: 'Harga Emas per gram (Rp)', type: 'number', id: 'harga', placeholder: 'Rp 600.000' }
        ],
        nisab: 85,
        calculation: (data) => {
            const total = data.gaji + data.lainnya;
            const nisabValue = zakatForms.penghasilan.nisab * data.harga;

            if (total < nisabValue) {
                return { 
                    zakat: 0, 
                    message: 'Belum wajib zakat (belum mencapai nisab)',
                    status: 'warning',
                    totalValue: total,
                    nisabValue
                };
            }

            const zakat = total * 0.025;
            return { 
                zakat,
                message: 'Sudah wajib zakat',
                status: 'success',
                totalValue: total,
                nisabValue
            };
        }
    },
};

function renderForm(type) {
    const form = zakatForms[type];
    
    let html = `
        <h2 class="text-2xl font-bold font-header text-black mb-6">${form.title}</h2>
        <div class="space-y-4">
    `;
    
    form.fields.forEach(field => {
        html += `
            <div>
                <label class="block text-lg font-bold mb-2 text-blue">${field.label}</label>
                <input 
                    type="${field.type}" 
                    id="${field.id}"
                    placeholder="${field.placeholder}"
                    class="w-full px-4 py-3 border-2 border-blue rounded-lg focus:outline-none focus:border-green text-lg"
                >
            </div>
        `;
    });
    
    html += `
        <button 
            onclick="calculateZakat('${type}')"
            class="w-full bg-blue text-white py-3 rounded-lg font-bold text-lg hover:bg-blue/80 transition mt-6"
        >
            Hitung Zakat
        </button>
        <div id="result" class="mt-6 p-6 bg-green/70 text-white rounded-2xl text-center hidden">
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p class="text-sm mb-1">Nilai Total</p>
                    <p id="nilaiTotal" class="text-xl font-relation">Rp 0</p>
                </div>
                <div>
                    <p class="text-sm mb-1">Nilai Nisab</p>
                    <p id="nilaiNisab" class="text-xl font-relation">Rp 0</p>
                </div>
            </div>
            <div class="bg-white/20 p-4 rounded-lg mb-4">
                <p class="text-sm mb-2">Jumlah Zakat (2.5%)</p>
                <p id="zakatAmount" class="text-4xl font-relation">Rp 0</p>
            </div>
            <div id="statusMsg" class="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm font-bold"></div>
        </div>
    </div>
    `;
    
    formSection.innerHTML = html;
}

function calculateZakat(type) {
    const form = zakatForms[type];
    const data = {};
    
    form.fields.forEach(field => {
        const value = document.getElementById(field.id).value;
        data[field.id] = parseFloat(value) || 0;
    });
    
    const result = form.calculation(data);
    const resultDiv = document.getElementById('result');
    
    document.getElementById('nilaiTotal').textContent = `Rp ${result.totalValue.toLocaleString('id-ID')}`;
    document.getElementById('nilaiNisab').textContent = `Rp ${result.nisabValue.toLocaleString('id-ID')}`;
    document.getElementById('zakatAmount').textContent = `Rp ${Math.round(result.zakat).toLocaleString('id-ID')}`;
    
    const statusMsg = document.getElementById('statusMsg');
    if (result.status === 'success') {
        statusMsg.innerHTML = '✅ ' + result.message;
        statusMsg.className = 'bg-green-100 text-green-800 p-3 rounded-lg text-lg font-bold';
    } else {
        statusMsg.innerHTML = '⏳ ' + result.message;
        statusMsg.className = 'bg-yellow-100 text-yellow-800 p-3 rounded-lg text-lg font-bold';
    }
    
    resultDiv.classList.remove('hidden');
}

function formatRupiah(input) {
    input.addEventListener("input", function () {

        let value = this.value.replace(/\D/g, "");

        if (value === "") {
            this.value = "";
            return;
        }

        this.value = Number(value).toLocaleString("id-ID");
    });
}

zakatType.addEventListener('change', (e) => {
    renderForm(e.target.value);
});

renderForm('emas');