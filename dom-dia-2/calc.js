/*
  calc.js
  Funciones de calculadora para usar desde la página web.
  Estas funciones replican la lógica de CalculadoraBasica.java
  y permiten que la UI en index.html invoque operaciones usando los
  valores que el usuario introduce en la página.

  Usamos sintaxis ES5 para compatibilidad con navegadores antiguos:
  - 'function' en vez de arrow functions
  - 'var' en vez de 'let' / 'const'
*/

// Convierte el valor a número y devuelve NaN si no es válido
function toNumber(value) {
  // Number() intenta convertir cadenas a número (acepta decimales y negativos)
  return Number(value);
}

// Suma dos valores
function sumar(a, b) {
  // Convertimos los parámetros a números
  var x = toNumber(a);
  var y = toNumber(b);

  // Dejamos una traza en la consola para ver qué se calculó
  console.log('sumar() ->', x, '+', y);

  // Devolvemos la suma (si alguno no es número, el resultado será NaN)
  return x + y;
}

// Resta b a a
function restar(a, b) {
  var x = toNumber(a);
  var y = toNumber(b);
  console.log('restar() ->', x, '-', y);
  return x - y;
}

// Multiplicación
function multiplicar(a, b) {
  var x = toNumber(a);
  var y = toNumber(b);
  console.log('multiplicar() ->', x, '*', y);
  return x * y;
}

// División con manejo sencillo de división por cero
function dividir(a, b) {
  var x = toNumber(a);
  var y = toNumber(b);
  console.log('dividir() ->', x, '/', y);
  if (y === 0) {
    // No lanzamos excepción; devolvemos string informativo para mostrar en UI
    return 'Error: división por cero';
  }
  return x / y;
}

// Módulo (resto)
function modulo(a, b) {
  var x = toNumber(a);
  var y = toNumber(b);
  console.log('modulo() ->', x, '%', y);
  if (y === 0) {
    return 'Error: módulo por cero';
  }
  return x % y;
}

// Potencia a^b
function potencia(a, b) {
  var x = toNumber(a);
  var y = toNumber(b);
  console.log('potencia() ->', x, '^', y);
  // Usamos Math.pow para calcular potencias
  return Math.pow(x, y);
}

// --- Código para conectar la UI ---
// Al cargar la página, buscamos los elementos del DOM y asignamos listeners
document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos (inputs y botones)
  var inputA = document.getElementById('calc-num-a');
  var inputB = document.getElementById('calc-num-b');
  var resultadoBox = document.getElementById('calc-resultado');

  // Botones
  var btnSuma = document.getElementById('op-sumar');
  var btnResta = document.getElementById('op-restar');
  var btnMult = document.getElementById('op-multiplicar');
  var btnDiv = document.getElementById('op-dividir');
  var btnMod = document.getElementById('op-modulo');
  var btnPow = document.getElementById('op-potencia');

  // Función auxiliar para leer inputs, ejecutar operación y mostrar resultado
  function ejecutarOperacion(opFn, simbolo) {
    // Leemos los valores escritos por el usuario
    var a = inputA.value;
    var b = inputB.value;

    // Ejecutamos la función de operación
    var res = opFn(a, b);

    // Mostramos en la consola y en la página
    console.log('Operación', simbolo, '->', a, simbolo, b, '=', res);
    resultadoBox.textContent = String(res);
  }

  // Asignamos los listeners solo si los botones existen
  if (btnSuma) { btnSuma.addEventListener('click', function(){ ejecutarOperacion(sumar, '+'); }); }
  if (btnResta) { btnResta.addEventListener('click', function(){ ejecutarOperacion(restar, '-'); }); }
  if (btnMult) { btnMult.addEventListener('click', function(){ ejecutarOperacion(multiplicar, '*'); }); }
  if (btnDiv) { btnDiv.addEventListener('click', function(){ ejecutarOperacion(dividir, '/'); }); }
  if (btnMod) { btnMod.addEventListener('click', function(){ ejecutarOperacion(modulo, '%'); }); }
  if (btnPow) { btnPow.addEventListener('click', function(){ ejecutarOperacion(potencia, '^'); }); }
});
