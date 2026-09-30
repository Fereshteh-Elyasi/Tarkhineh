const SERVICE_KEY = import.meta.env.VITE_NESHAN_SERVICE_KEY;

export async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
      {
        method: "GET",
        headers: {
          "Api-Key": SERVICE_KEY,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "خطا در دریافت آدرس");
    }

    return data.formatted_address;
  } catch (err) {
    console.error(err);

    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

// نسخه‌ی کامل‌تر reverseGeocode که علاوه بر آدرس متنی، شهر/استان/منطقه رو هم جدا برمی‌گردونه
// (برای فرم‌هایی مثل «درخواست نمایندگی» که این فیلدها رو به‌صورت جدا از هم می‌خوان).
// توجه: چون بدون کلید واقعی سرویس قابل تست نبود، بعد از اتصال کلید واقعی حتماً یک بار
// خروجی واقعی v5/reverse رو چک کن تا مطمئن بشی اسم فیلدهای city/state/... درست map شدن.
export async function reverseGeocodeDetailed(lat, lng) {
  try {
    const response = await fetch(
      `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
      {
        method: "GET",
        headers: {
          "Api-Key": SERVICE_KEY,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "خطا در دریافت آدرس");
    }

    return {
      fullAddress: data.formatted_address || "",
      city: data.city || data.municipality_zone || "",
      state: data.state || "",
      district: data.district || data.neighbourhood || "",
    };
  } catch (err) {
    console.error(err);
    return {
      fullAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      city: "",
      state: "",
      district: "",
    };
  }
}


