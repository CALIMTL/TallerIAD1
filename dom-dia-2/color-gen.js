/* color-gen.js
   Generador de colores aleatorios.
   Contiene lógica para generar colores hexadecimales y copiarlos al portapapeles.
   Comentarios en español, usando sintaxis ES5 compatible con principiantes.
*/

// Generar un color hexadecimal aleatorio
// Devuelve una cadena en formato #RRGGBB
function generarColorAleatorio() {
  // Math.random() genera un número entre 0 y 1
  // Math.floor() redondea hacia abajo
  // Multiplicamos por 16777215 (que es 0xFFFFFF en decimal, máximo color en hex)
  // toString(16) convierte a base 16 (hexadecimal)
  var numeroAleatorio = Math.floor(Math.random() * 16777215);
  
  // Convertimos a hexadecimal y rellenamos con ceros si es necesario
  var colorHex = '#' + ('0' + numeroAleatorio.toString(16).toUpperCase()).slice(-6);
  
  // Aseguramos que el resultado tenga 7 caracteres (#RRGGBB)
  // Si falta un cero al principio, lo añadimos
  if (colorHex.length < 7) {
    colorHex = '#' + ('000000' + numeroAleatorio.toString(16).toUpperCase()).slice(-6);
  }
  
  return colorHex;
}

// Copiar texto al portapapeles
// Si tiene éxito, muestra una confirmación visual temporal
function copiarAlPortapapeles(texto) {
  // Comprobamos si el navegador soporta la API Clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Usamos la API moderna (más segura)
    navigator.clipboard.writeText(texto).then(function() {
      console.log('Código de color copiado:', texto);
      // Mostramos confirmación visual (cambiar botón temporalmente)
      var btnCopiar = document.getElementById('cg-copy-btn');
      if (btnCopiar) {
        var textoOriginal = btnCopiar.textContent;
        btnCopiar.textContent = '¡Copiado!';
        btnCopiar.style.background = '#4caf50';
        // Volver al estado original después de 2 segundos
        setTimeout(function() {
          btnCopiar.textContent = textoOriginal;
          btnCopiar.style.background = '';
        }, 2000);
      }
    }).catch(function(err) {
      console.error('Error al copiar:', err);
      alert('No se pudo copiar el código. Intenta manualmente: ' + texto);
    });
  } else {
    // Fallback para navegadores antiguos: usar textarea temporal
    var textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      console.log('Código de color copiado (método antiguo):', texto);
      var btnCopiar = document.getElementById('cg-copy-btn');
      if (btnCopiar) {
        btnCopiar.textContent = '¡Copiado!';
        setTimeout(function() {
          btnCopiar.textContent = 'Copiar';
        }, 2000);
      }
    } catch (e) {
      console.error('Error al copiar (fallback):', e);
    }
    document.body.removeChild(textarea);
  }
}

// Conectar la UI al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos
  var colorBox = document.getElementById('cg-color-box');
  var hexDisplay = document.getElementById('cg-hex-display');
  var btnGenerar = document.getElementById('cg-generate-btn');
  var btnCopiar = document.getElementById('cg-copy-btn');
  
  // Salir si algún elemento no existe (no está el generador en esta página)
  if (!colorBox || !hexDisplay || !btnGenerar || !btnCopiar) {
    return;
  }
  
  // Color actual (inicializamos con uno aleatorio)
  var colorActual = generarColorAleatorio();
  
  // Función para aplicar un color: actualizar caja, texto y registrar en consola
  function aplicarColor(color) {
    colorActual = color;
    colorBox.style.backgroundColor = color;
    hexDisplay.textContent = color;
    console.log('Color generado:', color);
  }
  
  // Inicializar con un color aleatorio al cargar
  aplicarColor(colorActual);
  
  // Manejador para el botón "Generar Color"
  btnGenerar.addEventListener('click', function() {
    var nuevoColor = generarColorAleatorio();
    aplicarColor(nuevoColor);
  });
  
  // Manejador para el botón "Copiar"
  btnCopiar.addEventListener('click', function() {
    copiarAlPortapapeles(colorActual);
  });
  
  // Bonus: pulsar Enter también genera un color
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement === hexDisplay) {
      var nuevoColor = generarColorAleatorio();
      aplicarColor(nuevoColor);
    }
  });
});
