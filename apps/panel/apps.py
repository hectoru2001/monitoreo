from django.apps import AppConfig

class PanelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.panel'

    def ready(self):
        # Importa la función de actualización de pings
        from .tasks import actualizar_pings
        import threading

        # Lanza el hilo como daemon (no bloquea Gunicorn)
        threading.Thread(target=actualizar_pings, daemon=True).start()
