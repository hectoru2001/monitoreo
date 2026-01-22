import subprocess
import platform

def ping_host(ip: str, timeout=1000) -> bool:
    """
    Hace ping a una IP y devuelve True si responde, False si no.
    Timeout en milisegundos.
    """
    system = platform.system().lower()

    if system == 'windows':
        cmd = [
            'ping', '-n', '1',
            '-w', str(timeout),
            ip
        ]
    else:
        # Linux / macOS
        timeout_sec = max(1, int(timeout / 1000))
        cmd = [
            'ping', '-c', '1',
            '-W', str(timeout_sec),
            ip
        ]

    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return result.returncode == 0
    except Exception:
        return False
