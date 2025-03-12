let paginaAtual = 0;
const registrosPorPagina = 5;
let totalRegistros = 0;

async function carregarDados() {
    try {
        const response = await fetch(`/api/palavras?pagina=${paginaAtual}&limite=${registrosPorPagina}`);
        const dados = await response.json();
        
        totalRegistros = dados.total;
        
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        
        // Adiciona os registros da página atual
        dados.palavras.forEach(registro => {
            const row = `
                <tr>
                    <td>${registro.id}</td>
                    <td>${registro.en_txt}</td>
                    <td>${registro.pt_txt}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
        
        // Atualiza o CLI com a informação da página atual
        const cliOutput = document.getElementById('cli-output');
        cliOutput.innerHTML = `
            <p> Bem-vindo ao sistema de aprendizado interativo!</p>
            <p> Palavra ${dados.palavras[0].id}-${dados.palavras[dados.palavras.length - 1].id} de ${totalRegistros}</p>
        `;
        // Atualiza o estado dos botões
        atualizarBotoes();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        document.getElementById('cli-output').innerHTML += `
            <p style="color: red">> Erro ao carregar dados: ${error.message}</p>
        `;
    }
}

function atualizarBotoes() {
    const btnAnterior = document.querySelector('button[onclick="prevPage()"]');
    const btnProximo = document.querySelector('button[onclick="nextPage()"]');
    
    btnAnterior.disabled = paginaAtual === 0;
    btnProximo.disabled = (paginaAtual + 1) * registrosPorPagina >= totalRegistros;
}

async function nextPage() {
    if (paginaAtual < totalRegistros - 1) {
        paginaAtual++;
        await carregarDados();
    }
}

async function prevPage() {
    if (paginaAtual > 0) {
        paginaAtual--;
        await carregarDados();
    }
}

// Inicializa a tabela quando a página carregar
window.onload = carregarDados;