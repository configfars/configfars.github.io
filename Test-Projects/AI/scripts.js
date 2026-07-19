// ==================== مدل زبانی ساده (N-gram + قواعد گرامری) ====================

class SimpleLanguageModel {
    constructor() {
        // دیکشنری کلمات با نوع‌شون
        this.vocabulary = new Map();
        
        // زنجیره مارکوف: کلمه → [کلمات بعدی]
        this.transitions = new Map();
        
        // شروع‌کننده‌های جمله
        this.starters = [];
        
        // قواعد گرامری
        this.grammarRules = {
            greeting: { canStart: true, canEnd: false, next: ['question', 'emotion', 'noun', 'connector'] },
            question: { canStart: true, canEnd: true, next: ['emotion', 'noun', 'verb', 'connector', 'ending'] },
            emotion: { canStart: false, canEnd: true, next: ['question', 'connector', 'ending', 'noun'] },
            noun: { canStart: true, canEnd: false, next: ['verb', 'emotion', 'question', 'connector'] },
            verb: { canStart: false, canEnd: true, next: ['emotion', 'question', 'connector', 'ending', 'noun'] },
            connector: { canStart: false, canEnd: false, next: ['noun', 'verb', 'emotion', 'greeting', 'question'] },
            ending: { canStart: false, canEnd: true, next: [] }
        };

        this.loadFromStorage();
        this.initDefaultData();
    }

    // داده‌های پیش‌فرض
    initDefaultData() {
        if (this.vocabulary.size === 0) {
            const defaults = [
                // تحیت
                ['سلام', 'greeting'], ['درود', 'greeting'], ['سلام علیکم', 'greeting'],
                ['هی', 'greeting'], ['سلامتی', 'greeting'],
                
                // سوالی
                ['چطوری', 'question'], ['خوبی', 'question'], ['چی شد', 'question'],
                ['چه خبر', 'question'], ['حالت چطوره', 'question'], ['چیکار میکنی', 'question'],
                
                // احساس
                ['خوبم', 'emotion'], ['عالی', 'emotion'], ['بد نیستم', 'emotion'],
                ['ممنون', 'emotion'], ['خوشحالم', 'emotion'], ['خسته', 'emotion'],
                ['خوب', 'emotion'], ['عالیه', 'emotion'],
                
                // اسم
                ['من', 'noun'], ['تو', 'noun'], ['ما', 'noun'], ['شما', 'noun'],
                ['دوست', 'noun'], ['خانواده', 'noun'], ['زندگی', 'noun'],
                
                // فعل
                ['رفتم', 'verb'], ['کردم', 'verb'], ['هستم', 'verb'], ['بودم', 'verb'],
                ['دارم', 'verb'], ['می‌روم', 'verb'], ['می‌خوام', 'verb'],
                
                // ربط
                ['و', 'connector'], ['اما', 'connector'], ['پس', 'connector'],
                ['ولی', 'connector'], ['چون', 'connector'], ['اگر', 'connector'],
                
                // پایان
                ['خداحافظ', 'ending'], ['موفق باشی', 'ending'], ['به امید دیدار', 'ending'],
                ['فعلاً', 'ending'], ['خدانگهدار', 'ending']
            ];

            defaults.forEach(([word, type]) => {
                this.vocabulary.set(word, { type, count: 3 });
            });

            // جملات پیش‌فرض برای یادگیری
            this.learnSentence('سلام خوبی چطوری');
            this.learnSentence('من خوبم ممنون');
            this.learnSentence('سلام عالی هستم');
            this.learnSentence('چه خبر خوبی تو چطوری');
            this.learnSentence('خداحافظ موفق باشی');
            this.learnSentence('درود حالت چطوره خوبی');
            this.learnSentence('من دارم میرم خداحافظ');
            this.learnSentence('سلامتی چیکار میکنی خوبی');
            
            this.saveToStorage();
        }
    }

    // یادگیری یک جمله
    learnSentence(text) {
        const words = this.tokenize(text);
        if (words.length < 2) return;

        // اضافه کردن به شروع‌کننده‌ها
        const firstWord = words[0];
        if (!this.starters.includes(firstWord)) {
            this.starters.push(firstWord);
        }

        // ساخت زنجیره مارکوف
        for (let i = 0; i < words.length - 1; i++) {
            const current = words[i];
            const next = words[i + 1];

            if (!this.transitions.has(current)) {
                this.transitions.set(current, []);
            }
            this.transitions.get(current).push(next);

            // به‌روزرسانی دیکشنری
            if (!this.vocabulary.has(current)) {
                this.vocabulary.set(current, { type: 'unknown', count: 0 });
            }
            this.vocabulary.get(current).count++;
        }

        // کلمه آخر
        const last = words[words.length - 1];
        if (!this.vocabulary.has(last)) {
            this.vocabulary.set(last, { type: 'unknown', count: 0 });
        }
        this.vocabulary.get(last).count++;
    }

    // یادگیری معنی کلمه
    learnWord(word, type) {
        word = word.trim();
        if (!word) return;

        if (this.vocabulary.has(word)) {
            this.vocabulary.get(word).type = type;
        } else {
            this.vocabulary.set(word, { type, count: 1 });
        }

        // اگر تحیت یا سوال باشه، می‌تونه شروع‌کننده باشه
        if (type === 'greeting' || type === 'question') {
            if (!this.starters.includes(word)) {
                this.starters.push(word);
            }
        }

        this.saveToStorage();
    }

    // تبدیل متن به کلمات
    tokenize(text) {
        return text
            .replace(/[،,.!?؟!]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 0);
    }

    // تولید پاسخ بر اساس ورودی کاربر
    generateResponse(input, randomMode = true) {
        const inputWords = this.tokenize(input);
        
        // پیدا کردن کلمات ورودی در دیکشنری
        const knownWords = inputWords.filter(w => this.vocabulary.has(w));
        
        if (knownWords.length === 0) {
            return this.generateRandomSentence(3, 6);
        }

        if (randomMode) {
            // تولید جمله تصادفی بر اساس کلمات ورودی
            return this.generateContextualSentence(knownWords);
        } else {
            // پاسخ مستقیم بر اساس زنجیره مارکوف
            const seed = knownWords[Math.floor(Math.random() * knownWords.length)];
            return this.generateFromChain(seed, 4, 8);
        }
    }

    // تولید جمله بر اساس زمینه
    generateContextualSentence(seedWords) {
        const length = 3 + Math.floor(Math.random() * 5); // 3 تا 7 کلمه
        const sentence = [];
        
        // انتخاب شروع‌کننده مناسب
        let current;
        const greetings = seedWords.filter(w => this.getType(w) === 'greeting');
        
        if (greetings.length > 0 && Math.random() > 0.3) {
            current = greetings[Math.floor(Math.random() * greetings.length)];
        } else {
            const validStarters = this.starters.filter(w => {
                const type = this.getType(w);
                return this.grammarRules[type]?.canStart;
            });
            current = validStarters[Math.floor(Math.random() * validStarters.length)] || this.starters[0];
        }
        
        sentence.push(current);

        // ساخت جمله با رعایت قواعد گرامری
        for (let i = 1; i < length; i++) {
            const currentType = this.getType(current);
            const rule = this.grammarRules[currentType];
            
            if (!rule || rule.next.length === 0) break;

            // پیدا کردن کلمات مناسب برای بعد
            const candidates = [];
            
            // اولویت: کلمات از ورودی کاربر
            for (let word of seedWords) {
                if (!sentence.includes(word) && rule.next.includes(this.getType(word))) {
                    candidates.push(word);
                }
            }

            // دوم: کلمات از زنجیره مارکوف
            const chainNext = this.transitions.get(current) || [];
            for (let word of chainNext) {
                if (!sentence.includes(word) && rule.next.includes(this.getType(word))) {
                    candidates.push(word);
                }
            }

            // سوم: هر کلمه مناسب از دیکشنری
            if (candidates.length === 0) {
                for (let [word, info] of this.vocabulary) {
                    if (!sentence.includes(word) && rule.next.includes(info.type)) {
                        candidates.push(word);
                    }
                }
            }

            if (candidates.length === 0) break;

            current = candidates[Math.floor(Math.random() * candidates.length)];
            sentence.push(current);

            // اگر کلمه پایان بود، تموم کن
            if (this.grammarRules[this.getType(current)]?.canEnd && Math.random() > 0.5) {
                break;
            }
        }

        return this.beautify(sentence.join(' '));
    }

    // تولید از زنجیره مارکوف
    generateFromChain(seed, minLen, maxLen) {
        const sentence = [seed];
        let current = seed;
        const len = minLen + Math.floor(Math.random() * (maxLen - minLen));

        for (let i = 1; i < len; i++) {
            const nextWords = this.transitions.get(current);
            if (!nextWords || nextWords.length === 0) break;
            
            current = nextWords[Math.floor(Math.random() * nextWords.length)];
            sentence.push(current);
        }

        return this.beautify(sentence.join(' '));
    }

    // تولید کاملاً تصادفی
    generateRandomSentence(minLen, maxLen) {
        const len = minLen + Math.floor(Math.random() * (maxLen - minLen));
        const sentence = [];
        
        // شروع با یک تحیت یا سوال
        const starters = Array.from(this.vocabulary.entries())
            .filter(([_, info]) => this.grammarRules[info.type]?.canStart)
            .map(([word, _]) => word);
        
        let current = starters[Math.floor(Math.random() * starters.length)];
        sentence.push(current);

        for (let i = 1; i < len; i++) {
            const currentType = this.getType(current);
            const rule = this.grammarRules[currentType];
            
            if (!rule || rule.next.length === 0) break;

            const validWords = Array.from(this.vocabulary.entries())
                .filter(([word, info]) => rule.next.includes(info.type) && !sentence.includes(word))
                .map(([word, _]) => word);

            if (validWords.length === 0) break;

            current = validWords[Math.floor(Math.random() * validWords.length)];
            sentence.push(current);
        }

        return this.beautify(sentence.join(' '));
    }

    // زیباسازی جمله
    beautify(text) {
        if (!text) return '...';
        
        // اضافه کردن علائم نگارشی مناسب
        const endings = ['؟', '!', '.', '؟', '!'];
        const lastChar = text.slice(-1);
        
        if (!'؟!.'.includes(lastChar)) {
            // اگر آخرین کلمه سوالی بود
            const lastWord = text.split(' ').pop();
            const type = this.getType(lastWord);
            if (type === 'question') {
                text += '؟';
            } else if (type === 'emotion' || type === 'greeting') {
                text += '!';
            } else {
                text += endings[Math.floor(Math.random() * endings.length)];
            }
        }

        return text;
    }

    // گرفتن نوع کلمه
    getType(word) {
        return this.vocabulary.get(word)?.type || 'unknown';
    }

    // ذخیره در LocalStorage
    saveToStorage() {
        const data = {
            vocabulary: Array.from(this.vocabulary.entries()),
            transitions: Array.from(this.transitions.entries()),
            starters: this.starters
        };
        localStorage.setItem('language_model', JSON.stringify(data));
    }

    // بارگذاری از LocalStorage
    loadFromStorage() {
        const saved = localStorage.getItem('language_model');
        if (saved) {
            const data = JSON.parse(saved);
            this.vocabulary = new Map(data.vocabulary);
            this.transitions = new Map(data.transitions.map(([k, v]) => [k, v]));
            this.starters = data.starters;
        }
    }

    // پاک کردن
    clear() {
        this.vocabulary.clear();
        this.transitions.clear();
        this.starters = [];
        localStorage.removeItem('language_model');
        this.initDefaultData();
    }

    // آمار
    getStats() {
        return {
            words: this.vocabulary.size,
            transitions: Array.from(this.transitions.values()).reduce((a, b) => a + b.length, 0),
            starters: this.starters.length,
            sentences: Math.floor(this.transitions.size * 1.5)
        };
    }
}

// ==================== رابط کاربری ====================

const model = new SimpleLanguageModel();
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const teachBtn = document.getElementById('teachBtn');
const teachText = document.getElementById('teachText');
const wordInput = document.getElementById('wordInput');
const wordType = document.getElementById('wordType');
const addWordBtn = document.getElementById('addWordBtn');
const dictionary = document.getElementById('dictionary');
const stats = document.getElementById('stats');
const clearBtn = document.getElementById('clearBtn');
const randomMode = document.getElementById('randomMode');

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

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = '';

    const typing = showTyping();

    setTimeout(() => {
        typing.remove();
        const response = model.generateResponse(text, randomMode.checked);
        addMessage(response);
    }, 600 + Math.random() * 800);
}

// یادگیری جمله
teachBtn.addEventListener('click', () => {
    const text = teachText.value.trim();
    if (!text) {
        alert('لطفاً یک جمله بنویس!');
        return;
    }

    // جدا کردن جملات
    const sentences = text.split(/[.!?؟!،,]/).filter(s => s.trim().length > 0);
    
    sentences.forEach(s => model.learnSentence(s.trim()));
    model.saveToStorage();
    
    teachText.value = '';
    updateUI();
    
    addMessage(`✅ ${sentences.length} جمله جدید یاد گرفتم!`);
});

// یادگیری کلمه
addWordBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();
    const type = wordType.value;
    
    if (!word) {
        alert('لطفاً یک کلمه وارد کن!');
        return;
    }

    model.learnWord(word, type);
    wordInput.value = '';
    updateUI();
    
    const typeNames = {
        greeting: 'تحیت', question: 'سوالی', emotion: 'احساس',
        noun: 'اسم', verb: 'فعل', connector: 'ربط', ending: 'پایان'
    };
    
    addMessage(`✅ کلمه "${word}" به عنوان ${typeNames[type]} یاد گرفتم!`);
});

// پاک کردن
clearBtn.addEventListener('click', () => {
    if (confirm('آیا مطمئنی می‌خوای همه چی رو پاک کنی؟')) {
        model.clear();
        updateUI();
        addMessage('🗑️ حافظه کاملاً پاک شد!');
    }
});

// به‌روزرسانی UI
function updateUI() {
    // دیکشنری
    dictionary.innerHTML = '';
    const typeNames = {
        greeting: 'تحیت', question: 'سوالی', emotion: 'احساس',
        noun: 'اسم', verb: 'فعل', connector: 'ربط', ending: 'پایان', unknown: 'نامشخص'
    };
    
    for (let [word, info] of model.vocabulary) {
        const tag = document.createElement('span');
        tag.className = `word-tag ${info.type}`;
        tag.textContent = `${word} (${typeNames[info.type]})`;
        tag.title = `تعداد استفاده: ${info.count}`;
        dictionary.appendChild(tag);
    }

    // آمار
    const s = model.getStats();
    stats.innerHTML = `
        📖 <span>${s.words}</span> کلمه یاد گرفتم<br>
        🔗 <span>${s.transitions}</span> ارتباط بین کلمات<br>
        🚀 <span>${s.starters}</span> کلمه شروع‌کننده<br>
        📝 <span>~${s.sentences}</span> الگوی جمله
    `;
}

// رویدادها
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

// شروع
updateUI();
