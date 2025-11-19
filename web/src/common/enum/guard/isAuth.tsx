// Função pura para verificar se o usuário está autenticado
// Pode ser usada com segurança dentro de useEffect no _app.tsx

export default function isAuth(): boolean {
  // Garante que está no ambiente do navegador
  if (typeof window === "undefined") return true;

  // Recupera o token salvo no localStorage
  const token = localStorage?.getItem("user_token");

  // Se não houver token, redireciona para /logout
  if (!token) {
    window.location.href = "/logout";
    return false;
  }

  // Retorna true se o token existir
  return true;
}
