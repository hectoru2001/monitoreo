# panel/ping_cache.py
from threading import Lock

ping_cache = {}  # {'ip': 'Online'|'Offline'}
ping_cache_lock = Lock()
