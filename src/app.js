// reference html elements
const body = document.querySelector('body')
const main = document.querySelector('main')
const nav = document.querySelector('nav')
nav.className = 'nav'
const popup = document.querySelector('.popup')
const overlay = document.querySelector('.overlay')
const closePopupBtn = document.createElement('span')
closePopupBtn.className = 'closePopupBtn'


// reference api urls
const movieApi = 'https://api.tvmaze.com/shows'
const commentApi = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/mfWmNK2U98CR08nLP5Ud/comments/'
const likeApi = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/0V2vKmuLfBH53fnHnuXt/likes'

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
    const movieId = movieData.map(movie => movie.id)
    // console.log(movieId)

    let currentPage = 1
    let itemsPerPage = 8
    let totalPages = Math.ceil(movieData.length / itemsPerPage)

    // create a container to hold the cards
    const cardOuterContainer = document.createElement('div')
    cardOuterContainer.className = 'cardOuterContainer'
    
    // create function to display pages
    function displayPage() {
        closePopup()
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
            
            cardBody.append(cardName, cardLike, cardComment)
            
            card.append(cardImgDiv, cardBody)
            // making the GET request to the likes endpoint
            fetch(likeApi)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(data => {
                console.log(data);
                const cleanData = data.filter(entry => entry.item_id !== 'item2')
                console.log(cleanData);
                let movieLikes = 0;
                for (let j = 0; j < cleanData.length; j++) {
                    if (cleanData[j].item_id === movieId[i]) {
                        movieLikes = cleanData[j].likes;
                        break;
                    }
                }
                const likeCount = document.createElement('span')
                likeCount.innerText = movieLikes
                cardLike.prepend(likeCount)
            })
            .catch(error => console.log('Error: ' + error))

            // add event listener to show and hide popup
            cardImgDiv.addEventListener('click', () => showPopup(i))
            cardName.addEventListener('click', () => showPopup(i))
            cardComment.addEventListener('click', () => showPopup(i))
            overlay.addEventListener('click', closePopup)
            closePopupBtn.addEventListener('click', closePopup)
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && !popup.classList.contains('hidden')) {
                    closePopup()
                }
            })

            // add event listener to like
            cardLike.addEventListener('click', () => addLike(i, cardLike))

            // append the card to the card container
            cardOuterContainer.append(card)
        }
        // append the card container to the main
        main.append(cardOuterContainer)

        // // using js to implement feature for popup to pop out from the exact card that is clicked
        // // const card = document.querySelectorAll('.card')[index]
        // popupPosition = card.getBoundingClientRect()
        // popup.style.left = `${popupPosition.left + window.scrollX}px`
        // popup.style.top = `${popupPosition.top + window.scrollY}px`
        // console.log(`${popupPosition.top + window.scrollY}px`)

        // create function to show popup
        function showPopup (index) {
            // set popup to pop out from the corresponding clicked card
            // console.log(index);
            // const card = document.querySelectorAll('.card')[index]
            // const popupPosition = card.getBoundingClientRect()
            // popup.style.top = `${popupPosition.top + window.scrollY}px`
            // console.log(`${popupPosition.top + window.scrollY}px`)
            
            closePopupBtn.innerHTML = `<span class="material-symbols-outlined">
            close
            </span>`

            const popupContainer = document.createElement('div')
            popupContainer.className = 'popupContainer'

            const description = document.createElement('div')
            description.className = 'description'

            const title = document.createElement('h3')
            title.innerText = movieName[index]
            // console.log(title);

            const summary = document.createElement('p')
            summary.innerHTML = movieSummary[index]
            // console.log(summary);

            description.append(title, summary)

            const extraDescription = document.createElement('div')
            extraDescription.className = 'extraDescription'

            const thumbnailDiv = document.createElement('div')
            thumbnailDiv.className = 'thumbnailDiv'
            const thumbnail = document.createElement('img')
            thumbnail.src = movieThumbnail[index]
            thumbnailDiv.append(thumbnail)

            const runtime = document.createElement('span')
            runtime.innerText = `RUNTIME: ${movieRuntime[index]}`

            const rating = document.createElement('span')
            rating.innerText = `RATING: ${movieRating[index]}`

            const commentFormAndDiv = document.createElement('div')
            commentFormAndDiv.className = 'commentFormAndDiv'

            const commentForm = document.createElement('form')
            commentForm.className = 'commentForm'
            const commentInput = document.createElement('input')
            commentInput.className = 'commentInput'
            commentInput.placeholder = 'Your Name here'
            const commentText = document.createElement('textarea')
            commentText.className = 'commentText'
            commentText.placeholder = 'Your Comment here'
            const commentButton = document.createElement('button')
            commentButton.className = 'commentButton'
            commentButton.innerText = 'Comment'

            commentForm.append(commentInput, commentText, commentButton)

            extraDescription.append(thumbnailDiv, runtime, rating)

            popupContainer.append(extraDescription, description)
            
            commentFormAndDiv.append(commentForm)
            popupContainer.append(commentFormAndDiv)

            popup.append(closePopupBtn, popupContainer)

            popup.classList.remove('hidden')
            overlay.classList.remove('hidden')

            const commentsDivContainer = document.createElement('div')
            commentsDivContainer.className = 'commentsDivContainer'


            // send GET request to get and display the comments
            fetch(`${commentApi}?item_id=${movieId[index]}`)
            .then(response => response.json())
            .then(data => {
                const commentCount = document.createElement('h4')
                commentCount.innerText = `All Comments (${data.length})`
                
                // first check if data is an array
                if (Array.isArray(data) && data.length > 0) {
                    commentCount.innerText = `All Comments (${data.length})`
                    console.log('data is an array');
                    data.forEach(commentsData => {
    
                        // create div to display comments
                        const commentsDiv = document.createElement('div')
    
                        const commentsDivDate = document.createElement('span')
                        commentsDivDate.innerHTML = `${commentsData.creation_date}<br>`
                        const commentsDivUser = document.createElement('span')
                        commentsDivUser.innerHTML = `${commentsData.username}: <br>`
                        const commentsDivComment = document.createElement('span')
                        commentsDivComment.innerHTML = `${commentsData.comment}<br><br>`
                        
                        commentsDiv.append(commentsDivDate, commentsDivUser, commentsDivComment)
      
                        commentsDivContainer.append(commentsDiv)
                        
                        // console.log(commentsData);
                    })
                } else {
                    commentCount.innerText = `No comments yet. Be the first to comment.`
                    console.log('data is not an array');
                }

                commentFormAndDiv.append(commentCount, commentsDivContainer)

            })

            commentInput.setAttribute('required', '')
            commentText.setAttribute('required', '')
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const userComment = {
                    item_id: movieId[index],
                    username: commentInput.value,
                    comment: commentText.value
                }
                // making the POST request to the comments endpoint
                fetch(commentApi, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(userComment)
                })
                .then(response => {
                    if (response.ok) {
                        console.log('good to go');
                        console.log(movieId[index]);
                        console.log(response);
                        console.log(response.status);
                        return response.status

                    } else {
                        console.log('come back hia!');
                    }
                })
                .then(data => {
                    if (data === 201) {
                        console.log('hi there');
                        // clear commentForm values
                        // commentInput.value = ''
                        // commentText.value = ''
                        // OR since this is a form:
                        commentForm.reset()

                        const newCommentsDiv = document.createElement('div')
                        const newCommentsDivDate = document.createElement('span')
                        newCommentsDivDate.innerHTML = `${new Date().toLocaleString()}<br>`
                        const newCommentsDivUser = document.createElement('span')
                        newCommentsDivUser.innerHTML = `${userComment.username}: <br>`
                        const newCommentsDivComment = document.createElement('span')
                        newCommentsDivComment.innerHTML = `${userComment.comment}<br><br>`
                        
                        newCommentsDiv.append(newCommentsDivDate, newCommentsDivUser, newCommentsDivComment)

                        commentsDivContainer.append(newCommentsDiv)

                    }
                })
                .catch(error => {
                    console.log('Error: ' + error);
                })
                
            })
        }

        // create function to close popup
        function closePopup () {
            popup.innerHTML = ''
            popup.classList.add('hidden')
            overlay.classList.add('hidden')
        }

        // create function to add likes
        function addLike (index, likeIcon) {
            const userLike = {
                item_id: movieId[index]
            }
            // create an array to keep track of liked movies and get liked movies from local storage (for the like-only-once feature)
            const likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || []

            // making the POST request to the likes endpoint
            // implementing the like-only-once feature
            if (!likedMovies.includes(movieId[index])) {
                fetch(likeApi, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(userLike)
                })
                .then(response => {
                    if (response.ok) {
                        console.log('good to go for em likes');
                        return response.status
                    } else {
                        console.log('no likes for you brutha');
                    }
                })
                .then(data => {
                    console.log(data);
                    if (data === 201) {
                        likeIcon.classList.add('liked')
                        // update the liked movies array
                        likedMovies.push(movieId[index])
                        // save liked movies to local storage
                        localStorage.setItem('likedMovies', JSON.stringify(likedMovies))

                        console.log('change color');
                        console.log('you just liked a movie');
                    }
                })
                .catch(error => {
                    console.log('Error: ' + error);
                })
            } else {
                console.log('Movie already liked');
                const tooltip = document.createElement('span')
                tooltip.innerHTML = 'You\'ve already liked this movie<br>'
                tooltip.className = 'tooltip'
                likeIcon.prepend(tooltip)
                setTimeout(() => {
                    likeIcon.removeChild(tooltip)
                }, 2000)
            }            
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
