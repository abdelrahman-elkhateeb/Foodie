// Western digits in Arabic too ("185 ج.م.‏"), so prices match order numbers,
// phone numbers and what Egyptian delivery apps show.
function locale(language: string) {
  return language === "ar" ? "ar-EG-u-nu-latn" : "en-EG";
}

export function formatPrice(amount: number, language: string) {
  return new Intl.NumberFormat(locale(language), {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string, language: string) {
  return new Intl.DateTimeFormat(locale(language), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
