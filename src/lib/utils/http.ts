const BASE_URL = '/backend';

export async function http<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, options);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('HTTP Error in http util:', res.status, res.statusText, errorText);
    throw new Error(`Error de red: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}
