/* Каталог VTGSHMOT: каждая вещь в единственном экземпляре (винтаж), поэтому у неё один размер. */
const CATEGORIES = [
  { id: 'all', name: 'Все вещи' },
  { id: 'pants', name: 'Штаны/Шорты' },
  { id: 'jackets', name: 'Куртки' },
  { id: 'hoodies', name: 'Худи/Свитшоты' },
  { id: 'tees', name: 'Футболки' }
];
const SIZES = ['S', 'M', 'L', 'XL'];

const PRODUCTS = [
  { id: 1, cat: 'pants', art: 'pants', c: '#222428', a: '#d4402a', title: 'Горнолыжные штаны Mammut', brand: 'Mammut', price: 6990, size: 'L', cond: 9, year: '2000-е', desc: 'Мембранные штаны со швами под проклейку, снежные юбки и вентиляция по бёдрам. Без дефектов, фурнитура работает.', m: [['Длина', '106 см'], ['Пояс', '41 см'], ['Шаг', '78 см']] },
  { id: 2, cat: 'pants', art: 'jeans', c: '#3c63a6', a: '#e8eef8', title: 'Джинсы Rocawear 00s', brand: 'Rocawear', price: 6490, size: 'XL', cond: 8, year: '2003', desc: 'Широкие джинсы с вышивкой на кармане, плотный деним. Лёгкая потёртость на манжетах, как и должно быть у вещи из нулевых.', m: [['Длина', '110 см'], ['Пояс', '44 см'], ['Шаг', '80 см']] },
  { id: 3, cat: 'pants', art: 'pants', c: '#7a5a3a', a: '#d9c6a0', title: 'Карго Carhartt Double Knee', brand: 'Carhartt', price: 5490, size: 'L', cond: 8, year: '1990-е', desc: 'Рабочие штаны с двойным коленом. Плотный дак, выцветший цвет, штопка на правом колене.', m: [['Длина', '108 см'], ['Пояс', '42 см'], ['Шаг', '76 см']] },
  { id: 4, cat: 'pants', art: 'shorts', c: '#4a74b8', a: '#e8eef8', title: 'Джинсовые шорты Stüssy', brand: 'Stüssy', price: 3290, size: 'M', cond: 9, year: '2000-е', desc: 'Длинные джинсовые шорты ниже колена, лейбл на заднем кармане.', m: [['Длина', '58 см'], ['Пояс', '38 см']] },
  { id: 5, cat: 'pants', art: 'track', c: '#17181b', a: '#f4f4f4', title: 'Треки Adidas Originals', brand: 'Adidas', price: 3990, size: 'M', cond: 9, year: '1990-е', desc: 'Спортивные штаны с тремя полосами и кнопками по бокам. Состояние почти нового.', m: [['Длина', '102 см'], ['Пояс', '36 см'], ['Шаг', '75 см']] },
  { id: 6, cat: 'jackets', art: 'jacket', c: '#1f6b73', a: '#f2b84b', title: 'Куртка Columbia Gore-Tex', brand: 'Columbia', price: 8990, size: 'L', cond: 9, year: '1998', desc: 'Мембранная куртка с капюшоном-трансформером и пит-зипами. Водоотталкивающий слой в порядке.', m: [['Длина', '72 см'], ['Плечи', '52 см'], ['Рукав', '66 см']] },
  { id: 7, cat: 'jackets', art: 'bomber', c: '#4a5a3a', a: '#e8742a', title: 'Бомбер Alpha Industries', brand: 'Alpha Industries', price: 7490, size: 'M', cond: 8, year: '1990-е', desc: 'Классический MA-1 с оранжевой подкладкой. Манжеты и воротник в идеале, на подкладке мелкий след.', m: [['Длина', '63 см'], ['Плечи', '48 см'], ['Рукав', '65 см']] },
  { id: 8, cat: 'jackets', art: 'jacket', c: '#d56a1c', a: '#1b1b1d', title: 'Анорак The North Face 90s', brand: 'The North Face', price: 9490, size: 'XL', cond: 8, year: '1996', desc: 'Лёгкий анорак с кенгуру-карманом и вышивкой на груди. Цвет выгорел равномерно.', m: [['Длина', '74 см'], ['Плечи', '55 см'], ['Рукав', '67 см']] },
  { id: 9, cat: 'hoodies', art: 'hoodie', c: '#8e9096', a: '#ffffff', title: 'Худи Nike Center Swoosh', brand: 'Nike', price: 4990, size: 'L', cond: 8, year: '1999', desc: 'Тяжёлый хлопок, большой свуш по центру. Небольшая потёртость принта — вещь живая.', m: [['Длина', '70 см'], ['Плечи', '54 см'], ['Рукав', '64 см']] },
  { id: 10, cat: 'hoodies', art: 'sweat', c: '#27355c', a: '#c8362e', title: 'Свитшот Champion Reverse Weave', brand: 'Champion', price: 4290, size: 'M', cond: 9, year: '1990-е', desc: 'Обратное плетение, вшитые боковые клинья. Плотный и мягкий, без катышков.', m: [['Длина', '67 см'], ['Плечи', '50 см'], ['Рукав', '62 см']] },
  { id: 11, cat: 'hoodies', art: 'hoodie', c: '#7a5a3a', a: '#e7d9bc', title: 'Худи Carhartt WIP', brand: 'Carhartt', price: 5290, size: 'L', cond: 9, year: '2000-е', desc: 'Плотное худи с логотипом на груди. Чуть выгорело на капюшоне.', m: [['Длина', '69 см'], ['Плечи', '53 см'], ['Рукав', '64 см']] },
  { id: 12, cat: 'tees', art: 'tee', c: '#1b1b1d', a: '#e9663a', title: 'Футболка Harley-Davidson 90s', brand: 'Harley-Davidson', price: 3490, size: 'XL', cond: 8, year: '1994', desc: 'Двусторонний принт, одинарный шов, потрескавшийся пигмент.', m: [['Длина', '75 см'], ['Ширина', '57 см']] },
  { id: 13, cat: 'tees', art: 'tee', c: '#ededed', a: '#1b1b1d', title: 'Футболка Nirvana Band Tee', brand: 'Giant', price: 5990, size: 'L', cond: 7, year: '1993', desc: 'Оригинальный мерч тура. Есть тонкие следы носки, сохранность принта хорошая.', m: [['Длина', '74 см'], ['Ширина', '55 см']] },
  { id: 14, cat: 'tees', art: 'tee', c: '#232326', a: '#c8c8c8', title: 'Футболка Metallica Tour', brand: 'Brockum', price: 4990, size: 'L', cond: 8, year: '1991', desc: 'Тур-футболка с задним принтом.', m: [['Длина', '76 см'], ['Ширина', '56 см']], sold: true },
  { id: 15, cat: 'pants', art: 'shorts', c: '#4d6a3c', a: '#f2d84a', title: 'Шорты Nike ACG', brand: 'Nike', price: 2990, size: 'S', cond: 9, year: '2000-е', desc: 'Лёгкие треккинговые шорты с карманом на липучке.', m: [['Длина', '50 см'], ['Пояс', '34 см']] },
  { id: 16, cat: 'pants', art: 'jeans', c: '#7fa2d0', a: '#f6f1e6', title: 'Джинсы Levi’s 501', brand: 'Levi’s', price: 6290, size: 'M', cond: 8, year: '1990-е', desc: 'Прямой крой, пуговицы вместо молнии, made in USA. Красивые фейды на бёдрах.', m: [['Длина', '108 см'], ['Пояс', '39 см'], ['Шаг', '79 см']] }
];

const DELIVERY = [
  { id: 'pickup', name: 'Самовывоз, Москва', note: 'Бесплатно, по записи', price: 0 },
  { id: 'cdek', name: 'СДЭК, пункт выдачи', note: 'Бесплатно от 10 000 ₽', price: 350 },
  { id: 'courier', name: 'Курьер по Москве', note: '1–2 дня', price: 590 }
];
const PROMO = { VTG10: 0.1 };
const FREE_CDEK_FROM = 10000;
