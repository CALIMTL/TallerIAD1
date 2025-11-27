//crea una funcion para calcular el area de un circulo dado su radio
/**
 * Calcula el área de un círculo dado su radio
 * @param {number} radio - El radio del círculo en unidades de medida
 * @returns {number} El área del círculo calculada usando la fórmula: π * r²
 * @example
 * // Retorna aproximadamente 78.54
 * areaCirculo(5);
 */
function areaCirculo(radio) {
    //area = pi * r^2
    var area = Math.PI * Math.pow(radio, 2);
    return area;
}

//Crea una funcion para calcular el area de un rectangulo dado su base y altura
  

//vamos a calcular el volumen de un cilindro
//El volumen es area de la base (circulo) + altura
/**
 * Calcula el volumen de un cilindro basándose en el radio de la base y la altura.
 * 
 * La fórmula utilizada es: V = π * r² * h
 * donde r es el radio y h es la altura.
 * 
 * @param {number} radio - El radio de la base del cilindro en unidades de medida.
 * @param {number} altura - La altura del cilindro en las mismas unidades de medida.
 * @returns {number} El volumen del cilindro calculado.
 * 
 * @example
 * // Calcula el volumen de un cilindro con radio 5 y altura 10
 * const volumen = volumenCilindro(5, 10);
 * console.log(volumen); // Resultado: 785.3981633974483
 */
function volumenCilindro(radio, altura) {
    var areaBase = areaCirculo(radio);
    var volumen = areaBase * altura;
    return volumen;
}

//Crea un a función para calcular una derivada simple de una funcion polinomial de la forma ax^n
/**
 * Calcula la derivada de una función polinomial de la forma ax^n.
 * @param {number} a - Coeficiente del término polinomial.
 * @param {number} n - Exponente del término polinomial.
 * @returns {string} La derivada en formato "b*x^m", donde b es el nuevo coeficiente y m es el nuevo exponente.    
 * @example
 * // Retorna "6*x^2"
 * derivadaPolinomio(3, 3);
 * // Retorna "4*x^1"
 * derivadaPolinomio(2, 2);
 */
function derivadaPolinomio(a, n) {
    if (n === 0) {
        return "0";
    }
    var nuevoCoeficiente = a * n;
    var nuevoExponente = n - 1;
    return nuevoCoeficiente + "*x^" + nuevoExponente;
}

//crea una funcion para calcular una integral simple de una funcion polinomial de la forma ax^n
function integralPolinomio(a, n) {
    var nuevoExponente = n + 1;
    var nuevoCoeficiente = a / nuevoExponente;
    return nuevoCoeficiente + "*x^" + nuevoExponente + " + C";
}

