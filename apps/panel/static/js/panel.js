// Mapa de sonidos por nombre de categoría (rutas)
const sonidosPorCategoria = {
    'Servidor': '/static/audio/1.mp3',
    'Enlace': '/static/audio/2.mp3',
    'PC': '/static/audio/3.mp3',
};

// Categorías para las que ya se emitió sonido
const sonidosEmitidos = new Set();
let sonidosActivos = false;
let fallosConsecutivos = {};

// Estado previo de todos los servidores { 'nombreServidor': 'Online'|'Offline' }
let estadoPrevioServidores = {};

// Precargar audios tras interacción usuario
function activarSonidos() {
    Object.values(sonidosPorCategoria).forEach(ruta => {
        const audio = new Audio(ruta);
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(() => {
            console.warn('Autoplay bloqueado. Se necesita interacción del usuario.');
        });
    });
}

// Reproducir sonido X veces manteniendo objeto Audio
function reproducirSonidoRepetidoDesdeRuta(ruta, repeticiones = 3) {
    let contador = 0;
    const audio = new Audio(ruta);

    audio.addEventListener('ended', () => {
        contador++;
        if (contador < repeticiones) {
            audio.currentTime = 0;
            audio.play().catch(e => console.warn('No se pudo reproducir:', e));
        }
    });

    audio.play().catch(e => console.warn('No se pudo reproducir:', e));
}

function abrirModal() {
    const modal = document.getElementById('modal-servidor');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function cerrarModal() {
    const modal = document.getElementById('modal-servidor');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function enviarReporte() {
    const form = document.getElementById('form-reporte');
    const formData = new FormData(form);

    fetch('/gestion/api/guardar_reporte/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al guardar');
        return res.json();
    })
    .then(data => {
        cerrarModal();
        alert('Reporte creado correctamente');
        form.reset();
        cerrarModal();
    })
    .catch(err => {
        console.error(err);
        alert('Error al guardar el reporte');
    });
}

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

const MAX_FALLOS = 3;
const form = document.getElementById('form-reporte');

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

            const categoriasConCaidaNueva = new Set();

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

                servidores.forEach(servidor => {
                    const nombre = servidor.nombre;
                    const responde = servidor.status === 'Online';

                    if (!(nombre in fallosConsecutivos)) {
                        fallosConsecutivos[nombre] = 0;
                    }

                    if (responde) {
                        fallosConsecutivos[nombre] = 0;
                    } else {
                        fallosConsecutivos[nombre]++;
                    }

                    let estado;
                    if (fallosConsecutivos[nombre] === 0) {
                        estado = 'Online';
                        online++;
                    } else if (fallosConsecutivos[nombre] <= 2) {
                        estado = 'Inestable';
                        online++;
                    } else if (fallosConsecutivos[nombre] <= 6) {
                        estado = 'Degradado';
                        online++;
                    } else {
                        estado = 'Offline';
                        offline++;
                    }


                    const estadoPrevio = estadoPrevioServidores[nombre];

                    if (estadoPrevio === 'Online' && estado === 'Offline') {
                        categoriasConCaidaNueva.add(categoria);
                    }

                    estadoPrevioServidores[nombre] = estado;

                    let bgColor, textColor, borderColor, dotColor;

                    switch (estado) {
                        case 'Online':
                            bgColor = 'bg-green-100';
                            textColor = 'text-green-700';
                            borderColor = 'border-green-300';
                            dotColor = 'bg-green-500';
                            break;
                        case 'Inestable':
                            bgColor = 'bg-yellow-100';
                            textColor = 'text-yellow-700';
                            borderColor = 'border-yellow-300';
                            dotColor = 'bg-yellow-500';
                            break;
                        case 'Degradado':
                            bgColor = 'bg-orange-100';
                            textColor = 'text-orange-700';
                            borderColor = 'border-orange-300';
                            dotColor = 'bg-orange-500';
                            break;
                        default:
                            bgColor = 'bg-red-100';
                            textColor = 'text-red-700';
                            borderColor = 'border-red-300';
                            dotColor = 'bg-red-500';
                    }

                    const card = document.createElement('div');
                    card.className = `flex items-center gap-2 px-4 py-2 rounded-full border ${borderColor} ${bgColor} cursor-default transition hover:shadow-lg`;

                    card.innerHTML = `
                        <span class="w-3 h-3 rounded-full ${dotColor} inline-block"></span>
                        <span class="font-semibold ${textColor}" data-tippy-content="IP: ${servidor.ip}">
                            ${servidor.nombre}
                        </span>
                    `;

                    card.addEventListener('click', () => {
                        const ip = encodeURIComponent(servidor.ip);

                        fetch(`/gestion/api/servidor/${ip}/`)
                            .then(res => {
                                if (!res.ok) throw new Error('No encontrado');
                                return res.json();
                            })
                            .then(data => {
                                // inputs normales
                                form.nombre.value = data.nombre ?? '';
                                form.ip.value = data.ip ?? '';
                                form.enlace.value = data.servicio ?? '';
                                // select ¿Qué cayó?
                                const select = document.getElementById('que_cayo');
                                select.innerHTML = '<option value="">Selecciona una opción</option>';

                                if (data.referencia) {
                                    const opt1 = document.createElement('option');
                                    opt1.value = data.referencia;
                                    opt1.textContent = "Referencia Enlace - " + data.referencia;
                                    select.appendChild(opt1);
                                }

                                if (data.referencia2) {
                                    const opt2 = document.createElement('option');
                                    opt2.value = data.referencia2;
                                    opt2.textContent = "Referencia TKS - " + data.referencia2;
                                    select.appendChild(opt2);
                                }

                                abrirModal();
                            })
                            .catch(err => {
                                console.error('Error cargando servidor:', err);
                                alert('No se pudo cargar la información del servidor');
                            });
                    });


                    servidoresContainer.appendChild(card);
                });

                categoriaContainer.appendChild(servidoresContainer);
                contenedor.appendChild(categoriaContainer);
            }

            if (sonidosActivos) {
                categoriasConCaidaNueva.forEach(categoria => {
                    if (!sonidosEmitidos.has(categoria)) {
                        const rutaSonido = sonidosPorCategoria[categoria];
                        if (rutaSonido) {
                            reproducirSonidoRepetidoDesdeRuta(rutaSonido, 3);
                            sonidosEmitidos.add(categoria);
                        }
                    }
                });
            }

            if (offline === 0) {
                sonidosEmitidos.clear();
            }

            onlineCount.textContent = online;
            offlineCount.textContent = offline;

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

document.getElementById('form-conexion')?.addEventListener('submit', e => {
    console.log('Registrando evento de conexión/desconexión...');
    e.preventDefault();
    fetch('/panel/registrar-evento/', {
        method: 'POST',
        body: new FormData(e.target),
        headers: { 'X-CSRFToken': getCSRFToken() }
    }).then(() => cerrarModal());
});


// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const switchSonido = document.getElementById('activar-sonidos');

    if (switchSonido) {
        switchSonido.addEventListener('change', (e) => {
            sonidosActivos = e.target.checked;
            if (sonidosActivos) activarSonidos();
        });
    }

    if (form){
        form.addEventListener('submit', function (e) {
            e.preventDefault(); 

            enviarReporte();
        });

        document.getElementById('cerrar-modal').addEventListener('click', cerrarModal);
    }


    actualizarEstados();
    setInterval(actualizarEstados, 5000); // ajusta el intervalo si quieres
});
