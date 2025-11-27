// Base de datos local de Combatientes UNSC - Halo Universe
var combatientes = {
    'master-chief': {
        id: 117,
        name: 'Master Chief',
        sprites: {
            other: { 'official-artwork': { front_default: 'https://via.placeholder.com/180/0066ff/00d4ff?text=Master+Chief' } },
            front_default: 'https://via.placeholder.com/180/0066ff/00d4ff?text=Master+Chief'
        },
        types: [{ type: { name: 'spartan' } }, { type: { name: 'fighting' } }],
        stats: [
            { stat: { name: 'hp' }, base_stat: 255 },
            { stat: { name: 'attack' }, base_stat: 230 },
            { stat: { name: 'defense' }, base_stat: 240 },
            { stat: { name: 'sp-atk' }, base_stat: 210 },
            { stat: { name: 'sp-def' }, base_stat: 220 },
            { stat: { name: 'speed' }, base_stat: 200 }
        ]
    },
    'cortana': {
        id: 201,
        name: 'Cortana',
        sprites: {
            other: { 'official-artwork': { front_default: 'https://via.placeholder.com/180/00d4ff/0066ff?text=Cortana' } },
            front_default: 'https://via.placeholder.com/180/00d4ff/0066ff?text=Cortana'
        },
        types: [{ type: { name: 'psychic' } }, { type: { name: 'water' } }],
        stats: [
            { stat: { name: 'hp' }, base_stat: 150 },
            { stat: { name: 'attack' }, base_stat: 100 },
            { stat: { name: 'defense' }, base_stat: 120 },
            { stat: { name: 'sp-atk' }, base_stat: 255 },
            { stat: { name: 'sp-def' }, base_stat: 240 },
            { stat: { name: 'speed' }, base_stat: 220 }
        ]
    },
    'arbiter': {
        id: 302,
        name: 'Arbiter',
        sprites: {
            other: { 'official-artwork': { front_default: 'https://via.placeholder.com/180/aa0000/ffff00?text=Arbiter' } },
            front_default: 'https://via.placeholder.com/180/aa0000/ffff00?text=Arbiter'
        },
        types: [{ type: { name: 'fighting' } }, { type: { name: 'dark' } }],
        stats: [
            { stat: { name: 'hp' }, base_stat: 220 },
            { stat: { name: 'attack' }, base_stat: 240 },
            { stat: { name: 'defense' }, base_stat: 200 },
            { stat: { name: 'sp-atk' }, base_stat: 180 },
            { stat: { name: 'sp-def' }, base_stat: 200 },
            { stat: { name: 'speed' }, base_stat: 210 }
        ]
    },
    'spartan-117': {
        id: 117,
        name: 'Spartan 117',
        sprites: {
            other: { 'official-artwork': { front_default: 'https://via.placeholder.com/180/0066ff/00d4ff?text=Spartan+117' } },
            front_default: 'https://via.placeholder.com/180/0066ff/00d4ff?text=Spartan+117'
        },
        types: [{ type: { name: 'spartan' } }, { type: { name: 'steel' } }],
        stats: [
            { stat: { name: 'hp' }, base_stat: 255 },
            { stat: { name: 'attack' }, base_stat: 230 },
            { stat: { name: 'defense' }, base_stat: 240 },
            { stat: { name: 'sp-atk' }, base_stat: 210 },
            { stat: { name: 'sp-def' }, base_stat: 220 },
            { stat: { name: 'speed' }, base_stat: 200 }
        ]
    },
    'noble-team': {
        id: 403,
        name: 'Noble Team',
        sprites: {
            other: { 'official-artwork': { front_default: 'https://via.placeholder.com/180/ff6600/ffff00?text=Noble+Team' } },
            front_default: 'https://via.placeholder.com/180/ff6600/ffff00?text=Noble+Team'
        },
        types: [{ type: { name: 'spartan' } }, { type: { name: 'flying' } }],
        stats: [
            { stat: { name: 'hp' }, base_stat: 200 },
            { stat: { name: 'attack' }, base_stat: 210 },
            { stat: { name: 'defense' }, base_stat: 180 },
            { stat: { name: 'sp-atk' }, base_stat: 190 },
            { stat: { name: 'sp-def' }, base_stat: 200 },
            { stat: { name: 'speed' }, base_stat: 220 }
        ]
    },
    'chief': {
        id: 117,
        name: 'Chief',
        sprites: {
            other: { 'official-artwork': { front_default: 'https://www.pngplay.com/wp-content/uploads/13/Halo-Transparent-PNG.png' } },
            front_default: 'https://via.placeholder.com/180/0066ff/00d4ff?text=Chief'
        },
        types: [{ type: { name: 'spartan' } }, { type: { name: 'steel' } }],
        stats: [
            { stat: { name: 'hp' }, base_stat: 255 },
            { stat: { name: 'attack' }, base_stat: 230 },
            { stat: { name: 'defense' }, base_stat: 240 },
            { stat: { name: 'sp-atk' }, base_stat: 210 },
            { stat: { name: 'sp-def' }, base_stat: 220 },
            { stat: { name: 'speed' }, base_stat: 200 }
        ]
    }
};

// Función para obtener combatiente de la BD local o de PokeAPI como fallback
function obtenerCombatiente(nombre) {
    var nombreNorm = nombre.toLowerCase().replace(/\s/g, '-');
    
    // Buscar en BD local Halo
    if (combatientes[nombreNorm]) {
        return Promise.resolve(combatientes[nombreNorm]);
    }
    
    // Si no está en BD local, intentar con PokeAPI como fallback
    return obtenerPokemonAPI(nombre);
}

// Función original: obtener de PokeAPI
function obtenerPokemonAPI(nombrePokemon) {
    var url = 'https://pokeapi.co/api/v2/pokemon/' + nombrePokemon.toLowerCase();  
    return fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado: ' + response.status);
            }
            return response.json();
        })
        .catch(function(error) {
            console.error('Hubo un problema con la solicitud Fetch:', error);
            throw error;
        });
} 