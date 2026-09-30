// این فایل معادل menuData.js قبلی است، فقط جای فایل عوض شده (src/data/menuItems.js).
// داده‌های صفحه منو (MenuPage)
// این داده‌ها به‌عنوان «دیتابیس محلی» توسط src/api/menuApi.js خونده می‌شن (شبیه‌سازی fetch).

// ---------- تصاویر واقعی پروژه (همان تصاویری که در Home.jsx استفاده شده‌اند) ----------
import koofteh1 from '../assets/Images/Menu/koofteh berenji.jpg';
import koofteh2 from '../assets/Images/Menu/koofteh berenji2.jpg';
import koofteh3 from '../assets/Images/Menu/koofteh berenji3.jpg';
import koofteh4 from '../assets/Images/Menu/koofteh berenji4.jpg';
import koofteh5 from '../assets/Images/Menu/koofteh berenji5.jpg';
import koofteh6 from '../assets/Images/Menu/koofteh berenji6.jpg';
import kashk1 from '../assets/Images/Menu/kashk1.jpg';
import kashk2 from '../assets/Images/Menu/kashk2.jpg';
import kashk3 from '../assets/Images/Menu/kashk3.jpg';
import kashk4 from '../assets/Images/Menu/kashk4.jpg';
import kashk5 from '../assets/Images/Menu/kashk5.jpg';
import mirza1 from '../assets/Images/Menu/mirza.png';
import mirza2 from '../assets/Images/Menu/mirza2.jfif';
import mirza3 from '../assets/Images/Menu/mirza3.jpg';
import mirza4 from '../assets/Images/Menu/mirza4.jfif';
import mirza5 from '../assets/Images/Menu/mirza5.jpg';
import baqla1 from '../assets/Images/Menu/baqla.jpg';
import baqla2 from '../assets/Images/Menu/baqla2.jfif';
import baqla3 from '../assets/Images/Menu/baqla3.jfif';
import baqla4 from '../assets/Images/Menu/baqla4.jfif';
import baqla5 from '../assets/Images/Menu/baqla5.jpg';
import felafel from '../assets/Images/Menu/felafel.jpg';
import felafel2 from '../assets/Images/Menu/felafel2.webp';
import felafel3 from '../assets/Images/Menu/falafel3.jpg';
import felafel4 from '../assets/Images/Menu/falafel4.webp';
import felafel5 from '../assets/Images/Menu/felafel5.jpg';
import kalejoosh from '../assets/Images/Menu/kaljoosh.jpg';
import borani from '../assets/Images/borani.jpg';
import bademjan from '../assets/Images/bademjan.jpg';
import dolmeh from '../assets/Images/dolmeh.jpg';
import dolmem from '../assets/Images/Menu/dolme-moo.jpg';
import kokosabzi  from '../assets/Images/Menu/kokosabzi.jpg';
import kokoadas  from '../assets/Images/Menu/kokoadas.jpg';
// ------------------------------------------------------------
import pastasabzi1 from '../assets/Images/Menu/pastasabzi.jpg';
import pastasabzi2 from '../assets/Images/Menu/pastasabzi2.jpg';
import pastasabzi3 from '../assets/Images/Menu/pastasabzi3.jpg';
import pastasabzi4 from '../assets/Images/Menu/pastasabzi4.jpg';
import pastasabzi5 from '../assets/Images/Menu/pastasabzi5.jpg';
import pastasabzi6 from '../assets/Images/Menu/pastasabzi6.jpg';
import pastablonz from '../assets/Images/Menu/pastablonz.jpg';
import ratatoei from '../assets/Images/ratatoei.jpg';
import lazania from '../assets/Images/lazania.jpg';
import sushi from '../assets/Images/sushi.jpg';
import pakura from '../assets/Images/pakura.jpg';
import kalzoneh from '../assets/Images/kalzoneh.jpg';
import palak from '../assets/Images/Menu/palak.jpg';
// ---------------------------------------------------------------
import rokola from '../assets/Images/Menu/rokola.jpg';
import zeytoon from '../assets/Images/Menu/zeytoon.jpg';
import khameh from '../assets/Images/Menu/khameh.jpg';
import qarch from '../assets/Images/qarch.jpg';
import peperoni from '../assets/Images/peperoni.jpg';
import esfenaj from '../assets/Images/Menu/esfenaj.jpg';
import margarita from '../assets/Images/Menu/margarita.jpg';
import panir from '../assets/Images/Menu/pizzapanir.jpg';
// --------------------------------------------------------------------
import kotlet from '../assets/Images/Menu/kotlet1.jpg';
import koktel from '../assets/Images/Menu/koktel2.jpg';
import kadoo from '../assets/Images/Menu/kadoo3.jpg';
import penini from '../assets/Images/penini.jpg';
// ----------------------------------------------------------
import mast from '../assets/Images/Menu/mastkhiar.jpg';
import salad from '../assets/Images/Menu/saladshirazi.jpg';
// --------------------------------------------------------------
import panakota from '../assets/Images/Menu/panakootajpg.jpg';
import bastani from '../assets/Images/Menu/bastani.jpeg';
// -----------------------------------------------------------------
import doogh from '../assets/Images/Menu/doogh.jpg';
import havij from '../assets/Images/Menu/abhavij.jpeg';


// ---------- تب‌های اصلی نوع غذا (بالای صفحه) ----------
export const typeTabs = [
  { id: 'main', label: 'غذای اصلی' },
  { id: 'appetizer', label: 'پیش غذا' },
  { id: 'dessert', label: 'دسر' },
  { id: 'drink', label: 'نوشیدنی' },
];

// ---------- آیتم‌های منو به تفکیک هر تب و هر دسته‌بندی ----------
// هر آیتم شامل: عنوان، توضیح، قیمت/قیمت قبل از تخفیف (رشته فارسی مطابق بقیه پروژه)،
// درصد تخفیف، امتیاز، تعداد نظرات، تصویر، شناسه دسته و برچسب فارسی همان دسته برای سربرگ بخش.
export const menuItemsData = {
  main: [
    // ================= غذاهای ایرانی =================
       {
      id: 'm-koofte-berenji',
      title: 'کوفته برنجی',
      description: 'برنج سبزی کوفته لپه آرد نخودچی، گردو و زرشک و آلو پیاز',
      discountPercent: 35,
      oldPrice: '۱۸۰,۰۰۰',
      price: '۱۴۵,۰۰۰',
      rating: 4,
      ratingCount: 27,
      image: koofteh1 ,
      images:[koofteh1,koofteh2,koofteh3,koofteh4,koofteh5,koofteh6],
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: false,
    },
        {
      id: 'm-kashke-bademjan',
      title: 'کشک بادمجان',
      description: 'بادمجان، کشک، نعناع خشک، مغز گردو، سیر، پیاز',
      // discountPercent: 0,
      // oldPrice: '',
      price: '۹۵,۰۰۰',
      rating: 5,
      ratingCount: 27,
      image: kashk1 ,
      images:[kashk1,kashk2,kashk3,kashk4,kashk5],
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: true,
    },
        {
      id: 'm-mirza-qasemi',
      title: 'میرزا قاسمی',
      description: 'بادمجان، گوجه فرنگی، تخم مرغ، سیر، رب گوجه فرنگی',
      discountPercent: 10,
      oldPrice: '۱۶۵,۰۰۰',
      price: '۱۴۲,۵۰۰',
      rating: 5,
      ratingCount: 27,
      image: mirza1 ,
      images:[mirza1,mirza2,mirza3,mirza4,mirza5],
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: true,
    },
        {
      id: 'm-baqlagatoq',
      title: 'باقلاقاتوق',
      description: 'پاچ باقلا، شوید خشک، کره، سیر، تخم مرغ',
      discountPercent: 30,
      oldPrice: '',
      price: '۱۹۵,۰۰۰',
      rating: 4,
      ratingCount: 27,
      image:baqla1 ,
      images:[baqla1,baqla2,baqla3,baqla4,baqla5],
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: false,
    },
        {
      id: 'm-felafel',
      title: 'فلافل',
      description: 'نخود، پیاز، تخم گشنیز، سیر، جعفری، سیب زمینی',
      // discountPercent: 0,
      // oldPrice: '',
      price: '۸۰٬۰۰۰ ',
      rating: 3,
      ratingCount: 27,
      image:felafel ,
      images:[felafel,felafel2,felafel3,felafel4,felafel5],
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: false,
    },
          {
      id: 'm-kalejoosh',
      title: 'کله جوش',
      description: 'کشک، گردو، پیاز، نعناع خشک',
      discountPercent: 5,
      oldPrice: '۲۱۰٬۰۰۰',
      price: '۲۰۳٬۰۰۰ ',
      rating: 4,
      ratingCount: 27,
      image:kalejoosh ,
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: false,
    },
        {
      id: 'm-eggplant-borani',
      title: 'بورانی بادمجان',
      description: 'بادمجان کبابی، ماست چکیده، سیر، روغن نعنا و مغز گردو',
      discountPercent: 22,
      oldPrice: '۱۷۰٬۰۰۰',
      price: '۱۴۸٬۰۰۰ ',
      rating: 5,
      ratingCount: 45,
      image: borani,
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: true,
    },
    {
      id: 'm-stuffed-eggplant',
      title: 'بادمجان شکم‌پر',
      description: 'بادمجان، پیاز، گوجه فرنگی	، سبزی خشک',
      discountPercent: 18,
      oldPrice: '۱۵۰٬۰۰۰',
      price: '۱۳۶,۰۰۰',
      rating: 4,
      ratingCount: 27,
      image: bademjan,
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: false,
    },
    {
      id: 'm-stuffed-cabbage',
      title: 'دلمه برگ کلم',
      description: 'کلم برگ، برنج، لپه پخته، پیاز، سبزی معطر رب',
      discountPercent: 8,
      oldPrice: '۲۲۰٬۰۰۰',
      price: '۲۰۹٬۰۰۰ ',
      rating: 5,
      ratingCount: 52,
      image: dolmeh,
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: true,
    },
    {
      id: 'm-dolme-moo',
      title: 'دلمه برگ مو',
      description: 'پیاز، برنج، لپه، سبزی دلمه، سرکه',
      // discountPercent: 0,
      // oldPrice: '',
      price: '۱۹۵,۰۰۰',
      rating: 2,
      ratingCount: 27,
      image:dolmem ,
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: false,
    },
        {
      id: 'm-koko-sabzi',
      title: 'کوکو سبزی',
      description: 'تخم مرغ، گردو، سیر، آرد، روغن مایع سبزی کوکویی',
      discountPercent: 10,
      oldPrice: '۳۰۰٬۰۰۰',
      price: '۲۷۰٬۰۰۰ ',
      rating: 5,
      ratingCount: 27,
      image:kokosabzi ,
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: true,
    },
        {
      id: 'm-koko-adas',
      title: 'کوکو سیب زمینی و عدس',
      description: 'عدس، سیب زمینی، پیاز متوسط، تخم مرغ، پودر سیر، آرد سوخاری',
      discountPercent: 20,
      oldPrice: '۱۳۵٬۰۰۰',
      price: '۱۰۵٬۰۰۰ ',
      rating: 1,
      ratingCount: 27,
      image:kokoadas ,
      category: 'iranian',
      categoryLabel: 'غذاهای ایرانی',
      isBestseller: false,
    },

    // ================= غذاهای غیر ایرانی =================
        {
      id: 'm-ratatouille',
      title: 'پاستا سبزیجات',
      description: 'پاستا، قارچ، گوجه، کدوی خوردشده، پیاز خلالی‌شده',
      discountPercent: 20,
      oldPrice: '۱۷۵٬۰۰۰',
      price: '۱۴۰٬۰۰۰',
      rating: 5,
      ratingCount: 27,
      image: pastasabzi1,
      images: [pastasabzi1, pastasabzi2, pastasabzi3, pastasabzi4 ,pastasabzi5 , pastasabzi6],
      category: 'non-iranian',
      categoryLabel: 'غذاهای غیر ایرانی',
      isBestseller: true,
    },
        {
      id: 'm-ratatouie',
      title: 'پاستا بلونز',
      description: 'اسپاگتی، گوشت چرخ کرده، هویج، ساقه کرفس، گوجه فرنگی، سیر، پیاز، پنیر پارمزان، روغن زیتون',
      discountPercent: 12,
      oldPrice: '۱۷۰٬۰۰۰',
      price: '۱۶۰٬۰۰۰ ',
      rating: 4,
      ratingCount: 27,
      image: pastablonz,
      category: 'non-iranian',
      categoryLabel: 'غذاهای غیر ایرانی',
      isBestseller: false,
    },
    {
      id: 'm-ratatouille',
      title: 'راتاتویی',
      description: 'بادمجان، کدو سبز، فلفل دلمه‌ای، پیاز، رب گوجه فرنگی و ادویه‌جات فرانسوی',
      discountPercent: 45,
      oldPrice: '۱۸۰٬۰۰۰',
      price: '۹۵,۰۰۰',
      rating: 4,
      ratingCount: 27,
      image: ratatoei,
      category: 'non-iranian',
      categoryLabel: 'غذاهای غیر ایرانی',
      isBestseller: false,
    },
      {
      id: 'm-lasagna',
      title: 'لازانیا',
      description: 'لازانیا، قارچ، ریحان تازه، جعفری تازه، گوجه فرنگی و پنیر پیتزا بادمجان',
      // discountPercent: 25,
      // oldPrice: '۲۰۰,۰۰۰',
      price: '۱۵۰,۰۰۰',
      rating: 5,
      ratingCount: 38,
      image: lazania,
      category: 'non-iranian',
      categoryLabel: 'غذاهای غیر ایرانی',
      isBestseller: true,
    },
    {
      id: 'm-sushi',
      title: 'سوشی',
      description: 'جلبک دریایی/ نوری، برنج کته، سرکه سفید (یا سرکه برنج)، شکر، نمک دریا',
      discountPercent: 15,
      oldPrice: '۱۰۰,۰۰۰',
      price: '۸۵,۰۰۰',
      rating: 4,
      ratingCount: 21,
      image: sushi,
      category: 'non-iranian',
      categoryLabel: 'غذاهای غیر ایرانی',
      isBestseller: false,
    },
    {
      id: 'm-veggie-pakora',
      title: 'پاکورا سبزیجات',
      description: 'گرام ماسالا، پودر کاری، سیر له شده، ،گشنیز خرد شده',
      discountPercent: 8,
      oldPrice: '۱۲۵٬۰۰۰',
      price: '۱۱۰,۰۰۰',
      rating: 4,
      ratingCount: 28,
      image: pakura,
      category: 'non-iranian',
      categoryLabel: 'غذاهای غیر ایرانی',
      isBestseller: false,
    },
    {
      id: 'm-kalzoneh',
      title: 'کالزونه اسفناج',
      description: 'اسفناج، قارچ، پنیر موزارلا یا پنیر پیتزا، پنیر ریکوتا یا پنیر خامه ای، پیاز، سیر، روغن زیتون',
      discountPercent: 17,
      oldPrice: '۱۹۰٬۰۰۰',
      price: '۱۷۷٬۰۰۰ ',
      rating: 5,
      ratingCount: 21,
      image: kalzoneh,
      category: 'non-iranian',
      categoryLabel: 'غذاهای غیر ایرانی',
      isBestseller: true,
    },
    {
      id: 'm-palak-panir',
      title: 'پالاک پنیر',
      description: 'پنیر، اسفناج، گوجه، پیاز، سیر ',
      discountPercent: 15,
      oldPrice: '۲۰۰٬۰۰۰',
      price: '۱۸۰٬۰۰۰ ',
      rating: 4,
      ratingCount: 10,
      image: palak,
      category: 'non-iranian',
      categoryLabel: 'غذاهای غیر ایرانی',
      isBestseller: false,
    },

    // ================= پیتزاها =================
    {
      id: 'm-pizza-rokola',
      title: 'پیتزا روکولا',
      description: 'اسفناج، سبزی روکولا، آرد، پودر مایه خمیر، روغن زیتون، خردل، سیر، پنیر موزارلا و پارمسان، گوجه گیلاسی ،سس فلفل سبز تند ',
      discountPercent: 12,
      oldPrice: '۱۹۵٬۰۰۰',
      price: '۱۸۸٬۰۰۰ ',
      rating: 5,
      ratingCount: 23,
      image: rokola,
      category: 'pizza',
      categoryLabel: 'پیتزاها',
      isBestseller: true,
    },
    {
      id: 'm-pizza-bademjan-zeytoon',
      title: 'پیتزا بادمجان و زیتون',
      description: 'بادمجان کوچک، روغن زیتون، پنیر موزارلا، پنیر پارمزان، برگ ریحان، گوجه فرنگی، سس گوجه فرنگی',
      // discountPercent: 17,
      // oldPrice: '۲۱۳,۰۰۰',
      price: '۱۵۰٬۰۰۰ ',
      rating: 4,
      ratingCount: 34,
      image: zeytoon,
      category: 'pizza',
      categoryLabel: 'پیتزاها',
      isBestseller: false,
    },
        {
      id: 'm-pizza-khameh',
      title: 'پیتزا سبزیجات و خامه',
      description: 'نخود فرنگی پخته شده، ذرت نیم پز، فلفل دلمه‌ای رنگی، قارچ، سیر یا پیازچه خردشده',
      discountPercent: 21,
      oldPrice: '۲۱۰٬۰۰۰',
      price: '۱۸۵٬۰۰۰ ',
      rating: 4,
      ratingCount: 34,
      image: khameh,
      category: 'pizza',
      categoryLabel: 'پیتزاها',
      isBestseller: false,
    },
        {
      id: 'm-pizza-qarch',
      title: 'پیتزا قارچ',
      description: 'قارچ، فلفل دلمه ای، رب گوجه فرنگی، پودر سیر، آویشن، مرزه، پنیر پیتزا گیاهی',
      discountPercent: 25,
      oldPrice: '۲۱۵٬۰۰۰',
      price: '۱۷۵٬۰۰۰',
      rating: 3,
      ratingCount: 34,
      image: qarch,
      category: 'pizza',
      categoryLabel: 'پیتزاها',
      isBestseller: false,
    },
        {
      id: 'm-pizza-pepperoni',
      title: 'پیتزا پپرونی',
      description: 'ژامبون قرمز خشک‌شده، خردل، دانه رازیانه، پاپریکا دودی، پودر سیر و پنیر پیتزا',
      // discountPercent: 0,
      // oldPrice: '',
      price: '۱۰۰,۰۰۰',
      rating: 4,
      ratingCount: 19,
      image: peperoni,
      category: 'pizza',
      categoryLabel: 'پیتزاها',
      isBestseller: false,
    },
        {
      id: 'm-pizza-esfenaj',
      title: 'پیتزا اسفناج',
      description: 'اسفناج تازه، پیاز، سیر، پنیر پیتزا، قارچ',
      discountPercent: 10,
      oldPrice: '۲۸۰٬۰۰۰',
      price: '۲۵۲٬۰۰۰',
      rating: 5,
      ratingCount: 34,
      image: esfenaj,
      category: 'pizza',
      categoryLabel: 'پیتزاها',
      isBestseller: true,
    },
        {
      id: 'm-pizza-margarita',
      title: 'پیتزا مارگاریتا',
      description: 'گوجه فرنگی، ریحان، سیر، پنیر پیتزا',
      discountPercent: 13,
      oldPrice: '۱۶۵٬۰۰۰',
      price: '۱۴۷٬۰۰۰',
      rating: 2,
      ratingCount: 34,
      image: margarita,
      category: 'pizza',
      categoryLabel: 'پیتزاها',
      isBestseller: false,
    },
        {
      id: 'm-pizza-panir',
      title: 'پیتزا پنیر',
      description: 'نان پیتزا، پنیر پیتزا، سس باربیکیو، گوجه فرنگی، سس کچاپ، سیر، روغن زیتون',
      discountPercent: 16,
      oldPrice: '۱۲۵٬۰۰۰',
      price: '۱۰۵٬۰۰۰ ',
      rating: 3,
      ratingCount: 34,
      image: panir,
      category: 'pizza',
      categoryLabel: 'پیتزاها',
      isBestseller: false,
    },

    // ================= ساندویچ‌ها =================
    {
      id: 'm-kotlet',
      title: 'ساندویچ کتلت مخصوص',
      description: 'سیب زمینی، لوبیا قرمز،  بلغور گندم، نعناع خشک، پودر زیره، پودر جوز هندی، گوجه فرنگی، روغن زیتون',
      discountPercent: 18,
      oldPrice: '۲۳۰٬۰۰۰',
      price: '۲۰۵٬۰۰۰',
      rating: 5,
      ratingCount: 19,
      image: kotlet,
      category: 'sandwich',
      categoryLabel: 'ساندویچ‌ها',
      isBestseller: true,
    },
    {
      id: 'm-koktel',
      title: 'ساندویچ سوسیس کوکتل',
      description: 'سوسیس گیاهی، پیاز، سیب زمینی،  رب گوجه فرنگی',
      discountPercent: 35,
      oldPrice: '۲۰۵٬۰۰۰',
      price: '۱۶۵٬۰۰۰',
      rating: 4,
      ratingCount: 19,
      image: koktel,
      category: 'sandwich',
      categoryLabel: 'ساندویچ‌ها',
      isBestseller: false,
    },
    {
      id: 'm-kotlet-kadoosabz',
      title: 'ساندویچ کتلت کدو سبز',
      description: 'کدو سبز، هویج، سیب زمینی، پیاز',
      // discountPercent: 35,
      // oldPrice: '۲۰۵٬۰۰۰',
      price: '۱۴۵٬۰۰۰',
      rating: 5,
      ratingCount: 19,
      image: kadoo,
      category: 'sandwich',
      categoryLabel: 'ساندویچ‌ها',
      isBestseller: true,
    },
        {
      id: 'm-panini-spinach',
      title: 'پنینی اسفناج',
      description: 'نان پنینی، اسفناج تازه، پیاز، پنیر پیتزا و سس مخصوص کره‌ای',
      discountPercent: 15,
      oldPrice: '۲۲۳,۰۰۰',
      price: '۱۹۰,۰۰۰',
      rating: 3,
      ratingCount: 21,
      image: penini,
      category: 'sandwich',
      categoryLabel: 'ساندویچ‌ها',
      isBestseller: false,
    },
  ],

  // ================= پیش غذا =================
  appetizer: [
    {
      id: 'a-salad-shirazi',
      title: 'سالاد شیرازی',
      description: 'خیار، گوجه فرنگی، پیاز خرد‌شده، آبغوره و نعنا',
      discountPercent: 0,
      oldPrice: '',
      price: '۵۸,۰۰۰',
      rating: 4,
      ratingCount: 14,
      image: salad,
      category: 'general',
      categoryLabel: 'پیش غذاها',
      isBestseller: false,
    },
    {
      id: 'a-mast-khiar',
      title: 'ماست و خیار',
      description: 'ماست چکیده، خیار، نعنا خشک و مغز گردو',
      discountPercent: 10,
      oldPrice: '۶۵,۰۰۰',
      price: '۵۸,۵۰۰',
      rating: 5,
      ratingCount: 22,
      image: mast,
      category: 'general',
      categoryLabel: 'پیش غذاها',
      isBestseller: true,
    },
  ],

  // ================= دسر =================
  dessert: [
    {
      id: 'd-panna-cotta',
      title: 'پاناکوتا توت‌فرنگی',
      description: 'کرم شیر و خامه با ژله توت‌فرنگی تازه',
      discountPercent: 0,
      oldPrice: '',
      price: '۹۵,۰۰۰',
      rating: 5,
      ratingCount: 18,
      image: panakota,
      category: 'general',
      categoryLabel: 'دسرها',
      isBestseller: true,
    },
    {
      id: 'd-bastani-sonati',
      title: 'بستنی سنتی زعفرانی',
      description: 'بستنی زعفرانی با تکه‌های خامه و پسته خلالی',
      discountPercent: 20,
      oldPrice: '۲۲۹,۰۰۰',
      price: '۱۷۹,۰۰۰',
      rating: 4,
      ratingCount: 30,
      image: bastani,
      category: 'general',
      categoryLabel: 'دسرها',
      isBestseller: false,
    },
  ],

  // ================= نوشیدنی =================
  drink: [
    {
      id: 'dr-doogh',
      title: 'دوغ خوشگوار',
      description: 'ماست، آب، نعنا خشک و نمک، خنک و گازدار',
      discountPercent: 8,
      oldPrice: '۴۰,۰۰۰',
      price: '۳۵,۰۰۰',
      rating: 4,
      ratingCount: 11,
      image: doogh,
      category: 'general',
      categoryLabel: 'نوشیدنی‌ها',
      isBestseller: false,
    },
    {
      id: 'dr-ab-havij',
      title: 'آب هویج بستنی (400 میلی لیتر)',
      description: 'آب‌هویج تازه با یک اسکوپ بستنی وانیلی',
      discountPercent: 8,
      oldPrice: '۶۰,۰۰۰',
      price: '۵۵,۰۰۰',
      rating: 5,
      ratingCount: 26,
      image: havij,
      category: 'general',
      categoryLabel: 'نوشیدنی‌ها',
      isBestseller: true,
    },
  ],
};
