// Rick and Morty API - Consumidor de personajes
const API_URL = 'https://rickandmortyapi.com/api/character';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const container = document.getElementById('container');

// Variable para almacenar todos los personajes
let allCharacters = [];

// Evento del botón Buscar
searchBtn.addEventListener('click', buscarPersonajes);

// Evento Enter en el input
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarPersonajes();
    }
});

/**
 * Función para buscar personajes
 */
function buscarPersonajes() {
    const termino = searchInput.value.trim();
    
    if (!termino) {
        // Si no hay término, cargar todos
        cargarTodosLosPersonajes();
        return;
    }

    // Mostrar carga
    container.innerHTML = '<div class="loading">Buscando personajes...</div>';

    // Hacer fetch a la API con parámetro de búsqueda
    fetch(`${API_URL}?name=${encodeURIComponent(termino)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontraron personajes');
            }
            return response.json();
        })
        .then(data => {
            if (data.results && data.results.length > 0) {
                renderizarPersonajes(data.results);
            } else {
                container.innerHTML = '<div class="no-results">No se encontraron personajes con ese nombre.</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `<div class="error">Error al buscar personajes: ${error.message}</div>`;
        });
}

/**
 * Función para cargar todos los personajes (página inicial)
 */
function cargarTodosLosPersonajes() {
    container.innerHTML = '<div class="loading">Cargando personajes...</div>';

    // Cargar la primera página
    fetch(`${API_URL}?page=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar personajes');
            }
            return response.json();
        })
        .then(data => {
            if (data.results) {
                renderizarPersonajes(data.results);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `<div class="error">Error al cargar personajes: ${error.message}</div>`;
        });
}

/**
 * Función para renderizar las tarjetas de personajes
 */
function renderizarPersonajes(personajes) {
    // Limpiar contenedor
    container.innerHTML = '';

    // Crear tarjeta para cada personaje
    personajes.forEach(personaje => {
        const card = crearTarjetaPersonaje(personaje);
        container.appendChild(card);
    });
}

/**
 * Función para crear una tarjeta de personaje
 */
function crearTarjetaPersonaje(personaje) {
    // Crear elemento card
    const card = document.createElement('div');
    card.className = 'card';

    // Determinar clase de estado
    const statusClass = personaje.status.toLowerCase();

    // HTML de la tarjeta
    card.innerHTML = `
        <img src="${personaje.image}" alt="${personaje.name}" class="card-image" />
        <div class="card-content">
            <div class="card-name">${personaje.name}</div>
            <div class="card-info">
                <div class="card-info-row">
                    <span class="label">Estado:</span>
                    <span class="status ${statusClass}">${personaje.status}</span>
                </div>
                <div class="card-info-row">
                    <span class="label">Especie:</span>
                    <span>${personaje.species}</span>
                </div>
                <div class="card-info-row">
                    <span class="label">Ubicación:</span>
                    <span>${personaje.location.name}</span>
                </div>
            </div>
        </div>
    `;

    return card;
}

// Cargar personajes al iniciar la página
window.addEventListener('DOMContentLoaded', cargarTodosLosPersonajes);
