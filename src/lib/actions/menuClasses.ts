export function menuItemClasses(active: boolean, dark: boolean) {
  if (active) {
    return dark
      ? 'bg-blue-900/30 text-blue-400'
      : 'bg-blue-50 text-blue-600';
  }

  return dark
    ? 'text-gray-300 hover:bg-white/5 hover:text-gray-200'
    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700';
}
