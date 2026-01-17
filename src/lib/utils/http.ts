const BASE_URL = 'http://192.168.10.12:30004';

export async function http<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`);

  if (!res.ok) {
    throw new Error('Error de red');
  }

  return res.json();
}
