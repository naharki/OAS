# darta_chalani/context_processors.py
import requests

def global_office_context(request):
    """
    Exposes the active office configuration globally to all templates.
    """
    if not hasattr(request, '_cached_global_office'):
        try:
            # Fetches data from your microservice/API backend
            response = requests.get("http://127.0.0.1:8000/api/v1/darta-chalani/office/", timeout=3)
            if response.status_code == 200:
                result = response.json()
                data = result.get("data", [])
                if data and len(data) > 0:
                    request._cached_global_office = data[0]
                else:
                    request._cached_global_office = None
            else:
                request._cached_global_office = None
        except Exception:
            request._cached_global_office = None
            
    return {
        "global_office": request._cached_global_office
    }