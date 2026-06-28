def base_template(request):
    """
    Returns the appropriate base template depending on whether the request
    is an HTMX request.
    """
    if request.headers.get('HX-Request') == 'true':
        return {'base_template': 'core_portal/base_hx.html'}
    return {'base_template': 'core_portal/dashboard.html'}
