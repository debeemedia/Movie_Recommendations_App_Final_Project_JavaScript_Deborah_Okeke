// reference html elements
const main = document.querySelector('main')
const nav = document.querySelector('nav')
nav.className = 'nav'

// reference api url
const movieApi = 'https://api.tvmaze.com/shows'

// create function to fetch movie data
async function fetchMovie() {
    try{
        const response = await fetch(movieApi)
        const movieData = await response.json()
        // console.log(movieData);
        return movieData
    }
    catch(error) {
        console.log('Error: ' + error);
    }
}

// create function to display movie data and paginate
const displayMovies = async () => {
    const movieData = await fetchMovie()
    const movieName = movieData.map(movie => movie.name)
    // console.log(movieName);
    const movieImage = movieData.map(movie => movie.image.original)
    // console.log(movieImage);

    let currentPage = 1
    let itemsPerPage = 8
    let totalPages = Math.ceil(movieData.length / itemsPerPage)
    
    // create function to display pages
    function displayPage() {
        let startIndex = (currentPage - 1) * itemsPerPage
        let endIndex = startIndex + itemsPerPage

        for (let i = startIndex; i < endIndex && i < movieData.length; i++) {
            const card = document.createElement('div')
            card.className = 'card'
            
            const cardImgDiv = document.createElement('div')
            cardImgDiv.className = 'cardImgDiv'
            const cardImg = document.createElement('img')
            cardImg.src = movieImage[i]
            cardImg.className = 'cardImg'
            cardImgDiv.append(cardImg)
            
            const cardBody = document.createElement('span')
            cardBody.className = 'cardBody'
            const cardName = document.createElement('h3')
            cardName.innerText = movieName[i]
            cardName.className = 'cardName'
            const cardLike = document.createElement('span')
            cardLike.innerHTML = `<span class="material-symbols-outlined">
            favorite
            </span>`
            cardLike.className = 'cardLike'
            const cardComment = document.createElement('span')
            cardComment.innerHTML = `<span class="material-symbols-outlined">
            chat_bubble
            </span>`
            cardComment.className = 'cardComment'
            
            cardBody.append(cardName)
            cardBody.append(cardLike)
            cardBody.append(cardComment)
            
            card.append(cardImgDiv)
            card.append(cardBody)
            main.append(card)
        }
    }
    
    
    // create page navigation
    const previousButton = document.createElement('span')
    previousButton.innerHTML = '<span class="material-symbols-outlined">navigate_before</span>'
    
    const nextButton = document.createElement('span')
    nextButton.innerHTML = '<span class="material-symbols-outlined">navigate_next</span>'
    
    nav.appendChild(previousButton)
    nav.appendChild(nextButton)
    
    // add functionality to buttons
    previousButton.addEventListener('click', () => {
        main.innerHTML = ''
        if (currentPage > 1) {
            currentPage--
            displayPage()
            updateButtonVisibility()
        }
    })
    
    nextButton.addEventListener('click', () => {
        main.innerHTML = ''
        if (currentPage < totalPages) {
            currentPage++
            displayPage()
            updateButtonVisibility()
        }
    })
    
    // function to set button visibility
    function updateButtonVisibility() {
        if (currentPage <= 1) {
            previousButton.hidden = true
        } else {
            previousButton.hidden = false
        }

        if (currentPage >= totalPages) {
            nextButton.hidden = true
        } else {
            nextButton.hidden = false
        }
    }

    // call the displayPage and updateButtonVisibility functions to load the page and update button visibility on load
    displayPage()
    updateButtonVisibility()
    
}

displayMovies()
