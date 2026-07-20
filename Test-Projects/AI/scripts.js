// scripts.js - AI ULTIMATE PRO
// ==================== مغز هوش مصنوعی ====================

class AIUltimatePro {
    constructor() {
        this.vocabulary = new Map();
        this.conversations = new Map();
        this.codeKnowledge = new Map();
        this.memory = {
            userName: null,
            userGender: null,
            userLikes: new Set(),
            userDislikes: new Set(),
            lastIntent: null,
            lastTopic: null,
            history: [],
            context: new Map()
        };
        
        this.intents = [
            'greeting', 'how_are_you', 'status_good', 'status_bad',
            'question', 'answer', 'name', 'male_name', 'female_name',
            'thanks', 'goodbye', 'code', 'emotion', 'time', 'place',
            'food', 'animal', 'color', 'number', 'connector', 'unknown'
        ];
        
        this.init();
    }

    init() {
        this.loadDefaultVocabulary();
        this.loadDefaultCodeKnowledge();
        this.loadFromStorage();
    }

    // === دیکشنری پیش‌فرض بزرگ ===
    loadDefaultVocabulary() {
        const defaults = {
            // 👋 سلام
            'سلام': 'greeting', 'درود': 'greeting', 'سلام علیکم': 'greeting',
            'هی': 'greeting', 'سلامتی': 'greeting', 'صبح بخیر': 'greeting',
            'عصر بخیر': 'greeting', 'شب بخیر': 'greeting', 'سلام بر تو': 'greeting',
            'درود بر شما': 'greeting', 'سلام و درود': 'greeting', 'احوالپرسی': 'greeting',
            'سلام کردن': 'greeting', 'تحیت': 'greeting', 'خوش آمد': 'greeting',
            
            // ❓ احوال
            'چطوری': 'how_are_you', 'خوبی': 'how_are_you', 'حالت چطوره': 'how_are_you',
            'چیکار میکنی': 'how_are_you', 'حالت خوبه': 'how_are_you', 'چه خبر': 'how_are_you',
            'چی شد': 'how_are_you', 'حال شما': 'how_are_you', 'احوالت': 'how_are_you',
            'چطورید': 'how_are_you', 'چه طورید': 'how_are_you', 'خوب هستی': 'how_are_you',
            'حالت': 'how_are_you', 'احوال': 'how_are_you', 'خبر': 'how_are_you',
            
            // ✅ خوب
            'خوبم': 'status_good', 'عالی': 'status_good', 'خوب': 'status_good',
            'عالیه': 'status_good', 'بد نیستم': 'status_good', 'خوشحالم': 'status_good',
            'تمیز': 'status_good', 'عالی ام': 'status_good', 'خوب هستم': 'status_good',
            'فوق العاده': 'status_good', 'عالیه همه چی': 'status_good', 'خوش': 'status_good',
            'سرحال': 'status_good', 'سرحالم': 'status_good', 'اوکی': 'status_good',
            'ok': 'status_good', 'تمیزم': 'status_good', 'عالیه': 'status_good',
            'خوبه': 'status_good', 'عالیه': 'status_good', 'خوشحال': 'status_good',
            'راضی': 'status_good', 'راضیم': 'status_good', 'ممنون': 'status_good',
            
            // ❌ بد
            'خسته‌ام': 'status_bad', 'حالم بده': 'status_bad', 'ناراحتم': 'status_bad',
            'غمگینم': 'status_bad', 'بد': 'status_bad', 'خسته': 'status_bad',
            'افسرده': 'status_bad', 'ناراحت': 'status_bad', 'بدحالم': 'status_bad',
            'مریض': 'status_bad', 'مریضم': 'status_bad', 'بی‌حالم': 'status_bad',
            'حالم خوب نیست': 'status_bad', 'حال خوشی ندارم': 'status_bad',
            'حالم بده': 'status_bad', 'افسردگی': 'status_bad', 'غم': 'status_bad',
            'ناراحتی': 'status_bad', 'استرس': 'status_bad', 'استرس دارم': 'status_bad',
            
            // ❓ سوال
            'کی': 'question', 'چی': 'question', 'کجا': 'question', 'چرا': 'question',
            'چطور': 'question', 'چند': 'question', 'چیست': 'question', 'آیا': 'question',
            'کیست': 'question', 'کدام': 'question', 'چگونه': 'question', 'چقدر': 'question',
            'چیزی': 'question', 'چطوره': 'question', 'چیه': 'question', 'کجاست': 'question',
            'چرا اینطور': 'question', 'چطوریه': 'question', 'چی شده': 'question',
            
            // 💬 پاسخ
            'بله': 'answer', 'آره': 'answer', 'نه': 'answer', 'خیر': 'answer',
            'شاید': 'answer', 'احتمالاً': 'answer', 'دقیقاً': 'answer', 'صحیح': 'answer',
            'درسته': 'answer', 'غلط': 'answer', 'درست': 'answer', 'باشه': 'answer',
            'باش': 'answer', 'حله': 'answer', 'حل': 'answer', 'قبول': 'answer',
            'بسیار خب': 'answer', 'اوکی': 'answer', 'قبوله': 'answer',
            
            // 👨 اسم مرد
            'علی': 'male_name', 'محمد': 'male_name', 'حسن': 'male_name', 'رضا': 'male_name',
            'احمد': 'male_name', 'محمود': 'male_name', 'حسین': 'male_name', 'مجید': 'male_name',
            'فرهاد': 'male_name', 'سعید': 'male_name', 'امیر': 'male_name', 'پرهام': 'male_name',
            'کامران': 'male_name', 'بهزاد': 'male_name', 'شاهین': 'male_name', 'بهرام': 'male_name',
            'داریوش': 'male_name', 'فرزاد': 'male_name', 'حامد': 'male_name', 'ایمان': 'male_name',
            'مسعود': 'male_name', 'نادر': 'male_name', 'پژمان': 'male_name', 'رامین': 'male_name',
            'سامان': 'male_name', 'شایان': 'male_name', 'عرفان': 'male_name', 'میلاد': 'male_name',
            
            // 👩 اسم زن
            'سارا': 'female_name', 'مریم': 'female_name', 'فاطمه': 'female_name', 'نرگس': 'female_name',
            'زهرا': 'female_name', 'لیلا': 'female_name', 'سمیه': 'female_name', 'پریسا': 'female_name',
            'نسیم': 'female_name', 'مهرناز': 'female_name', 'شیما': 'female_name', 'آتنا': 'female_name',
            'یلدا': 'female_name', 'نازنین': 'female_name', 'شیرین': 'female_name', 'مینا': 'female_name',
            'سپیده': 'female_name', 'غزل': 'female_name', 'رها': 'female_name', 'آوا': 'female_name',
            'باران': 'female_name', 'نازنین': 'female_name', 'مهسا': 'female_name', 'کیمیا': 'female_name',
            
            // 🏷️ اسم عمومی
            'اسم': 'name', 'نام': 'name', 'اسمت': 'name', 'تو کی هستی': 'name',
            'اسم من': 'name', 'من': 'name', 'تو': 'name', 'شما': 'name',
            'دوست': 'name', 'دوستم': 'name', 'دوستت': 'name', 'رفیق': 'name',
            'برادر': 'name', 'خواهر': 'name', 'مادر': 'name', 'پدر': 'name',
            'خانواده': 'name', 'نزدیکان': 'name', 'آشنا': 'name', 'همکار': 'name',
            
            // 🙏 تشکر
            'ممنون': 'thanks', 'متشکرم': 'thanks', 'مرسی': 'thanks',
            'قربان': 'thanks', 'ممنونم': 'thanks', 'سپاس': 'thanks',
            'سپاسگزارم': 'thanks', 'ممنونم ازت': 'thanks', 'ممنون از لطفت': 'thanks',
            'متشکر': 'thanks', 'سپاسگزار': 'thanks', 'ممنونم بابت': 'thanks',
            'قربان تو': 'thanks', 'ممنونم عزیز': 'thanks', 'سپاس فراوان': 'thanks',
            
            // 👋 خداحافظ
            'خداحافظ': 'goodbye', 'موفق باشی': 'goodbye', 'خدانگهدار': 'goodbye',
            'فعلاً': 'goodbye', 'به امید دیدار': 'goodbye', 'بای': 'goodbye',
            'بدرود': 'goodbye', 'خوش باشی': 'goodbye', 'خدانگهدار': 'goodbye',
            'موفق': 'goodbye', 'خداحافظی': 'goodbye', 'بای بای': 'goodbye',
            'فعلا': 'goodbye', 'خدانگهدار': 'goodbye', 'موفق باشی': 'goodbye',
            
            // 💻 کد
            'کد': 'code', 'برنامه': 'code', 'برنامه‌نویسی': 'code', 'کد بنویس': 'code',
            'بنویس': 'code', 'اسکریپت': 'code', 'کدنویسی': 'code', 'پروژه': 'code',
            'python': 'code', 'javascript': 'code', 'java': 'code', 'c++': 'code',
            'html': 'code', 'css': 'code', 'sql': 'code', 'react': 'code',
            'node': 'code', 'php': 'code', 'ruby': 'code', 'go': 'code',
            'rust': 'code', 'swift': 'code', 'kotlin': 'code', 'dart': 'code',
            'flutter': 'code', 'angular': 'code', 'vue': 'code', 'svelte': 'code',
            'typescript': 'code', 'json': 'code', 'xml': 'code', 'yaml': 'code',
            'function': 'code', 'class': 'code', 'variable': 'code', 'loop': 'code',
            'if': 'code', 'else': 'code', 'for': 'code', 'while': 'code',
            'return': 'code', 'import': 'code', 'export': 'code', 'const': 'code',
            'let': 'code', 'var': 'code', 'async': 'code', 'await': 'code',
            'promise': 'code', 'array': 'code', 'object': 'code', 'map': 'code',
            'console': 'code', 'log': 'code', 'print': 'code', 'printf': 'code',
            'scanf': 'code', 'input': 'code', 'output': 'code', 'algorithm': 'code',
            'data structure': 'code', 'database': 'code', 'api': 'code', 'rest': 'code',
            'graphql': 'code', 'websocket': 'code', 'http': 'code', 'server': 'code',
            'client': 'code', 'frontend': 'code', 'backend': 'code', 'fullstack': 'code',
            'devops': 'code', 'docker': 'code', 'kubernetes': 'code', 'cloud': 'code',
            'aws': 'code', 'azure': 'code', 'gcp': 'code', 'linux': 'code',
            'git': 'code', 'github': 'code', 'gitlab': 'code', 'ci/cd': 'code',
            
            // 😊 احساس
            'خوشحالم': 'emotion', 'ناراحتم': 'emotion', 'هیجان‌زده‌ام': 'emotion',
            'غمگینم': 'emotion', 'عصبانی': 'emotion', 'ترسیده': 'emotion',
            'امیدوارم': 'emotion', 'دلم تنگه': 'emotion', 'عاشق': 'emotion',
            'دوست دارم': 'emotion', 'متنفرم': 'emotion', 'شوک': 'emotion',
            'شگفت‌زده': 'emotion', 'حیرت‌زده': 'emotion', 'متحیر': 'emotion',
            'خوشحالی': 'emotion', 'ناراحتی': 'emotion', 'عصبانیت': 'emotion',
            'ترس': 'emotion', 'امید': 'emotion', 'دلتنگی': 'emotion', 'عشق': 'emotion',
            'دوست داشتن': 'emotion', 'متنفر': 'emotion', 'شگفت': 'emotion',
            'حیرت': 'emotion', 'تعجب': 'emotion', 'شادی': 'emotion', 'غم': 'emotion',
            
            // ⏰ زمان
            'امروز': 'time', 'دیروز': 'time', 'فردا': 'time', 'حالا': 'time',
            'الان': 'time', 'صبح': 'time', 'ظهر': 'time', 'عصر': 'time',
            'شب': 'time', 'نیمه‌شب': 'time', 'ساعت': 'time', 'دقیقه': 'time',
            'ثانیه': 'time', 'هفته': 'time', 'ماه': 'time', 'سال': 'time',
            'زمان': 'time', 'تاریخ': 'time', 'روز': 'time', 'شب': 'time',
            'صبحگاه': 'time', 'شبگاه': 'time', 'ظهرگاه': 'time', 'عصرگاه': 'time',
            'بامداد': 'time', 'شب‌گیر': 'time', 'نیمه‌روز': 'time', 'غروب': 'time',
            'طلوع': 'time', 'سپیده‌دم': 'time', 'گرگ‌ومیش': 'time', 'شب‌افروز': 'time',
            
            // 📍 مکان
            'اینجا': 'place', 'آنجا': 'place', 'خانه': 'place', 'مدرسه': 'place',