// ==================== هوش مصنوعی واقعی با درک و فهم ====================

class RealAI {
    constructor() {
        // === دیکشنری معانی ===
        this.vocabulary = new Map();
        
        // === حافظه مکالمه ===
        this.memory = {
            lastIntent: null,
            lastTopic: null,
            conversationHistory: [],
            userName: null
        };
        
        // === داده‌های آموزشی ===
        this.trainingData = [];
        
        // === مدل TensorFlow ===
        this.model = null;
        this.isModelReady = false;
        
        // === Intent ها ===
        this.intents = [
            'greeting', 'how_are_you', 'status_good', 'status_bad',
            'question', 'name', 'thanks', 'goodbye', 'unknown'
        ];
        
        // === پاسخ‌های پیش‌فرض برای هر intent ===
        this.responses = {
            greeting: [
                'سلام! خوبی؟ چطوری؟',
                'درود! حالت چطوره؟',
                'سلام علیکم! چه خبر؟',
                'هی! خوبی؟'
            ],
            how_are_you: [
                'من خوبم، ممنون! تو چطوری؟',
                'عالی! تو چطوری؟',
                'خوبم، تو چه خبر؟'
            ],
            status_good: [
                'خوشحالم که خوبی! 😊',
                'عالیه! منم خوبم.',
                'خوشحالم! چه خبر دیگه؟'
            ],
            status_bad: [
                'متأسفم! امیدوارم زودتر خوب بشی.',
                'ای بابا! چی شده؟',
                'غمگینم که حالت بده. می‌خوای حرف بزنی؟'
            ],
            question: [
                'نمی‌دونم دقیقاً، ولی می‌تونم یاد بگیرم!',
                'سوال خوبیه! بذار فکر کنم...',
                'متأسفانه اطلاعات کافی ندارم.'
            ],
            name: [
                'اسم من AI هست! اسم تو چیه؟',
                'من یک هوش مصنوعی ساده‌ام. تو کی هستی؟'
            ],
            thanks: [
                'قربان تو! 💜',
                'خواهش می‌کنم!',
                'ممنون از لطفت!'
            ],
            goodbye: [
                'خداحافظ! موفق باشی! 🌟',
                'فعلاً! به امید دیدار!',
                'خدانگهدار! مراقب خودت باش!'
            ],
            unknown: [
                'متوجه نشدم... می‌تونی بیشتر توضیح بدی؟',
                'نفهمیدم! می‌تونی بهم یاد بدی؟',
                'هنوز یاد نگرفتم اینو! آموزشم بده.'
            ]
        };
        
        this.init();
    }

    async init() {
        this.initDefaultVocabulary();
        this.loadMemory();
        await this.buildModel();
        this.updateUI();
    }

    // === دیکشنری پیش‌فرض ===
    initDefaultVocabulary() {
        const defaults = {
            // greeting
            'سلام': 'greeting', 'درود': 'greeting', 'سلام علیکم': 'greeting',
            'هی': 'greeting', 'سلامتی': 'greeting', 'صبح بخیر': 'greeting',
            'عصر بخیر': 'greeting', 'شب بخیر': 'greeting',
            
            // how_are_you
            'چطوری': 'how_are_you', 'خوبی': 'how_are_you', 'حالت چطوره': 'how_are_you',
            'چیکار میکنی': 'how_are_you', 'حالت خوبه': 'how_are_you',
            'چه خبر': 'how_are_you', 'چی شد': 'how_are_you',
            
            // status_good
            'خوبم': 'status_good', 'عالی': 'status_good', 'خوب': 'status_good',
            'عالیه': 'status_good', 'بد نیستم': 'status_good', 'خوشحالم': 'status_good',
            'تمیز': 'status_good', 'عالی ام': 'status_good', 'خوب هستم': 'status_good',
            
            // status_bad
            'خسته‌ام': 'status_bad', 'حالم بده': 'status_bad', 'ناراحتم': 'status_bad',
            'غمگینم': 'status_bad', 'بد': 'status_bad', 'خسته': 'status_bad',
            
            // question
            'کی': 'question', 'چی': 'question', 'کجا': 'question', 'چرا': 'question',
            'چطور': 'question', 'چند': 'question',
            
            // name
            'اسم': 'name', 'نام': 'name', 'اسمت': 'name', 'تو کی هستی': 'name',
            
            // thanks
            'ممنون': 'thanks', 'متشکرم': 'thanks', 'مرسی': 'thanks',
            'قربان': 'thanks', 'ممنونم': 'thanks',
            
            // goodbye
            'خداحافظ': 'goodbye', 'موفق باشی': 'goodbye', 'خدانگهدار': 'goodbye',
            'فعلاً': 'goodbye', 'به امید دیدار': 'goodbye', 'بای': 'goodbye'
        };

        for (let [word, intent] of Object.entries(defaults)) {
            this.vocabulary.set(word, { intent, count: 5, weight: 1.0 });
        }
    }

    // === ساخت مدل TensorFlow.js ===
    async buildModel() {
        try {
            this.model = tf.sequential();
            
            // لایه ورودی: بردار ویژگی‌ها
            this.model.add(tf.layers.dense({
                inputShape: [50], // 50 ویژگی
                units: 32,
                activation: 'relu'
            }));
            
            // لایه پنهان
            this.model.add(tf.layers.dense({
                units: 16,
                activation: 'relu'
            }));
            
            // لایه خروجی: 9 intent
            this.model.add(tf.layers.dense({
                units: 9,
                activation: 'softmax'
            }));
            
            this.model.compile({
                optimizer: tf.train.adam(0.001),
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });
            
            this.isModelReady = true;
            console.log('✅ مدل ساخته شد!');
        } catch (e) {
            console.log('⚠️ TensorFlow خطا:', e);
            this.isModelReady = false;
        }
    }

    // === تبدیل متن به بردار ویژگی ===
    textToVector(text) {
        const vector = new Array(50).fill(0);
        const words = this.tokenize(text);
        
        words.forEach((word, i) => {
            // هش ساده برای تبدیل کلمه به عدد
            let hash = 0;
            for (let char of word) {
                hash = ((hash << 5) - hash) + char.charCodeAt(0);
                hash = hash & hash;
            }
            const index = Math.abs(hash) % 50;
            vector[index] = 1;
            
            // وزن‌دهی بر اساس دیکشنری
            if (this.vocabulary.has(word)) {
                const info = this.vocabulary.get(word);
                vector[index] = info.weight;
            }
        });
        
        return vector;
    }

    // === تشخیص قصد (Intent Detection) ===
    detectIntent(text) {
        const words = this.tokenize(text);
        const scores = new Map();
        
        // مقداردهی اولیه
        this.intents.forEach(i => scores.set(i, 0));
        
        // تحلیل هر کلمه
        words.forEach(word => {
            if (this.vocabulary.has(word)) {
                const info = this.vocabulary.get(word);
                scores.set(info.intent, (scores.get(info.intent) || 0) + info.weight);
            }
        });
        
        // بررسی الگوهای ترکیبی
        const textLower = text.toLowerCase();
        
        // الگوی "اسم من ... است"
        if (textLower.includes('اسم من') || textLower.includes('من')) {
            if (textLower.includes('هستم') || textLower.includes('ام')) {
                scores.set('name', (scores.get('name') || 0) + 2);
            }
        }
        
        // انتخاب بهترین intent
        let bestIntent = 'unknown';
        let bestScore = 0;
        
        for (let [intent, score] of scores) {
            if (score > bestScore) {
                bestScore = score;
                bestIntent = intent;
            }
        }
        
        // اطمینان
        const confidence = Math.min(bestScore / words.length * 100, 100);
        
        return { intent: bestIntent, confidence, scores };
    }

    // === تولید پاسخ هوشمند ===
    generateResponse(text) {
        const detection = this.detectIntent(text);
        const intent = detection.intent;
        const confidence = detection.confidence;
        
        // به‌روزرسانی حافظه
        this.memory.lastIntent = intent;
        this.memory.conversationHistory.push({ role: 'user', text, intent });
        
        let response = '';
        
        // === منطق پاسخ‌دهی هوشمند ===
        
        // 1. اگر کاربر اسمش رو گفت
        if (intent === 'name' || this.extractName(text)) {
            const name = this.extractName(text);
            if (name && !this.memory.userName) {
                this.memory.userName = name;
                response = `سلام ${name}! خوشحالم از آشنایی 😊`;
            } else if (this.memory.userName) {
                response = `${this.memory.userName} عزیز! چطورم می‌تونم کمکت کنم؟`;
            } else {
                response = this.getRandomResponse('name');
            }
        }
        // 2. پاسخ به تحیت
        else if (intent === 'greeting') {
            if (this.memory.userName) {
                response = `سلام ${this.memory.userName}! خوبی؟`;
            } else {
                response = this.getRandomResponse('greeting');
            }
        }
        // 3. پاسخ به احوالپرسی
        else if (intent === 'how_are_you') {
            // اگر قبلاً گفتیم حالمان خوب است
            if (this.memory.lastTopic === 'status_good') {
                response = 'هنوز خوبم! تو چطوری؟';
            } else {
                response = this.getRandomResponse('how_are_you');
            }
        }
        // 4. پاسخ به حال خوب
        else if (intent === 'status_good') {
            this.memory.lastTopic = 'status_good';
            response = this.getRandomResponse('status_good');
        }
        // 5. پاسخ به حال بد
        else if (intent === 'status_bad') {
            this.memory.lastTopic = 'status_bad';
            response = this.getRandomResponse('status_bad');
        }
        // 6. پاسخ به تشکر
        else if (intent === 'thanks') {
            response = this.getRandomResponse('thanks');
        }
        // 7. پاسخ به خداحافظی
        else if (intent === 'goodbye') {
            if (this.memory.userName) {
                response = `خداحافظ ${this.memory.userName}! موفق باشی 🌟`;
            } else {
                response = this.getRandomResponse('goodbye');
            }
        }
        // 8. سوال
        else if (intent === 'question') {
            response = this.getRandomResponse('question');
        }
        // 9. ناشناخته
        else {
            // بررسی یادگیری قبلی
            const learned = this.findLearnedResponse(text);
            if (learned) {
                response = learned;
            } else {
                response = this.getRandomResponse('unknown');
            }
        }
        
        // ذخیره در حافظه
        this.memory.conversationHistory.push({ role: 'bot', text: response, intent });
        this.saveMemory();
        
        return { text: response, intent, confidence };
    }

    // === استخراج اسم از جمله ===
    extractName(text) {
        const patterns = [
            /اسم من (.+?) است/,
            /اسم من (.+?)ه/,
            /من (.+?) هستم/,
            /من (.+?) ام/
        ];
        
        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match) return match[1].trim();
        }
        
        // ساده: بعد از "اسم" یا "من"
        if (text.includes('اسم من')) {
            const parts = text.split('اسم من')[1];
            if (parts) return parts.replace(/(است|هست|ام|می‌باشم)/, '').trim();
        }
        
        return null;
    }

    // === پاسخ تصادفی ===
    getRandomResponse(intent) {
        const list = this.responses[intent] || this.responses.unknown;
        return list[Math.floor(Math.random() * list.length)];
    }

    // === یادگیری مکالمه ===
    learnConversation(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        for (let i = 0; i < lines.length - 1; i += 2) {
            const input = lines[i];
            const expected = lines[i + 1];
            
            if (!input || !expected) continue;
            
            // یادگیری کلمات
            const inputWords = this.tokenize(input);
            const inputIntent = this.detectIntent(input).intent;
            
            inputWords.forEach(word => {
                if (this.vocabulary.has(word)) {
                    this.vocabulary.get(word).count++;
                    this.vocabulary.get(word).weight = Math.min(
                        this.vocabulary.get(word).weight + 0.1, 2.0
                    );
                } else {
                    this.vocabulary.set(word, { 
                        intent: inputIntent, 
                        count: 1, 
                        weight: 1.0 
                    });
                }
            });
            
            // ذخیره مکالمه
            this.trainingData.push({ input, response: expected, intent: inputIntent });
        }
        
        this.saveMemory();
        return Math.floor(lines.length / 2);
    }

    // === پیدا کردن پاسخ یادگرفته شده ===
    findLearnedResponse(text) {
        const normalized = this.normalize(text);
        
        // جستجوی دقیق
        for (let data of this.trainingData) {
            if (this.normalize(data.input) === normalized) {
                return data.response;
            }
        }
        
        // جستجوی fuzzy
        let bestMatch = null;
        let bestScore = 0;
        
        for (let data of this.trainingData) {
            const score = this.similarity(normalized, this.normalize(data.input));
            if (score > bestScore && score > 0.7) {
                bestScore = score;
                bestMatch = data.response;
            }
        }
        
        return bestMatch;
    }

    // === شباهت دو رشته ===
    similarity(s1, s2) {
        const words1 = new Set(this.tokenize(s1));
        const words2 = new Set(this.tokenize(s2));
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        return intersection.size / Math.max(words1.size, words2.size);
    }

    // === ابزارها ===
    tokenize(text) {
        return text
            .replace(/[،,.!?؟!]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 0);
    }

    normalize(text) {
        return text.trim().toLowerCase()
            .replace(/[؟!?.,،]/g, '')
            .replace(/\s+/g, ' ');
    }

    // === ذخیره/بارگذاری ===
    saveMemory() {
        const data = {
            vocabulary: Array.from(this.vocabulary.entries()),
            memory: this.memory,
            trainingData: this.trainingData
        };
        localStorage.setItem('real_ai_memory', JSON.stringify(data));
    }

    loadMemory() {
        const saved = localStorage.getItem('real_ai_memory');
        if (saved) {
            const data = JSON.parse(saved);
            this.vocabulary = new Map(data.vocabulary);
            this.memory = data.memory;
            this.trainingData = data.trainingData || [];
        }
    }

    clear() {
        this.vocabulary.clear();
        this.memory = { lastIntent: null, lastTopic: null, conversationHistory: [], userName: null };
        this.trainingData = [];
        localStorage.removeItem('real_ai_memory');
        this.initDefaultVocabulary();
    }

    getStats() {
        return {
            words: this.vocabulary.size,
            learned: this.trainingData.length,
            history: this.memory.conversationHistory.length,
            userName: this.memory.userName || '---'
        };
    }
}

// ==================== رابط کاربری ====================

const ai = new RealAI();
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const trainBtn = document.getElementById('trainBtn');
const trainData = document.getElementById('trainData');
const trainProgress = document.getElementById('trainProgress');
const trainStatus = document.getElementById('trainStatus');
const wordInput = document.getElementById('newWord');
const wordIntent = document.getElementById('wordIntent');
const addWordBtn = document.getElementById('addWordBtn');
const neuronVisual = document.getElementById('neuronVisual');
const statsText = document.getElementById('statsText');
const detectedIntent = document.getElementById('detectedIntent');
const memoryStatus = document.getElementById('memoryStatus');
const confidenceBadge = document.getElementById('confidenceBadge');
const botAvatar = document.getElementById('botAvatar');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');

function addMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    const time = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    
    msg.innerHTML = `
        <div class="message-bubble">${text}</div>
        <span class="time">${time}</span>
    `;
    
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function showTyping() {
    const div = document.createElement('div');
    div.className = 'message bot-message typing-indicator';
    div.innerHTML = `
        <div class="typing">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
    return div;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = '';
    
    botAvatar.classList.add('thinking');

    const typing = showTyping();

    // شبیه‌سازی فکر کردن
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    
    typing.remove();
    botAvatar.classList.remove('thinking');

    const result = ai.generateResponse(text);
    
    // نمایش اطلاعات
    detectedIntent.textContent = getIntentName(result.intent);
    confidenceBadge.textContent = `🎯 اطمینان: ${Math.round(result.confidence)}%`;
    confidenceBadge.className = `confidence-badge ${result.confidence > 70 ? 'high' : result.confidence > 40 ? 'medium' : 'low'}`;
    
    // حافظه
    const mem = ai.memory;
    memoryStatus.textContent = mem.userName ? `می‌شناسم ${mem.userName}` : (mem.lastIntent ? `موضوع: ${getIntentName(mem.lastIntent)}` : 'خالی');
    
    addMessage(result.text);
    updateUI();
}

function getIntentName(intent) {
    const names = {
        greeting: '👋 سلام', how_are_you: '❓ احوالپرسی',
        status_good: '✅ حال خوب', status_bad: '❌ حال بد',
        question: '❓ سوال', name: '🏷️ اسم',
        thanks: '🙏 تشکر', goodbye: '👋 خداحافظ',
        unknown: '❓ نامشخص'
    };
    return names[intent] || intent;
}

// آموزش
trainBtn.addEventListener('click', async () => {
    const text = trainData.value.trim();
    if (!text) {
        alert('مکالمه بنویس!');
        return;
    }

    trainBtn.disabled = true;
    trainProgress.style.width = '0%';
    trainStatus.textContent = 'در حال یادگیری...';
    
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
        await new Promise(r => setTimeout(r, 100));
        trainProgress.style.width = `${(i / steps) * 100}%`;
    }
    
    const learned = ai.learnConversation(text);
    trainData.value = '';
    trainStatus.textContent = `✅ ${learned} مکالمه یاد گرفتم!`;
    trainBtn.disabled = false;
    trainProgress.style.width = '0%';
    
    addMessage(`🧠 ${learned} مکالمه جدید یاد گرفتم!`);
    updateUI();
});

// اضافه کردن کلمه
addWordBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();
    const intent = wordIntent.value;
    
    if (!word) {
        alert('کلمه رو وارد کن!');
        return;
    }

    ai.vocabulary.set(word, { intent, count: 10, weight: 1.5 });
    ai.saveMemory();
    wordInput.value = '';
    updateUI();
    
    addMessage(`✅ "${word}" = ${getIntentName(intent)} (وزن بالا)`);
});

// ذخیره/بارگذاری/پاک کردن
saveBtn.addEventListener('click', () => {
    ai.saveMemory();
    addMessage('💾 مغز من ذخیره شد!');
});

loadBtn.addEventListener('click', () => {
    ai.loadMemory();
    updateUI();
    addMessage('📂 مغز من بارگذاری شد!');
});

clearBtn.addEventListener('click', () => {
    if (confirm('همه چی پاک می‌شه! مطمئنی؟')) {
        ai.clear();
        updateUI();
        addMessage('🗑️ همه چی پاک شد!');
    }
});

function updateUI() {
    const s = ai.getStats();
    statsText.innerHTML = `
        🧠 <span>${s.words}</span> کلمه می‌شناسم<br>
        📚 <span>${s.learned}</span> مکالمه یاد گرفتم<br>
        💬 <span>${s.history}</span> پیام در حافظه<br>
        👤 اسم تو: <span>${s.userName}</span>
    `;
    
    // نورون‌ها
    neuronVisual.innerHTML = '';
    const count = Math.min(s.words, 30);
    for (let i = 0; i < count; i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron';
        neuron.style.left = `${Math.random() * 90}%`;
        neuron.style.top = `${Math.random() * 90}%`;
        neuron.style.animationDelay = `${Math.random() * 2}s`;
        if (Math.random() > 0.7) neuron.classList.add('active');
        neuronVisual.appendChild(neuron);
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

// شروع
updateUI();