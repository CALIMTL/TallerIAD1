// 🖱️ Ejercicio: DOM (Document Object Model)

// 1. Seleccionar elementos por su ID
// En JavaScript usamos `document.getElementById('idDelElemento')` para obtener
// una referencia al elemento con ese `id` en el HTML.
// A continuación seleccionamos la caja y los botones usando sus IDs.

// Selecciona el elemento con id="miCaja" y lo guarda en la variable 'miCaja'
var miCaja = document.getElementById('miCaja');

// Selecciona el botón con id="btnCambiarColor" y lo guarda en 'btnCambiarColor'
var btnCambiarColor = document.getElementById('btnCambiarColor');

// Selecciona el botón con id="btnCambiarTexto" y lo guarda en 'btnCambiarTexto'
var btnCambiarTexto = document.getElementById('btnCambiarTexto');

// Mostrar en consola referencias encontradas (útil para depuración y aprendizaje)
console.log('miCaja seleccionado:', miCaja);
console.log('btnCambiarColor seleccionado:', btnCambiarColor);
console.log('btnCambiarTexto seleccionado:', btnCambiarTexto);


// 2. Escuchar eventos (Clicks)
// Para que un botón haga algo cuando se le hace click, añadimos un "listener"
// con `addEventListener('click', función)`. La función se ejecuta al hacer click.
if (btnCambiarColor) {
    btnCambiarColor.addEventListener('click', function() {
        // Obtener color anterior: preferimos el estilo inline, si no existe usamos el calculado
        var colorAnterior = miCaja.style.backgroundColor || window.getComputedStyle(miCaja).backgroundColor;
        // Mostrar en consola qué acción se va a realizar
        console.log('Se hizo click en btnCambiarColor. Color anterior:', colorAnterior, '-> nuevo: red');

        // Cambiar el color de fondo de la caja a rojo cuando se haga click en el botón
        miCaja.style.backgroundColor = 'red';
        // Confirmar en consola el nuevo valor
        console.log('miCaja.style.backgroundColor ahora es:', miCaja.style.backgroundColor);
    });
} else {
    // En caso de que el elemento no exista, mostramos un aviso en consola (útil para depuración)
    console.warn('No se encontró el botón con id "btnCambiarColor"');
}

// 3. Modificar elementos
// Cuando den click en 'Cambiar Color', cambia el color de fondo de la caja a rojo.
// Pídele a la IA: "¿Cómo cambio el estilo background-color de un elemento con JS?"


// Reto:
// Haz que el botón 'Cambiar Texto' cambie lo que dice dentro de la caja por "¡Hola DOM!".
if (btnCambiarTexto) {
    btnCambiarTexto.addEventListener('click', function() {
        // Mostrar en consola el texto anterior y el nuevo
        console.log('Se hizo click en btnCambiarTexto. Texto anterior:', miCaja.textContent, "-> nuevo: ¡Hola DOM!");

        // Cambiamos el texto que hay dentro del elemento (propiedad textContent)
        miCaja.textContent = '¡Hola DOM!';

        // Confirmar en consola el nuevo texto
        console.log('miCaja.textContent ahora es:', miCaja.textContent);
    });
} else {
    console.warn('No se encontró el botón con id "btnCambiarTexto"');
}