#  KilitTaşı: Gelişmiş Kimlik Doğrulama Analizörü
*(Keystone: Advanced Authentication Analyzer)*

![GitHub repo size](https://img.shields.io/github/repo-size/EminOzarslan/kilittasi?color=green)
![GitHub last commit](https://img.shields.io/github/last-commit/EminOzarslan/kilittasi)

**KilitTaşı**, parola güvenliğini sadece karakter uzunluğu gibi yüzeysel metriklerle değil; matematiksel entropi, siber güvenlik sözlükleri ve gerçek dünya sızıntı verileriyle analiz eden web tabanlı bir "Pentest" (Sızma Testi) yardımcı aracıdır.

## Proje Felsefesi
Mimaride kilit taşı, bir kemeri ayakta tutan en kritik parçadır. Siber güvenlik mimarisinde de ateş duvarları veya karmaşık şifreleme algoritmaları ne kadar güçlü olursa olsun, sistemin en zayıf halkası ve kilit taşı **"Son Kullanıcı Parolasıdır"**. Bu proje, bu savunma hattının direncini profesyonel metriklerle ölçmek için geliştirilmiştir.

##  Öne Çıkan Özellikler

- **Matematiksel Entropi Analizi:** $E = L \times \log_2(R)$ formülü ile parolanın teorik gücünü hesaplar ve modern donanımlara karşı kaba kuvvet (brute-force) dayanım süresini tahmin eder.
- **k-Anonymity ile İhlal Kontrolü:** Kullanıcı parolasını internete sızdırmadan, **SHA-1** hash'leme ve **k-Anonymity** prensibi ile "Have I Been Pwned" API üzerinden 10 milyardan fazla sızdırılmış parola arasında tarama yapar.
- **Akıllı Ceza Algoritması:** - **Sözlük Kontrolü:** Yaygın kullanılan parolaları (Admin, 123456 vb.) tespit eder.
  - **Tekrar Cezası:** Ardışık karakter tekrarlarını (aaaa, 1111) yakalar.
  - **Klavye Desenleri:** Belirli klavye dizilimlerini analiz ederek güvenlik skorunu dinamik olarak günceller.
- **Modern & Karanlık Arayüz:** Siber güvenlik temalı (Cyber-Dark), responsive ve kullanıcı dostu tasarım.

##  Teknik Yığın (Tech Stack)

- **Dil:** Saf JavaScript (Vanilla JS)
- **Kriptografi:** Web Crypto API (Tarayıcı tarafında güvenli hashing)
- **Veri Yönetimi:** Asynchronous Fetch API & JSON tabanlı yerel wordlist
- **CSS Mimari:** Modern CSS Variables & Flexbox

##  Kurulum ve Kullanım

1. Bu depoyu klonlayın:
```bash
git clone [https://github.com/](https://github.com/)[GITHUB_KULLANICI_ADIN]/kilittasi.git