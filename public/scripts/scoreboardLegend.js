const legendBtn = document.querySelector('#sb-legend-btn')
const legendContent = document.querySelector('.sb-legend-content')

legendBtn.addEventListener('click', () => {
    legendContent.classList.toggle('sb-legend-content--active')
})