async function carregarDados() {
    const response = await fetch('http://localhost:3000/dados');
    const data = await response.json();
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.word}</td><td>${item.en_txt}</td><td>${item.pt_txt}</td>`;
        tbody.appendChild(row);
    });
}

window.onload = carregarDados;
