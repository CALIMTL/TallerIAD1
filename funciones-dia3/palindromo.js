//Ejercicio: Detección de palíndromos
//Objetivo: crea un logica compleja encapsulada en una función
//Un ejemplo de palindromo es "anilina" o "reconocer"
//1. Crea una funcion llamada esPalindromo que reciba un texto y retorne true si es palindromo
// o false si no lo es

function esPalindromo(texto) {
    // Convertir a minúsculas y eliminar espacios en blanco
    var textoLimpio = texto.toLowerCase().replace(/\s/g, '');
    // Obtener la longitud del texto limpio
    var longitud = textoLimpio.length;
    // Comparar caracteres desde el inicio y el final hacia el centro
    for (var i = 0; i < longitud / 2; i++) {
        if (textoLimpio[i] !== textoLimpio[longitud - 1 - i]) {
            return false; // No es palíndromo
        }
    }
    return true; // Es palíndromo
}