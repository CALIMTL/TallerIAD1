/* app.js
   Lógica de la calculadora web.
   Comentarios en español para principiantes.
   Evitamos sintaxis ES6 avanzada y usamos funciones ES5.
*/

// Validar que la expresión contiene sólo caracteres permitidos
function esExpresionValida(expr) {
  // Permitimos dígitos, espacios, operadores +-*/%(), punto y paréntesis
  var re = /^[0-9+\-*/%.()\s]+$/;
  return re.test(expr);
}

// Evaluar una expresión segura: validamos antes de usar Function
function evaluarExpresion(expr) {
  // Reemplazamos los símbolos ÷ y × si se usan (por seguridad)
  expr = expr.replace(/÷/g, '/').replace(/×/g, '*');

  if (!esExpresionValida(expr)) {
    return { error: 'Entrada inválida: caracteres no permitidos.' };
  }

  try {
    // Usamos Function en vez de eval por claridad; ya validamos la cadena
    // eslint-disable-next-line no-new-func
    var resultado = Function('return ' + expr)();

    // Comprobación simple de división por cero (si el resultado es Infinity o NaN)
    if (resultado === Infinity || resultado === -Infinity) {
      return { error: 'Error: división por cero.' };
    }
    if (isNaN(resultado)) {
      return { error: 'Resultado no numérico (NaN).' };
    }

    return { value: resultado };
  } catch (e) {
    return { error: 'Error al evaluar la expresión.' };
  }
}

// Código que conecta la UI y maneja teclado y clics
(function () {
  // Referencias a elementos
  var screen = document.getElementById('wc-screen');
  var keypad = document.querySelector('.webcalc-keypad');
  var clearBtn = document.getElementById('wc-clear');
  var equalsBtn = document.getElementById('wc-equals');

  // Estado actual de la pantalla
  var pantalla = '0';

  function actualizarPantalla() {
    screen.textContent = pantalla;
  }

  // Añadir un carácter a la pantalla (gestiona la sustitución del 0 inicial)
  function pushChar(ch) {
    if (pantalla === '0') {
      pantalla = String(ch);
    } else {
      pantalla += String(ch);
    }
    actualizarPantalla();
  }

  // Borrar última entrada
  function backspace() {
    if (pantalla.length <= 1) {
      pantalla = '0';
    } else {
      pantalla = pantalla.slice(0, -1);
    }
    actualizarPantalla();
  }

  // Limpiar todo
  function clearAll() {
    pantalla = '0';
    actualizarPantalla();
  }

  // Calcular expresión
  function calcular() {
    var expr = pantalla;
    var res = evaluarExpresion(expr);
    if (res.error) {
      screen.textContent = res.error;
      // Opcional: volver a mostrar el valor anterior tras 1.8s
      setTimeout(actualizarPantalla, 1800);
    } else {
      pantalla = String(res.value);
      actualizarPantalla();
    }
  }

  // Manejar click en botones (delegación)
  if (keypad) {
    keypad.addEventListener('click', function (e) {
      var btn = e.target;
      if (!btn.classList.contains('wc-btn')) return;
      var val = btn.getAttribute('data-value');

      if (btn.id === 'wc-clear') {
        clearAll();
        return;
      }
      if (btn.id === 'wc-equals') {
        calcular();
        return;
      }

      if (val) {
        pushChar(val);
      }
    });
  }

  // Manejar teclado: tanto Numpad como teclado alfanumérico
  document.addEventListener('keydown', function (e) {
    var key = e.key;

    // Mapear algunas teclas visuales a operadores si es necesario
    if ((key >= '0' && key <= '9') || key === '.' || key === '(' || key === ')') {
      e.preventDefault();
      pushChar(key);
      return;
    }

    if (key === 'Enter') {
      e.preventDefault();
      calcular();
      return;
    }

    if (key === 'Backspace') {
      e.preventDefault();
      backspace();
      return;
    }

    if (key === 'Escape') {
      e.preventDefault();
      clearAll();
      return;
    }

    // Operadores
    if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
      e.preventDefault();
      pushChar(key);
      return;
    }

    // Numpad keys (algunos navegadores usan nombres diferentes, manejamos por code)
    // example: NumpadMultiply, NumpadAdd, NumpadDecimal, NumpadSubtract
    if (e.code && e.code.indexOf('Numpad') === 0) {
      // extraer la parte posterior
      var np = e.code.replace('Numpad', '');
      if (np === 'Decimal') { e.preventDefault(); pushChar('.'); return; }
      if (np === 'Add') { e.preventDefault(); pushChar('+'); return; }
      if (np === 'Subtract') { e.preventDefault(); pushChar('-'); return; }
      if (np === 'Multiply') { e.preventDefault(); pushChar('*'); return; }
      if (np === 'Divide') { e.preventDefault(); pushChar('/'); return; }
      // si es un número (Numpad0..Numpad9)
      if (!isNaN(Number(np))) { e.preventDefault(); pushChar(np); return; }
    }
  });

  // Inicializar pantalla
  actualizarPantalla();
})();
