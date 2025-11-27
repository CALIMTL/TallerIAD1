/* ============================================
   ANALIZADOR DE TEXTO EN TIEMPO REAL
   ============================================
   
   ARCHIVO: text-analyzer.js
   PROPÓSITO: Análisis dinámico de texto con estadísticas en tiempo real
   
   CARACTERÍSTICAS:
   - Contador de caracteres (con y sin espacios)
   - Contador de palabras
   - Contador de oraciones
   - Cálculo de tiempo de lectura estimado
   - Validación de texto vacío
   - Animaciones sutiles en actualizaciones
   - Funcionalidad copiar estadísticas al portapapeles
   
   VARIABLES GLOBALES:
   - inputElement: referencia al textarea
   - statElements: objeto con referencias a todos los elementos de estadísticas
   - CHARS_PER_MINUTE: constante para cálculo de lectura
*/

// Constante: palabras por minuto para cálculo de lectura
// (estándar en industria de lectura rápida)
var WORDS_PER_MINUTE = 200;

/**
 * FUNCIÓN: contarCaracteresConEspacios()
 * PROPÓSITO: contar todos los caracteres incluidos espacios y saltos de línea
 * 
 * @param {string} texto - texto a analizar
 * @returns {number} - cantidad total de caracteres
 * 
 * EJEMPLO:
 *   contarCaracteresConEspacios("Hola mundo") -> 10
 *   (H-o-l-a-espacio-m-u-n-d-o = 10 caracteres)
 */
function contarCaracteresConEspacios(texto) {
  // length devuelve el número de caracteres en la cadena
  // incluyendo espacios, tabulaciones y saltos de línea
  return texto.length;
}

/**
 * FUNCIÓN: contarCaracteresSinEspacios()
 * PROPÓSITO: contar caracteres pero SIN espacios en blanco
 * 
 * PROCESO:
 * 1. Usar regex /\s/g para encontrar todos los espacios en blanco
 * 2. \s = cualquier espacio (espacio, tab, salto de línea)
 * 3. /g = flag global (buscar TODOS, no solo el primero)
 * 4. .replace(regex, '') = reemplazar con cadena vacía
 * 5. Contar longitud del resultado
 * 
 * @param {string} texto - texto a analizar
 * @returns {number} - cantidad de caracteres sin espacios
 * 
 * EJEMPLO:
 *   contarCaracteresSinEspacios("Hola mundo") 
 *   -> "Holamundo" (quitar espacio)
 *   -> 9 caracteres
 */
function contarCaracteresSinEspacios(texto) {
  // /\s/g busca TODOS los espacios en blanco (espacio, tab, salto línea)
  // .replace() los reemplaza por cadena vacía ''
  // .length devuelve la cantidad de caracteres restantes
  var sinEspacios = texto.replace(/\s/g, '');
  return sinEspacios.length;
}

/**
 * FUNCIÓN: contarPalabras()
 * PROPÓSITO: contar palabras (separadas por espacios)
 * 
 * PROCESO:
 * 1. Usar trim() para eliminar espacios al inicio/final
 * 2. Si texto vacío después de trim, devolver 0
 * 3. Si no vacío, dividir por /\s+/ (1 o más espacios)
 * 4. split() devuelve array, .length es la cantidad
 * 
 * CASOS ESPECIALES:
 * - Múltiples espacios: "Hola    mundo" -> ["Hola", "mundo"] = 2 palabras
 * - Espacios al inicio/final: "  Hola mundo  " se convierte en "Hola mundo"
 * 
 * @param {string} texto - texto a analizar
 * @returns {number} - cantidad de palabras
 * 
 * EJEMPLO:
 *   contarPalabras("Hola mundo, ¿cómo estás?")
 *   -> ["Hola", "mundo,", "¿cómo", "estás?"]
 *   -> 4 palabras
 */
function contarPalabras(texto) {
  // trim() elimina espacios al inicio y final
  var textoLimpio = texto.trim();
  
  // Si después de limpiar queda vacío, no hay palabras
  if (textoLimpio === '') {
    return 0;
  }
  
  // /\s+/g busca 1 o más espacios en blanco (consideramos como separador)
  // split() divide la cadena en array por el patrón
  var palabras = textoLimpio.split(/\s+/);
  
  // .length devuelve cantidad de elementos en el array
  return palabras.length;
}

/**
 * FUNCIÓN: contarOraciones()
 * PROPÓSITO: contar oraciones (terminadas por . ! ?)
 * 
 * PROCESO:
 * 1. Usar regex para buscar los 3 caracteres que terminan oraciones
 * 2. /[.!?]/g busca punto, exclamación o interrogación
 * 3. match() devuelve array con coincidencias o null si no hay
 * 4. Si no hay match, devolver 0
 * 5. Si hay match, devolver cantidad de elementos
 * 
 * NOTA: Esta es una aproximación simple. Las oraciones reales
 * pueden ser más complejas (abreviaturas, números decimales, etc.)
 * 
 * @param {string} texto - texto a analizar
 * @returns {number} - cantidad de oraciones detectadas
 * 
 * EJEMPLO:
 *   contarOraciones("Hola. ¿Cómo estás? ¡Bien!")
 *   -> coincidencias: ['.', '?', '!']
 *   -> 3 oraciones
 */
function contarOraciones(texto) {
  // /[.!?]/g busca punto (.), admiración (!) o interrogación (?)
  // [.!?] = cualquiera de estos caracteres
  // /g = flag global (buscar TODOS, no solo el primero)
  var coincidencias = texto.match(/[.!?]/g);
  
  // Si no hay coincidencias, match() devuelve null
  // En ese caso, devolver 0
  if (coincidencias === null) {
    return 0;
  }
  
  // Si hay coincidencias, .length devuelve la cantidad
  return coincidencias.length;
}

/**
 * FUNCIÓN: calcularTiempoLectura()
 * PROPÓSITO: calcular tiempo estimado de lectura en minutos
 * 
 * FÓRMULA:
 * Tiempo (minutos) = Número de palabras / Palabras por minuto
 * 
 * EJEMPLO:
 * Si hay 400 palabras y se leen 200 palabras por minuto:
 * 400 / 200 = 2 minutos
 * 
 * NOTA IMPORTANTE:
 * - Usamos Math.ceil() para redondear hacia arriba
 * - Así 1 palabra da 1 minuto (no 0)
 * - Si 0 palabras, result es 0 (sin redondear)
 * 
 * @param {number} palabras - cantidad de palabras en el texto
 * @returns {number} - minutos redondeados hacia arriba
 * 
 * EJEMPLOS:
 *   calcularTiempoLectura(0)   -> 0 min (vacío)
 *   calcularTiempoLectura(100) -> 1 min (100/200 = 0.5 → ceil = 1)
 *   calcularTiempoLectura(400) -> 2 min (400/200 = 2)
 *   calcularTiempoLectura(450) -> 3 min (450/200 = 2.25 → ceil = 3)
 */
function calcularTiempoLectura(palabras) {
  // Evitar división por cero y casos edge
  if (palabras === 0) {
    return 0;
  }
  
  // Dividir palabras entre palabras por minuto
  var tiempoExacto = palabras / WORDS_PER_MINUTE;
  
  // Math.ceil() redondea hacia arriba (siempre sube)
  // Así 0.1 minutos se convierte en 1 minuto
  // y 2.1 minutos se convierte en 3 minutos
  var tiempoRedondeado = Math.ceil(tiempoExacto);
  
  return tiempoRedondeado;
}

/**
 * FUNCIÓN: formatearEstadisticas()
 * PROPÓSITO: crear una cadena con todas las estadísticas para copiar
 * 
 * PROCESO:
 * 1. Obtener referencia al textarea
 * 2. Extraer el texto actual
 * 3. Calcular todas las métricas
 * 4. Crear string formateado con líneas separadas
 * 5. Devolver la cadena
 * 
 * @returns {string} - estadísticas formateadas para copiar
 * 
 * EJEMPLO DE OUTPUT:
 *   "ESTADÍSTICAS DEL TEXTO
 *    ======================
 *    Caracteres (con espacios): 125
 *    Caracteres (sin espacios): 108
 *    Palabras: 20
 *    Oraciones: 3
 *    Tiempo de lectura: 1 minuto"
 */
function formatearEstadisticas() {
  // Obtener referencia al textarea
  var inputElement = document.getElementById('ta-input');
  
  // Si no existe el elemento, devolver cadena vacía
  if (!inputElement) {
    return '';
  }
  
  // Obtener el texto actual
  var texto = inputElement.value;
  
  // Calcular todas las métricas
  var charsConEspacios = contarCaracteresConEspacios(texto);
  var charsSinEspacios = contarCaracteresSinEspacios(texto);
  var palabras = contarPalabras(texto);
  var oraciones = contarOraciones(texto);
  var tiempoLectura = calcularTiempoLectura(palabras);
  
  // Crear cadena con formato legible para copiar
  var estadisticas = 'ESTADÍSTICAS DEL TEXTO\n';
  estadisticas += '======================\n';
  estadisticas += 'Caracteres (con espacios): ' + charsConEspacios + '\n';
  estadisticas += 'Caracteres (sin espacios): ' + charsSinEspacios + '\n';
  estadisticas += 'Palabras: ' + palabras + '\n';
  estadisticas += 'Oraciones: ' + oraciones + '\n';
  estadisticas += 'Tiempo de lectura: ' + tiempoLectura + ' minuto' + (tiempoLectura !== 1 ? 's' : '');
  
  return estadisticas;
}

/**
 * FUNCIÓN: actualizarEstadisticas()
 * PROPÓSITO: actualizar el display de todas las estadísticas
 * 
 * PROCESO:
 * 1. Obtener referencia al textarea
 * 2. Obtener el texto actual
 * 3. Calcular todas las métricas
 * 4. Actualizar cada elemento del DOM con su valor
 * 
 * ELEMENTOS ACTUALIZADOS:
 * - ta-chars-with-spaces: caracteres con espacios
 * - ta-chars-without-spaces: caracteres sin espacios
 * - ta-word-count: número de palabras
 * - ta-sentence-count: número de oraciones
 * - ta-reading-time: tiempo de lectura estimado
 */
function actualizarEstadisticas() {
  // Obtener referencia al textarea
  var inputElement = document.getElementById('ta-input');
  
  // Si no existe el textarea, salir sin hacer nada
  if (!inputElement) {
    console.warn('Textarea con ID ta-input no encontrado');
    return;
  }
  
  // Obtener el texto actual del textarea
  var texto = inputElement.value;
  
  // CALCULAR TODAS LAS MÉTRICAS
  var charsConEspacios = contarCaracteresConEspacios(texto);
  var charsSinEspacios = contarCaracteresSinEspacios(texto);
  var palabras = contarPalabras(texto);
  var oraciones = contarOraciones(texto);
  var tiempoLectura = calcularTiempoLectura(palabras);
  
  // ACTUALIZAR ELEMENTOS DEL DOM
  // Cada elemento se actualiza si existe en la página
  
  // Elemento: Caracteres con espacios
  var elemCharsConEspacios = document.getElementById('ta-chars-with-spaces');
  if (elemCharsConEspacios) {
    elemCharsConEspacios.textContent = charsConEspacios;
  }
  
  // Elemento: Caracteres sin espacios
  var elemCharsSinEspacios = document.getElementById('ta-chars-without-spaces');
  if (elemCharsSinEspacios) {
    elemCharsSinEspacios.textContent = charsSinEspacios;
  }
  
  // Elemento: Número de palabras
  var elemPalabras = document.getElementById('ta-word-count');
  if (elemPalabras) {
    elemPalabras.textContent = palabras;
  }
  
  // Elemento: Número de oraciones
  var elemOraciones = document.getElementById('ta-sentence-count');
  if (elemOraciones) {
    elemOraciones.textContent = oraciones;
  }
  
  // Elemento: Tiempo de lectura
  var elemTiempoLectura = document.getElementById('ta-reading-time');
  if (elemTiempoLectura) {
    // Formato: "X min" (con manejo del plural)
    var textoTiempo = tiempoLectura + ' min';
    elemTiempoLectura.textContent = textoTiempo;
  }
}

/**
 * FUNCIÓN: limpiarTodo()
 * PROPÓSITO: resetear el textarea y todas las estadísticas
 * 
 * PROCESO:
 * 1. Obtener referencia al textarea
 * 2. Vaciar su contenido
 * 3. Hacer focus para que el usuario pueda seguir escribiendo
 * 4. Actualizar estadísticas (todas irán a 0)
 */
function limpiarTodo() {
  // Obtener referencia al textarea
  var inputElement = document.getElementById('ta-input');
  
  // Si existe, vaciar su contenido
  if (inputElement) {
    inputElement.value = '';
    
    // Hacer focus en el textarea para que el usuario pueda seguir escribiendo
    // sin tener que hacer clic de nuevo
    inputElement.focus();
  }
  
  // Actualizar estadísticas (mostrarán todos 0)
  actualizarEstadisticas();
  
  // Log en consola para debugging
  console.log('✓ Texto limpiado');
}

/**
 * FUNCIÓN: copiarEstadisticas()
 * PROPÓSITO: copiar las estadísticas al portapapeles del usuario
 * 
 * PROCESO:
 * 1. Validar que el texto no esté vacío
 * 2. Formatear las estadísticas
 * 3. Intentar copiar usando Clipboard API (moderna)
 * 4. Si falla Clipboard API, intentar con execCommand (antigua)
 * 5. Mostrar confirmación visual al usuario
 * 
 * NOTA: El navegador pide permiso para acceder al portapapeles
 */
function copiarEstadisticas() {
  // Obtener referencia al textarea
  var inputElement = document.getElementById('ta-input');
  
  // Validación: textarea debe existir
  if (!inputElement) {
    console.error('Textarea no encontrado');
    return;
  }
  
  // Obtener texto actual
  var texto = inputElement.value;
  
  // Validación: texto no debe estar vacío
  if (texto.trim() === '') {
    alert('Por favor escribe algo de texto primero');
    return;
  }
  
  // Formatear estadísticas
  var estadisticas = formatearEstadisticas();
  
  // INTENTAR MÉTODO 1: Clipboard API (moderna, recomendada)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(estadisticas)
      .then(function() {
        // Éxito: Mostrar confirmación visual
        console.log('✓ Estadísticas copiadas al portapapeles');
        alert('✓ Estadísticas copiadas al portapapeles');
        
        // Cambiar texto del botón temporalmente como confirmación visual
        var btnCopiar = document.getElementById('ta-copy-stats-btn');
        if (btnCopiar) {
          var textoOriginal = btnCopiar.textContent;
          btnCopiar.textContent = '✓ ¡Copiado!';
          
          // Restaurar texto después de 2 segundos
          setTimeout(function() {
            btnCopiar.textContent = textoOriginal;
          }, 2000);
        }
      })
      .catch(function(error) {
        // Si falla Clipboard API, intentar método antiguo
        console.warn('Clipboard API falló:', error);
        copiarAlPortapapelesAntiguo(estadisticas);
      });
  } else {
    // Si Clipboard API no disponible, usar método antiguo
    copiarAlPortapapelesAntiguo(estadisticas);
  }
}

/**
 * FUNCIÓN: copiarAlPortapapelesAntiguo()
 * PROPÓSITO: copiar texto usando método antiguo (execCommand)
 * 
 * PROCESO:
 * 1. Crear elemento textarea temporal
 * 2. Poner el texto a copiar
 * 3. Añadir al DOM
 * 4. Seleccionar todo el texto
 * 5. Ejecutar comando copy
 * 6. Remover el elemento temporal
 * 7. Mostrar confirmación
 * 
 * NOTA: Este método es más antiguo pero tiene mejor compatibilidad
 * 
 * @param {string} texto - texto a copiar
 */
function copiarAlPortapapelesAntiguo(texto) {
  // Crear elemento textarea temporal (invisible)
  var textarea = document.createElement('textarea');
  
  // Estilos para que sea invisible
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  
  // Poner el texto a copiar en el textarea
  textarea.value = texto;
  
  // Añadir al documento
  document.body.appendChild(textarea);
  
  // Seleccionar todo el contenido del textarea
  textarea.select();
  
  // Intentar ejecutar comando copy
  try {
    var success = document.execCommand('copy');
    
    if (success) {
      // Éxito: mostrar confirmación
      console.log('✓ Estadísticas copiadas al portapapeles (método antiguo)');
      alert('✓ Estadísticas copiadas al portapapeles');
      
      // Cambiar texto del botón temporalmente
      var btnCopiar = document.getElementById('ta-copy-stats-btn');
      if (btnCopiar) {
        var textoOriginal = btnCopiar.textContent;
        btnCopiar.textContent = '✓ ¡Copiado!';
        
        setTimeout(function() {
          btnCopiar.textContent = textoOriginal;
        }, 2000);
      }
    } else {
      console.error('execCommand("copy") falló');
      alert('No se pudo copiar. Por favor, intenta manualmente.');
    }
  } catch (error) {
    // Si hay error, mostrar mensaje
    console.error('Error al copiar:', error);
    alert('Error al copiar: ' + error.message);
  } finally {
    // SIEMPRE remover el textarea temporal (aunque falle)
    document.body.removeChild(textarea);
  }
}

/* ============================================
   INICIALIZACIÓN (DOMContentLoaded)
   ============================================ */

/**
 * EVENTO: DOMContentLoaded
 * PROPÓSITO: Configurar el analizador de texto cuando la página carga
 * 
 * PASOS:
 * 1. Verificar que el textarea existe
 * 2. Configurar evento input (actualización en tiempo real)
 * 3. Configurar botón limpiar
 * 4. Configurar botón copiar estadísticas
 * 5. Actualizar estadísticas iniciales (mostrar 0s)
 */
document.addEventListener('DOMContentLoaded', function() {
  // Obtener referencias a elementos principales
  var inputElement = document.getElementById('ta-input');
  var btnLimpiar = document.getElementById('ta-clear-btn');
  var btnCopiar = document.getElementById('ta-copy-stats-btn');
  
  // Validación: verificar que el textarea existe
  if (!inputElement) {
    console.log('⚠ Analizador de texto no encontrado en la página');
    return;
  }
  
  // CONFIGURAR ACTUALIZACIÓN EN TIEMPO REAL
  // El evento 'input' se dispara cada vez que el usuario escribe
  inputElement.addEventListener('input', function() {
    // Llamar a función que actualiza las estadísticas
    actualizarEstadisticas();
  });
  
  // CONFIGURAR BOTÓN LIMPIAR
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', limpiarTodo);
  }
  
  // CONFIGURAR BOTÓN COPIAR
  if (btnCopiar) {
    btnCopiar.addEventListener('click', copiarEstadisticas);
  }
  
  // Actualizar estadísticas iniciales (mostrar 0s)
  actualizarEstadisticas();
  
  // Log de confirmación
  console.log('✓✓✓ Analizador de texto inicializado correctamente ✓✓✓');
});
