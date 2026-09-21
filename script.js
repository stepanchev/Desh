const openPanel = document.getElementById('headerButtonOpenPanal')
const sidebar = document.getElementById("sidebar")
openPanel.addEventListener('click', () => {
    sidebar.classList.toggle('open')
})