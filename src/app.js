// reference html elements
const body = document.querySelector('body')
const main = document.querySelector('main')
const nav = document.querySelector('nav')
nav.className = 'nav'
const popup = document.querySelector('.popup')
const overlay = document.querySelector('.overlay')
const closePopupBtn = document.createElement('span')


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
    const movieSummary = movieData.map(movie => movie.summary)
    // console.log(movieSummary);
    const movieThumbnail = movieData.map(movie => movie.image.medium)
    const movieRuntime = movieData.map(movie => movie.runtime)
    const movieRating = movieData.map(movie => {
        let rating = movie.rating
        for (let key in rating) {
            return `${key}: ${rating[key]}`
        }
    })

    let currentPage = 1
    let itemsPerPage = 8
    let totalPages = Math.ceil(movieData.length / itemsPerPage)

    // create a container to hold the cards
    const cardOuterContainer = document.createElement('div')
    
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

            // add event listener to show and hide popup
            card.addEventListener('click', () => showPopup(i))
            overlay.addEventListener('click', closePopup)
            closePopupBtn.addEventListener('click', closePopup)
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && !popup.classList.contains('hidden')) {
                    closePopup()
                }
            })

            // append the card to the card container
            cardOuterContainer.append(card)
        }
        // append the card container to the main
        main.append(cardOuterContainer)

        // create function to show popup
        function showPopup (index) {
            closePopupBtn.innerHTML = `<span class="material-symbols-outlined">
            close
            </span>`

            const popupContainer = document.createElement('div')
            popupContainer.className = 'popupContainer'

            const description = document.createElement('div')
            description.className = 'description'

            const title = document.createElement('h3')
            title.innerText = movieName[index]
            console.log(title);

            const summary = document.createElement('p')
            summary.innerHTML = movieSummary[index]
            console.log(summary);

            description.append(title)
            description.append(summary)

            const extraDescription = document.createElement('div')
            extraDescription.className = 'extraDescription'

            const thumbnail = document.createElement('img')
            thumbnail.src = movieThumbnail[index]

            const runtime = document.createElement('span')
            runtime.innerText = `RUNTIME: ${movieRuntime[index]}`

            const rating = document.createElement('span')
            rating.innerText = `RATING: ${movieRating[index]}`

            const commentForm = document.createElement('form')
            commentForm.className = 'commentForm'
            const commentInput = document.createElement('input')
            commentInput.placeholder = 'Your Name here'
            const commentText = document.createElement('textarea')
            commentText.placeholder = 'Your Comment here'
            const commentButton = document.createElement('button')
            commentButton.innerText = 'Comment'

            commentForm.append(commentInput)
            commentForm.append(commentText)
            commentForm.append(commentButton)

            extraDescription.append(thumbnail)
            extraDescription.append(runtime)
            extraDescription.append(rating)

            popupContainer.append(extraDescription)
            popupContainer.append(description)
            popupContainer.append(commentForm)
            
            popup.append(closePopupBtn)
            popup.append(popupContainer)

            popup.classList.remove('hidden')
            overlay.classList.remove('hidden')
        }

        // create function to close popup
        function closePopup () {
            popup.innerHTML = ''
            popup.classList.add('hidden')
            overlay.classList.add('hidden')
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
        cardOuterContainer.innerHTML = ''
        if (currentPage > 1) {
            currentPage--
            displayPage()
            updateButtonVisibility()
        }
    })
    
    nextButton.addEventListener('click', () => {
        cardOuterContainer.innerHTML = ''
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