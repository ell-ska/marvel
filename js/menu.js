$(function() {
    $('.header__menu-button').on('click', () => {
        $('.container').toggleClass('container--locked')
        $('.header__menu-button').toggleClass('header__menu-button--clicked')
        $('.nav').toggleClass('display-none')
        $('.main').toggleClass('display-none')
    })
})