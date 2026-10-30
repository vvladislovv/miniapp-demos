/* Каталог АРХИВ №9: 24 вещи в единственном экземпляре. Бренды вымышленные. */
window.A9 = window.A9 || {};

A9.CATS = [
  { id: 'bottom', label: 'Низ' },
  { id: 'top', label: 'Верх' },
  { id: 'jackets', label: 'Куртки' },
  { id: 'hoodies', label: 'Худи/свитшоты' },
  { id: 'tees', label: 'Футболки' }
];

A9.SIZES = ['S', 'M', 'L', 'XL'];

A9.CONDS = {
  5: { label: 'Как новая', note: 'Без следов носки, бирки или чистая подкладка.' },
  4: { label: 'Отличное', note: 'Носили аккуратно, видимых дефектов нет.' },
  3: { label: 'Хорошее', note: 'Лёгкие следы носки, честно показаны на фото.' },
  2: { label: 'Следы носки', note: 'Есть потёртости или мелкие пятна, цена ниже.' }
};

A9.PRICE_MIN = 1500;
A9.PRICE_MAX = 12000;
A9.FREE_FROM = 6000;
A9.PROMO = { code: 'ARCH10', percent: 10 };

A9.DELIVERY = {
  pickup: { label: 'Самовывоз', hint: 'Москва, м. Курская, шоурум. Бесплатно', cost: 0, free: true },
  pvz: { label: 'Пункт выдачи СДЭК', hint: '2-4 дня по России', cost: 290, free: false },
  courier: { label: 'Курьер до двери', hint: '1-3 дня, Москва и область', cost: 490, free: false }
};

const bottomMeas = (w, h, l, s) => [['Пояс (полуобхват)', w], ['Бёдра (полуобхват)', h], ['Длина', l], ['Шаг', s]];
const topMeas = (sh, ch, l, sl) => [['Плечи', sh], ['Грудь (полуобхват)', ch], ['Длина', l], ['Рукав', sl]];

/* Поля: id, brand, name, cat, kind, size, cond, price, c (цвет), a (акцент), bg, bgKind, tex, mat, year, desc, meas, print, drop, sold */
A9.ITEMS = [
  { id: 1, brand: 'Norrland', name: 'Карго Ridge', cat: 'bottom', kind: 'cargo', size: 'L', cond: 4, price: 4200, c: '#55603f', a: '#c8ff2e', bg: '#e9e4d6', bgKind: 'grid', tex: 'ripstop', mat: 'Хлопок, рип-стоп', year: '1998', desc: 'Широкие карго с шестью карманами и стяжками по низу. Плотная ткань, фурнитура родная.', meas: bottomMeas(41, 57, 104, 77) },
  { id: 2, brand: 'Kestrel Outdoor', name: 'Бомбер Gale', cat: 'jackets', kind: 'bomber', size: 'M', cond: 5, price: 8900, c: '#1f3b66', a: '#ff7a1a', bg: '#c8ff2e', bgKind: 'sun', tex: 'nylon', mat: 'Нейлон, подкладка полиэстер', year: '1994', desc: 'Лёгкий нейлоновый бомбер с оранжевой подкладкой. Молния ходит идеально, манжеты не растянуты.', meas: topMeas(50, 58, 66, 62), drop: true, print: { front: 'none', back: 'text', text: 'GALE' } },
  { id: 3, brand: 'Voltage Sport', name: 'Штаны Spark', cat: 'bottom', kind: 'track', size: 'M', cond: 4, price: 2900, c: '#20242b', a: '#f2f0e8', bg: '#ff5a1f', bgKind: 'stripes', tex: 'nylon', mat: 'Полиэстер', year: '1996', desc: 'Спортивные штаны с лампасами. Шуршащий материал, манжеты на молнии.', meas: bottomMeas(37, 54, 102, 76) },
  { id: 4, brand: 'Dune&Co', name: 'Свитшот Mesa', cat: 'hoodies', kind: 'crew', size: 'L', cond: 4, price: 3400, c: '#b78a5a', a: '#3a2a1a', bg: '#2f4bff', bgKind: 'dots', tex: 'fleece', mat: 'Хлопок 80%, полиэстер 20%', year: '1999', desc: 'Песочный свитшот с вышитым логотипом. Футер с начёсом, ворот держит форму.', meas: topMeas(54, 62, 69, 63), print: { front: 'text', back: 'none', text: 'DUNE' } },
  { id: 5, brand: 'Halden', name: 'Худи Fjord', cat: 'hoodies', kind: 'hoodie', size: 'L', cond: 5, price: 6200, c: '#7f8f86', a: '#f2f0e8', bg: '#e9e4d6', bgKind: 'num', tex: 'fleece', mat: 'Хлопок, плотный футер', year: '2001', desc: 'Тяжёлое худи цвета шалфея. Плотность около 450 г, кенгуру и шнурки целые.', meas: topMeas(56, 64, 71, 65), print: { front: 'text', back: 'circle', text: 'HALDEN' }, sold: true },
  { id: 6, brand: 'Rowan Works', name: 'Джинсы Workshop 5', cat: 'bottom', kind: 'jeans', size: 'M', cond: 4, price: 5400, c: '#3d5a80', a: '#d9a441', bg: '#e9e4d6', bgKind: 'split', tex: 'denim', mat: 'Деним 100% хлопок', year: '1995', desc: 'Прямые рабочие джинсы, пять карманов, жёлтая строчка. Натуральные потёртости на коленях.', meas: bottomMeas(40, 55, 106, 78) },
  { id: 7, brand: 'Okra Supply', name: 'Футболка Tour 97', cat: 'tees', kind: 'tee', size: 'L', cond: 3, price: 2300, c: '#e9e4d6', a: '#d63a1e', bg: '#ff9bd0', bgKind: 'grid', tex: 'cotton', mat: 'Хлопок 100%', year: '1997', desc: 'Тур-футболка с принтом на груди и крупной графикой на спине. Принт с мягкими трещинками.', meas: topMeas(50, 56, 74, 22), print: { front: 'text', back: 'circle', text: "TOUR'97" } },
  { id: 8, brand: 'Brisk Athletic', name: 'Футболка Sprint 91', cat: 'tees', kind: 'tee', size: 'M', cond: 4, price: 1900, c: '#c8ff2e', a: '#111111', bg: '#9a9a9a', bgKind: 'hazard', tex: 'cotton', mat: 'Хлопок, полиэстер', year: '1991', desc: 'Беговая майка-футболка с номером. Кислотный цвет не выцвел.', meas: topMeas(47, 52, 69, 21), print: { front: 'none', back: 'num', text: '91' } },
  { id: 9, brand: 'Marlow', name: 'Пуховик Alta', cat: 'jackets', kind: 'puffer', size: 'L', cond: 4, price: 12000, c: '#d4552b', a: '#111111', bg: '#e9e4d6', bgKind: 'grid', tex: 'nylon', mat: 'Нейлон, гусиный пух', year: '1993', desc: 'Объёмный пуховик ржавого цвета, тёплый до -20. Молния и кнопки без нареканий.', meas: topMeas(58, 66, 70, 66), print: { front: 'text', back: 'none', text: 'ALTA' }, sold: true },
  { id: 10, brand: 'Tideline', name: 'Рубашка Pier', cat: 'top', kind: 'shirt', size: 'L', cond: 3, price: 2600, c: '#8a2f2f', a: '#e9d9b0', bg: '#c8ff2e', bgKind: 'dots', tex: 'flannel', mat: 'Хлопковая фланель', year: '1992', desc: 'Фланелевая рубашка в крупную клетку. Мягкая, воротник держит форму.', meas: topMeas(52, 60, 76, 64) },
  { id: 11, brand: 'Fenwick', name: 'Свитер Heath', cat: 'top', kind: 'knit', size: 'M', cond: 4, price: 4800, c: '#2f4a3a', a: '#e9e4d6', bg: '#ff9bd0', bgKind: 'stripes', tex: 'knit', mat: 'Шерсть 70%, акрил 30%', year: '1990', desc: 'Плотный вязаный свитер с жаккардовой полосой. Без затяжек и катышков.', meas: topMeas(51, 60, 68, 61), drop: true },
  { id: 12, brand: 'Rowan Works', name: 'Куртка Drover', cat: 'jackets', kind: 'denim', size: 'M', cond: 5, price: 7400, c: '#35506f', a: '#e0a63a', bg: '#e9e4d6', bgKind: 'num', tex: 'denim', mat: 'Деним, хлопок', year: '1996', desc: 'Джинсовая куртка прямого кроя, строчка контрастная. Деним мягкий, швы ровные.', meas: topMeas(49, 58, 63, 62) },
  { id: 13, brand: 'Kestrel Outdoor', name: 'Шорты Creek', cat: 'bottom', kind: 'shorts', size: 'M', cond: 4, price: 2100, c: '#7b6a4a', a: '#f2f0e8', bg: '#2f4bff', bgKind: 'grid', tex: 'ripstop', mat: 'Хлопок, рип-стоп', year: '2000', desc: 'Походные шорты с накладными карманами. Подходят под высокий рост.', meas: bottomMeas(39, 56, 52, 24) },
  { id: 14, brand: 'Voltage Sport', name: 'Худи Volt', cat: 'hoodies', kind: 'hoodie', size: 'XL', cond: 4, price: 3900, c: '#c8ff2e', a: '#111111', bg: '#e9e4d6', bgKind: 'split', tex: 'fleece', mat: 'Хлопок, футер с начёсом', year: '1998', desc: 'Кислотное худи оверсайз с принтом на груди. Яркий цвет без следов стирки.', meas: topMeas(60, 68, 73, 66), drop: true, print: { front: 'text', back: 'circle', text: 'VOLTAGE' } },
  { id: 15, brand: 'Halden', name: 'Футболка Moss', cat: 'tees', kind: 'tee', size: 'S', cond: 5, price: 1500, c: '#44543f', a: '#e9e4d6', bg: '#ff5a1f', bgKind: 'sun', tex: 'cotton', mat: 'Хлопок 100%', year: '2002', desc: 'Тёмно-зелёная футболка с круглым принтом. Почти не носили.', meas: topMeas(44, 50, 66, 20), print: { front: 'circle', back: 'none', text: 'H' } },
  { id: 16, brand: 'Dune&Co', name: 'Рубашка Oasis', cat: 'top', kind: 'shirt', size: 'M', cond: 4, price: 3100, c: '#d9c9a0', a: '#2e5e8a', bg: '#2f4bff', bgKind: 'stripes', tex: 'flannel', mat: 'Хлопок, лён', year: '1997', desc: 'Лёгкая рубашка в клетку цвета песка. Рукав можно закатать, пуговицы родные.', meas: topMeas(48, 55, 72, 60) },
  { id: 17, brand: 'Marlow', name: 'Бомбер Alta 82', cat: 'jackets', kind: 'bomber', size: 'XL', cond: 3, price: 6800, c: '#3a4d2f', a: '#ff5a1f', bg: '#e9e4d6', bgKind: 'hazard', tex: 'nylon', mat: 'Нейлон', year: '1982', desc: 'Лётный бомбер с оранжевой подкладкой. Есть лёгкая потёртость на манжете, показана на фото.', meas: topMeas(56, 64, 68, 65), drop: true, print: { front: 'none', back: 'num', text: '82' } },
  { id: 18, brand: 'Okra Supply', name: 'Джинсы Loose 90', cat: 'bottom', kind: 'jeans', size: 'L', cond: 3, price: 4100, c: '#2c3e5c', a: '#e9e4d6', bg: '#c8ff2e', bgKind: 'grid', tex: 'denim', mat: 'Деним 100% хлопок', year: '1994', desc: 'Свободные джинсы с низкой посадкой. Тёмный деним, подвороты оригинальные.', meas: bottomMeas(43, 60, 108, 79), sold: true },
  { id: 19, brand: 'Brisk Athletic', name: 'Штаны Crest', cat: 'bottom', kind: 'track', size: 'M', cond: 4, price: 2700, c: '#1a2f5a', a: '#ff5a1f', bg: '#e9e4d6', bgKind: 'dots', tex: 'nylon', mat: 'Полиэстер', year: '1999', desc: 'Спортивные штаны с контрастными лампасами. Резинка тугая, шнурок на месте.', meas: bottomMeas(38, 55, 101, 75) },
  { id: 20, brand: 'Tideline', name: 'Ветровка Reef', cat: 'jackets', kind: 'bomber', size: 'M', cond: 2, price: 3300, c: '#f0c419', a: '#111111', bg: '#3a3a3a', bgKind: 'stripes', tex: 'nylon', mat: 'Нейлон', year: '1995', desc: 'Жёлтая ветровка, есть следы носки на локтях и пятно у подкладки. Цена с учётом этого.', meas: topMeas(50, 59, 65, 63), print: { front: 'none', back: 'text', text: 'REEF' } },
  { id: 21, brand: 'Fenwick', name: 'Свитер Crest', cat: 'top', kind: 'knit', size: 'S', cond: 5, price: 4500, c: '#8b2a3a', a: '#e9e4d6', bg: '#c8ff2e', bgKind: 'split', tex: 'knit', mat: 'Шерсть мериноса', year: '1993', desc: 'Бордовый свитер из шерсти, узор по груди. Выглядит как с витрины.', meas: topMeas(45, 52, 62, 58), drop: true },
  { id: 22, brand: 'Rowan Works', name: 'Карго Hauler', cat: 'bottom', kind: 'cargo', size: 'XL', cond: 3, price: 4700, c: '#3b3b3b', a: '#c8ff2e', bg: '#ff9bd0', bgKind: 'stripes', tex: 'ripstop', mat: 'Хлопок, твил', year: '2001', desc: 'Тёмные рабочие карго с усиленными коленями. Ткань плотная, фурнитура металл.', meas: bottomMeas(45, 62, 110, 80) },
  { id: 23, brand: 'Norrland', name: 'Лонгслив Frost', cat: 'tees', kind: 'crew', size: 'L', cond: 3, price: 2400, c: '#e9e4d6', a: '#1f3b66', bg: '#ff5a1f', bgKind: 'dots', tex: 'cotton', mat: 'Хлопок 100%', year: '1996', desc: 'Лонгслив с контрастными полосами на груди. Манжеты слегка вытянуты.', meas: topMeas(52, 58, 72, 64), print: { front: 'stripe', back: 'none', text: '' }, sold: true },
  { id: 24, brand: 'Kestrel Outdoor', name: 'Худи Summit', cat: 'hoodies', kind: 'hoodie', size: 'M', cond: 4, price: 5900, c: '#2b2b2b', a: '#c8ff2e', bg: '#e9e4d6', bgKind: 'num', tex: 'fleece', mat: 'Хлопок, флис', year: '2000', desc: 'Чёрное худи с лаймовым принтом. Тёплое, плотное, капюшон на два слоя.', meas: topMeas(52, 60, 69, 64), drop: true, print: { front: 'text', back: 'text', text: 'SUMMIT' } }
];

A9.FEATURED_ID = 2;
A9.DROP_NO = '07';
