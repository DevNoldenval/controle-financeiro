// Dados simulados para exemplo (substitua pelos seus dados reais)
const transacoes = [
  { data: '2025-09-01', responsavel: 'Você', valor: 3000, tipo: 'receita', categoria: 'Salário', descricao: 'Salário Setembro' },
  { data: '2025-09-05', responsavel: 'Esposa', valor: 500, tipo: 'despesa', categoria: 'Supermercado', descricao: 'Compras semanais' },
  { data: '2025-09-10', responsavel: 'Você', valor: 200, tipo: 'despesa', categoria: 'Transporte', descricao: 'Uber' },
  { data: '2025-09-12', responsavel: 'Você', valor: 150, tipo: 'despesa', categoria: 'Lazer', descricao: 'Cinema' },
  { data: '2025-09-15', responsavel: 'Esposa', valor: 2500, tipo: 'receita', categoria: 'Freelance', descricao: 'Projeto web' },
  { data: '2025-09-20', responsavel: 'Você', valor: 100, tipo: 'despesa', categoria: 'Alimentação', descricao: 'Almoço' },
];

// Preencher filtro de categorias
function populaFiltroCategorias() {
  const filtro = document.getElementById('filterCategory');
  const categorias = [...new Set(transacoes.map(t => t.categoria))];
  filtro.innerHTML = '<option value="">Todas</option>';
  categorias.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    filtro.appendChild(option);
  });
}

// Preencher tabela de transações
function populaTabela(categoria = '') {
  const tbody = document.getElementById('transactionsTableBody');
  tbody.innerHTML = '';
  transacoes
    .filter((t) => !categoria || t.categoria === categoria)
    .forEach((t) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td>${t.data}</td>
      <td>${t.responsavel}</td>
      <td>${t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td>${t.tipo}</td>
      <td>${t.categoria}</td>
      <td>${t.descricao}</td>
    `;
      tbody.appendChild(tr);
    });
}

// Atualizar resumo (saldo, receitas, despesas)
function calculaResumo() {
  let receita = 0,
    despesa = 0;
  transacoes.forEach((t) => {
    if (t.tipo === 'receita') receita += t.valor;
    else despesa += t.valor;
  });
  const saldo = receita - despesa;
  document.getElementById('saldoValue').textContent = saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('receitaValue').textContent = receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('despesaValue').textContent = despesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Gerar gráfico de barras receitas x despesas por mês
function criaGraficoBarras() {
  const ctx = document.getElementById('barChart').getContext('2d');
  // Agrupa por mês
  const meses = {};
  transacoes.forEach((t) => {
    const mes = t.data.substring(0, 7);
    if (!meses[mes]) meses[mes] = { receita: 0, despesa: 0 };
    meses[mes][t.tipo] += t.valor;
  });
  const labels = Object.keys(meses);
  const receitaData = labels.map((m) => meses[m].receita);
  const despesaData = labels.map((m) => meses[m].despesa);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Receita', data: receitaData, backgroundColor: 'rgba(76,175,80,0.7)' },
        { label: 'Despesa', data: despesaData, backgroundColor: 'rgba(244,67,54,0.7)' },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  });
}

// Gerar gráfico de pizza das despesas por categoria
function criaGraficoPizza() {
  const ctx = document.getElementById('pieChart').getContext('2d');
  const somaPorCategoria = {};
  transacoes.forEach((t) => {
    if (t.tipo === 'despesa') somaPorCategoria[t.categoria] = (somaPorCategoria[t.categoria] || 0) + t.valor;
  });
  const labels = Object.keys(somaPorCategoria);
  const data = labels.map((l) => somaPorCategoria[l]);
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{ data, backgroundColor: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1', '#FF7043', '#9E9D24'] }],
    },
    options: { responsive: true },
  });
}

window.onload = () => {
  calculaResumo();
  populaFiltroCategorias();
  populaTabela();
  criaGraficoBarras();
  criaGraficoPizza();
  document.getElementById('filterCategory').addEventListener('change', (e) => populaTabela(e.target.value));
  document.getElementById('btnLogin').addEventListener('click', () => alert('Implementar login Google aqui.'));
};
