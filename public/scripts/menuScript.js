let toggleSideBarButton = document.querySelector('#nav-button')
let navSidebar = document.querySelector('.aside-navbar')

toggleSideBarButton.addEventListener('click', () => {
    navSidebar.classList.toggle('active')
})