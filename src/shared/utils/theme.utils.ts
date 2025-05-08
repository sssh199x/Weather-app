export function toggleDarkMode(): void {
  const element = document.querySelector('html');
  element?.classList.toggle('my-app-dark');
}
