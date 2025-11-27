/*
  temp.js
  Funciones para convertir temperaturas.
  Contiene funciones para convertir desde Celsius a Fahrenheit y Kelvin.
  Comentarios en español, usando sintaxis compatible con principiantes (ES5).
*/

/**
 * Convierte grados Celsius a Fahrenheit.
 * Fórmula: (°C * 9/5) + 32 = °F
 * @param {number|string} celsius - temperatura en grados Celsius (acepta número o cadena numérica)
 * @returns {number} temperatura en Fahrenheit (redondeada a 2 decimales)
 */
function celsiusToFahrenheit(celsius) {
  // Convertir la entrada a número (por si llega como string)
  var c = Number(celsius);

  // Si la conversión falla (por ejemplo, entrada no numérica), devolvemos NaN
  if (isNaN(c)) {
    return NaN;
  }

  // Aplicamos la fórmula
  var f = (c * 9 / 5) + 32;

  // Devolvemos con dos decimales para mayor legibilidad
  return Math.round(f * 100) / 100;
}

/**
 * Convierte grados Celsius a Kelvin.
 * Fórmula: °C + 273.15 = K
 * @param {number|string} celsius - temperatura en grados Celsius
 * @returns {number} temperatura en Kelvin (redondeada a 2 decimales)
 */
function celsiusToKelvin(celsius) {
  var c = Number(celsius);
  if (isNaN(c)) {
    return NaN;
  }

  var k = c + 273.15;
  return Math.round(k * 100) / 100;
}

// Ejemplos de uso (puedes descomentarlos para probar en consola):
// console.log(celsiusToFahrenheit(0)); // 32
// console.log(celsiusToKelvin(0));     // 273.15
// console.log(celsiusToFahrenheit(100)); // 212
// console.log(celsiusToKelvin(-273.15)); // 0

// Export simple para uso en módulos (si se usa en Node o bundlers)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    celsiusToFahrenheit: celsiusToFahrenheit,
    celsiusToKelvin: celsiusToKelvin
  };
}

// Conectar la UI si existen los elementos en la página
// Esto permite incluir el conversor en cualquier HTML sin borrar lo demás.
document.addEventListener && document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('temp-celsius-input');
  var btnF = document.getElementById('temp-to-f');
  var btnK = document.getElementById('temp-to-k');
  var output = document.getElementById('temp-result');

  if (!input || (!btnF && !btnK) || !output) {
    // No hay UI para enlazar en esta página, salimos silenciosamente
    return;
  }

  // Función auxiliar para mostrar resultado o error
  function mostrar(valor) {
    output.textContent = String(valor);
    console.log('Conversor:', valor);
  }

  btnF && btnF.addEventListener('click', function () {
    var val = Number(input.value);
    if (isNaN(val)) { mostrar('Entrada inválida'); return; }
    mostrar(celsiusToFahrenheit(val) + ' °F');
  });

  btnK && btnK.addEventListener('click', function () {
    var val = Number(input.value);
    if (isNaN(val)) { mostrar('Entrada inválida'); return; }
    mostrar(celsiusToKelvin(val) + ' K');
  });

  // Soportar Enter en el input para convertir a Fahrenheit por defecto
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var val = Number(input.value);
      if (isNaN(val)) { mostrar('Entrada inválida'); return; }
      mostrar(celsiusToFahrenheit(val) + ' °F');
    }
  });
});
