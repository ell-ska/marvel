window.addEventListener('load', () => {
    const loader = document.querySelector('.loader')
    setTimeout(() => {
        loader.classList.add('loader--finished')
    }, 2000)
})