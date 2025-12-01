// Configurar PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Elementos DOM
const readerTitle = document.getElementById('reader-title');
const accessibleContent = document.getElementById('accessible-content');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const readerContrastBtn = document.getElementById('reader-contrast');
const readerFontDecreaseBtn = document.getElementById('reader-font-decrease');
const readerFontIncreaseBtn = document.getElementById('reader-font-increase');
const readerAudioBtn = document.getElementById('reader-audio');
const librasInfoBtn = document.getElementById('libras-info');
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const closeAudioBtn = document.getElementById('close-audio');

// Variáveis globais
let currentBook = null;
let currentPdfPages = [];
let currentPage = 1;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isPlaying = false;

// Inicializar leitor
async function initializeReader() {
    // Obter parâmetro da URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('book'));
    
    if (!bookId) {
        showError('Livro não especificado.');
        return;
    }
    
    // Carregar dados do livro
    const books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
    currentBook = books.find(book => book.id === bookId);
    
    if (!currentBook) {
        showError('Livro não encontrado.');
        return;
    }
    
    readerTitle.textContent = currentBook.title;
    await loadBookContent();
}

// Carregar conteúdo do livro
async function loadBookContent() {
    try {
        accessibleContent.innerHTML = '<div class="loading">Extraindo texto do PDF...</div>';
        
        const pdfText = await extractTextFromPDF(currentBook.pdf);
        displayPage(1);
        
    } catch (error) {
        console.error('Erro ao carregar livro:', error);
        showError(`Erro ao carregar o livro: ${error.message}`);
    }
}

// Extrair texto do PDF
async function extractTextFromPDF(pdfUrl) {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    
    currentPdfPages = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        
        currentPdfPages.push({
            pageNumber: i,
            content: pageText
        });
    }
    
    return 'Conteúdo extraído com sucesso';
}

// Mostrar página específica
function displayPage(pageNumber) {
    if (currentPdfPages.length === 0) {
        showError('Nenhuma página carregada.');
        return;
    }
    
    currentPage = Math.max(1, Math.min(pageNumber, currentPdfPages.length));
    const page = currentPdfPages[currentPage - 1];
    
    // Formatar conteúdo
    const paragraphs = page.content
        .split('. ')
        .filter(sentence => sentence.trim().length > 10)
        .map(sentence => `<p class="readable-text">${sentence.trim()}.</p>`)
        .join('');
    
    accessibleContent.innerHTML = paragraphs || '<p class="readable-text">' + page.content + '</p>';
    pageInfo.textContent = `Página ${currentPage} de ${currentPdfPages.length}`;
    
    // Atualizar navegação
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === currentPdfPages.length;
}

// Mostrar erro
function showError(message) {
    accessibleContent.innerHTML = `
        <div class="error-message">
            <h3>Erro</h3>
            <p>${message}</p>
            <a href="index.html" class="reader-control-btn">Voltar à Biblioteca</a>
        </div>
    `;
}

// Reproduzir áudio da página
function playCurrentPageAudio() {
    if (currentPdfPages.length === 0 || currentPage < 1) return;
    
    const page = currentPdfPages[currentPage - 1];
    const textToRead = `Página ${currentPage} de ${currentBook.title}. ${page.content}`;
    
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    currentUtterance = new SpeechSynthesisUtterance(textToRead);
    currentUtterance.lang = 'pt-BR';
    currentUtterance.rate = 0.9;
    
    currentUtterance.onstart = function() {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
        audioPlayer.style.display = 'block';
    };
    
    currentUtterance.onend = function() {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
    };
    
    speechSynthesis.speak(currentUtterance);
}

// Inicializar VLibras
function initializeVLibras() {
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = function() {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        console.log('VLibras carregado com sucesso!');
    };
    script.onerror = function() {
        console.error('Erro ao carregar VLibras');
        librasInfoBtn.innerHTML = '<span>👐</span> Libras (Erro)';
        librasInfoBtn.style.backgroundColor = '#e74c3c';
    };
    document.head.appendChild(script);
}

// Mostrar informações sobre Libras
function showLibrasInfo() {
    alert('O VLibras está disponível no canto inferior direito da tela. \n\nClique no ícone do VLibras para ativar a tradução para Libras. \n\nVocê pode selecionar qualquer texto na página para ver a tradução em Libras.');
}

// Event Listeners
readerContrastBtn.addEventListener('click', function() {
    document.body.classList.toggle('high-contrast');
    this.textContent = document.body.classList.contains('high-contrast') 
        ? 'Contraste Normal' 
        : 'Alto Contraste';
});

readerFontDecreaseBtn.addEventListener('click', function() {
    let currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    if (currentSize > 12) {
        document.body.style.fontSize = (currentSize - 2) + 'px';
    }
});

readerFontIncreaseBtn.addEventListener('click', function() {
    let currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    if (currentSize < 24) {
        document.body.style.fontSize = (currentSize + 2) + 'px';
    }
});

readerAudioBtn.addEventListener('click', playCurrentPageAudio);

librasInfoBtn.addEventListener('click', showLibrasInfo);

prevPageBtn.addEventListener('click', function() {
    if (currentPage > 1) {
        displayPage(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', function() {
    if (currentPage < currentPdfPages.length) {
        displayPage(currentPage + 1);
    }
});

playPauseBtn.addEventListener('click', function() {
    if (isPlaying) {
        speechSynthesis.pause();
        playPauseBtn.textContent = '▶';
        isPlaying = false;
    } else {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
        } else if (currentUtterance) {
            speechSynthesis.speak(currentUtterance);
        }
        playPauseBtn.textContent = '⏸';
        isPlaying = true;
    }
});

closeAudioBtn.addEventListener('click', function() {
    speechSynthesis.cancel();
    audioPlayer.style.display = 'none';
    isPlaying = false;
});

// Teclas de atalho
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && currentPage > 1) {
        displayPage(currentPage - 1);
    } else if (event.key === 'ArrowRight' && currentPage < currentPdfPages.length) {
        displayPage(currentPage + 1);
    } else if (event.key === ' ' && event.ctrlKey) {
        event.preventDefault();
        playCurrentPageAudio();
    } else if (event.key === 'l' && event.altKey) {
        event.preventDefault();
        showLibrasInfo();
    }
});

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeReader();
    initializeVLibras();
});

// Função para destacar texto selecionado (útil para Libras)
function highlightSelectedText() {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        // O VLibras automaticamente detecta texto selecionado
        console.log('Texto selecionado para Libras:', selection.toString());
    }
}

document.addEventListener('mouseup', highlightSelectedText);