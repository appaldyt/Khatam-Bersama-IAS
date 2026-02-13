const FALLBACK_ADMIN_USER = 'admin';
const FALLBACK_ADMIN_PASS = 'masadi123';

export function getAdminAuthConfig() {
  return {
    username: FALLBACK_ADMIN_USER.trim(),
    password: FALLBACK_ADMIN_PASS.trim(),
  };
}
