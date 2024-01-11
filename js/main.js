const charactersList = document.getElementById('characters-list');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
let currentPage = 1;
let totalPages = 1;

async function getCharacters(page) {
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const data = await response.json();
    totalPages = data.info.pages;
    return data.results;
}

async function searchCharacters() {
    const searchTerm = searchInput.value;
    const response = await fetch(`https://rickandmortyapi.com/api/character?name=${searchTerm}`);
    const data = await response.json();
    displayCharacters(data.results);

    // Limpar a paginação ao realizar uma nova pesquisa
    paginationContainer.innerHTML = '';
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updateCharacters();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updateCharacters();
    }
}

function displayCharacters(characters) {
    charactersList.innerHTML = '';

    characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');

        const characterName = document.createElement('h2');
        characterName.textContent = character.name;

        const characterStatus = document.createElement('p');
        characterStatus.textContent = `Status: ${character.status}`;

        const characterSpecies = document.createElement('p');
        characterSpecies.textContent = `Species: ${character.species}`;

        const characterImage = document.createElement('img');
        characterImage.src = character.image;
        characterImage.alt = character.name;
        characterImage.classList.add('character-image');

        characterCard.appendChild(characterName);
        characterCard.appendChild(characterStatus);
        characterCard.appendChild(characterSpecies);
        characterCard.appendChild(characterImage);

        charactersList.appendChild(characterCard);
    });
}

function createPaginationButtons(info) {
    const { pages, next, prev } = info;
    paginationContainer.innerHTML = '';

    if (prev) {
        const prevButton = createPaginationButton('Previous', prev);
        paginationContainer.appendChild(prevButton);
    }

    for (let i = 1; i <= pages; i++) {
        const pageButton = createPaginationButton(i, i);
        paginationContainer.appendChild(pageButton);
    }

    if (next) {
        const nextButton = createPaginationButton('Next', next);
        paginationContainer.appendChild(nextButton);
    }
}

function createPaginationButton(text, page) {
    const button = document.createElement('button');
    button.textContent = text;

    button.addEventListener('click', () => {
        currentPage = page;
        updateCharacters();
    });

    return button;
}

async function updateCharacters() {
    const characters = await getCharacters(currentPage);
    displayCharacters(characters);

    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${currentPage}`);
    const pageInfo = await response.json();
    createPaginationButtons(pageInfo.info);
}

// Initial load
updateCharacters();
