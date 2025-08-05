import subprocess
import platform

def ping_host(ip: str, timeout=1000) -> bool:
    """
    Hace ping a una IP y devuelve True si responde, False si no.

    :param ip: Dirección IP a pingear.
    :param timeout: Tiempo en milisegundos para esperar respuesta.
    """
    param = '-n' if platform.system().lower() == 'windows' else '-c'
    # timeout para Linux/Mac es en segundos (dividimos milisegundos entre 1000)
    timeout_param = '-w' if platform.system().lower() == 'windows' else '-W'
    timeout_value = str(timeout) if platform.system().lower() == 'windows' else str(int(timeout / 1000))

    try:
        output = subprocess.run(
            ['ping', param, '1', timeout_param, timeout_value, ip],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return output.returncode == 0
    except Exception:
        return False
