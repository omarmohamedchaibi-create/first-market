import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ملفات الترجمة
const resources = {
  "ar": {
    "translation": {
      "welcome": "متجري",
      "addToCart": "🛒 أضف إلى السلة",
      "checkout": "✅  إتمام الشراء",
      "home":"🏠  الرئيسية     |",
      "cart":"🛒 السلة",
      "search":"🔍 ابحث عن منتج...",
      "catg":"كل الفئات",
      "prmax":"السعر الأقصى",
      "prmin":"السعر الأدنى",
      "cart":"السلة",
      "pro":"منتج",
      "ttl":"المجموع",
      "da":"دج",
      "eb":"إفراغ السلة",
      "your products..":":منتجاتك",
      "laptop":"حاسوب محمول",
      "delete": "حذف ❌",
      "electronics": "الكترونيات",
      "accessories": "ملحقات",
      "furniture": "أثاث",
      "general": "عامة",
      "cartEmpty": "السلة فارغة.",
      "backToProducts": "⬅ الرجوع إلى المنتجات",
      "productNotFound": "❌ المنتج غير موجود",
      "loadingProduct": "⏳ جاري تحميل المنتج...",
      "deleteConfirm": "هل أنت متأكد من حذف هذا المنتج؟",
      "deleteFail": "حدث خطأ أثناء الحذف",
      "productAdded": "✅ تم إضافة {{name}} إلى السلة",
      "alreadyInCart": "⚠️ المنتج موجود بالفعل في السلة",
      "clearCart": "🗑️ إفراغ السلة",
      "successOrder": "✅ تم تنفيذ الطلب بنجاح! شكراً لثقتك بنا.",
      "emptyOrder": "🛑 لا يمكنك إتمام الشراء وسلتك فارغة!",
      "cartContent": "🛒 محتوى السلة",
      "No Results ❌":"❌ لا توجد نتائج",
    },
  },
  "en": {
    "translation": {
      "welcome": "My Store",
      "addToCart": "Add to Cart 🛒",
      "checkout": "Checkout ✅ ",
      "home":"🏠 HOME   |",
      "cart":"Cart 🛒",
      "search":" Search for a product... 🔍",
      "catg":"All Categories",
      "prmax":"Max Price",
      "prmin":"Min Price",
      "cart":"Cart",
      "pro":"product",
      "ttl":"The Total",
      "da":"DA",
      "eb":"Empty the basket",
      "your products..":"your products:",
      "laptop":"Laptop",
      "delete": "DELETE ❌",
      "electronics": "Electronics",
      "accessories": "Accessories",
      "furniture": "Furniture",
      "general": "General",
      "cartEmpty": "Cart is empty.",
      "backToProducts": "⬅ Back to products",
      "productNotFound": "❌ Product not found",
      "loadingProduct": "⏳ Loading product...",
      "deleteConfirm": "Are you sure you want to delete this product?",
      "deleteFail": "An error occurred while deleting",
      "productAdded": "✅ {{name}} added to cart",
      "alreadyInCart": "⚠️ Product is already in the cart",
      "clearCart": "🗑️ Empty the basket",
      "successOrder": "✅ Order placed successfully! Thank you for your trust.",
      "emptyOrder": "🛑 You can't checkout with an empty cart!",
      "cartContent": "Cart Content 🛒",
      "No Results ❌":"No Results ❌",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
