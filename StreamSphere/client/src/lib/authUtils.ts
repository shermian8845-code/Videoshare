export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*/.test(error.message);
}

export function logout() {
  // Clear token from localStorage
  localStorage.removeItem('token');
  // Redirect to home page
  window.location.href = '/';
}