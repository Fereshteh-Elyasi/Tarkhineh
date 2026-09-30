import vanak from "../assets/Images/vanak.png";
import aqdasie from "../assets/Images/aqdasie.jpg";
import chaloos from "../assets/Images/chaloos.jpg";
import chaloos1 from "../assets/Images/chaloos1.jpg";
import Branch1 from "../assets/Images/Branch1.jpg";
import Branch2  from "../assets/Images/Branch2.jpg";
import Branch3  from "../assets/Images/Branch3.jpg";
import Branch4  from "../assets/Images/Branch4.jpg";
import Branch5  from "../assets/Images/Branch5.jpg";

// TODO: این داده فعلاً نمونه (mock) است. هروقت بک‌اند آماده شد، کافیست
// داخل src/api/branchesApi.js به‌جای خواندن از این فایل، از fetch به آدرس واقعی استفاده شود.
export const branches = [
  {
    slug: "ekbatan",
    name: "شعبه اکباتان",
   address: "اکباتان، خیابان ریاحی، کوچه سیزدهم، ساختمان آیسا، طبقه همکف",
   BRANCH_PHONE1: "شماره تماس ۱: ۵۴۸۹۱۲۵۴-۰۲۱",
   BRANCH_PHONE2: "شماره تماس ۲: ۵۴۸۹۱۲۵۵-۰۲۱",
  BRANCH_WORKING_HOURS: "ساعت کاری: همه‌روزه از ساعت ۱۲ تا ۲۳ بجز روزهای تعطیل",
    image: chaloos,
    images:[chaloos,Branch4,Branch1,Branch3,Branch5],
    lat: 35.7219,
    lng: 51.2775,
  },
  {
    slug: "chaloos",
    name: "شعبه چالوس",
    address: "چالوس، خیابان امام، بعد از میدان شهرداری، جنب داروخانه دکتر اکبری",
    image: chaloos1,
     images:[chaloos,Branch2,Branch3,Branch4,Branch5],
    lat: 36.6560,
    lng: 51.4206,
  },
  {
    slug: "aqdasie",
    name: "شعبه اقدسیه",
    address: "اقدسیه، خیابان شبستری، بعد از کوچه خرمشهر، پلاک ۸",
    image: aqdasie,
     images:[aqdasie,Branch1,Branch3,Branch4,Branch5],
    lat: 35.8100,
    lng: 51.4800,
  },
  {
    slug: "vanak",
    name: "شعبه ونک",
    address: "میدان ونک، خیابان ولیعصر، نبش کوچه نشاط، پلاک ۲۴",
    image: vanak,
     images:[vanak,Branch3,Branch2,Branch4,Branch5],
    lat: 35.7563,
    lng: 51.4113,
  },
];

export const BRANCH_WORKING_HOURS = "همه‌روزه از ساعت ۱۲ الی ۲۳";
export const BRANCH_PHONE1 = "۰۲۱-۳۳۵۳۴۳۵۴";
export const BRANCH_PHONE2 = "۰۲۱-۳۳۵۳۴۳۵۶";
