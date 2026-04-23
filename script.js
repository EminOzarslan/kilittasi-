const passwordInput = document.getElementById('passwordInput');
const toggleBtn = document.getElementById('toggleBtn');

let blackList = [];

async function loadBlacklist() {
    try {
        const response = await fetch('blacklist.json');
        const data = await response.json();
        blackList = data.passwords;
        console.log("Kara liste başarıyla yüklendi.");
    } catch (error) {
        console.error("Liste yüklenirken hata oluştu:", error);
    }
}

loadBlacklist();


toggleBtn.addEventListener('click', function () {

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'Gizle';
    }
    else {
        passwordInput.type = 'password';
        toggleBtn.textContent = 'Göster';
    }

});

function calculateEntropy(password) {
    const length = password.length;
    if (length === 0) return 0;

    const uniqueChars = new Set(password).size;
    if (uniqueChars === 1) return 0;

    const lowerCasePassword = password.toLowerCase();

    const isBlacklisted = blackList.some(word => lowerCasePassword.includes(word));

    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

    const entropy = length * Math.log2(poolSize);
    let finalEntropy = Math.floor(entropy);

    const repetitions = password.match(/(.)\1{3,}/g);
    if (repetitions) {
        finalEntropy = Math.floor(finalEntropy / 4);
    }

    if (isBlacklisted) {
        finalEntropy = Math.floor(finalEntropy / 3);
    }

    return Math.max(0, finalEntropy);
}

function estimateCrackTime(entropy) {

    const guessesPerSecond = 100000000000;

    const totalCombinations = Math.pow(2, entropy);

    const seconds = totalCombinations / guessesPerSecond;

    if (seconds < 1) return "Anında kırılır!";
    if (seconds < 60) return `${Math.floor(seconds)} saniye`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} dakika`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat`;
    if (seconds < 31536000) return `${Math.floor(seconds / 86400)} gün`;
    if (seconds < 3153600000) return `${Math.floor(seconds / 31536000)} yıl`;

    return "Yüzyıllar sürer...";
}


const strengthBar = document.getElementById('strengthBar');
const entropyScoreDisplay = document.getElementById('entropyScore');
const crackTimeDisplay = document.getElementById('crackTime');

passwordInput.addEventListener('input', function () {
    const currentPassword = passwordInput.value;

    if (currentPassword.length === 0) {
        entropyScoreDisplay.textContent = '0';
        crackTimeDisplay.textContent = '-';
        strengthBar.style.width = '0%';
        return;
    }

    const entropy = calculateEntropy(currentPassword);
    const crackTime = estimateCrackTime(entropy);

    entropyScoreDisplay.textContent = entropy;
    crackTimeDisplay.textContent = crackTime;

    let fillPercentage = (entropy / 100) * 100;
    if (fillPercentage < 5) fillPercentage = 5;
    if (fillPercentage > 100) fillPercentage = 100;

    strengthBar.style.width = fillPercentage + '%';

    if (entropy < 55) {
        strengthBar.style.backgroundColor = '#ff4d4d';
    } else if (entropy < 70) {
        strengthBar.style.backgroundColor = '#ffa500';
    } else {
        strengthBar.style.backgroundColor = '#00FF00';
    }
});



// --- YENİ MODÜL: K-ANONYMITY İLE SIZINTI KONTROLÜ ---

const checkBreachBtn = document.getElementById('checkBreachBtn');
const breachResult = document.getElementById('breachResult');

// Metni SHA-1 Hash'ine çeviren modern Web Crypto fonksiyonu
async function getSHA1Hash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Array'i alıp büyük harfli hexadecimal bir stringe çeviriyoruz
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    return hashHex;
}

// Butona tıklandığında çalışacak asıl olay
checkBreachBtn.addEventListener('click', async function () {
    const password = passwordInput.value;

    if (password.length === 0) {
        breachResult.textContent = "Lütfen önce bir parola girin.";
        breachResult.style.color = "#ccc";
        return;
    }

    breachResult.textContent = "Sorgulanıyor... (k-Anonymity devrede)";
    breachResult.style.color = "#ffa500"; // Turuncu (Bekleme)

    try {
        // 1. Şifrenin Hash'ini al
        const fullHash = await getSHA1Hash(password);

        // 2. Hash'i böl: İlk 5 karakter (Prefix) ve Geri Kalan (Suffix)
        const prefix = fullHash.substring(0, 5);
        const suffix = fullHash.substring(5);

        // 3. SADECE İLK 5 KARAKTERİ HIBP API'sine yolla
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = await response.text();

        // 4. Gelen yanıtları satır satır böl (Her satır: HASH_KUYRUGU:SIZDIRILMA_SAYISI şeklindedir)
        const hashes = data.split('\n');

        let isBreached = false;
        let breachCount = 0;

        // 5. Gelen listedeki kuyrukları bizim gizli kuyruğumuzla (suffix) karşılaştır
        for (let i = 0; i < hashes.length; i++) {
            const line = hashes[i].split(':');
            const returnedSuffix = line[0];
            const count = line[1];

            if (returnedSuffix === suffix) {
                isBreached = true;
                breachCount = count.trim();
                break;
            }
        }

        // 6. Sonucu Ekrana Yazdır
       
        // Eğer şifre sızdırılmışsa, entropi çubuğunu ne kadar yeşil olursa olsun KIRMIZIYA çak!
        if (isBreached) {
            breachResult.textContent = `🚨 TEHLİKE: Bu parola daha önce ${breachCount} kez veri ihlallerinde sızdırılmış! ASLA KULLANMAYIN!`;
            breachResult.style.color = "#ff4d4d";

            // Çubuğu ve skoru zorla sıfırla/kırmızı yap
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = '#ff4d4d'; // Kıpkırmızı
            entropyScoreDisplay.textContent = '0 (Sızdırılmış!)';
            crackTimeDisplay.textContent = 'Anında kırılır (Sözlükte var)';
        } else {
            breachResult.textContent = "✅ TEMİZ: Bu parola bilinen hiçbir sızıntıya karışmamış.";
            breachResult.style.color = "#00FF00";
        }

    } catch (error) {
        breachResult.textContent = "Bağlantı hatası oluştu.";
        console.error(error);
    }
});