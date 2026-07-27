// Единый источник каталога — используется и функциями API, и фронтендом (через /api/products).
// Цены в тенге (₸). При изменении цен правь только здесь.
export const PRODUCTS = [
  { id: 'sejaro_2_5',  name: 'Sejaro 2.5mg', price: 68000,  desc: 'Шприц-ручка 2,5 мг/доза 2,4 мл + игла 4 шт',  img: '/products/sejaro_2_5.jpg' },
  { id: 'sejaro_5',    name: 'Sejaro 5mg',   price: 85600,  desc: 'Шприц-ручка 5 мг/доза 2,4 мл + игла 4 шт',    img: '/products/sejaro_5.jpg' },
  { id: 'sejaro_7_5',  name: 'Sejaro 7.5',   price: 93660,  desc: 'Шприц-ручка 7,5 мг/доза 2,4 мл + игла 4 шт',  img: '/products/sejaro_7_5.jpg' },
  { id: 'sejaro_10',   name: 'Sejaro 10mg',  price: 106000, desc: 'Шприц-ручка 10 мг/доза 2,4 мл + игла 4 шт',   img: '/products/sejaro_10.jpg' },
  { id: 'sejaro_12_5', name: 'Sejaro 12.5',  price: 115800, desc: 'Шприц-ручка 12,5 мг/доза 2,4 мл + игла 4 шт', img: '/products/sejaro_12_5.jpg' },
  { id: 'sejaro_15',   name: 'Sejaro 15mg',  price: 165000, desc: 'Шприц-ручка 15 мг/доза 2,4 мл + игла 4 шт',   img: '/products/sejaro_15.jpg' },
];

export const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
