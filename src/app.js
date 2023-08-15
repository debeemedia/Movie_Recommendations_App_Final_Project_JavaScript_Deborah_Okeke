// reference html elements
const body = document.querySelector('body');
const main = document.querySelector('main');
const nav = document.querySelector('nav');
nav.className = 'nav';
const popup = document.querySelector('.popup');
const overlay = document.querySelector('.overlay');
const closePopupBtn = document.createElement('span');

// reference api url
const movieApi = 'https://api.tvmaze.com/shows';
const interactionsApi = 'https://microverse.notion.site/Involvement-API-869e60b5ad104603aa6db59e08150270';

// create function to fetch movie data
async function fetchMovie() {
    try {
        const response = await fetch(movieApi);
        const movieData = await response.json();
        return movieData;
    } catch (error) {
        console.log('Error: ' + error);
    }
}

// Create card element
function createCard(movie) {
    const card = document.createElement('div');
    card.className = 'card';

    const cardImgDiv = document.createElement('div');
    cardImgDiv.className = 'cardImgDiv';
    const cardImg = document.createElement('img');
    cardImg.src = movie.image.original;
    cardImg.className = 'cardImg';
    cardImgDiv.append(cardImg);

    const cardBody = document.createElement('span');
    cardBody.className = 'cardBody';
    const cardName = document.createElement('h3');
    cardName.innerText = movie.name;
    cardName.className = 'cardName';
    const cardLike = document.createElement('span');
    cardLike.innerHTML = `<span class="material-symbols-outlined">favorite</span>`;
    cardLike.className = 'cardLike';
    const cardComment = document.createElement('span');
    cardComment.innerHTML = `<span class="material-symbols-outlined">chat_bubble</span>`;
    cardComment.className = 'cardComment';

    cardBody.append(cardName);
    cardBody.append(cardLike);
    cardBody.append(cardComment);

    card.append(cardImgDiv);
    card.append(cardBody);

    card.addEventListener('click', () => showPopup(movie));

    return card;
}

// Create popup content
function createPopupContent(movie) {
    const description = document.createElement('div');
    description.className = 'description';

    const title = document.createElement('h3');
    title.innerText = movie.name;

    const summary = document.createElement('p');
    summary.innerHTML = movie.summary;

    description.append(title);
    description.append(summary);

    // ... (add more content as needed)

    return description;
}

// Show popup
function showPopup(movie) {
    closePopupBtn.innerHTML = `<span class="material-symbols-outlined">close</span>`;

    // Clear previous content and event listeners
    popup.innerHTML = '';
    overlay.removeEventListener('click', closePopup);
    closePopupBtn.removeEventListener('click', closePopup);

    // Add popup content
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popupContainer';

    const description = createPopupContent(movie);

    popupContainer.append(description);
    popup.append(closePopupBtn);
    popup.append(popupContainer);

    popup.classList.remove('hidden');
    overlay.classList.remove('hidden');

    // Add event listeners
    overlay.addEventListener('click', closePopup);
    closePopupBtn.addEventListener('click', closePopup);
}

// Create function to close popup
function closePopup() {
    popup.innerHTML = '';
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
}

// create function to display movie data and paginate
const displayMovies = async () => {
    const movieData = await fetchMovie();
    const movieName = movieData.map(movie => movie.name);
    const movieImage = movieData.map(movie => movie.image.original);
    const movieSummary = movieData.map(movie => movie.summary);
    const movieThumbnail = movieData.map(movie => movie.image.medium);
    const movieRuntime = movieData.map(movie => movie.runtime);
    const movieRating = movieData.map(movie => {
        let rating = movie.rating;
        for (let key in rating) {
            return `${key}: ${rating[key]}`;
        }
    });

    let currentPage = 1;
    let itemsPerPage = 8;
    let totalPages = Math.ceil(movieData.length / itemsPerPage);

    // create function to display pages
    function displayPage() {
        main.innerHTML = '';
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;

        for (let i = startIndex; i < endIndex && i < movieData.length; i++) {
            const card = createCard(movieData[i]);
            main.append(card);
        }

        // ... (rest of your code for pagination buttons)
    }

    // ... (rest of your code for pagination buttons and event listeners)

    // call the displayPage and updateButtonVisibility functions to load the page and update button visibility on load
    displayPage();
    updateButtonVisibility();
};

displayMovies();
