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
            ip = servidor.ip  # STRING

            responde = ping_host(ip)

            lista_servidores.append({
                'nombre': servidor.nombre,
                'ip': ip,
                'status': 'Online' if responde else 'Offline',
            })

        data[categoria.nombre] = lista_servidores

    return JsonResponse(data)
