// Mapa de sonidos por nombre de categoría
const sonidosPorCategoria = {
    'Servidor': new Audio('/static/audio/1.mp3'),
    'Enlace': new Audio('/static/audio/2.mp3'),
    'Servidores': new Audio('/static/audio/3.mp3'),
};

// Control de sonidos ya emitidos
const sonidosEmitidos = new Set();
let sonidosActivos = false;

// Intento de precarga de audio para obtener permiso del usuario
function activarSonidos() {
    Object.values(sonidosPorCategoria).forEach(audio => {
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(() => {
            console.warn('Autoplay bloqueado. Se necesita interacción del usuario.');
        });
    });
}

function actualizarEstados() {
    fetch('/panel/ping-status/')
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById('servidores');
            const timestamp = document.getElementById('ultima-actualizacion');
            const onlineCount = document.getElementById('online-count');
            const offlineCount = document.getElementById('offline-count');

            const now = new Date();
            timestamp.textContent = `Última actualización: ${now.toLocaleTimeString()}`;

            let online = 0;
            let offline = 0;
            contenedor.innerHTML = '';

            for (const categoria in data) {
                const servidores = data[categoria];

                const categoriaContainer = document.createElement('section');
                categoriaContainer.className = 'mb-8 p-4 bg-gray-100 rounded-lg shadow-sm';

                const encabezado = document.createElement('h2');
                encabezado.textContent = categoria;
                encabezado.className = 'text-2xl font-semibold text-gray-800 mb-4 border-b pb-2';
                categoriaContainer.appendChild(encabezado);

                const servidoresContainer = document.createElement('div');
                servidoresContainer.className = 'flex flex-wrap gap-3';

                let algunOffline = false;

                servidores.forEach(servidor => {
                    const isOnline = servidor.status === 'Online';
                    if (isOnline) {
                        online++;
                    } else {
                        offline++;
                        algunOffline = true;
                    }

                    const card = document.createElement('div');
                    const bgColor = isOnline ? 'bg-green-100' : 'bg-red-100';
                    const textColor = isOnline ? 'text-green-700' : 'text-red-700';
                    const borderColor = isOnline ? 'border-green-300' : 'border-red-300';

                    card.className = `flex items-center gap-2 px-4 py-2 rounded-full border ${borderColor} ${bgColor} cursor-default transition hover:shadow-lg`;

                    card.innerHTML = `
                        <span class="w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} inline-block"></span>
                        <span class="font-semibold ${textColor}" data-tippy-content="IP: ${servidor.ip}">${servidor.nombre}</span>
                    `;

                    servidoresContainer.appendChild(card);
                });

                categoriaContainer.appendChild(servidoresContainer);
                contenedor.appendChild(categoriaContainer);

                // Emitir sonido si hay caída y aún no se ha emitido
                if (algunOffline && !sonidosEmitidos.has(categoria) && sonidosActivos) {
                    const sonido = sonidosPorCategoria[categoria];
                    if (sonido) {
                        sonido.play().catch(e => console.warn("No se pudo reproducir el sonido:", e));
                        sonidosEmitidos.add(categoria);
                    }
                }
            }

            if (offline === 0) {
                sonidosEmitidos.clear(); // Reinicia si todo está en línea
            }

            onlineCount.textContent = online;
            offlineCount.textContent = offline;

            // Inicializa tooltips
            tippy('[data-tippy-content]', {
                placement: 'top',
                animation: 'shift-away',
                delay: [100, 50],
                theme: 'light-border'
            });
        })
        .catch(error => {
            console.error('Error al obtener estados:', error);
            document.getElementById('error-message').classList.remove('hidden');
        });
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const switchSonido = document.getElementById('activar-sonidos');

    if (switchSonido) {
        switchSonido.addEventListener('change', (e) => {
            sonidosActivos = e.target.checked;
            if (sonidosActivos) activarSonidos();
        });
    }

    actualizarEstados();
    setInterval(actualizarEstados, 60 * 1000); // Cada minuto
});
