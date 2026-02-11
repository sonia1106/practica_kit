import { writable } from 'svelte/store';
import type { Product } from '$lib/types/products';

export const products = writable<Product[]>([]);
