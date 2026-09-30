import afterImg from "../assets/Images/after.png";
import beforeImg from "../assets/Images/before.png";
import desertImg from "../assets/Images/desert.png";

// TODO: نمونه (mock). بعداً باید بر اساس درخواست کاربر از بک‌اند جستجو شود.
export const searchableItems = [
  { id: "pasta-diet", name: "پاستا رژیمی", discountPercent: 10, oldPrice: "۱۸۹,۰۰۰", price: "۱۶۸,۰۰۰", rating: 3, ratingCount: 40, image: afterImg },
  { id: "pasta-veggie", name: "پاستا سبزیجات", discountPercent: 15, oldPrice: "۱۹۵,۰۰۰", price: "۱۶۵,۰۰۰", rating: 5, ratingCount: 59, image: beforeImg },
  { id: "pasta-vegan", name: "پاستا گیاهی", discountPercent: 14, oldPrice: "۱۴۵,۰۰۰", price: "۱۲۸,۰۰۰", rating: 4, ratingCount: 31, image: desertImg },
];
