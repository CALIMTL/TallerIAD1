/**
 * UNSC HALO API - Centro de Monitoreo Militar
 * Sistema de rastreo de unidades, enemigos y activos del universo Halo
 * Requiere: API_KEY válida de Halo API (https://www.haloapi.com)
 */

// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================

const API_KEY = '<TU_API_KEY_AQUI>';
const API_BASE_URL = 'https://www.haloapi.com/api';

// Sección actual
let currentSection = 'personajes';

// Base de datos local de fallback (en caso de que la API no esté disponible)
const FALLBACK_UNITS = [
    {
        id: 1,
        name: 'Master Chief (Spartan-117)',
        faction: 'UNSC',
        status: 'Alive',
        rank: 'Spartan-II',
        lastLocation: 'Installation 07',
        game: 'Halo Infinite',
        image: '🎖️',
        emoji: true,
        armor: 'Mark VII',
        weapons: ['MA40 Assault Rifle', 'BR75 Battle Rifle'],
        achievements: ['Legendary Spartan', 'Halo Savior', 'Ancient Evil Destroyer'],
        description: 'Comandante supremo de las fuerzas UNSC, portador del título "Master Chief". Piloto legendario del Cortana con más de 30 años de servicio militar.'
    },
    {
        id: 2,
        name: 'Cortana',
        faction: 'UNSC',
        status: 'Active',
        rank: 'AI Smarty',
        lastLocation: 'Zeta Halo',
        game: 'Halo: The Master Chief Collection',
        image: '🤖',
        emoji: true,
        armor: 'Digital Matrix',
        weapons: ['MJOLNIR Systems', 'Network Defense'],
        achievements: ['Savior of Humanity', 'Covenant Defier', 'Legacy Guardian'],
        description: 'Inteligencia Artificial de clase Smarty creada a partir de patrones neurales del Dr. Halsey. Compañera de armas del Master Chief.'
    },
    {
        id: 3,
        name: 'Arbiter (Thel Vadam)',
        faction: 'Sangheili',
        status: 'Alive',
        rank: 'Elite Sangheili',
        lastLocation: 'Zeta Halo',
        game: 'Halo 3 & Infinite',
        image: '⚔️',
        emoji: true,
        armor: 'Arbiter Combat Harness',
        weapons: ['Energy Sword', 'Plasma Rifle'],
        achievements: ['Covenant Destroyer', 'Peace Maker', 'Unlikely Ally'],
        description: 'Líder Sangheili y ex-Arbiter del Covenant. Cambió de bando para luchar junto a Master Chief contra amenazas comunes.'
    },
    {
        id: 4,
        name: 'ODST Squad (Buck)',
        faction: 'UNSC',
        status: 'Alive',
        rank: 'Orbital Drop Shock Trooper',
        lastLocation: 'New Mombasa',
        game: 'Halo 3: ODST',
        image: '⛑️',
        emoji: true,
        armor: 'ODST Combat Suit',
        weapons: ['MA37 Assault Rifle', 'M7 SMG'],
        achievements: ['Urban Legend', 'Night Ops Master', 'Covenant Slayer'],
        description: 'Soldados de élite de caída orbital. Conocidos por su valentía y habilidades de combate en zona urbana. Liderados por el Sargento Buck.'
    },
    {
        id: 5,
        name: 'Atriox (Banished Leader)',
        faction: 'Banished',
        status: 'Active',
        rank: 'Warlord',
        lastLocation: 'Zeta Halo',
        game: 'Halo Wars 2 & Infinite',
        image: '👹',
        emoji: true,
        armor: 'Banished War Plate',
        weapons: ['Gravity Hammer', 'Plasma Cannon'],
        achievements: ['Halo Ring Conqueror', 'Master Chief Defeater', 'Banished Leader'],
        description: 'Líder carismático de los Banished, una facción rebelde de Elites. Enemigo principal en Halo Infinite, busca dominar la Instalación 07.'
    },
    {
        id: 6,
        name: 'Noble Leader (Carter-A259)',
        faction: 'UNSC',
        status: 'Dead',
        rank: 'Spartan-III Leader',
        lastLocation: 'Reach',
        game: 'Halo: Reach',
        image: '🛡️',
        emoji: true,
        armor: 'Mark V[B]',
        weapons: ['SRS99-S5 Sniper Rifle', 'M7 SMG'],
        achievements: ['Last Stand Defender', 'Reach Guardian', 'Noble Team Leader'],
        description: 'Comandante del Equipo Noble, un escuadrón de Spartan-III. Sacrificado en la defensa de Reach contra la invasión Covenant.'
    },
    {
        id: 7,
        name: 'Sergeant Johnson',
        faction: 'UNSC',
        status: 'Dead',
        rank: 'Sergeant Major',
        lastLocation: 'Installation Array',
        game: 'Halo: Combat Evolved',
        image: '👨‍✈️',
        emoji: true,
        armor: 'Marine Combat Suit',
        weapons: ['M90 CAWS Shotgun', 'GRD-7 Grenade Launcher'],
        achievements: ['Covenant Veteran', 'Ring Survivor', 'Halo Protector'],
        description: 'Experimentado Sargento Mayor de Marines UNSC. Sobrevivió a múltiples enfrentamientos contra el Covenant en los Halos.'
    },
    {
        id: 8,
        name: 'The Didact',
        faction: 'Forerunner',
        status: 'Destroyed',
        rank: 'Ancient Being',
        lastLocation: 'Installation 04 (Requiem)',
        game: 'Halo 4',
        image: '👻',
        emoji: true,
        armor: 'Forerunner Tech',
        weapons: ['Forerunner Powers', 'Gravity Beam'],
        achievements: ['Ancient Guardian', 'Human Digitizer', 'Requiem Master'],
        description: 'Antigua entidad Forerunner despertada de su letargo. Antagonista principal de Halo 4, representa el poder de civilizaciones extintas.'
    },
    {
        id: 9,
        name: 'Spartan Locke (Jameson Locke)',
        faction: 'UNSC',
        status: 'Alive',
        rank: 'Spartan-IV',
        lastLocation: 'Guardian Installation',
        game: 'Halo 5: Guardians',
        image: '🎯',
        emoji: true,
        armor: 'Mark VI',
        weapons: ['DMR', 'Plasma Rifle'],
        achievements: ['Spartan Hunter', 'Cortana Tracker', 'Guardian Survivor'],
        description: 'Spartan de cuarta generación especializado en búsqueda y captura. Persigue a Cortana y el Master Chief en Halo 5.'
    },
    {
        id: 10,
        name: 'Engineer (Engineer Combat Unit)',
        faction: 'Covenant',
        status: 'Unknown',
        rank: 'Support Unit',
        lastLocation: 'Covenant Installations',
        game: 'Halo Series',
        image: '🛸',
        emoji: true,
        armor: 'Covenant Tech',
        weapons: ['Repair Systems', 'Shield Generator'],
        achievements: ['Tech Support', 'Shield Master', 'Halo Survivor'],
        description: 'Unidades de combate y soporte del Covenant. Criaturas biomecánicas controladas para reparación y defensa de infraestructuras.'
    },
    {
        id: 11,
        name: 'Dr. Catherine Halsey',
        faction: 'UNSC',
        status: 'Alive',
        rank: 'Scientist',
        lastLocation: 'UNSC Infinity',
        game: 'Halo: The Master Chief Collection',
        image: '🔬',
        emoji: true,
        armor: 'Lab Coat',
        weapons: ['Scientific Knowledge', 'Spartan AI Creation'],
        achievements: ['Spartan Creator', 'Forerunner Scholar', 'AI Pioneer'],
        description: 'Brillante neurocirujana responsable del programa Spartan. Creadora de Cortana y arquitecta de los avances UNSC más importantes.'
    },
    {
        id: 12,
        name: 'The Warden Eternal',
        faction: 'Forerunner',
        status: 'Defeated',
        rank: 'Guardian Entity',
        lastLocation: 'Installation 04 (Zeta Halo)',
        game: 'Halo 5 & Infinite',
        image: '⚡',
        emoji: true,
        armor: 'Forerunner Construct',
        weapons: ['Installation Defense', 'Telekinesis'],
        achievements: ['Installation Guardian', 'Portal Keeper', 'Forerunner Sentinel'],
        description: 'Entidad de seguridad Forerunner que protege Instalación Halo. Enemigo recurrente que sirve como defensor de estructuras antiguas.'
    }
];

// BASE DE DATOS DE ARMAS HALO
const WEAPONS_DB = [
    {
        id: 101,
        name: 'MA40 Assault Rifle',
        faction: 'UNSC',
        type: 'Rifle',
        damage: 'Medio',
        fireRate: 'Rápida',
        image: '🔫',
        emoji: true,
        ammo: '5.56x45mm NATO',
        game: 'Halo Infinite',
        description: 'Rifle de asalto estándar UNSC. Arma versátil de corto a medio alcance con buena cadencia de fuego.'
    },
    {
        id: 102,
        name: 'Energy Sword',
        faction: 'Covenant',
        type: 'Melee',
        damage: 'Letal',
        fireRate: 'Rápida',
        image: '⚔️',
        emoji: true,
        ammo: 'Energía',
        game: 'Halo: Combat Evolved',
        description: 'Arma de hoja energética Sangheili. Instakilate en combate cuerpo a cuerpo. Icónica del Covenant.'
    },
    {
        id: 103,
        name: 'BR75 Battle Rifle',
        faction: 'UNSC',
        type: 'Rifle',
        damage: 'Alto',
        fireRate: 'Media',
        image: '🎯',
        emoji: true,
        ammo: '9.4x40mm',
        game: 'Halo 2',
        description: 'Rifle de batalla de precisión UNSC. Dispara en ráfagas de 3 balas. Excelente para duelos a media distancia.'
    },
    {
        id: 104,
        name: 'Plasma Rifle',
        faction: 'Covenant',
        type: 'Rifle',
        damage: 'Medio',
        fireRate: 'Media',
        image: '🔥',
        emoji: true,
        ammo: 'Plasma',
        game: 'Halo: Combat Evolved',
        description: 'Arma energética Covenant que dispara bolsas de plasma sobrecalentado. Causa sobrecarga de escudos.'
    },
    {
        id: 105,
        name: 'Gravity Hammer',
        faction: 'Banished',
        type: 'Melee',
        damage: 'Catastrófico',
        fireRate: 'Lenta',
        image: '🔨',
        emoji: true,
        ammo: 'Gravedad',
        game: 'Halo 2',
        description: 'Mazo que manipula campos gravitacionales. Arma definitiva de Atriox en Halo Infinite.'
    },
    {
        id: 106,
        name: 'M90 CAWS Shotgun',
        faction: 'UNSC',
        type: 'Shotgun',
        damage: 'Catastrófico',
        fireRate: 'Lenta',
        image: '💥',
        emoji: true,
        ammo: '8 Gauge',
        game: 'Halo: Combat Evolved',
        description: 'Escopeta UNSC de alcance corto. Devastadora en combate cercano. Arma legendaria del Sargento Johnson.'
    },
    {
        id: 107,
        name: 'Sniper Rifle (SRS99)',
        faction: 'UNSC',
        type: 'Rifle',
        damage: 'Instakilate',
        fireRate: 'Muy Lenta',
        image: '🎲',
        emoji: true,
        ammo: '14.5x114mm',
        game: 'Halo: Combat Evolved',
        description: 'Rifle de precisión de largo alcance. Una bala, una muerte. El arma favorita de Elite Operators.'
    },
    {
        id: 108,
        name: 'Plasma Grenade',
        faction: 'Covenant',
        type: 'Granada',
        damage: 'Alto',
        fireRate: 'N/A',
        image: '💣',
        emoji: true,
        ammo: 'Plasma',
        game: 'Halo: Combat Evolved',
        description: 'Granada de plasma que se adhiere a objetivos. Explota con retraso. Mortífera en áreas cerradas.'
    }
];

// BASE DE DATOS DE LUGARES HALO
const LOCATIONS_DB = [
    {
        id: 201,
        name: 'Installation 07 (Zeta Halo)',
        type: 'Instalación Forerunner',
        faction: 'Forerunner',
        image: '🌍',
        emoji: true,
        size: 'Gigantesco',
        inhabitants: 'Forerunner Sentinels, Flood, Banished',
        game: 'Halo Infinite',
        description: 'Anillo Halo incompleto descubierto en Infinite. Campo de batalla principal contra Atriox y los Banished. Centro neurálgico Forerunner.'
    },
    {
        id: 202,
        name: 'Reach',
        type: 'Colonia UNSC',
        faction: 'UNSC',
        image: '🏔️',
        emoji: true,
        size: 'Planeta',
        inhabitants: 'Humanos, Covenant (invasor)',
        game: 'Halo: Reach',
        description: 'Fortaleza militar UNSC devastada por el Covenant. Última línea de defensa en Halo Reach. Planeta natal del Equipo Noble.'
    },
    {
        id: 203,
        name: 'Installation 04 (El Arca)',
        type: 'Superarma Forerunner',
        faction: 'Forerunner',
        image: '⭕',
        emoji: true,
        size: 'Colosal',
        inhabitants: 'Forerunners (extintos), Flood, Covenant',
        game: 'Halo 3',
        description: 'Instalación de control maestro de todos los Halos. Destruida en Halo 3. Ubicación final épica de la trilogía clásica.'
    },
    {
        id: 204,
        name: 'New Mombasa',
        type: 'Ciudad Urbana',
        faction: 'UNSC',
        image: '🌃',
        emoji: true,
        size: 'Metrópolis',
        inhabitants: 'Civiles UNSC, Covenant invasor',
        game: 'Halo 3: ODST',
        description: 'Ciudad africana ocupada por fuerzas Covenant. Escenario de ODST. Ambiente noir urbano diferente a otros Halos.'
    },
    {
        id: 205,
        name: 'Requiem',
        type: 'Estructura Forerunner',
        faction: 'Forerunner',
        image: '🔷',
        emoji: true,
        size: 'Colosal',
        inhabitants: 'Forerunner AI, Prometheans',
        game: 'Halo 4',
        description: 'Escudo de defensa Forerunner que despierta en Halo 4. Hogar del Didact. Mundo alienígena misterioso.'
    },
    {
        id: 206,
        name: 'Extraño Anillo (Instalación 04B)',
        type: 'Anillo Halo Secundario',
        faction: 'Forerunner',
        image: '💫',
        emoji: true,
        size: 'Colosal',
        inhabitants: 'Forerunner Constructs, Guardians',
        game: 'Halo Wars 2',
        description: 'Instalación Halo secundaria descubierta en Halo Wars 2. Campo de batalla estratégico UNSC vs Banished.'
    }
];

// BASE DE DATOS DE JUEGOS HALO
const GAMES_DB = [
    {
        id: 301,
        name: 'Halo: Combat Evolved',
        release: 2001,
        platform: 'Xbox',
        type: 'FPS',
        image: '🎮',
        emoji: true,
        developers: '343 Industries, Bungie',
        mainHero: 'Master Chief (Spartan-117)',
        enemies: 'Covenant, Flood, Sentinels',
        description: 'El juego que revolucionó los FPS en consolas. Introducción del Master Chief y su viaje en Installation 04. Inicia la saga épica.'
    },
    {
        id: 302,
        name: 'Halo 2',
        release: 2004,
        platform: 'Xbox',
        type: 'FPS',
        image: '🎯',
        emoji: true,
        developers: 'Bungie',
        mainHero: 'Master Chief & Arbiter',
        enemies: 'Covenant, Flood, Heretics',
        description: 'Secuela aclamada que introduce el Arbiter como jugador. Multiplayerunline revolucionario. Finales sorpresa épicas.'
    },
    {
        id: 303,
        name: 'Halo 3',
        release: 2007,
        platform: 'Xbox 360',
        type: 'FPS',
        image: '🏁',
        emoji: true,
        developers: 'Bungie',
        mainHero: 'Master Chief, Cortana, Arbiter',
        enemies: 'Covenant, Flood, Profetas',
        description: 'Conclusión de la trilogía original. Batalla épica en El Arca. Cierra la saga clásica de forma legendaria con final memorable.'
    },
    {
        id: 304,
        name: 'Halo 4',
        release: 2012,
        platform: 'Xbox 360',
        type: 'FPS',
        image: '👾',
        emoji: true,
        developers: '343 Industries',
        mainHero: 'Master Chief & Cortana',
        enemies: 'Prometheans, Didact, Flood',
        description: 'Inicia la nueva era 343 Industries. Introduce Requiem y el Didact. Narrativa emocional de Master Chief vs Cortana roja.'
    },
    {
        id: 305,
        name: 'Halo 5: Guardians',
        release: 2015,
        platform: 'Xbox One',
        type: 'FPS',
        image: '⚡',
        emoji: true,
        developers: '343 Industries',
        mainHero: 'Master Chief & Spartan Locke',
        enemies: 'Prometheans, Cortana roja, Guardians',
        description: 'Dual protagonista: Master Chief vs Spartan Locke. Persecución de Cortana. Gameplay moderno con thrust y sobrecargas.'
    }
];

// ============================================
// ELEMENTOS DEL DOM
// ============================================

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const container = document.getElementById('container');
const statusIndicator = document.getElementById('statusIndicator');

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Evento del botón Buscar
 */
searchBtn.addEventListener('click', buscarUnidades);

/**
 * Evento Enter en el input
 */
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        buscarUnidades();
    }
});

/**
 * Cargar unidades al iniciar página
 */
window.addEventListener('DOMContentLoaded', cargarUnidadesIniciales);

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Cargar unidades inicialmente (fallback o primeras del registro)
 */
function cargarUnidadesIniciales() {
    mostrarCarga('Inicializando Base de Datos UNSC...');
    
    // Agregar event listeners a botones de navegación
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', cambiarSeccion);
    });
    
    // Usar fallback (en producción intentar API)
    setTimeout(() => {
        renderizarUnidadesPorSeccion();
    }, 1000);
}

/**
 * Buscar unidades por término
 */
function buscarUnidades() {
    const termino = searchInput.value.trim();

    if (!termino) {
        mostrarError('Por favor, ingresa un nombre, facción o tipo de unidad.');
        return;
    }

    mostrarCarga('Escaneando base de datos...');

    // Simular búsqueda en fallback (en producción usar API real)
    setTimeout(() => {
        const resultados = buscarEnSeccionActiva(termino);
        
        if (resultados.length > 0) {
            renderizarUnidades(resultados);
        } else {
            mostrarNoResultados(termino);
        }
    }, 800);

    // Descomenta la siguiente línea para usar la API real cuando tengas API_KEY
    // buscarEnHaloAPI(termino);
}

/**
 * Buscar en la sección activa
 */
function buscarEnSeccionActiva(termino) {
    const termLower = termino.toLowerCase();
    let baseDatos = [];
    
    switch(currentSection) {
        case 'personajes':
            baseDatos = FALLBACK_UNITS;
            break;
        case 'armas':
            baseDatos = WEAPONS_DB;
            break;
        case 'lugares':
            baseDatos = LOCATIONS_DB;
            break;
        case 'juegos':
            baseDatos = GAMES_DB;
            break;
        default:
            baseDatos = FALLBACK_UNITS;
    }
    
    return baseDatos.filter(item => 
        (item.name && item.name.toLowerCase().includes(termLower)) ||
        (item.faction && item.faction.toLowerCase().includes(termLower)) ||
        (item.rank && item.rank.toLowerCase().includes(termLower)) ||
        (item.type && item.type.toLowerCase().includes(termLower)) ||
        (item.description && item.description.toLowerCase().includes(termLower))
    );
}
/**
 * Buscar en fallback local
 */
function buscarEnFallback(termino) {
    const termLower = termino.toLowerCase();
    return FALLBACK_UNITS.filter(unit => 
        unit.name.toLowerCase().includes(termLower) ||
        unit.faction.toLowerCase().includes(termLower) ||
        unit.rank.toLowerCase().includes(termLower)
    );
}

/**
 * Buscar en Halo API real (cuando API_KEY esté disponible)
 */
function buscarEnHaloAPI(termino) {
    if (API_KEY === '<TU_API_KEY_AQUI>') {
        mostrarError('[ACCESO DENEGADO] API Key no configurada. Usando base de datos local.');
        const resultados = buscarEnFallback(termino);
        if (resultados.length > 0) {
            renderizarUnidades(resultados);
        } else {
            mostrarNoResultados(termino);
        }
        return;
    }

    const headers = {
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Accept': 'application/json'
    };

    // Intentar búsqueda en diferentes endpoints
    Promise.all([
        fetch(`${API_BASE_URL}/stats/multiplayer/matchmapvariant?count=10`, { headers }),
    ])
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(dataArray => {
            const unidades = procesarRespuestaAPI(dataArray, termino);
            
            if (unidades.length > 0) {
                renderizarUnidades(unidades);
            } else {
                mostrarNoResultados(termino);
            }
        })
        .catch(error => {
            console.error('Error al conectar con Halo API:', error);
            mostrarError('Error al acceder a la base de datos UNSC. Usando registros locales...');
            const resultados = buscarEnFallback(termino);
            if (resultados.length > 0) {
                renderizarUnidades(resultados);
            }
        });
}

/**
 * Procesar respuesta de Halo API
 */
function procesarRespuestaAPI(dataArray, termino) {
    const unidades = [];
    const termLower = termino.toLowerCase();

    // Procesar cada respuesta y extraer unidades relevantes
    dataArray.forEach(data => {
        if (data.Results && Array.isArray(data.Results)) {
            data.Results.forEach(item => {
                if (item.name && item.name.toLowerCase().includes(termLower)) {
                    unidades.push({
                        id: item.id,
                        name: item.name,
                        faction: 'UNSC',
                        status: item.status || 'Unknown',
                        rank: item.type || 'Asset',
                        lastLocation: item.location || 'Unknown',
                        image: item.imageUrl || null
                    });
                }
            });
        }
    });

    return unidades;
}

/**
 * Cambiar sección activa
 */
function cambiarSeccion(event) {
    const nuevoSection = event.target.getAttribute('data-section');
    currentSection = nuevoSection;
    
    // Actualizar botones activos
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === nuevoSection) {
            btn.classList.add('active');
        }
    });
    
    // Limpiar búsqueda y cargar nueva sección
    searchInput.value = '';
    renderizarUnidadesPorSeccion();
}

/**
 * Renderizar unidades según sección activa
 */
function renderizarUnidadesPorSeccion() {
    let unidades = [];
    
    switch(currentSection) {
        case 'personajes':
            unidades = FALLBACK_UNITS;
            break;
        case 'armas':
            unidades = WEAPONS_DB;
            break;
        case 'lugares':
            unidades = LOCATIONS_DB;
            break;
        case 'juegos':
            unidades = GAMES_DB;
            break;
        default:
            unidades = FALLBACK_UNITS;
    }
    
    renderizarUnidades(unidades);
}

/**
 * Renderizar unidades en el contenedor
 */
function renderizarUnidades(unidades) {
    container.innerHTML = '';
    statusIndicator.innerHTML = '';

    if (!Array.isArray(unidades) || unidades.length === 0) {
        mostrarNoResultados('general');
        return;
    }

    unidades.forEach(unidad => {
        const card = crearTarjetaUnidad(unidad);
        container.appendChild(card);
    });

    // Mostrar cantidad de resultados
    statusIndicator.innerHTML = `✓ ${unidades.length} unidad(es) encontrada(s)`;
    statusIndicator.style.color = '#8fbc8f';
    statusIndicator.classList.remove('loading', 'error');
}

/**
 * Crear tarjeta de unidad
 */
function crearTarjetaUnidad(unidad) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${unidad.id}`;

    // Determinar clase de estado
    const statusClass = obtenerClaseEstado(unidad.status);

    // Determinar clase de facción
    const factionClass = obtenerClaseFactcion(unidad.faction);

    // Crear contenido de imagen
    let imagenHTML;
    if (unidad.emoji) {
        imagenHTML = `<div class="card-image-emoji">${unidad.image}</div>`;
    } else {
        imagenHTML = unidad.image
            ? `<img src="${unidad.image}" alt="${unidad.name}" class="card-image" onerror="this.parentElement.innerHTML='<div class=\"card-image-fallback\">█</div>'">`
            : `<div class="card-image-fallback">█</div>`;
    }

    // Crear contenido base de la tarjeta
    const cardBaseHTML = `
        <div class="card-image-container">
            ${imagenHTML}
        </div>
        <div class="card-content">
            <div class="card-header">
                <div class="card-name">${sanitizeHTML(unidad.name)}</div>
                <span class="expand-icon" title="Click para expandir">⮕</span>
            </div>
            <div class="card-info">
                <div class="card-info-row">
                    <span class="info-label">FACCIÓN:</span>
                    <span class="info-value">
                        <span class="faction-badge ${factionClass}">${sanitizeHTML(unidad.faction)}</span>
                    </span>
                </div>
                <div class="card-info-row">
                    <span class="info-label">ESTADO:</span>
                    <span class="info-value">
                        <span class="status-badge ${statusClass}">${sanitizeHTML(unidad.status)}</span>
                    </span>
                </div>
                <div class="card-info-row">
                    <span class="info-label">RANGO/CLASE:</span>
                    <span class="info-value">${sanitizeHTML(unidad.rank)}</span>
                </div>
                <div class="card-info-row">
                    <span class="info-label">UBICACIÓN:</span>
                    <span class="info-value">${sanitizeHTML(unidad.lastLocation)}</span>
                </div>
            </div>
        </div>
        <div class="card-expanded" style="display: none;">
            <div class="card-expanded-content">
                <div class="close-btn" title="Cerrar detalles">✕</div>
                <div class="expanded-section">
                    <h3>📖 DESCRIPCIÓN</h3>
                    <p>${sanitizeHTML(unidad.description)}</p>
                </div>
                <div class="expanded-section">
                    <h3>🎮 VIDEOJUEGO</h3>
                    <p>${sanitizeHTML(unidad.game)}</p>
                </div>
                <div class="expanded-section">
                    <h3>🛡️ ARMADURA</h3>
                    <p>${sanitizeHTML(unidad.armor)}</p>
                </div>
                <div class="expanded-section">
                    <h3>⚔️ ARMAMENTO</h3>
                    <ul class="weapons-list">
                        ${unidad.weapons.map(w => `<li>• ${sanitizeHTML(w)}</li>`).join('')}
                    </ul>
                </div>
                <div class="expanded-section">
                    <h3>🏆 LOGROS</h3>
                    <ul class="achievements-list">
                        ${unidad.achievements.map(a => `<li>★ ${sanitizeHTML(a)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    card.innerHTML = cardBaseHTML;

    // Event listeners para expandir/contraer
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn') || e.target.parentElement.classList.contains('close-btn')) {
            contraerTarjeta(card);
        } else {
            expandirTarjeta(card);
        }
    });

    return card;
}

/**
 * Obtener clase CSS para estado
 */
function obtenerClaseEstado(status) {
    if (!status) return 'status-unknown';
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('alive') || statusLower.includes('active')) {
        return 'status-alive';
    } else if (statusLower.includes('dead') || statusLower.includes('destroyed')) {
        return 'status-destroyed';
    } else if (statusLower.includes('active')) {
        return 'status-active';
    } else {
        return 'status-unknown';
    }
}

/**
 * Obtener clase CSS para facción
 */
function obtenerClaseFactcion(faction) {
    if (!faction) return 'faction-unknown';
    const factionLower = faction.toLowerCase();
    
    if (factionLower.includes('unsc')) {
        return 'faction-unsc';
    } else if (factionLower.includes('covenant')) {
        return 'faction-covenant';
    } else if (factionLower.includes('banished')) {
        return 'faction-banished';
    } else {
        return 'faction-unknown';
    }
}

/**
 * Mostrar indicador de carga
 */
function mostrarCarga(mensaje) {
    container.innerHTML = '';
    statusIndicator.innerHTML = `[●●●] ${mensaje}`;
    statusIndicator.className = 'status-indicator loading';
}

/**
 * Mostrar error
 */
function mostrarError(mensaje) {
    container.innerHTML = `
        <div class="error-message">
            ⚠ [ALERTA DEL SISTEMA]<br>
            ${mensaje}
        </div>
    `;
    statusIndicator.innerHTML = `[✗] ERROR - ${mensaje}`;
    statusIndicator.className = 'status-indicator error';
}

/**
 * Mostrar sin resultados
 */
function mostrarNoResultados(termino) {
    container.innerHTML = `
        <div class="no-results-message">
            [--] NO SE ENCONTRARON RESULTADOS<br>
            Búsqueda: "${termino}" no encontrada en la base de datos UNSC.<br>
            Verifica el nombre, facción o tipo e intenta de nuevo.
        </div>
    `;
    statusIndicator.innerHTML = `[○] Sin resultados para: "${termino}"`;
    statusIndicator.style.color = '#ff8c00';
    statusIndicator.classList.remove('loading', 'error');
}

/**
 * Sanitizar HTML para evitar XSS
 */
function sanitizeHTML(text) {
    if (!text) return 'N/A';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Log de actividad (para debugging)
 */
function logActividad(mensaje) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${mensaje}`);
}

/**
 * Expandir tarjeta mostrando detalles completos
 */
function expandirTarjeta(card) {
    if (card.classList.contains('expanded')) {
        return;
    }

    // Cerrar otras tarjetas expandidas
    document.querySelectorAll('.card.expanded').forEach(c => {
        if (c !== card) contraerTarjeta(c);
    });

    card.classList.add('expanded');
    const expandedContent = card.querySelector('.card-expanded');
    if (expandedContent) {
        expandedContent.style.display = 'block';
        // Animar entrada
        expandedContent.style.animation = 'slideDown 0.3s ease';
    }
    logActividad(`Tarjeta expandida: ${card.querySelector('.card-name').textContent}`);
}

/**
 * Contraer tarjeta
 */
function contraerTarjeta(card) {
    card.classList.remove('expanded');
    const expandedContent = card.querySelector('.card-expanded');
    if (expandedContent) {
        expandedContent.style.display = 'none';
    }
    logActividad(`Tarjeta contraída: ${card.querySelector('.card-name').textContent}`);
}

// Mensaje inicial
logActividad('Centro de Monitoreo UNSC inicializado');
