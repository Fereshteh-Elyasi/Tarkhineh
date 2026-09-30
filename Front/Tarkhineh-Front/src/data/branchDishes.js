import dolmeh from "../assets/Images/dolmeh.jpg";
import bademjan from "../assets/Images/bademjan.jpg";
import kalzoneh from "../assets/Images/kalzoneh.jpg";
import qarch from "../assets/Images/qarch.jpg";
import kalsiom from "../assets/Images/kalsiom.jpg";
import fileh from "../assets/Images/fileh.jpg";
import alfredo from "../assets/Images/alfredo.jpeg";
import penini from "../assets/Images/penini.jpg";
import peperoni from "../assets/Images/peperoni.jpg";
import ratatoei from "../assets/Images/ratatoei.jpg";
import borani from "../assets/Images/borani.jpg";
import mega from "../assets/Images/mega.jpg";
import vegan from "../assets/Images/vegan.jpg";
import sushi from "../assets/Images/sushi.jpg";
import pakura from "../assets/Images/pakura.jpg";
import lazania from "../assets/Images/lazania.jpg";
import ravioli from "../assets/Images/ravioli.jpg";

// TODO: نمونه (mock). بعداً این سه لیست باید بر اساس شعبه انتخاب‌شده از بک‌اند گرفته شوند.
export const branchFeaturedDishes = [
  { id: "b-stuffed-cabbage", name: "دلمه برگ کلم", discountPercent: 25, price: "۲۰۹,۰۰۰", rating: 5, ratingCount: 52, image: dolmeh },
  { id: "b-stuffed-eggplant", name: "بادمجان شکم‌پر", discountPercent: 17, price: "۱۳۶,۰۰۰", rating: 4, ratingCount: 27, image: bademjan },
  { id: "b-spinach-calzone", name: "کالزونه اسفناج", discountPercent: 17, price: "۱۷۷,۰۰۰", rating: 5, ratingCount: 34, image: kalzoneh },
  { id: "b-pizza-mushroom", name: "پیتزا قارچ", discountPercent: 25, price: "۱۷۵,۰۰۰", rating: 3, ratingCount: 23, image: qarch },
  { id: "b-calcium-plate", name: "بشقاب گیاهی کلسیم", discountPercent: 27, price: "۱۷۵,۰۰۰", rating: 5, ratingCount: 27, image: kalsiom },
  { id: "b-pro-fileh", name: "پرو فیله(رژیمی)", discountPercent: 20, price: "۷۰۹,۰۰۰", rating: 3.5, ratingCount: 20, image: fileh },
  { id: "b-pasta-alfredo", name: "پاستا آلفردو", discountPercent: 15, price: "۹۹۵,۰۰۰", rating: 4.5, ratingCount: 10, image: alfredo },
];

export const branchPopularDishes = [
  { id: "b-panini-spinach", name: "پنینی اسفناج", discountPercent: 15, price: "۱۹۰,۰۰۰", rating: 3, ratingCount: 21, image: penini },
  { id: "b-pizza-pepperoni", name: "پیتزا پپرونی", discountPercent: 0, price: "۱۰۰,۰۰۰", rating: 4, ratingCount: 19, image: peperoni },
  { id: "b-ratatouille-1", name: "راتاتویی", discountPercent: 26, price: "۹۵,۰۰۰", rating: 4, ratingCount: 27, image: ratatoei },
  { id: "b-eggplant-borani", name: "بورانی بادمجان", discountPercent: 25, price: "۱۴۸,۰۰۰", rating: 5, ratingCount: 45, image: borani },
  { id: "b-mega-burger", name: "مگا استودیو برگر", discountPercent: 0, price: "۹۵۰,۰۰۰", rating: 4.7, ratingCount: 19, image: mega },
  { id: "b-vegan-dish", name: "دیش گیاهی", discountPercent: 0, price: "۱۳۷,۰۰۰", rating: 4.7, ratingCount: 19, image: vegan },
];

export const branchNonIranianDishes = [
  { id: "b-sushi", name: "سوشی", discountPercent: 15, price: "۸۵,۰۰۰", rating: 4, ratingCount: 21, image: sushi },
  { id: "b-ratatouille-2", name: "راتاتویی", discountPercent: 25, price: "۹۵,۰۰۰", rating: 4, ratingCount: 21, image: ratatoei },
  { id: "b-veggie-pakora", name: "پاکورا سبزیجات", discountPercent: 0, price: "۱۱۰,۰۰۰", rating: 4, ratingCount: 28, image: pakura },
  { id: "b-lasagna", name: "لازانیا", discountPercent: 25, price: "۱۵۰,۰۰۰", rating: 5, ratingCount: 38, image: lazania },
  { id: "b-ravioli", name: "راویولی ایتالیایی", discountPercent: 25, price: "۹۵,۰۰۰", rating: 4, ratingCount: 21, image: ravioli },
];
