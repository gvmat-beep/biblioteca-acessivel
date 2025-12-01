// Dados dos livros
const books = [
    {
        id: 1,
        title: "Revolução dos Bichos",
        author: "George Orwell",
        cover: "img/ardb.webp",
        pdf: "livros/revolucao-dos-bichos.pdf",
        description: "A história narra a revolta dos animais de uma fazenda contra os humanos, com o objetivo de criar uma sociedade livre e igualitária. Contudo, os porcos, liderados por Napoleão, gradualmente traem os ideais revolucionários e estabelecem uma nova e brutal ditadura, onde se tornam indistinguíveis dos antigos opressores."
    },
    {
        id: 2,
        title: "Pedagogia da Esperança - Um reencontro com a Pedagogia do Oprimido",
        author: "Paulo Freire",
        cover: "img/pf1.jpg",
        pdf: "livros/20190628210617.pdf",
        description: "O livro reafirma a esperança crítica como um ato de práxis (ação e reflexão) contra o fatalismo. Freire defende que a educação deve inspirar a luta ativa para a transformação social, convidando o leitor a 'esperança' – ir em busca da utopia."
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        cover: "img/1984b.jpg",
        pdf: "livros/e-book-1984.pdf",
        description: "Ambientado na Oceânia, o Estado é controlado pelo Grande Irmão e pela vigilância constante. O protagonista, Winston Smith, tenta resistir, mas o livro demonstra o poder do sistema em aniquilar a liberdade individual, manipular a verdade (Duplipensar) e impor o controle absoluto."
    },
    {
        id: 4,
        title: "Pedagogia do Oprimido",
        author: "Paulo Freire",
        cover: "img/pfpo.jpg",
        pdf: "livros/Paulo Freire, 1970. PEDAGOGIA DO OPRIMIDO.pdf",
        description: "O livro critica a Educação Bancária (modelo opressor de depósito de conteúdo) e defende a Educação Problematizadora, que se baseia no diálogo e na conscientização."
    },
    {
        id: 5,
        title: "Ideias para adiar o fim do mundo",
        author: "Ailton Krenak",
        cover: "img/ipsomak.jpg",
        pdf: "livros/Ideias-para-adiar-o-fim-do-mundo-Krenak-Ailton.pdf",
        description: "Krenak argumenta que o 'fim do mundo' é o colapso de nosso modo de vida alienado da natureza. A solução é uma resistência cultural: rejeitar a ideia de uma humanidade única, abraçar a diversidade e retomar o pertencimento à Terra para adiar o colapso e continuar a sonhar."
    },
    {
        id: 6,
        title: "Pedagogia dos Sonhos Possíveis",
        author: "Paulo Freire",
        cover: "img/pfpsp.jpeg",
        pdf: "livros/Pedagogia Dos Sonhos Possíveis Paulo Freire.pdf",
        description: "Seu objetivo é nutrir a imaginação e a curiosidade do aluno, capacitando-o a sonhar e construir 'mundos possíveis' (realidades alternativas)."
    },
    {
        id: 7,
        title: "A terra dá, a terra quer",
        author: "Antônio Bispo dos Santos",
        cover: "img/atdatq.jpg",
        pdf: "livros/Antonio Bispo dos Santos - A terra dá, a terra quer-Ubu Editora (2023).pdf",
        description: "é um ensaio quilombola contra-colonial. O autor critica a lógica capitalista da Bio-concentração (acúmulo) e defende a Bio-interação, que é a forma de vida baseada na reciprocidade e no compartilhamento. O livro ensina que a Terra não é um recurso, mas um parente que exige respeito e troca mútua para a vida continuar."
    },
    {
        id: 8,
        title: "HARRY POTTER e a Câmara Secreta",
        author: "J.K. Rowling",
        cover: "img/hp.jpeg",
        pdf: "livros/harry-potter-e-a-camara-secreta.pdf",
        description: "No segundo ano de Harry em Hogwarts, ele enfrenta novos desafios, incluindo a abertura da Câmara Secreta, que ameaça a segurança dos estudantes. Com a ajuda de seus amigos, Harry desvenda o mistério por trás dos ataques e confronta o monstro que habita a câmara."
    }
];

// Elementos DOM
const booksContainer = document.getElementById('books-container');
const searchInput = document.getElementById('search-input');
const contrastBtn = document.getElementById('contrast-btn');
const fontDecreaseBtn = document.getElementById('font-decrease');
const fontIncreaseBtn = document.getElementById('font-increase');
const audioReaderBtn = document.getElementById('audio-reader');

// Carregar livros
function loadBooks(booksToLoad) {
    booksContainer.innerHTML = '';

    booksToLoad.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'">
                <span style="display: none;">${book.title}</span>
            </div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="book-description" style="font-size: 0.8rem; color: var(--text-m-color); margin-bottom: 10px;">
                ${book.description}
            </div>
            <div class="book-actions">
                <a href="leitor.html?book=${book.id}" class="action-btn read-btn" target="_blank">
                    Leitor Acessível
                </a>
                <a href="${book.pdf}" class="action-btn pdf-btn" target="_blank">
                    PDF Original
                </a>
            </div>
        `;
        booksContainer.appendChild(bookCard);
    });
}

// Controles de acessibilidade
contrastBtn.addEventListener('click', function () {
    document.body.classList.toggle('high-contrast');
    this.textContent = document.body.classList.contains('high-contrast')
        ? 'Contraste Normal'
        : 'Alto Contraste';
});

fontDecreaseBtn.addEventListener('click', function () {
    let currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    if (currentSize > 12) {
        document.body.style.fontSize = (currentSize - 2) + 'px';
    }
});

fontIncreaseBtn.addEventListener('click', function () {
    let currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    if (currentSize < 24) {
        document.body.style.fontSize = (currentSize + 2) + 'px';
    }
});

audioReaderBtn.addEventListener('click', function () {
    const pageText = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(pageText);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
});

// Pesquisa
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
    );
    loadBooks(filteredBooks);
});

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    loadBooks(books);

    // Carregar VLibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = function () {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.head.appendChild(script);

    // Salvar livros no localStorage para o leitor acessar
    localStorage.setItem('libraryBooks', JSON.stringify(books));
});



