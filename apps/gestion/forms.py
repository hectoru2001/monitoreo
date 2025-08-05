# gestion/forms.py

from django import forms
from .models import Iconos, Servidor, Categoria

class IconoForm(forms.ModelForm):
    class Meta:
        model = Iconos
        fields = ['nombre', 'descripcion', 'ruta']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'border rounded px-3 py-2 w-full'}),
            'descripcion': forms.TextInput(attrs={'class': 'border rounded px-3 py-2 w-full'}),
            'ruta': forms.TextInput(attrs={'class': 'border rounded px-3 py-2 w-full', 'placeholder': 'ruta del icono, ej: icons/server.png'}),
        }

class ServidorForm(forms.ModelForm):
    class Meta:
        model = Servidor
        fields = ['nombre', 'ip', 'categoria']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'border rounded px-3 py-2 w-full'}),
            'ip': forms.TextInput(attrs={'class': 'border rounded px-3 py-2 w-full'}),
            'categoria': forms.Select(attrs={'class': 'border rounded px-3 py-2 w-full'}),
            'icono': forms.Select(attrs={
                'class': 'hidden'
            }),
        }

class CategoriaForm(forms.ModelForm):
    class Meta:
        model = Categoria
        fields = ['nombre', 'descripcion']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'border rounded px-3 py-2 w-full'}),
            'descripcion': forms.TextInput(attrs={'class': 'border rounded px-3 py-2 w-full'}),
        }