from django.db import models

class Servidor(models.Model):
    nombre = models.CharField(max_length=100)
    ip = models.GenericIPAddressField(protocol='IPv4')
    icono = models.ForeignKey('Iconos', on_delete=models.CASCADE, null=True)
    categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} ({self.ip})"

class Iconos(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.CharField(max_length=70)
    ruta = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} ({self.descripcion})"
    

class Categoria(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=70, null=True)

    def __str__(self):
        return f"{self.nombre}"