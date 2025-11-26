//Ejercicio: Array y objetos
//1. Array (listas)
//Crea una lista de tus 3 comidas favotritas
const comidasFavoritas = ["Pizza", "Sushi", "Tacos"];

//2. Objeto (key y value)
//Crea un objeto que represente a una persona con las siguientes propiedades: nombre, edad y ciudad
const persona = {
    nombre: "Juan",
    edad: 30,
    ciudad: "Madrid",
    habilidades: ["programación", "dibujo", "cocina"],
    estatura: 1.75,
    Programador:true
};
// ¿Como accedo a la propiredad "nombre" de mi objeto "persona"?
console.log('Nombre:', persona.nombre);
// ¿como accedo a la propiedad de habilidades de mi objeto persona?
console.log('Habilidades:', persona.habilidades);
// ¿Como puedo acceder a la habilidad de dibujo de mi objeto persona?
console.log('Habilidad de dibujo:', persona.habilidades[1]);

//3. Array de objetos 
// Crea una lista de 3 alumnos(objetos) con nombre y caificación)
const alumnos = [
    { nombre: "Ana", calificacion: 90 },
    { nombre: "Luis", calificacion: 80 },
    { nombre: "Marta", calificacion: 100 },
    { nombre: "Carlos",}
];
//Escribe un bucle que recorra el array de alumnos e imprima solo los que tengan una calificación mayor a 80
for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].calificacion > 80) {
        console.log('Alumno con calificación mayor a 80:', alumnos[i].nombre);
    }
}
