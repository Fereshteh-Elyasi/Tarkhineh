-- ===================================================================
-- Seed data v2 - a FULL, accurate copy of src/data/menuItems.js,
-- branches.js, branchDishes.js, and review.js from the real frontend,
-- including the real image filenames (see README section below on
-- where to copy the actual image files from).
--
-- IMPORTANT: import with a UTF-8 client:
--   mysql -u root --default-character-set=utf8mb4 tarkhineh < seed_v2.sql
-- Run this AFTER schema.sql. If you already ran the old seed.sql,
-- first empty the tables:
--   mysql -u root -e "USE tarkhineh; SET FOREIGN_KEY_CHECKS=0;
--   TRUNCATE menu_item_images; TRUNCATE menu_items; TRUNCATE menu_tabs;
--   TRUNCATE branch_dishes; TRUNCATE branch_images; TRUNCATE reviews;
--   TRUNCATE branches; TRUNCATE discount_codes; SET FOREIGN_KEY_CHECKS=1;"
-- ===================================================================
SET NAMES utf8mb4;
USE tarkhineh;

-- ---------- menu tabs ----------
INSERT INTO menu_tabs (id, label, sort_order) VALUES
  ('main', 'غذای اصلی', 1),
  ('appetizer', 'پیش غذا', 2),
  ('dessert', 'دسر', 3),
  ('drink', 'نوشیدنی', 4);

-- ---------- menu items: MAIN / iranian ----------
INSERT INTO menu_items
  (id, tab_id, title, description, price, old_price, discount_percent, rating, rating_count, image, category, category_label, is_bestseller) VALUES
  ('m-koofte-berenji', 'main', 'کوفته برنجی', 'برنج سبزی کوفته لپه آرد نخودچی، گردو و زرشک و آلو پیاز', 145000, 180000, 35, 4.0, 27, '/uploads/Images/Menu/koofteh berenji.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-kashke-bademjan', 'main', 'کشک بادمجان', 'بادمجان، کشک، نعناع خشک، مغز گردو، سیر، پیاز', 95000, NULL, NULL, 5.0, 27, '/uploads/Images/Menu/kashk1.jpg', 'iranian', 'غذاهای ایرانی', 1),
  ('m-mirza-qasemi', 'main', 'میرزا قاسمی', 'بادمجان، گوجه فرنگی، تخم مرغ، سیر، رب گوجه فرنگی', 142500, 165000, 10, 5.0, 27, '/uploads/Images/Menu/mirza.png', 'iranian', 'غذاهای ایرانی', 1),
  ('m-baqlagatoq', 'main', 'باقلاقاتوق', 'پاچ باقلا، شوید خشک، کره، سیر، تخم مرغ', 195000, NULL, 30, 4.0, 27, '/uploads/Images/Menu/baqla.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-felafel', 'main', 'فلافل', 'نخود، پیاز، تخم گشنیز، سیر، جعفری، سیب زمینی', 80000, NULL, NULL, 3.0, 27, '/uploads/Images/Menu/felafel.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-kalejoosh', 'main', 'کله جوش', 'کشک، گردو، پیاز، نعناع خشک', 203000, 210000, 5, 4.0, 27, '/uploads/Images/Menu/kaljoosh.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-eggplant-borani', 'main', 'بورانی بادمجان', 'بادمجان کبابی، ماست چکیده، سیر، روغن نعنا و مغز گردو', 148000, 170000, 22, 5.0, 45, '/uploads/Images/borani.jpg', 'iranian', 'غذاهای ایرانی', 1),
  ('m-stuffed-eggplant', 'main', 'بادمجان شکم‌پر', 'بادمجان، پیاز، گوجه فرنگی، سبزی خشک', 136000, 150000, 18, 4.0, 27, '/uploads/Images/bademjan.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-stuffed-cabbage', 'main', 'دلمه برگ کلم', 'کلم برگ، برنج، لپه پخته، پیاز، سبزی معطر رب', 209000, 220000, 8, 5.0, 52, '/uploads/Images/dolmeh.jpg', 'iranian', 'غذاهای ایرانی', 1),
  ('m-dolme-moo', 'main', 'دلمه برگ مو', 'پیاز، برنج، لپه، سبزی دلمه، سرکه', 195000, NULL, NULL, 2.0, 27, '/uploads/Images/Menu/dolme-moo.jpg', 'iranian', 'غذاهای ایرانی', 0),
  ('m-koko-sabzi', 'main', 'کوکو سبزی', 'تخم مرغ، گردو، سیر، آرد، روغن مایع سبزی کوکویی', 270000, 300000, 10, 5.0, 27, '/uploads/Images/Menu/kokosabzi.jpg', 'iranian', 'غذاهای ایرانی', 1),
  ('m-koko-adas', 'main', 'کوکو سیب زمینی و عدس', 'عدس، سیب زمینی، پیاز متوسط، تخم مرغ، پودر سیر، آرد سوخاری', 105000, 135000, 20, 1.0, 27, '/uploads/Images/Menu/kokoadas.jpg', 'iranian', 'غذاهای ایرانی', 0);

-- ---------- menu items: MAIN / non-iranian ----------
INSERT INTO menu_items
  (id, tab_id, title, description, price, old_price, discount_percent, rating, rating_count, image, category, category_label, is_bestseller) VALUES
  ('m-pasta-sabzi', 'main', 'پاستا سبزیجات', 'پاستا، قارچ، گوجه، کدوی خوردشده، پیاز خلالی‌شده', 140000, 175000, 20, 5.0, 27, '/uploads/Images/Menu/pastasabzi.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 1),
  ('m-pasta-blonz', 'main', 'پاستا بلونز', 'اسپاگتی، گوشت چرخ کرده، هویج، ساقه کرفس، گوجه فرنگی، سیر، پیاز، پنیر پارمزان، روغن زیتون', 160000, 170000, 12, 4.0, 27, '/uploads/Images/Menu/pastablonz.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 0),
  ('m-ratatouille', 'main', 'راتاتویی', 'بادمجان، کدو سبز، فلفل دلمه‌ای، پیاز، رب گوجه فرنگی و ادویه‌جات فرانسوی', 95000, 180000, 45, 4.0, 27, '/uploads/Images/ratatoei.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 0),
  ('m-lasagna', 'main', 'لازانیا', 'لازانیا، قارچ، ریحان تازه، جعفری تازه، گوجه فرنگی و پنیر پیتزا بادمجان', 150000, NULL, NULL, 5.0, 38, '/uploads/Images/lazania.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 1),
  ('m-sushi', 'main', 'سوشی', 'جلبک دریایی/ نوری، برنج کته، سرکه سفید (یا سرکه برنج)، شکر، نمک دریا', 85000, 100000, 15, 4.0, 21, '/uploads/Images/sushi.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 0),
  ('m-veggie-pakora', 'main', 'پاکورا سبزیجات', 'گرام ماسالا، پودر کاری، سیر له شده، گشنیز خرد شده', 110000, 125000, 8, 4.0, 28, '/uploads/Images/pakura.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 0),
  ('m-kalzoneh', 'main', 'کالزونه اسفناج', 'اسفناج، قارچ، پنیر موزارلا یا پنیر پیتزا، پنیر ریکوتا یا پنیر خامه‌ای، پیاز، سیر، روغن زیتون', 177000, 190000, 17, 5.0, 21, '/uploads/Images/kalzoneh.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 1),
  ('m-palak-panir', 'main', 'پالاک پنیر', 'پنیر، اسفناج، گوجه، پیاز، سیر', 180000, 200000, 15, 4.0, 10, '/uploads/Images/Menu/palak.jpg', 'non_iranian', 'غذاهای غیر ایرانی', 0);

-- ---------- menu items: MAIN / pizza ----------
INSERT INTO menu_items
  (id, tab_id, title, description, price, old_price, discount_percent, rating, rating_count, image, category, category_label, is_bestseller) VALUES
  ('m-pizza-rokola', 'main', 'پیتزا روکولا', 'اسفناج، سبزی روکولا، آرد، پودر مایه خمیر، روغن زیتون، خردل، سیر، پنیر موزارلا و پارمسان، گوجه گیلاسی، سس فلفل سبز تند', 188000, 195000, 12, 5.0, 23, '/uploads/Images/Menu/rokola.jpg', 'pizza', 'پیتزاها', 1),
  ('m-pizza-bademjan-zeytoon', 'main', 'پیتزا بادمجان و زیتون', 'بادمجان کوچک، روغن زیتون، پنیر موزارلا، پنیر پارمزان، برگ ریحان، گوجه فرنگی، سس گوجه فرنگی', 150000, NULL, NULL, 4.0, 34, '/uploads/Images/Menu/zeytoon.jpg', 'pizza', 'پیتزاها', 0),
  ('m-pizza-khameh', 'main', 'پیتزا سبزیجات و خامه', 'نخود فرنگی پخته شده، ذرت نیم پز، فلفل دلمه‌ای رنگی، قارچ، سیر یا پیازچه خردشده', 185000, 210000, 21, 4.0, 34, '/uploads/Images/Menu/khameh.jpg', 'pizza', 'پیتزاها', 0),
  ('m-pizza-qarch', 'main', 'پیتزا قارچ', 'قارچ، فلفل دلمه‌ای، رب گوجه فرنگی، پودر سیر، آویشن، مرزه، پنیر پیتزا گیاهی', 175000, 215000, 25, 3.0, 34, '/uploads/Images/qarch.jpg', 'pizza', 'پیتزاها', 0),
  ('m-pizza-pepperoni', 'main', 'پیتزا پپرونی', 'ژامبون قرمز خشک‌شده، خردل، دانه رازیانه، پاپریکا دودی، پودر سیر و پنیر پیتزا', 100000, NULL, NULL, 4.0, 19, '/uploads/Images/peperoni.jpg', 'pizza', 'پیتزاها', 0),
  ('m-pizza-esfenaj', 'main', 'پیتزا اسفناج', 'اسفناج تازه، پیاز، سیر، پنیر پیتزا، قارچ', 252000, 280000, 10, 5.0, 34, '/uploads/Images/Menu/esfenaj.jpg', 'pizza', 'پیتزاها', 1),
  ('m-pizza-margarita', 'main', 'پیتزا مارگاریتا', 'گوجه فرنگی، ریحان، سیر، پنیر پیتزا', 147000, 165000, 13, 2.0, 34, '/uploads/Images/Menu/margarita.jpg', 'pizza', 'پیتزاها', 0),
  ('m-pizza-panir', 'main', 'پیتزا پنیر', 'نان پیتزا، پنیر پیتزا، سس باربیکیو، گوجه فرنگی، سس کچاپ، سیر، روغن زیتون', 105000, 125000, 16, 3.0, 34, '/uploads/Images/Menu/pizzapanir.jpg', 'pizza', 'پیتزاها', 0);

-- ---------- menu items: MAIN / sandwich ----------
INSERT INTO menu_items
  (id, tab_id, title, description, price, old_price, discount_percent, rating, rating_count, image, category, category_label, is_bestseller) VALUES
  ('m-kotlet', 'main', 'ساندویچ کتلت مخصوص', 'سیب زمینی، لوبیا قرمز، بلغور گندم، نعناع خشک، پودر زیره، پودر جوز هندی، گوجه فرنگی، روغن زیتون', 205000, 230000, 18, 5.0, 19, '/uploads/Images/Menu/kotlet1.jpg', 'sandwich', 'ساندویچ‌ها', 1),
  ('m-koktel', 'main', 'ساندویچ سوسیس کوکتل', 'سوسیس گیاهی، پیاز، سیب زمینی، رب گوجه فرنگی', 165000, 205000, 35, 4.0, 19, '/uploads/Images/Menu/koktel2.jpg', 'sandwich', 'ساندویچ‌ها', 0),
  ('m-kotlet-kadoosabz', 'main', 'ساندویچ کتلت کدو سبز', 'کدو سبز، هویج، سیب زمینی، پیاز', 145000, NULL, NULL, 5.0, 19, '/uploads/Images/Menu/kadoo3.jpg', 'sandwich', 'ساندویچ‌ها', 1),
  ('m-panini-spinach', 'main', 'پنینی اسفناج', 'نان پنینی، اسفناج تازه، پیاز، پنیر پیتزا و سس مخصوص کره‌ای', 190000, 223000, 15, 3.0, 21, '/uploads/Images/penini.jpg', 'sandwich', 'ساندویچ‌ها', 0);

-- ---------- menu items: APPETIZER ----------
INSERT INTO menu_items
  (id, tab_id, title, description, price, old_price, discount_percent, rating, rating_count, image, category, category_label, is_bestseller) VALUES
  ('a-salad-shirazi', 'appetizer', 'سالاد شیرازی', 'خیار، گوجه فرنگی، پیاز خرد‌شده، آبغوره و نعنا', 58000, NULL, NULL, 4.0, 14, '/uploads/Images/Menu/saladshirazi.jpg', 'general', 'پیش غذاها', 0),
  ('a-mast-khiar', 'appetizer', 'ماست و خیار', 'ماست چکیده، خیار، نعنا خشک و مغز گردو', 58500, 65000, 10, 5.0, 22, '/uploads/Images/Menu/mastkhiar.jpg', 'general', 'پیش غذاها', 1);

-- ---------- menu items: DESSERT ----------
INSERT INTO menu_items
  (id, tab_id, title, description, price, old_price, discount_percent, rating, rating_count, image, category, category_label, is_bestseller) VALUES
  ('d-panna-cotta', 'dessert', 'پاناکوتا توت‌فرنگی', 'کرم شیر و خامه با ژله توت‌فرنگی تازه', 95000, NULL, NULL, 5.0, 18, '/uploads/Images/Menu/panakootajpg.jpg', 'general', 'دسرها', 1),
  ('d-bastani-sonati', 'dessert', 'بستنی سنتی زعفرانی', 'بستنی زعفرانی با تکه‌های خامه و پسته خلالی', 179000, 229000, 20, 4.0, 30, '/uploads/Images/Menu/bastani.jpeg', 'general', 'دسرها', 0);

-- ---------- menu items: DRINK ----------
INSERT INTO menu_items
  (id, tab_id, title, description, price, old_price, discount_percent, rating, rating_count, image, category, category_label, is_bestseller) VALUES
  ('dr-doogh', 'drink', 'دوغ خوشگوار', 'ماست، آب، نعنا خشک و نمک، خنک و گازدار', 35000, 40000, 8, 4.0, 11, '/uploads/Images/Menu/doogh.jpg', 'general', 'نوشیدنی‌ها', 0),
  ('dr-ab-havij', 'drink', 'آب هویج بستنی (400 میلی لیتر)', 'آب‌هویج تازه با یک اسکوپ بستنی وانیلی', 55000, 60000, 8, 5.0, 26, '/uploads/Images/Menu/abhavij.jpeg', 'general', 'نوشیدنی‌ها', 1);

-- ---------- extra gallery images (src/data/menuItems.js "images" arrays) ----------
INSERT INTO menu_item_images (menu_item_id, image_url, sort_order) VALUES
  ('m-koofte-berenji', '/uploads/Images/Menu/koofteh berenji2.jpg', 1),
  ('m-koofte-berenji', '/uploads/Images/Menu/koofteh berenji3.jpg', 2),
  ('m-koofte-berenji', '/uploads/Images/Menu/koofteh berenji4.jpg', 3),
  ('m-koofte-berenji', '/uploads/Images/Menu/koofteh berenji5.jpg', 4),
  ('m-koofte-berenji', '/uploads/Images/Menu/koofteh berenji6.jpg', 5),
  ('m-kashke-bademjan', '/uploads/Images/Menu/kashk2.jpg', 1),
  ('m-kashke-bademjan', '/uploads/Images/Menu/kashk3.jpg', 2),
  ('m-kashke-bademjan', '/uploads/Images/Menu/kashk4.jpg', 3),
  ('m-kashke-bademjan', '/uploads/Images/Menu/kashk5.jpg', 4),
  ('m-mirza-qasemi', '/uploads/Images/Menu/mirza2.jfif', 1),
  ('m-mirza-qasemi', '/uploads/Images/Menu/mirza3.jpg', 2),
  ('m-mirza-qasemi', '/uploads/Images/Menu/mirza4.jfif', 3),
  ('m-mirza-qasemi', '/uploads/Images/Menu/mirza5.jpg', 4),
  ('m-baqlagatoq', '/uploads/Images/Menu/baqla2.jfif', 1),
  ('m-baqlagatoq', '/uploads/Images/Menu/baqla3.jfif', 2),
  ('m-baqlagatoq', '/uploads/Images/Menu/baqla4.jfif', 3),
  ('m-baqlagatoq', '/uploads/Images/Menu/baqla5.jpg', 4),
  ('m-felafel', '/uploads/Images/Menu/felafel2.webp', 1),
  ('m-felafel', '/uploads/Images/Menu/falafel3.jpg', 2),
  ('m-felafel', '/uploads/Images/Menu/falafel4.webp', 3),
  ('m-felafel', '/uploads/Images/Menu/felafel5.jpg', 4),
  ('m-pasta-sabzi', '/uploads/Images/Menu/pastasabzi2.jpg', 1),
  ('m-pasta-sabzi', '/uploads/Images/Menu/pastasabzi3.jpg', 2),
  ('m-pasta-sabzi', '/uploads/Images/Menu/pastasabzi4.jpg', 3),
  ('m-pasta-sabzi', '/uploads/Images/Menu/pastasabzi5.jpg', 4),
  ('m-pasta-sabzi', '/uploads/Images/Menu/pastasabzi6.jpg', 5);

-- ---------- branches (src/data/branches.js) ----------
INSERT INTO branches (id, slug, name, address, phone1, phone2, working_hours, lat, lng, image) VALUES
  (1, 'ekbatan', 'شعبه اکباتان', 'اکباتان، خیابان ریاحی، کوچه سیزدهم، ساختمان آیسا، طبقه همکف', 'شماره تماس ۱: ۵۴۸۹۱۲۵۴-۰۲۱', 'شماره تماس ۲: ۵۴۸۹۱۲۵۵-۰۲۱', 'ساعت کاری: همه‌روزه از ساعت ۱۲ تا ۲۳ بجز روزهای تعطیل', 35.7219000, 51.2775000, '/uploads/Images/chaloos.jpg'),
  (2, 'chaloos', 'شعبه چالوس', 'چالوس، خیابان امام، بعد از میدان شهرداری، جنب داروخانه دکتر اکبری', NULL, NULL, NULL, 36.6560000, 51.4206000, '/uploads/Images/chaloos1.jpg'),
  (3, 'aqdasie', 'شعبه اقدسیه', 'اقدسیه، خیابان شبستری، بعد از کوچه خرمشهر، پلاک ۸', NULL, NULL, NULL, 35.8100000, 51.4800000, '/uploads/Images/aqdasie.jpg'),
  (4, 'vanak', 'شعبه ونک', 'میدان ونک، خیابان ولیعصر، نبش کوچه نشاط، پلاک ۲۴', NULL, NULL, NULL, 35.7563000, 51.4113000, '/uploads/Images/vanak.png');

INSERT INTO branch_images (branch_id, image_url, sort_order) VALUES
  (1, '/uploads/Images/Branch4.jpg', 1), (1, '/uploads/Images/Branch1.jpg', 2), (1, '/uploads/Images/Branch3.jpg', 3), (1, '/uploads/Images/Branch5.jpg', 4),
  (2, '/uploads/Images/Branch2.jpg', 1), (2, '/uploads/Images/Branch3.jpg', 2), (2, '/uploads/Images/Branch4.jpg', 3), (2, '/uploads/Images/Branch5.jpg', 4),
  (3, '/uploads/Images/Branch1.jpg', 1), (3, '/uploads/Images/Branch3.jpg', 2), (3, '/uploads/Images/Branch4.jpg', 3), (3, '/uploads/Images/Branch5.jpg', 4),
  (4, '/uploads/Images/Branch3.jpg', 1), (4, '/uploads/Images/Branch2.jpg', 2), (4, '/uploads/Images/Branch4.jpg', 3), (4, '/uploads/Images/Branch5.jpg', 4);

-- ---------- branch dishes (src/data/branchDishes.js) - same list applied to every branch ----------
INSERT INTO branch_dishes (branch_id, section, name, price, discount_percent, rating, rating_count, image, sort_order)
SELECT b.id, d.section, d.name, d.price, d.discount_percent, d.rating, d.rating_count, d.image, d.sort_order
FROM branches b
CROSS JOIN (
  SELECT 'featured' AS section, 'دلمه برگ کلم' AS name, 209000 AS price, 25 AS discount_percent, 5.0 AS rating, 52 AS rating_count, '/uploads/Images/dolmeh.jpg' AS image, 1 AS sort_order
  UNION ALL SELECT 'featured', 'بادمجان شکم‌پر', 136000, 17, 4.0, 27, '/uploads/Images/bademjan.jpg', 2
  UNION ALL SELECT 'featured', 'کالزونه اسفناج', 177000, 17, 5.0, 34, '/uploads/Images/kalzoneh.jpg', 3
  UNION ALL SELECT 'featured', 'پیتزا قارچ', 175000, 25, 3.0, 23, '/uploads/Images/qarch.jpg', 4
  UNION ALL SELECT 'featured', 'بشقاب گیاهی کلسیم', 175000, 27, 5.0, 27, '/uploads/Images/kalsiom.jpg', 5
  UNION ALL SELECT 'featured', 'پرو فیله(رژیمی)', 709000, 20, 3.5, 20, '/uploads/Images/fileh.jpg', 6
  UNION ALL SELECT 'featured', 'پاستا آلفردو', 995000, 15, 4.5, 10, '/uploads/Images/alfredo.jpeg', 7
  UNION ALL SELECT 'popular', 'پنینی اسفناج', 190000, 15, 3.0, 21, '/uploads/Images/penini.jpg', 1
  UNION ALL SELECT 'popular', 'پیتزا پپرونی', 100000, 0, 4.0, 19, '/uploads/Images/peperoni.jpg', 2
  UNION ALL SELECT 'popular', 'راتاتویی', 95000, 26, 4.0, 27, '/uploads/Images/ratatoei.jpg', 3
  UNION ALL SELECT 'popular', 'بورانی بادمجان', 148000, 25, 5.0, 45, '/uploads/Images/borani.jpg', 4
  UNION ALL SELECT 'popular', 'مگا استودیو برگر', 950000, 0, 4.7, 19, '/uploads/Images/mega.jpg', 5
  UNION ALL SELECT 'popular', 'دیش گیاهی', 137000, 0, 4.7, 19, '/uploads/Images/vegan.jpg', 6
  UNION ALL SELECT 'non_iranian', 'سوشی', 85000, 15, 4.0, 21, '/uploads/Images/sushi.jpg', 1
  UNION ALL SELECT 'non_iranian', 'راتاتویی', 95000, 25, 4.0, 21, '/uploads/Images/ratatoei.jpg', 2
  UNION ALL SELECT 'non_iranian', 'پاکورا سبزیجات', 110000, 0, 4.0, 28, '/uploads/Images/pakura.jpg', 3
  UNION ALL SELECT 'non_iranian', 'لازانیا', 150000, 25, 5.0, 38, '/uploads/Images/lazania.jpg', 4
  UNION ALL SELECT 'non_iranian', 'راویولی ایتالیایی', 95000, 25, 4.0, 21, '/uploads/Images/ravioli.jpg', 5
) d;

-- ---------- reviews (src/data/review.js) - same 5 reviews applied to every branch ----------
INSERT INTO reviews (branch_id, name, review_date, text, rating, avatar)
SELECT b.id, r.name, r.review_date, r.text, r.rating, r.avatar
FROM branches b
CROSS JOIN (
  SELECT 'آرزو محمدعلی‌زاده' AS name, '۲۳ اسفند ۱۴۰۱' AS review_date,
         'از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم. از مدیریت شعبه اکباتان رستوران‌های ترخینه واقعاً تشکر می‌کنم.' AS text,
         5 AS rating, '/uploads/Images/arezoo.jpg' AS avatar
  UNION ALL SELECT 'سردار وظیفه', '۲۴ اسفند ۱۴۰۱',
         'از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم. از مدیریت شعبه اکباتان رستوران‌های ترخینه واقعاً تشکر می‌کنم.',
         4, '/uploads/Images/sardar.png'
  UNION ALL SELECT 'علی رضایی', '۲۶ اسفند ۱۴۰۱',
         'از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم. از مدیریت شعبه اکباتان رستوران‌های ترخینه واقعا تشکر میکنم.',
         4, '/uploads/Images/ali.png'
  UNION ALL SELECT 'حسن محمدی', '۲۵ اسفند ۱۴۰۱',
         'از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم. از مدیریت شعبه اکباتان رستوران‌های ترخینه واقعا تشکر میکنم.',
         5, '/uploads/Images/sardar2.png'
) r;

-- ---------- discount codes ----------
INSERT INTO discount_codes (code, percent, amount, max_discount, expires_at, is_active) VALUES
  ('TARKHINEH10', 10, NULL, 50000, '2027-12-31', 1),
  ('WELCOME20000', NULL, 20000, NULL, '2027-12-31', 1);
