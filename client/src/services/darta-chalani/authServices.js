// darta chalani apps 
import api from '../../lib/api'

export const DartaChalaniAuthService = {
  logout: () => api.post("/users/logout/"),
 };
