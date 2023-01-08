$(function() {
    
    // Marvel API github https://github.com/AugustoMarcelo/mcuapi
    const MARVEL_API_ADDRESS = 'https://mcuapi.herokuapp.com/api/v1/movies/'

    // The Movie Database API https://developers.themoviedb.org/3/movies/get-movie-images
    const TMDB_API_ADDRESS = 'https://api.themoviedb.org/3/movie/'
    const TMDB_API_KEY = '?api_key=1df71b7f9f57d38257f3e0b7b903d3c8'
    const TMDB_API_IMAGE_ADRESS = 'https://image.tmdb.org/t/p/original'

    let today = new Date
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    $('.details__back-button').on('click', () => {
        $('.main').show()
        $('.details').addClass('display-none')
    })

    const appendMovies = (movie, element) => {
        let releaseDate = new Date(movie.release_date)
        let container = $('<div>').addClass('movie')

        container.append($('<img>').attr('src', movie.cover_url))
        container.append($('<h3>').text(movie.title))
        container.append($('<span>').text(releaseDate.getFullYear()))

        container.on('click', () => {
            getMovieInfo(movie.imdb_id, releaseDate, movie.phase, movie.chronology, movie.overview, movie.id)
        })

        $(element).append(container)
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
                $('.details__title').text(data.title)

                if (releaseDate > today) {
                    $('.details__release-date').text('Releases ' +  months[releaseDate.getMonth()]  + ' ' + releaseDate.getDate() + ', ' + releaseDate.getFullYear())
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

                if (data.vote_average > 0) {
                    let rating = Math.round(data.vote_average * 10) / 10
                    $('.rating-number').text(rating)
    
                    let ratingOffset = Math.round((157 / rating) * 10) / 10
                    $('.rating-circle svg').css('stroke-dashoffset', ratingOffset + 'px')
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
                });
            })
            .catch(error => {
                $('.main').text(error)
            })
    }

    getMarvelMovies()

})