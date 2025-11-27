// ============================================
// HOOK: USE AUTH
// ============================================
// Hook personalizado para usar AuthContext
// Simplifica acesso aos dados de autenticação
// ============================================

import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
