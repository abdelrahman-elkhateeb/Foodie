import type en from "./en";

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

// Typed against the English file so a missing key fails the build.
// Arabic needs extra plural forms (zero/two/few/many) on top of en's keys.
const ar: DeepStringRecord<typeof en> & {
  cart: Record<string, string>;
  admin: { stats: Record<string, string> };
} = {
  brand: "فودي",

  nav: {
    home: "الرئيسية",
    menu: "القائمة",
    trackOrder: "تتبع الطلب",
    cart: "السلة",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    openMenu: "فتح القائمة",
    switchLanguage: "English",
    toggleTheme: "تبديل المظهر",
  },

  common: {
    loading: "جارٍ التحميل...",
    error: "حدث خطأ ما.",
    errorHint: "تأكد من اتصالك بالإنترنت وحاول مرة أخرى.",
    crashHint: "واجهت الصفحة مشكلة غير متوقعة. إعادة التحميل تحلها غالبًا.",
    retry: "حاول مرة أخرى",
    reload: "إعادة التحميل",
    unavailable: "غير متاح",
    cancel: "إلغاء",
    all: "الكل",
  },

  payment: {
    cash: "كاش",
    online: "أونلاين",
  },

  categories: {
    breakfast: "فطار",
    sandwiches: "سندوتشات",
    grills: "مشويات",
    mains: "أطباق رئيسية",
    sides: "مقبلات",
    desserts: "حلويات",
    drinks: "مشروبات",
  },

  home: {
    hero: {
      badge: "ساخن وطازج حتى باب بيتك",
      title: "وجباتك المفضلة،",
      highlight: "بضغطة واحدة",
      subtitle:
        "تصفح القائمة، اطلب في ثوانٍ، وتابع طلبك من مطبخنا حتى باب بيتك لحظة بلحظة.",
      orderNow: "اطلب الآن",
      track: "تتبع طلبًا",
    },
    featured: {
      title: "الأكثر طلبًا الآن",
      subtitle: "اختيارات مميزة يعود لها عملاؤنا دائمًا.",
      viewAll: "عرض القائمة كاملة",
    },
    how: {
      title: "كيف يعمل",
      subtitle: "من الجوع إلى باب بيتك في ثلاث خطوات بسيطة.",
      browse: {
        title: "اختر وجبتك",
        description: "تصفح القائمة حسب الفئة أو ابحث عن طبق.",
      },
      order: {
        title: "أكّد طلبك",
        description: "أضف عنوانك وادفع كاش عند الاستلام.",
      },
      track: {
        title: "تابعه مباشرة",
        description: "تابع كل خطوة من المطبخ حتى باب بيتك.",
      },
    },
    why: {
      title: "لماذا فودي؟",
      fresh: {
        title: "طازج دائمًا",
        description: "كل طلب يُحضّر لحظة تأكيده.",
      },
      live: {
        title: "تتبع مباشر",
        description: "تظهر التحديثات فورًا دون الحاجة لتحديث الصفحة.",
      },
      payment: {
        title: "ادفع بطريقتك",
        description: "الدفع كاش عند الاستلام، والدفع أونلاين قريبًا.",
      },
      language: {
        title: "عربي وإنجليزي",
        description: "التجربة كاملة بلغتك، مع دعم الكتابة من اليمين لليسار.",
      },
    },
    cta: {
      title: "جعان؟",
      subtitle: "وجبتك القادمة على بعد ضغطات قليلة.",
      button: "تصفح القائمة",
    },
  },

  footer: {
    tagline: "مشروع تجريبي متكامل لطلب الطعام مبني بـ React و Supabase.",
    explore: "استكشف",
    demoNote:
      "هذا مشروع تجريبي. الطلبات ليست حقيقية.",
    rights: "جميع الحقوق محفوظة.",
  },

  menu: {
    title: "قائمتنا",
    subtitle: "تُحضّر طازجة وتصلك ساخنة.",
    search: "ابحث عن طبق...",
    noResults: "لا توجد أطباق مطابقة لبحثك.",
    addToCart: "أضف إلى السلة",
    added: "تمت إضافة {{name}} إلى السلة",
  },

  cart: {
    title: "سلة الطلبات",
    view: "عرض السلة",
    empty: "السلة فارغة",
    emptyDescription: "أضف بعض الوجبات اللذيذة من القائمة.",
    browseMenu: "تصفح القائمة",
    clear: "تفريغ السلة",
    itemsCount_zero: "لا توجد منتجات",
    itemsCount_one: "منتج واحد",
    itemsCount_two: "منتجان",
    itemsCount_few: "{{count}} منتجات",
    itemsCount_many: "{{count}} منتجًا",
    itemsCount_other: "{{count}} منتج",
    items: "العدد",
    subtotal: "المجموع الفرعي",
    total: "الإجمالي",
    orderSummary: "ملخص الطلب",
    checkout: "إتمام الطلب",
    loginToCheckout: "سجّل الدخول لإتمام الطلب",
    unavailableNotice: "بعض المنتجات لم تعد متاحة ولن تُضاف إلى طلبك.",
    remove: "حذف",
    increase: "زيادة الكمية",
    decrease: "تقليل الكمية",
  },

  checkout: {
    title: "إتمام الطلب",
    deliveryDetails: "بيانات التوصيل",
    fullName: "الاسم بالكامل",
    fullNamePlaceholder: "أحمد محمد",
    fullNameRequired: "من فضلك أدخل اسمك",
    phoneNumber: "رقم الهاتف",
    phonePlaceholder: "01012345678",
    phoneRequired: "من فضلك أدخل رقم هاتفك",
    phoneInvalid: "أدخل رقم موبايل مصري صحيح (مثال: 01012345678)",
    address: "العنوان",
    addressPlaceholder: "الشارع، العمارة، الشقة، المدينة",
    addressRequired: "من فضلك أدخل عنوانك",
    paymentMethod: "طريقة الدفع",
    onlineSoon: "قريبًا",
    orderSummary: "ملخص الطلب",
    items: "العدد",
    total: "الإجمالي",
    placeOrder: "تأكيد الطلب",
    placing: "جارٍ تأكيد الطلب...",
    backToMenu: "العودة للقائمة",
    demoNotice:
      "تطبيق تجريبي: من فضلك لا تُدخل بيانات شخصية حقيقية.",
  },

  orderConfirmed: {
    title: "تم تأكيد الطلب",
    description: "تم إرسال طلبك بنجاح.",
    orderId: "رقم الطلب",
    track: "تتبع الطلب",
    backToMenu: "العودة للقائمة",
  },

  trackOrder: {
    title: "تتبع الطلب",
    description: "أدخل رقم الطلب لمعرفة حالته الحالية.",
    orderId: "رقم الطلب",
    placeholder: "مثال: 12",
    action: "تتبع",
    loading: "جارٍ تحميل الطلب...",
    notFound: "لم يتم العثور على طلب بهذا الرقم.",
    customer: "العميل",
    order: "طلب",
    placedAt: "وقت الطلب",
    items: "المنتجات",
    total: "الإجمالي",
    live: "مباشر",
    call: "اتصل بالمطعم",
    whatsapp: "واتساب",
    whatsappMessage: "أهلاً، بسأل عن الطلب رقم #{{id}}",
  },

  orderStatus: {
    pending: "قيد الانتظار",
    preparing: "قيد التحضير",
    out_for_delivery: "خرج للتوصيل",
    delivered: "تم التسليم",
  },

  orderSteps: {
    pending: {
      title: "تم استلام الطلب",
      description: "تم استلام طلبك بنجاح.",
    },
    preparing: {
      title: "قيد التحضير",
      description: "يتم تحضير طلبك الآن.",
    },
    out_for_delivery: {
      title: "خرج للتوصيل",
      description: "طلبك في الطريق إليك.",
    },
    delivered: {
      title: "تم التسليم",
      description: "بالهناء والشفاء.",
    },
  },

  auth: {
    loginTitle: "أهلًا بعودتك",
    loginSubtitle: "سجّل الدخول إلى حسابك",
    registerTitle: "إنشاء حساب",
    registerSubtitle: "سجّل لتبدأ في طلب أشهى الوجبات",
    fullName: "الاسم بالكامل",
    fullNamePlaceholder: "أحمد محمد",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    login: "تسجيل الدخول",
    loggingIn: "جارٍ تسجيل الدخول...",
    createAccount: "إنشاء الحساب",
    creatingAccount: "جارٍ إنشاء الحساب...",
    noAccount: "ليس لديك حساب؟",
    signUp: "أنشئ حسابًا",
    haveAccount: "لديك حساب بالفعل؟",
    fullNameRequired: "الاسم مطلوب",
    emailRequired: "البريد الإلكتروني مطلوب",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordMin: "كلمة المرور يجب ألا تقل عن 6 أحرف",
    confirmRequired: "من فضلك أكّد كلمة المرور",
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    welcomeBack: "أهلًا بعودتك!",
    loginToOrder: "من فضلك سجّل الدخول أو أنشئ حسابًا لإتمام طلبك. سلتك محفوظة.",
    accountCreated: "تم إنشاء حسابك!",
    confirmEmail: "راجع بريدك لتأكيد الحساب ثم سجّل الدخول.",
  },

  notFound: {
    title: "الصفحة غير موجودة",
    description: "الصفحة التي تبحث عنها غير موجودة.",
    backHome: "العودة للرئيسية",
  },

  errors: {
    PRODUCT_PROTECTED:
      "هذا منتج تجريبي محمي. أنشئ منتجك الخاص لتعديله أو حذفه.",
  },

  admin: {
    title: "لوحة التحكم",
    subtitle: "نظرة عامة وإدارة",
    sidebarTitle: "إدارة فودي",
    sidebarSubtitle: "أدِر مطعمك",
    management: "الإدارة",
    nav: {
      dashboard: "لوحة التحكم",
      products: "المنتجات",
      orders: "الطلبات",
    },
    backToSite: "العودة للموقع",
    roleAdmin: "مسؤول",

    stats: {
      revenue: "الإيرادات",
      revenueHint: "من الطلبات المُسلّمة",
      totalOrders: "إجمالي الطلبات",
      todayHint: "{{count}} اليوم",
      avgOrder: "متوسط الطلب",
      avgOrderHint: "على كل الطلبات",
      last7Days: "الطلبات خلال آخر 7 أيام",
      active: "طلبات جارية",
      activeHint: "قيد الانتظار أو التحضير أو في الطريق",
      byStatus: "الطلبات حسب الحالة",
      topDishes: "الأطباق الأكثر طلبًا",
      sold: "تم بيع {{count}}",
      recentOrders: "أحدث الطلبات",
      viewAll: "عرض الكل",
      noData: "لا توجد طلبات بعد. اطلب من القائمة لتظهر الإحصائيات هنا.",
    },

    products: {
      title: "المنتجات",
      subtitle: "إدارة الأطباق والأسعار والتوفر.",
      tableTitle: "منتجات القائمة",
      add: "إضافة منتج",
      addDescription: "أنشئ طبقًا جديدًا في القائمة.",
      editTitle: "تعديل المنتج",
      editDescription: "حدّث بيانات المنتج.",
      product: "المنتج",
      price: "السعر",
      category: "الفئة",
      status: "الحالة",
      available: "متاح",
      unavailable: "غير متاح",
      protected: "منتج تجريبي",
      protectedHint: "المنتجات التجريبية لا يعدّلها إلا المسؤول.",
      actions: "إجراءات",
      edit: "تعديل",
      delete: "حذف",
      deleteTitle: "حذف \"{{name}}\"؟",
      deleteDescription:
        "سيتم حذفه من القائمة. إذا كان ضمن طلبات سابقة فسيتم أرشفته بدلًا من ذلك لتحتفظ الطلبات باسمه وصورته.",
      created: "تم إنشاء المنتج",
      updated: "تم تحديث المنتج",
      deleted: "تم حذف المنتج",
      archived: "تمت أرشفة المنتج. الطلبات السابقة ما زالت تعرضه.",
      empty: "لا توجد منتجات بعد.",
      form: {
        nameEn: "الاسم (إنجليزي)",
        nameAr: "الاسم (عربي)",
        descriptionEn: "الوصف (إنجليزي)",
        descriptionAr: "الوصف (عربي)",
        price: "السعر (جنيه)",
        imageUrl: "رابط الصورة",
        category: "الفئة",
        available: "متاح",
        availableHint: "السماح للعملاء بإضافة المنتج إلى السلة.",
        required: "هذا الحقل مطلوب",
        priceMin: "السعر يجب أن يكون أكبر من صفر",
        create: "إنشاء المنتج",
        creating: "جارٍ الإنشاء...",
        update: "تحديث المنتج",
        updating: "جارٍ التحديث...",
      },
    },

    orders: {
      title: "الطلبات",
      subtitle: "إدارة طلبات العملاء وحالة التوصيل. التحديثات تظهر مباشرة.",
      order: "الطلب",
      customer: "العميل",
      payment: "الدفع",
      status: "الحالة",
      total: "الإجمالي",
      empty: "لا توجد طلبات.",
      viewDetails: "عرض التفاصيل",
      changeStatus: "تغيير الحالة",
      details: "بيانات العميل والطلب.",
      items: "المنتجات",
      statusUpdated: "الطلب #{{id}} أصبح: {{status}}",
      newOrder: "طلب جديد #{{id}}",
      enableAlerts: "تشغيل التنبيهات",
    },
  },
};

export default ar;
