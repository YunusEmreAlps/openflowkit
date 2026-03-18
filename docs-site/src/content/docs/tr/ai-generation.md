---
draft: false
title: AI Generation
---



FlowMind, doğal dili anlayarak yapısal diyagramlara dönüştürmek için Google'ın **Gemini 2.0 Flash** modelinden yararlanır.

## Nasıl Çalışır?

1.  **Niyet Analizi**: Yapay zeka, isteminizi analiz ederek *hedefi* (örn. "Giriş Akışı") ve *aktörleri* (Kullanıcı, Sunucu, Veritabanı) anlar.
2.  **Yapısal Üretim**: Düğümleri ve bağlantıları temsil eden geçerli bir FlowMind DSL JSON nesnesi oluşturur.
3.  **Düzen Optimizasyonu**: Motor, oluşturulan grafiğin okunabilir olmasını sağlamak için akıllı düzen algoritmaları uygular.

## İstemler İçin En İyi Uygulamalar

En iyi sonuçları elde etmek için **adımlar** ve **çıktı** hakkında spesifik olun.

### ❌ Çok Belirsiz
> "Bir sistem diyagramı yap."

### ✅ İyi
> "Bir e-ticaret platformu için üst düzey sistem mimarisi oluştur. Web Uygulaması, API Ağ Geçidi, Kullanıcı Servisi, Ürün Servisi ve ortak bir PostgreSQL veritabanı içersin."

### ✅ Daha İyi (Süreç Akışı)
> "Kullanıcı şifre sıfırlama süreci için bir akış diyagramı çiz. 'Kullanıcı şifremi unuttum'a tıklar' ile başla, e-postanın var olup olmadığını kontrol et. Evet ise benzersiz token gönder. Hayır ise hata göster. 'Kullanıcı yeni şifresini girer' ile bitir."

## Yapay Zeka Sonuçlarını Düzenleme

Yapay zeka üretimi bir başlangıç noktasıdır, son nokta değil. Her zaman şunları yapabilirsiniz:
*   Eksik adımları manuel olarak ekleyin.
*   Netlik için düğümleri yeniden adlandırın.
*   Belirli bölümleri yeniden oluşturun (Yakında).

## 🔑 Kendi Anahtarını Getir (BYOK)

FlowMind varsayılan olarak sınırlı kotaya sahip paylaşımlı bir API anahtarı kullanır. Yoğun kullanım, gizlilik veya kendi faturalandırmanızı kullanmak için kendi **Gemini API Anahtarınızı** getirebilirsiniz.

1.  **Google AI Studio**'ya gidin ve [API Anahtarı Alın](https://aistudio.google.com/app/apikey).
2.  FlowMind'da **Ayarlar**'ı (Dişli Simgesi) açın veya herhangi bir **Marka Kiti**'ne tıklayın.
3.  **Yapay Zeka** sekmesine gidin.
4.  Anahtarınızı güvenli giriş alanına yapıştırın.

> [!NOTE]
> Anahtarınız tarayıcınızın `localStorage` alanında yerel olarak saklanır ve sunucularımıza hiçbir zaman gönderilmez. Yalnızca Google'a yapılan istemci taraflı API çağrıları için kullanılır.
