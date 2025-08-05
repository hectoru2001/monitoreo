# views.py

from django.shortcuts import render, redirect, get_object_or_404
from .models import Iconos, Servidor, Categoria
from .forms import IconoForm, ServidorForm, CategoriaForm

# -------- Iconos -------- #

def lista_iconos(request):
    iconos = Iconos.objects.all()
    return render(request, 'iconos/lista.html', {'iconos': iconos})

def crear_icono(request):
    form = IconoForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('iconos')
    return render(request, 'iconos/formulario.html', {'form': form})

def editar_icono(request, pk):
    icono = get_object_or_404(Iconos, pk=pk)
    form = IconoForm(request.POST or None, instance=icono)
    if form.is_valid():
        form.save()
        return redirect('iconos')
    return render(request, 'iconos/formulario.html', {'form': form})

def eliminar_icono(request, pk):
    icono = get_object_or_404(Iconos, pk=pk)
    if request.method == 'POST':
        icono.delete()
        return redirect('iconos')
    return render(request, 'iconos/eliminar.html', {'objeto': icono})


# -------- Servidores -------- #

def lista_servidores(request):
    servidores = Servidor.objects.all()
    return render(request, 'servidores/lista.html', {'servidores': servidores})

def crear_servidor(request):
    form = ServidorForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('servidores')
    return render(request, 'servidores/formulario.html', {'form': form})

def editar_servidor(request, pk):
    servidor = get_object_or_404(Servidor, pk=pk)
    form = ServidorForm(request.POST or None, instance=servidor)
    if form.is_valid():
        form.save()
        return redirect('servidores')
    return render(request, 'servidores/formulario.html', {'form': form})

def eliminar_servidor(request, pk):
    servidor = get_object_or_404(Servidor, pk=pk)
    if request.method == 'POST':
        servidor.delete()
        return redirect('servidores')
    return render(request, 'servidores/eliminar.html', {'objeto': servidor})

# -------- Categorías -------- #
def lista_categorias(request):
    categorias = Categoria.objects.all()
    return render(request, 'categorias/lista.html', {'categorias': categorias})

def crear_categoria(request):
    if request.method == 'POST':
        form = CategoriaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('categorias')
    else:
        form = CategoriaForm()
    return render(request, 'categorias/formulario.html', {'form': form, 'titulo': 'Crear Categoría'})

def editar_categoria(request, pk):
    categoria = get_object_or_404(Categoria, pk=pk)
    if request.method == 'POST':
        form = CategoriaForm(request.POST, instance=categoria)
        if form.is_valid():
            form.save()
            return redirect('categorias')
    else:
        form = CategoriaForm(instance=categoria)
    return render(request, 'categorias/formulario.html', {'form': form, 'titulo': 'Editar Categoría'})

def eliminar_categoria(request, pk):
    categoria = get_object_or_404(Categoria, pk=pk)
    if request.method == 'POST':
        categoria.delete()
        return redirect('categorias')
    return render(request, 'categorias/eliminar.html', {
        'objeto': categoria,  # o puedes usar 'categoria' si así lo tienes en el template
        'tipo': 'Categoría'
    })
