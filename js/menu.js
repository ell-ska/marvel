$(function() {
    $('.header__menu-button').on('click', () => {
        $('.header__menu-button').toggleClass('header__menu-button--clicked')
        $('.nav').toggleClass('display-none')
    })
})