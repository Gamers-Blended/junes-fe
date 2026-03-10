export function initSessionId(): void {
  if (!localStorage.getItem('sessionId')) {
    localStorage.setItem('sessionId', crypto.randomUUID());
  }
}