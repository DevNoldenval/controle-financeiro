const CLIENT_ID = '149224581281-7d5rqr12io40f7rr9mleoit7ttpd1etf.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const SPREADSHEET_ID = '1qhcen9CBgYR0-70-kKt4PG_eQVsxRYGS8GSQiu8cnDY';
const API_URL = 'https://script.google.com/macros/s/AKfycbwLgIiMo4R7aOzfYwkvo9H5OrTjEVP7L4NfyFtCaVmMasShI8Vvu1iyAwB676xlaYD7/exec';

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  });
}

function updateSigninStatus(isSignedIn) {
  document.getElementById('btn-login').style.display = isSignedIn ? 'none' : 'inline-block';
  document.getElementById('btn-logout').style.display = isSignedIn ? 'inline-block' : 'none';
  if (isSignedIn) {
    loadAllData();
  }
}

function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

function loadAllData() {
  fetch(`${API_URL}?sheet=Transacoes`)
    .then((res) => res.json())
    .then((json) => {
      populateTransactions(json.data || []);
      syncPendentes();
    })
    .catch((err) => console.error('Erro ao ler via Apps Script:', err));
}

function appendTransaction(rowArray) {
  return fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'create',
      sheet: 'Transacoes',
      data: rowArray
    })
  }).then((res) => res.json());
}

document.getElementById('lancamentoForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const row = [
    form.data.value,
    form.responsavel.value,
    form.valor.value,
    form.tipo.value,
    form.cartao.value,
    form.parcelas.value || '',
    form.categoria.value,
    form.subcategoria.value,
    form.descricao.value,
    form.fixo.checked ? 'Sim' : 'Não'
  ];

  appendTransaction(row)
    .then((res) => {
      if (res.success) {
        loadAllData();
      } else {
        throw new Error('Falha no append');
      }
    })
    .catch(() => {
      savePendentes(row);
      alert('Sem conexão. Lançamento salvo localmente e será sincronizado depois.');
    });
});

function savePendentes(row) {
  const pend = JSON.parse(localStorage.getItem('pendentes') || '[]');
  pend.push(row);
  localStorage.setItem('pendentes', JSON.stringify(pend));
}

function syncPendentes() {
  const pend = JSON.parse(localStorage.getItem('pendentes') || '[]');
  if (!pend.length) return;
  Promise.all(pend.map((row) => appendTransaction(row)))
    .then(() => {
      localStorage.removeItem('pendentes');
      loadAllData();
    })
    .catch(() => console.warn('Ainda sem conexão para sincronizar pendentes'));
}

function populateTransactions(rows) {
  const filtro = document.getElementById('filtroResponsavel').value;
  const tbody = document.getElementById('transacoesBody');
  tbody.innerHTML = '';
  rows.slice(1).forEach((cols) => {
    const responsavel = cols[1];
    if (filtro && responsavel !== filtro) return;
    const tr = document.createElement('tr');
    cols.forEach((c) => {
      const td = document.createElement('td');
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

window.onload = () => {
  document.getElementById('btn-login').onclick = handleAuthClick;
  document.getElementById('btn-logout').onclick = handleSignoutClick;
  document.getElementById('filtroResponsavel').onchange = loadAllData;
  handleClientLoad();
};
