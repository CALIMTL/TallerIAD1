/* clock.js
   ========================================================
   RELOJ DIGITAL INTERACTIVO CON ALARMA
   ========================================================
   
   Características principales:
   ✓ Display digital actualizado cada segundo (HH:MM:SS)
   ✓ Fecha completa en español (Día, DD de Mes de YYYY)
   ✓ Sistema de alarma con validación (solo horas futuras)
   ✓ Notificación visual y sonora cuando suena la alarma
   ✓ Toggle entre modo 24h y 12h (AM/PM)
   ✓ Saludos dinámicos según la hora del día
   ✓ Comentarios explicativos detallados para aprendizaje
   ✓ Sintaxis ES5 compatible con navegadores antiguos
*/

/* ============================================
   SECCIÓN 1: DATOS ESTÁTICOS (ARRAYS)
   ============================================ */

// Array que almacena los nombres de todos los meses en español
// Se usa para convertir números (0-11) a nombres legibles
var nombresMeses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Array que almacena los nombres de todos los días de la semana en español
// Se usa para convertir números (0-6) a nombres legibles
var nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/* ============================================
   SECCIÓN 2: VARIABLES GLOBALES DE ESTADO
   ============================================ */

// VARIABLE: alarmaActiva
// Propósito: almacenar si la alarma está activada o no
// Tipo: boolean (true = activa, false = inactiva)
var alarmaActiva = false;

// VARIABLE: horaAlarma
// Propósito: almacenar la hora a la que debe sonar la alarma
// Tipo: string o null
// Formato: "HH:MM" (ej: "14:30")
var horaAlarma = null;

// VARIABLE: modo24h
// Propósito: controlar el formato de la hora mostrada
// Tipo: boolean (true = 24h, false = 12h con AM/PM)
var modo24h = true;

// VARIABLE: alarmaYaSonada
// Propósito: evitar que la alarma se dispare múltiples veces en el mismo minuto
// Tipo: boolean
var alarmaYaSonada = false;

/* ============================================
   SECCIÓN 3: FUNCIONES AUXILIARES
   ============================================ */

/**
 * FUNCIÓN: padZero()
 * PROPÓSITO: agregar un cero a la izquierda si el número es menor a 10
 * 
 * EJEMPLO:
 *   padZero(5)  -> "05"
 *   padZero(15) -> "15"
 *   padZero(0)  -> "00"
 *
 * @param {number} num - número a formatear (0-59 generalmente)
 * @returns {string} - número con cero a la izquierda si es necesario
 */
function padZero(num) {
  // Si el número es menor a 10, concatenar "0" + número
  // Si no, simplemente convertir a string
  return (num < 10 ? '0' : '') + num;
}

/**
 * FUNCIÓN: obtenerSaludo()
 * PROPÓSITO: determinar el saludo apropiado según la hora del día
 * 
 * RANGO DE HORAS:
 *   05:00 - 11:59 -> "Buenos días"
 *   12:00 - 17:59 -> "Buenas tardes"
 *   18:00 - 04:59 -> "Buenas noches"
 *
 * @param {number} horas - hora actual (formato 24h: 0-23)
 * @returns {string} - saludo apropiado
 */
function obtenerSaludo(horas) {
  // Si la hora está entre 5 y 12 (exclusive)
  if (horas >= 5 && horas < 12) {
    return 'Buenos días';
  }
  // Si la hora está entre 12 y 18 (exclusive)
  else if (horas >= 12 && horas < 18) {
    return 'Buenas tardes';
  }
  // Para el resto de horas (18-04:59)
  else {
    return 'Buenas noches';
  }
}

/**
 * FUNCIÓN: formatearHora()
 * PROPÓSITO: convertir hora a formato de texto legible (24h o 12h)
 * 
 * EJEMPLOS:
 *   formatearHora(14, 30, 5) en 24h  -> "14:30:05"
 *   formatearHora(14, 30, 5) en 12h  -> "02:30:05 PM"
 *   formatearHora(0, 30, 5) en 12h   -> "12:30:05 AM"
 *
 * @param {number} horas - horas (0-23)
 * @param {number} minutos - minutos (0-59)
 * @param {number} segundos - segundos (0-59)
 * @returns {string} - hora formateada
 */
function formatearHora(horas, minutos, segundos) {
  var horaFormato = horas;
  var periodo = '';

  // Si estamos en modo 12h, convertir a formato AM/PM
  if (!modo24h) {
    // Determinar si es AM (mañana) o PM (tarde/noche)
    periodo = horas >= 12 ? ' PM' : ' AM';
    
    // Convertir hora de formato 24h (0-23) a 12h (1-12)
    horaFormato = horas % 12;
    
    // Si la hora es 0 (medianoche), mostrarla como 12
    if (horaFormato === 0) {
      horaFormato = 12;
    }
  }

  // Devolver hora formateada con ceros a la izquierda
  // Ejemplo: "09:05:03" en lugar de "9:5:3"
  return padZero(horaFormato) + ':' + padZero(minutos) + ':' + padZero(segundos) + periodo;
}

/**
 * FUNCIÓN: obtenerFechaEspanol()
 * PROPÓSITO: convertir objeto Date a fecha formateada en español
 * 
 * EJEMPLO:
 *   Date(2025-11-26) -> "Miércoles, 26 de Noviembre de 2025"
 *
 * @param {Date} fecha - objeto Date con la fecha
 * @returns {string} - fecha formateada en español
 */
function obtenerFechaEspanol(fecha) {
  // getDay() devuelve 0-6, usamos ese índice en nombresDias
  var dia = nombresDias[fecha.getDay()];
  
  // getDate() devuelve el día del mes (1-31)
  var numDia = fecha.getDate();
  
  // getMonth() devuelve 0-11, usamos ese índice en nombresMeses
  var mes = nombresMeses[fecha.getMonth()];
  
  // getFullYear() devuelve el año completo (4 dígitos)
  var anio = fecha.getFullYear();

  // Retornar cadena formateada: "Día, DD de Mes de YYYY"
  return dia + ', ' + numDia + ' de ' + mes + ' de ' + anio;
}

/* ============================================
   SECCIÓN 4: FUNCIÓN PRINCIPAL DEL RELOJ
   ============================================ */

/**
 * FUNCIÓN: actualizarReloj()
 * PROPÓSITO: actualizar el reloj y verificar alarma (se llama cada segundo)
 * 
 * PASOS QUE REALIZA:
 * 1. Obtener hora/fecha actual
 * 2. Actualizar display del reloj
 * 3. Actualizar display de la fecha
 * 4. Actualizar saludo según hora
 * 5. Verificar si la alarma debe sonar
 */
function actualizarReloj() {
  // Crear objeto Date con la hora/fecha actual del sistema
  var ahora = new Date();
  
  // Extraer componentes de la hora
  var horas = ahora.getHours();      // 0-23
  var minutos = ahora.getMinutes();  // 0-59
  var segundos = ahora.getSeconds(); // 0-59

  // Obtener referencias a los elementos del DOM
  var displayReloj = document.getElementById('clock-display');
  var displayFecha = document.getElementById('clock-date');
  var displaySaludo = document.getElementById('clock-greeting');

  // ACTUALIZAR DISPLAY DEL RELOJ
  // Si el elemento existe en la página, actualizar su contenido
  if (displayReloj) {
    displayReloj.textContent = formatearHora(horas, minutos, segundos);
  }

  // ACTUALIZAR DISPLAY DE LA FECHA
  if (displayFecha) {
    displayFecha.textContent = obtenerFechaEspanol(ahora);
  }

  // ACTUALIZAR SALUDO
  if (displaySaludo) {
    displaySaludo.textContent = obtenerSaludo(horas);
  }

  // VERIFICAR SI LA ALARMA DEBE SONAR
  // Solo verificamos si:
  // 1. La alarma está activa (alarmaActiva === true)
  // 2. Hay una hora de alarma configurada (horaAlarma !== null)
  if (alarmaActiva && horaAlarma) {
    // Crear cadena con hora actual en formato "HH:MM"
    var horaActualStr = padZero(horas) + ':' + padZero(minutos);
    
    // Comparar hora actual con hora de alarma
    // Si coinciden y no ha sonado en este minuto, sonar
    if (horaActualStr === horaAlarma && !alarmaYaSonada) {
      sonarAlarma();
      alarmaYaSonada = true; // Evitar disparos múltiples
    }
    // Si la hora cambió, permitir que suene en el próximo minuto coincidente
    else if (horaActualStr !== horaAlarma) {
      alarmaYaSonada = false;
    }
  }
}

/* ============================================
   SECCIÓN 5: FUNCIONES DE ALARMA
   ============================================ */

/**
 * FUNCIÓN: sonarAlarma()
 * PROPÓSITO: ejecutar la secuencia de alarma (sonido, notificación visual, etc.)
 * 
 * ACCIONES:
 * 1. Mostrar notificación visual con animación
 * 2. Reproducir sonido (Web Audio API o alert como fallback)
 * 3. Desactivar la alarma automáticamente
 * 4. Mostrar mensaje en consola
 */
function sonarAlarma() {
  // PASO 1: REGISTRO EN CONSOLA
  console.log('¡¡¡ ALARMA ¡¡¡ Son las ' + horaAlarma);

  // PASO 2: MOSTRAR NOTIFICACIÓN VISUAL
  var notificacion = document.getElementById('clock-alarm-notification');
  
  if (notificacion) {
    // Hacer visible el elemento (por defecto está oculto con display:none)
    notificacion.style.display = 'block';
    
    // Agregar clase CSS para activar la animación de parpadeo
    notificacion.classList.add('alarm-active');
    
    // Mostrar mensaje en la notificación
    notificacion.textContent = '¡¡¡ ALARMA ¡¡¡  Son las ' + horaAlarma;
  }

  // PASO 3: REPRODUCIR SONIDO
  // Intentamos usar Web Audio API (funciona en navegadores modernos)
  try {
    // Crear contexto de audio
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Crear oscilador (generador de onda sonora)
    var oscillator = audioContext.createOscillator();
    
    // Crear nodo de ganancia (control de volumen)
    var gain = audioContext.createGain();

    // Conectar componentes: oscillator -> gain -> altavoz
    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    // Configurar parámetros del sonido
    oscillator.frequency.value = 800;  // Frecuencia en Hz (sonido agudo)
    oscillator.type = 'sine';          // Tipo de onda (onda senoidal suave)

    // Configurar envolvente de volumen: empezar fuerte y bajar
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    // Reproducir sonido durante 0.5 segundos
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
  } catch (e) {
    // Si falla la Web Audio API, usar alert como alternativa
    console.warn('Web Audio API no disponible, usando alert');
    alert('¡¡¡ALARMA!!! Son las ' + horaAlarma);
  }

  // PASO 4: DESACTIVAR ALARMA AUTOMÁTICAMENTE
  alarmaActiva = false;
  horaAlarma = null;
  
  // Actualizar el display del estado
  actualizarEstadoAlarma();
}

/**
 * FUNCIÓN: actualizarEstadoAlarma()
 * PROPÓSITO: actualizar el texto e ícono del estado de la alarma
 */
function actualizarEstadoAlarma() {
  var estadoEl = document.getElementById('clock-alarm-status');
  
  if (estadoEl) {
    if (alarmaActiva && horaAlarma) {
      // Mostrar que hay alarma activa
      estadoEl.textContent = '⏰ Alarma establecida para las ' + horaAlarma;
      estadoEl.className = 'clock-alarm-status alarm-active-indicator';
    } else {
      // Mostrar que no hay alarma
      estadoEl.textContent = 'Sin alarma establecida';
      estadoEl.className = 'clock-alarm-status';
    }
  }
}

/**
 * FUNCIÓN: establecerAlarma()
 * PROPÓSITO: validar y guardar una nueva alarma
 * 
 * VALIDACIONES:
 * - Verificar que el input no esté vacío
 * - Verificar que la hora sea en el futuro (no pasada)
 */
function establecerAlarma() {
  // Obtener referencia al input
  var inputHora = document.getElementById('clock-alarm-input');
  
  // VALIDACIÓN 1: Input debe existir y tener valor
  if (!inputHora || !inputHora.value) {
    alert('Por favor selecciona una hora para la alarma');
    return;
  }

  // Obtener la hora seleccionada (formato "HH:MM" del input type="time")
  var horaSeleccionada = inputHora.value;
  
  // Obtener la hora actual
  var ahora = new Date();
  var horaActualStr = padZero(ahora.getHours()) + ':' + padZero(ahora.getMinutes());

  // VALIDACIÓN 2: La hora debe ser en el futuro
  // Comparamos strings "HH:MM" (funciona porque ambos usan formato 24h)
  if (horaSeleccionada <= horaActualStr) {
    alert('Hora actual: ' + horaActualStr + '\n\nPor favor selecciona una hora futura');
    return;
  }

  // Si pasó todas las validaciones, almacenar la alarma
  horaAlarma = horaSeleccionada;
  alarmaActiva = true;
  alarmaYaSonada = false; // Reiniciar flag
  
  // Actualizar display
  actualizarEstadoAlarma();
  
  // Mostrar confirmación en consola y navegador
  console.log('✓ Alarma establecida para las ' + horaAlarma);
  alert('✓ Alarma establecida para las ' + horaAlarma);
}

/**
 * FUNCIÓN: cancelarAlarma()
 * PROPÓSITO: desactivar la alarma actual y ocultar notificaciones
 */
function cancelarAlarma() {
  // Desactivar alarma
  alarmaActiva = false;
  horaAlarma = null;
  alarmaYaSonada = false;
  
  // Obtener referencia a la notificación
  var notificacion = document.getElementById('clock-alarm-notification');
  
  // Ocultar notificación si existe
  if (notificacion) {
    notificacion.style.display = 'none';
    notificacion.classList.remove('alarm-active');
  }
  
  // Actualizar display del estado
  actualizarEstadoAlarma();
  
  // Mostrar confirmación
  console.log('✓ Alarma cancelada');
  alert('✓ Alarma cancelada');
}

/**
 * FUNCIÓN: toggleModo()
 * PROPÓSITO: cambiar entre modo 24h y modo 12h (AM/PM)
 */
function toggleModo() {
  // Invertir el booleano (cambiar modo)
  modo24h = !modo24h;
  
  // Obtener referencia al botón
  var btnModo = document.getElementById('clock-toggle-mode');
  
  // Actualizar texto del botón
  if (btnModo) {
    btnModo.textContent = modo24h ? 'Modo: 24h ✓' : 'Modo: 12h ✓';
  }
  
  // Actualizar inmediatamente el reloj con el nuevo formato
  actualizarReloj();
  
  // Mostrar nuevo modo en consola
  console.log('✓ Modo cambiado a: ' + (modo24h ? '24 horas' : '12 horas (AM/PM)'));
}

/* ============================================
   SECCIÓN 6: INICIALIZACIÓN (DOMContentLoaded)
   ============================================ */

/**
 * EVENTO: DOMContentLoaded
 * PROPÓSITO: inicializar el reloj cuando la página ha cargado completamente
 * 
 * ACCIONES:
 * 1. Verificar que el reloj exista en la página
 * 2. Actualizar reloj inmediatamente
 * 3. Configurar actualización cada segundo
 * 4. Asignar listeners a botones
 */
document.addEventListener('DOMContentLoaded', function () {
  // Buscar elementos principales del reloj
  var displayReloj = document.getElementById('clock-display');
  var btnEstablecer = document.getElementById('clock-set-alarm');
  var btnCancelar = document.getElementById('clock-cancel-alarm');
  var btnToggle = document.getElementById('clock-toggle-mode');

  // Si no existe el reloj en la página, salir sin hacer nada
  if (!displayReloj) {
    console.log('⚠ Reloj digital no encontrado en la página');
    return;
  }

  // ACCIÓN 1: Actualizar reloj inmediatamente (sin esperar 1 segundo)
  actualizarReloj();
  actualizarEstadoAlarma();

  // ACCIÓN 2: Configurar actualización automática cada 1000ms (1 segundo)
  // Esta es la línea clave que mantiene el reloj "vivo"
  setInterval(actualizarReloj, 1000);

  // ACCIÓN 3: Asignar listeners a los botones

  // Botón "Establecer Alarma"
  if (btnEstablecer) {
    btnEstablecer.addEventListener('click', establecerAlarma);
  }

  // Botón "Cancelar Alarma"
  if (btnCancelar) {
    btnCancelar.addEventListener('click', cancelarAlarma);
  }

  // Botón "Toggle Modo 24h/12h"
  if (btnToggle) {
    btnToggle.addEventListener('click', toggleModo);
  }

  // BONUS: Soportar Enter en el input de hora (para UX mejorada)
  var inputHora = document.getElementById('clock-alarm-input');
  if (inputHora) {
    inputHora.addEventListener('keydown', function (e) {
      // Si presionan Enter, establecer alarma
      if (e.key === 'Enter') {
        establecerAlarma();
      }
    });
  }

  // Mostrar en consola que todo está listo
  console.log('✓✓✓ Reloj digital inicializado correctamente ✓✓✓');
});
