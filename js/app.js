$(function() {
    
    // Marvel API github https://github.com/AugustoMarcelo/mcuapi
    const MARVEL_API_ADDRESS = 'https://mcuapi.herokuapp.com/api/v1/movies/'

    // The Movie Database API https://developers.themoviedb.org/3/movies/get-movie-images
    const TMDB_API_ADDRESS = 'https://api.themoviedb.org/3/movie/'
    const TMDB_API_KEY = '?api_key=1df71b7f9f57d38257f3e0b7b903d3c8'
    const TMDB_API_IMAGE_ADRESS = 'https://image.tmdb.org/t/p/original'

    let today = new Date
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const appendMovies = (movie, element, id) => {
        let releaseDate = new Date(movie.release_date)
        let container = $('<div>').addClass('movie')

        if (document.location.pathname === '/saved.html') {
            let imgContainer = $('<div>').addClass('movie__img')
            imgContainer.append($('<img>').attr('src', movie.cover_url))

            let button = $('<button>')
            button.append($('<img>').attr({'src': '../assets/icons/close-white.svg', 'data-id': id}))
            button.on('click', unsaveMovie)

            imgContainer.append(button)
            container.append(imgContainer)
        } else {
            container.append($('<img>').attr('src', movie.cover_url))
        }

        container.append($('<h3>').text(movie.title))
        container.append($('<span>').text(releaseDate.getFullYear()))

        container.on('click', () => {
            window.scrollTo(0, 0)
            getMovieInfo(movie.imdb_id, releaseDate, movie.phase, movie.chronology, movie.overview, movie.id)
        })

        $(element).append(container)
    }

    const unsaveMovie = (e) => {
        e.stopPropagation()
        let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || []
        let id = $(e.target).attr('data-id')

        let index = savedMovies.indexOf(id)
        if (savedMovies.includes(id) && index >= 0) {
            savedMovies.splice(index, 1)
        }

        localStorage.setItem('savedMovies', JSON.stringify(savedMovies))

        if (document.location.pathname === '/saved.html') {
            $(e.target).parents('.movie').remove()
        }
    }

    const saveMovie = () => {
        let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || []
        let id = $('.details__title').attr('data-id')

        if (!savedMovies.includes(id)) {
            savedMovies.push(id)
        }

        localStorage.setItem('savedMovies', JSON.stringify(savedMovies))

        $('.details__button span').text('Added to saved')
        $('.details__button img').attr('src', 'assets/icons/check.svg')
    }

    const getMovieInfo = (imdbId, releaseDate, phase, chronology, desc, id) => {
        fetch(TMDB_API_ADDRESS + imdbId + TMDB_API_KEY)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status)
                } else {
                    return response.json()
                }
            })
            .then(data => {

                $('.main').hide()

                $('.details__image').css('background-image', 'url(' + TMDB_API_IMAGE_ADRESS + data.backdrop_path + ')')
                $('.details__title').text(data.title).attr('data-id', id)

                if (releaseDate > today) {
                    $('.details__release-date').text('Releases ' +  months[releaseDate.getMonth()]  + ' ' + releaseDate.getDate() + ', ' + releaseDate.getFullYear())
                    $('.details__release').show()
                } else {
                    $('.details__release').hide()
                }

                $('.meta__year').text(releaseDate.getFullYear())
                $('.meta__phase').text(phase)
                $('.meta__chronology').text(chronology)
                $('.details__desc').text(desc)

                fetch(MARVEL_API_ADDRESS + id)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.status)
                        } else {
                            return response.json()
                        }
                    })
                    .then(data => {
                        $('.related__movies').empty()

                        if (data.related_movies.length == 0) {
                            $('.details__related').hide()
                        } else {
                            data.related_movies.forEach(movie => {
                                appendMovies(movie, '.related__movies')
                            })
                        }
                    })
                    .catch(error => {
                        $('.main').text(error)
                    })

                let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || []
                if (savedMovies.includes(id.toString())) {
                    $('.details__button span').text('Added to saved')
                    $('.details__button img').attr('src', 'assets/icons/check.svg')
                } else {
                    $('.details__button span').text('Add to saved')
                    $('.details__button img').attr('src', 'assets/icons/cross.svg')
                }

                if (data.vote_average > 0) {
                    let rating = Math.round(data.vote_average * 10) / 10
                    $('.rating-number').text(rating)
    
                    let ratingOffset = Math.round((157 / rating) * 10) / 10
                    $('.rating-circle svg').css('stroke-dashoffset', ratingOffset + 'px')
                    $('.details__rating').show()
                } else {
                    $('.details__rating').hide()
                }

                $('.details').removeClass('display-none')
            })
            .catch(error => {
                $('.main').text(error)
            })
    }

    const getMarvelMovies = () => {
        fetch(MARVEL_API_ADDRESS)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status)
                } else {
                    return response.json()
                }
            })
            .then(data => {
                
                let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || []

                data.data.forEach(movie => {
                    let releaseDate = new Date(movie.release_date)

                    if (releaseDate > today) {
                        appendMovies(movie, '.coming-soon .section__movies')
                    } else if (movie.phase === 1) {
                        appendMovies(movie, '.phase-one .section__movies')
                    } else if (movie.phase === 2) {
                        appendMovies(movie, '.phase-two .section__movies')
                    } else if (movie.phase === 3) {
                        appendMovies(movie, '.phase-three .section__movies')
                    } else if (movie.phase === 4) {
                        appendMovies(movie, '.phase-four .section__movies')
                    }

                    if (savedMovies.length > 0) {
                        savedMovies.forEach(savedMovie => {
                            if (savedMovie == movie.id) {
                                appendMovies(movie, '.saved .section__movies', movie.id)
                            }
                        })
                    } else {
                        $('.saved .section__message').text("You haven't saved any movies yet!")
                    }
                });
            })
            .catch(error => {
                $('.main').text(error)
            })
    }

    $('.details__back-button').on('click', () => {
        $('.main').show()
        $('.details').addClass('display-none')
    })

    $('.details__button').on('click', saveMovie)

    getMarvelMovies()

})