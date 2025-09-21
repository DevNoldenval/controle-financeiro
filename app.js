// Dados da aplicação
let appData = {
  "usuarios": [
    {"id": 1, "nome": "João Silva", "apelido": "João", "ativo": true},
    {"id": 2, "nome": "Maria Silva", "apelido": "Maria", "ativo": true}
  ],
  "categorias": [
    {"nome": "Casa", "tipo": "despesa", "icon": "🏠", "color": "#3B82F6"},
    {"nome": "Alimentação", "tipo": "despesa", "icon": "🍽️", "color": "#10B981"},
    {"nome": "Transporte", "tipo": "despesa", "icon": "🚗", "color": "#F59E0B"},
    {"nome": "Saúde", "tipo": "despesa", "icon": "🏥", "color": "#EF4444"},
    {"nome": "Lazer", "tipo": "despesa", "icon": "🎉", "color": "#8B5CF6"},
    {"nome": "Salário", "tipo": "receita", "icon": "💰", "color": "#22C55E"},
    {"nome": "Comissão", "tipo": "receita", "icon": "📈", "color": "#06B6D4"},
    {"nome": "Vendas", "tipo": "receita", "icon": "🛍️", "color": "#EC4899"},
    {"nome": "Extras", "tipo": "both", "icon": "⭐", "color": "#64748B"}
  ],
  "cartoes": [
    {
      "id": 1,
      "nome": "Nubank Roxinho",
      "ultimos_digitos": "1234",
      "tipo": "crédito",
      "limite": 5000,
      "dia_vencimento": 15,
      "data_boa": 8,
      "ativo": true,
      "fatura_atual": 1200,
      "cor": "#8A05BE"
    },
    {
      "id": 2,
      "nome": "Itaú Débito",
      "ultimos_digitos": "5678",
      "tipo": "débito",
      "limite": 0,
      "dia_vencimento": 0,
      "data_boa": 0,
      "ativo": true,
      "fatura_atual": 0,
      "cor": "#FF6600"
    }
  ],
  "transacoes": [
    {
      "id": 1,
      "data": "2025-01-15",
      "tipo": "receita",
      "valor": 5000,
      "categoria": "Salário",
      "descricao": "Salário Janeiro",
      "forma_pagamento": "PIX",
      "usuario": "João",
      "cartao": null,
      "parcelas": 1,
      "parcela_atual": 1
    },
    {
      "id": 2,
      "data": "2025-01-10",
      "tipo": "despesa",
      "valor": 300,
      "categoria": "Alimentação",
      "descricao": "Supermercado",
      "forma_pagamento": "crédito",
      "usuario": "Maria",
      "cartao": "Nubank Roxinho",
      "parcelas": 1,
      "parcela_atual": 1
    },
    {
      "id": 3,
      "data": "2025-01-08",
      "tipo": "despesa",
      "valor": 1200,
      "categoria": "Casa",
      "descricao": "Smart TV 55 polegadas",
      "forma_pagamento": "crédito",
      "usuario": "João",
      "cartao": "Nubank Roxinho",
      "parcelas": 12,
      "parcela_atual": 1
    },
    {
      "id": 4,
      "data": "2025-01-12",
      "tipo": "despesa",
      "valor": 150,
      "categoria": "Transporte",
      "descricao": "Combustível",
      "forma_pagamento": "débito",
      "usuario": "João",
      "cartao": "Itaú Débito",
      "parcelas": 1,
      "parcela_atual": 1
    },
    {
      "id": 5,
      "data": "2025-01-05",
      "tipo": "despesa",
      "valor": 80,
      "categoria": "Lazer",
      "descricao": "Cinema",
      "forma_pagamento": "crédito",
      "usuario": "Maria",
      "cartao": "Nubank Roxinho",
      "parcelas": 1,
      "parcela_atual": 1
    }
  ]
};

// Estado da aplicação
let currentUser = null;
let currentSection = 'dashboard';
let charts = {};

// Configurações
const config = {
  googleClientId: "149224581281-7d5rqr12io40f7rr9mleoit7ttpd1etf.apps.googleusercontent.com",
  appsScriptUrl: "https://script.google.com/macros/s/AKfycby9HwziQxRIeLdbu15YMwrbANQHvy6Hp3SQv9_BSpFqULc6CEgaCTcsm4MrTDrOyzPw/exec"
};

// Função para mostrar overlay de carregamento de forma segura
function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('show');
  }
}

// Função para esconder overlay de carregamento de forma segura
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    
    // Simular carregamento e auto-login para demonstração
    setTimeout(() => {
        simulateAutoLogin();
    }, 1500);
}

function simulateAutoLogin() {
    // Simular dados do usuário
    currentUser = {
        id: 'demo-user',
        name: 'João Silva',
        email: 'joao@exemplo.com',
        picture: 'https://ui-avatars.com/api/?name=Joao+Silva&background=8A05BE&color=fff&size=32'
    };
    
    hideLoading();
    showApp();
    updateUserInfo();
    loadDashboard();
}

function setupEventListeners() {
    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            navigateToSection(section);
        });
    });
    
    // Forms
    document.getElementById('lancamentoForm').addEventListener('submit', handleLancamentoSubmit);
    document.getElementById('cartaoForm').addEventListener('submit', handleCartaoSubmit);
    document.getElementById('usuarioForm').addEventListener('submit', handleUsuarioSubmit);
    
    // Form interactions
    document.querySelectorAll('input[name="tipo"]').forEach(radio => {
        radio.addEventListener('change', updateCategoriasByTipo);
    });
    
    document.getElementById('formaPagamentoSelect').addEventListener('change', toggleCartaoSection);
    document.querySelectorAll('input[name="parcelas_tipo"]').forEach(radio => {
        radio.addEventListener('change', toggleParcelasSection);
    });
    
    document.getElementById('parcelasSlider').addEventListener('input', updateParcelasInfo);
    document.querySelector('input[name="valor"]').addEventListener('input', updateParcelasInfo);
    
    // Search
    document.getElementById('searchTransacoes').addEventListener('input', filterTransactions);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// Autenticação Google
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    
    currentUser = {
        id: responsePayload.sub,
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    };
    
    hideLoading();
    showApp();
    updateUserInfo();
    loadDashboard();
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function checkAuthState() {
    // Verificar se há um usuário logado (simulação)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        hideLoading();
        showApp();
        updateUserInfo();
        loadDashboard();
    } else {
        hideLoading();
        showLoginModal();
    }
}

function showApp() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('header').style.display = 'block';
    document.getElementById('sidebar').style.display = 'block';
    document.getElementById('mainContent').style.display = 'block';
    
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('header').style.display = 'none';
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name || 'Usuário';
        document.getElementById('userAvatar').src = currentUser.picture || '';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginModal();
}

// Navegação
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('sidebar-open');
}

function navigateToSection(sectionName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Update active section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
    currentSection = sectionName;
    
    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'lancamentos':
            loadLancamentos();
            break;
        case 'cartoes':
            loadCartoes();
            break;
        case 'usuarios':
            loadUsuarios();
            break;
    }
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('mainContent').classList.remove('sidebar-open');
    }
}

// Dashboard
function loadDashboard() {
    updateSummaryCards();
    setTimeout(() => {
        loadCharts();
    }, 100);
    loadUltimasTransacoes();
}

function updateSummaryCards() {
    const receitas = appData.transacoes
        .filter(t => t.tipo === 'receita')
        .reduce((sum, t) => sum + t.valor, 0);
    
    const despesas = appData.transacoes
        .filter(t => t.tipo === 'despesa')
        .reduce((sum, t) => sum + t.valor, 0);
    
    const saldo = receitas - despesas;
    
    document.getElementById('saldoTotal').textContent = formatCurrency(saldo);
    document.getElementById('receitasTotal').textContent = formatCurrency(receitas);
    document.getElementById('despesasTotal').textContent = formatCurrency(despesas);
}

function loadCharts() {
    loadReceitaDespesaChart();
    loadCategoriaChart();
}

function loadReceitaDespesaChart() {
    const ctx = document.getElementById('receitaDespesaChart').getContext('2d');
    
    if (charts.receitaDespesa) {
        charts.receitaDespesa.destroy();
    }
    
    const monthlyData = getMonthlyData();
    
    charts.receitaDespesa = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan'],
            datasets: [{
                label: 'Receitas',
                data: monthlyData.receitas,
                backgroundColor: '#1FB8CD',
                borderRadius: 6
            }, {
                label: 'Despesas',
                data: monthlyData.despesas,
                backgroundColor: '#FFC185',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

function loadCategoriaChart() {
    const ctx = document.getElementById('categoriaChart').getContext('2d');
    
    if (charts.categoria) {
        charts.categoria.destroy();
    }
    
    const categoriaData = getCategoriaData();
    
    charts.categoria = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoriaData.labels,
            datasets: [{
                data: categoriaData.values,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function getMonthlyData() {
    // Dados simulados para os últimos 6 meses
    return {
        receitas: [4500, 4800, 5200, 4900, 5100, 5000],
        despesas: [3200, 2800, 3500, 3100, 2900, 1730]
    };
}

function getCategoriaData() {
    const despesas = appData.transacoes.filter(t => t.tipo === 'despesa');
    const categorias = {};
    
    despesas.forEach(transacao => {
        if (!categorias[transacao.categoria]) {
            categorias[transacao.categoria] = 0;
        }
        categorias[transacao.categoria] += transacao.valor;
    });
    
    return {
        labels: Object.keys(categorias),
        values: Object.values(categorias)
    };
}

function loadUltimasTransacoes() {
    const container = document.getElementById('ultimasTransacoes');
    const ultimasTransacoes = appData.transacoes
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5);
    
    container.innerHTML = '';
    
    ultimasTransacoes.forEach(transacao => {
        const categoria = appData.categorias.find(c => c.nome === transacao.categoria);
        const transactionItem = createTransactionItem(transacao, categoria);
        container.appendChild(transactionItem);
    });
}

function createTransactionItem(transacao, categoria) {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    
    const parcelas = transacao.parcelas > 1 ? ` (${transacao.parcela_atual}/${transacao.parcelas})` : '';
    
    item.innerHTML = `
        <div class="transaction-icon" style="background-color: ${categoria?.color}">
            ${categoria?.icon || '💰'}
        </div>
        <div class="transaction-info">
            <h4>${transacao.descricao}${parcelas}</h4>
            <div class="transaction-meta">
                <span>${transacao.categoria}</span>
                <span>•</span>
                <span>${transacao.usuario}</span>
                ${transacao.cartao ? `<span>• ${transacao.cartao}</span>` : ''}
            </div>
        </div>
        <div class="transaction-value">
            <div class="transaction-amount ${transacao.tipo}">
                ${transacao.tipo === 'receita' ? '+' : '-'} ${formatCurrency(transacao.valor)}
            </div>
            <div class="transaction-date">${formatDate(transacao.data)}</div>
        </div>
    `;
    
    return item;
}

// Lançamentos
function loadLancamentos() {
    populateSelects();
    loadAllTransactions();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('input[name="data"]').value = today;
}

function populateSelects() {
    populateCategoriaSelect();
    populateUsuarioSelect();
    populateCartaoSelect();
}

function populateCategoriaSelect() {
    const select = document.getElementById('categoriaSelect');
    const tipoSelecionado = document.querySelector('input[name="tipo"]:checked').value;
    
    select.innerHTML = '<option value="">Selecione uma categoria</option>';
    
    appData.categorias
        .filter(categoria => categoria.tipo === tipoSelecionado || categoria.tipo === 'both')
        .forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.nome;
            option.textContent = `${categoria.icon} ${categoria.nome}`;
            select.appendChild(option);
        });
}

function populateUsuarioSelect() {
    const select = document.getElementById('usuarioSelect');
    select.innerHTML = '<option value="">Selecione um usuário</option>';
    
    appData.usuarios
        .filter(usuario => usuario.ativo)
        .forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.apelido;
            option.textContent = usuario.nome;
            select.appendChild(option);
        });
}

function populateCartaoSelect() {
    const select = document.getElementById('cartaoSelect');
    select.innerHTML = '<option value="">Selecione um cartão</option>';
    
    appData.cartoes
        .filter(cartao => cartao.ativo && cartao.tipo === 'crédito')
        .forEach(cartao => {
            const option = document.createElement('option');
            option.value = cartao.nome;
            option.textContent = `${cartao.nome} (••••${cartao.ultimos_digitos})`;
            select.appendChild(option);
        });
}

function updateCategoriasByTipo() {
    populateCategoriaSelect();
}

function toggleCartaoSection() {
    const formaPagamento = document.getElementById('formaPagamentoSelect').value;
    const cartaoSection = document.getElementById('cartaoSection');
    
    if (formaPagamento === 'crédito') {
        cartaoSection.style.display = 'block';
    } else {
        cartaoSection.style.display = 'none';
    }
}

function toggleParcelasSection() {
    const parcelasTipo = document.querySelector('input[name="parcelas_tipo"]:checked').value;
    const parcelasSection = document.getElementById('parcelasSection');
    
    if (parcelasTipo === 'parcelado') {
        parcelasSection.style.display = 'block';
        updateParcelasInfo();
    } else {
        parcelasSection.style.display = 'none';
    }
}

function updateParcelasInfo() {
    const parcelas = document.getElementById('parcelasSlider').value;
    const valor = parseFloat(document.querySelector('input[name="valor"]').value) || 0;
    const valorParcela = valor / parcelas;
    
    document.getElementById('parcelasValue').textContent = `${parcelas}x`;
    document.getElementById('valorParcela').textContent = formatCurrency(valorParcela);
}

function handleLancamentoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!data.data || !data.valor || !data.categoria || !data.usuario || !data.forma_pagamento) {
        showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Validate card selection for credit
    if (data.forma_pagamento === 'crédito' && !data.cartao) {
        showToast('Selecione um cartão para pagamento no crédito.', 'error');
        return;
    }
    
    const newTransaction = {
        id: Date.now(),
        data: data.data,
        tipo: data.tipo,
        valor: parseFloat(data.valor),
        categoria: data.categoria,
        descricao: data.descricao || '',
        forma_pagamento: data.forma_pagamento,
        usuario: data.usuario,
        cartao: data.cartao || null,
        parcelas: data.parcelas_tipo === 'parcelado' ? parseInt(document.getElementById('parcelasSlider').value) : 1,
        parcela_atual: 1
    };
    
    appData.transacoes.push(newTransaction);
    
    // Generate installments if needed
    if (newTransaction.parcelas > 1) {
        generateInstallments(newTransaction);
    }
    
    showToast('Lançamento cadastrado com sucesso!');
    e.target.reset();
    
    // Reset form state
    document.getElementById('cartaoSection').style.display = 'none';
    document.getElementById('parcelasSection').style.display = 'none';
    document.querySelector('input[value="receita"]').checked = true;
    populateCategoriaSelect();
    
    loadAllTransactions();
    updateSummaryCards();
}

function generateInstallments(baseTransaction) {
    const valorParcela = baseTransaction.valor / baseTransaction.parcelas;
    const cartao = appData.cartoes.find(c => c.nome === baseTransaction.cartao);
    
    for (let i = 2; i <= baseTransaction.parcelas; i++) {
        const dataVencimento = calculateNextPaymentDate(baseTransaction.data, i - 1, cartao.data_boa);
        
        const installment = {
            ...baseTransaction,
            id: Date.now() + i,
            data: dataVencimento,
            valor: valorParcela,
            parcela_atual: i,
            descricao: `${baseTransaction.descricao} (${i}/${baseTransaction.parcelas})`
        };
        
        appData.transacoes.push(installment);
    }
    
    // Update base transaction
    baseTransaction.valor = valorParcela;
    baseTransaction.descricao = `${baseTransaction.descricao} (1/${baseTransaction.parcelas})`;
}

function calculateNextPaymentDate(baseDate, monthsToAdd, dataBoa) {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    date.setDate(dataBoa);
    return date.toISOString().split('T')[0];
}

function loadAllTransactions() {
    const container = document.getElementById('todasTransacoes');
    const allTransactions = [...appData.transacoes]
        .sort((a, b) => new Date(b.data) - new Date(a.data));
    
    container.innerHTML = '';
    
    allTransactions.forEach(transacao => {
        const categoria = appData.categorias.find(c => c.nome === transacao.categoria);
        const transactionItem = createTransactionItem(transacao, categoria);
        container.appendChild(transactionItem);
    });
}

function filterTransactions() {
    const searchTerm = document.getElementById('searchTransacoes').value.toLowerCase();
    const items = document.querySelectorAll('#todasTransacoes .transaction-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Cartões
function loadCartoes() {
    const container = document.getElementById('cartoesGrid');
    container.innerHTML = '';
    
    appData.cartoes
        .filter(cartao => cartao.ativo)
        .forEach(cartao => {
            const cartaoElement = createCartaoElement(cartao);
            container.appendChild(cartaoElement);
        });
}

function createCartaoElement(cartao) {
    const div = document.createElement('div');
    div.className = 'cartao-visual';
    div.style.background = `linear-gradient(135deg, ${cartao.cor} 0%, ${adjustColor(cartao.cor, -20)} 100%)`;
    
    const disponivel = cartao.tipo === 'crédito' ? cartao.limite - cartao.fatura_atual : 0;
    const percentualUsado = cartao.tipo === 'crédito' ? (cartao.fatura_atual / cartao.limite) * 100 : 0;
    
    div.innerHTML = `
        <div class="cartao-header">
            <h3 class="cartao-nome">${cartao.nome}</h3>
            <div class="cartao-tipo">${cartao.tipo}</div>
        </div>
        <div class="cartao-numero">•••• •••• •••• ${cartao.ultimos_digitos}</div>
        ${cartao.tipo === 'crédito' ? `
            <div class="cartao-limite">
                <div>Limite: ${formatCurrency(cartao.limite)}</div>
                <div class="limite-bar">
                    <div class="limite-progress" style="width: ${percentualUsado}%"></div>
                </div>
                <div>Disponível: ${formatCurrency(disponivel)}</div>
            </div>
        ` : ''}
        <div class="cartao-info">
            ${cartao.dia_vencimento > 0 ? `<span>Vence: ${cartao.dia_vencimento}</span>` : '<span>Débito</span>'}
            ${cartao.data_boa > 0 ? `<span>Data boa: ${cartao.data_boa}</span>` : ''}
        </div>
    `;
    
    return div;
}

function handleCartaoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const newCard = {
        id: Date.now(),
        nome: data.nome,
        ultimos_digitos: data.ultimos_digitos,
        tipo: data.tipo,
        limite: parseFloat(data.limite) || 0,
        dia_vencimento: parseInt(data.dia_vencimento) || 0,
        data_boa: parseInt(data.data_boa) || 0,
        ativo: true,
        fatura_atual: 0,
        cor: getRandomCardColor()
    };
    
    appData.cartoes.push(newCard);
    
    showToast('Cartão adicionado com sucesso!');
    e.target.reset();
    loadCartoes();
    populateCartaoSelect();
}

function getRandomCardColor() {
    const colors = ['#8A05BE', '#FF6600', '#22C55E', '#EF4444', '#3B82F6', '#8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Usuários
function loadUsuarios() {
    const container = document.getElementById('usuariosGrid');
    container.innerHTML = '';
    
    appData.usuarios
        .filter(usuario => usuario.ativo)
        .forEach(usuario => {
            const usuarioElement = createUsuarioElement(usuario);
            container.appendChild(usuarioElement);
        });
}

function createUsuarioElement(usuario) {
    const div = document.createElement('div');
    div.className = 'usuario-card';
    
    const inicial = usuario.nome.charAt(0).toUpperCase();
    
    div.innerHTML = `
        <div class="usuario-avatar">${inicial}</div>
        <h3 class="usuario-nome">${usuario.nome}</h3>
        <p class="usuario-apelido">@${usuario.apelido}</p>
        <div class="usuario-status ativo">Ativo</div>
    `;
    
    return div;
}

function handleUsuarioSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const newUser = {
        id: Date.now(),
        nome: data.nome,
        apelido: data.apelido,
        ativo: true
    };
    
    appData.usuarios.push(newUser);
    
    showToast('Usuário adicionado com sucesso!');
    e.target.reset();
    loadUsuarios();
    populateUsuarioSelect();
}

// Utility Functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function adjustColor(color, amount) {
    const usePound = color[0] === "#";
    const col = usePound ? color.slice(1) : color;
    
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    
    return (usePound ? "#" : "") + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}
