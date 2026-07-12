import { PRODUCTS } from '../lib/products.js';

// Отдаёт каталог фронтенду Mini App.
export default function handler(req, res) {
  res.setHeader('cache-control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json({ products: PRODUCTS });
}
