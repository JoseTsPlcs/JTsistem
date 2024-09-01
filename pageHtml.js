// Selecciona los elementos
const toggleBtn = document.getElementById('toggleBtn');
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');

// Añade un evento al botón de hamburguesa
toggleBtn.addEventListener('click', function () {
    // Alterna la clase 'expanded' en la barra de navegación
    navbar.classList.toggle('expanded');
});
