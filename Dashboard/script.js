// Verificação de acesso ao dashboard
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const access = params.get('access');

    if (access !== 'secret9clicks') {
        window.location.href = '../Cantinho-Mae/index.html'; // Ajuste este caminho conforme a nova estrutura
    }
});

// Código existente do Dashboard/script.js
document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    document.getElementById('refresh-btn').addEventListener('click', refreshData);
    document.getElementById('search-pedidos').addEventListener('input', debounce(filterTable, 300));
});

// Inicializa a funcionalidade da barra lateral
function initSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', function () {
        const isExpanded = sidebar.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// Atualiza dados com chamada à API
async function refreshData() {
    const refreshBtn = document.getElementById('refresh-btn');
    const table = document.getElementById('pedidos-table');
    const spinner = document.querySelector('.loading-spinner');

    refreshBtn.disabled = true;
    table.classList.add('loading');
    if (spinner) spinner.style.display = 'flex';

    try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/dashboard', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Falha ao carregar dados');

        const data = await response.json();

        // Update dashboard metrics
        document.querySelector('.stat-card:nth-child(1) .stat-info p').textContent = `R$ ${(data.salesToday || 1450).toFixed(2)}`;
        document.querySelector('.stat-card:nth-child(2) .stat-info p').textContent = data.newClients || 12;
        document.querySelector('.stat-card:nth-child(3) .stat-info p').textContent = data.newOrders || 24;
        document.querySelector('.stat-card:nth-child(4) .stat-info p').textContent = data.rating || 4.8;

        // Update table
        updateTable(data.orders || []);

        showToast('Dados atualizados com sucesso', 'success');
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        showToast('Erro ao atualizar dados', 'error');
    } finally {
        refreshBtn.disabled = false;
        table.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
    }
}

// Atualiza a tabela de pedidos
function updateTable(orders) {
    const tbody = document.querySelector('#pedidos-table tbody');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id || 'N/A'}</td>
            <td>${order.client || 'N/A'}</td>
            <td>${order.products || 'N/A'}</td>
            <td>${order.date || 'N/A'}</td>
            <td>R$ ${(order.value || 0).toFixed(2)}</td>
            <td><span style="color: var(--${order.statusColor || 'success'}-color)">${order.status || 'N/A'}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Função de debounce para limitar chamadas
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Filtra a tabela com base na busca
function filterTable() {
    const searchTerm = this.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#pedidos-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Exibe notificações toast
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 100);
}