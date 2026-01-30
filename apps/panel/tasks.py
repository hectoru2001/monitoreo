# panel/tasks.py
import threading
import time
from .ping_cache import ping_cache, ping_cache_lock
from apps.gestion.models import Servidor, Categoria
from .utils import ping_host, telnet_host

def actualizar_pings():
    while True:
        data = {}

        for categoria in Categoria.objects.all():
            servidores_categoria = Servidor.objects.filter(categoria=categoria)
            lista_servidores = []

            es_servidor = categoria.nombre.lower() == "servidor"

            for servidor in servidores_categoria:

                if not es_servidor:
                    responde = ping_host(servidor.ip)

                    lista_servidores.append({
                        'nombre': servidor.nombre,
                        'ip': servidor.ip,
                        'status': 'Online' if responde else 'Offline',
                    })

                else:
                    responde = telnet_host(servidor.ip, servidor.puerto)

                    lista_servidores.append({
                        'nombre': servidor.nombre,
                        'ip': servidor.ip,
                        'puerto': servidor.puerto,
                        'status': 'Online' if responde else 'Offline',
                    })

            data[categoria.nombre] = lista_servidores

        with ping_cache_lock:
            ping_cache.clear()
            ping_cache.update(data)

        time.sleep(5)

