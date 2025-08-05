from django.shortcuts import render
from django.http import JsonResponse
from apps.gestion.models import Servidor, Categoria
from .utils import ping_host
from collections import defaultdict
from django.contrib.auth.decorators import login_required

@login_required
def index(request):
    servidores = Servidor.objects.all()
    return render(request, 'panel.html', {'servidores': servidores})

def index_publico(request):
    return render(request, 'panel_public.html')

def status_ping(request):
    data = {}
    categorias = Categoria.objects.all()

    for categoria in categorias:
        servidores_categoria = Servidor.objects.filter(categoria=categoria)
        lista_servidores = []

        for servidor in servidores_categoria:
            ips_servidor = [servidor.ip]  # aunque solo 1 IP por servidor en tu modelo

            estados_ips = []
            for ip in ips_servidor:
                estado = ping_host(ip)  # ping secuencial, espera aquí
                estados_ips.append(estado)

            estado_general = 'Online' if any(estados_ips) else 'Offline'

            lista_servidores.append({
                'nombre': servidor.nombre,
                'ip': ips_servidor,
                'status': estado_general,
            })

        data[categoria.nombre] = lista_servidores

    return JsonResponse(data)
