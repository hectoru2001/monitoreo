from django.shortcuts import render
from django.http import JsonResponse
from apps.gestion.models import Servidor, Categoria
from .utils import ping_host
from collections import defaultdict
from django.contrib.auth.decorators import login_required
from .ping_cache import ping_cache, ping_cache_lock

@login_required
def index(request):
    servidores = Servidor.objects.all()
    return render(request, 'panel.html', {'servidores': servidores})

def index_publico(request):
    return render(request, 'panel_public.html')


def status_ping(request):
    with ping_cache_lock:
        data = ping_cache.copy()
    return JsonResponse(data)
