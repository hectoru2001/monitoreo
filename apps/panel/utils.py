import platform
import subprocess
import socket

PING_BIN = "/usr/bin/ping"

def ping_host(ip: str, timeout=1000) -> bool:
    system = platform.system().lower()

    if system == 'windows':
        cmd = ['ping', '-n', '1', '-w', str(timeout), ip]
    else:
        timeout_sec = max(1, int(timeout / 1000))
        cmd = [PING_BIN, '-c', '1', '-W', str(timeout_sec), ip]

    try:
        return subprocess.run(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        ).returncode == 0
    except Exception:
        return False

def telnet_host(ip: str, port: int, timeout=1000) -> bool:
    timeout_sec = timeout / 1000

    try:
        with socket.create_connection((ip, port), timeout=timeout_sec):
            return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False