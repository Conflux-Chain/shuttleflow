export function buildSearch(obj) {
  const searchParams = new URLSearchParams();
  Object.keys(obj).forEach(key => {
    const value = obj[key] + ''
    if (value !== '') {
      searchParams.append(key, obj[key])
    }
  });
  return '?' + searchParams.toString();
}
