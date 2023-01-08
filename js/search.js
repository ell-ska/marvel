$(function() {
    $('.header__search-button').on('click', () => {
        $('.search').toggleClass('display-none')
        if (!$('.search').hasClass('display-none')) {
            $('.search__input').trigger('focus')
        }
    })

    $('.search__input').on('input', () => {

        if ($('.search__input').val().length > 2) {

            document.querySelectorAll('.movie h3').forEach(movie => {
                let movieTitles = movie.textContent.toLowerCase()
                let inputValue = document.querySelector('.search__input').value.toLowerCase()

                if (movieTitles.includes(inputValue)) {
                    // $(movie.parentNode).clone().appendTo('.search')
                }

            })

            // if input value includes word or part of word of a movie title (.movie h3) .clone() that .movie and add to search div

        }

    })
})