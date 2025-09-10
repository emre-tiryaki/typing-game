[İngilizce versiyonu için tıklayın](Readme.en.md) / Click for Turkish version

---

typing-game bir [TypingClub](https://www.typingclub.com) klonudur ve kullanıcılara klavyede yazma hızlarını geliştirmelerini sağlamayı amaçlar. Bu projeyi takım çalışması ve git ile proje geliştirmeyi öğrenmek amacıyla yaptık bu yüzden çok güzel olmayabilir affınıza sığınıyoruz 😇.

---

# Proje linki
https://typing-game-92pq.onrender.com

---

# Proje Görüntüleri

## 1. Ana Sayfa
<img width="1869" height="935" alt="image" src="https://github.com/user-attachments/assets/11b79625-df21-45b0-af7c-5cedbb836cd3" />

## 2. Leveller
<img width="1869" height="935" alt="image" src="https://github.com/user-attachments/assets/5aadb818-d0ab-49e8-a31b-d3ea79c6dd4f" />

## 3. Oynanış
<img width="1869" height="935" alt="image" src="https://github.com/user-attachments/assets/df77519a-05e9-4061-9c44-78f21aee99f6" />

---

# Katkıda Bulunanlar
| <img src="https://github.com/10sinan.png" width="150" height="150" style="border-radius: 50%;" alt="Mehmet Sinan Sönmez"> | <img src="https://github.com/emre-tiryaki.png" width="150" height="150" style="border-radius: 50%;" alt="Emre Tiryaki"> |
|:---:|:---:|
| **Mehmet Sinan Sönmez** | **Emre Tiryaki** |
| Frontend Geliştirici | Backend Geliştirici |
| [<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20" height="20"> GitHub](https://github.com/10sinan) | [<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20" height="20"> GitHub](https://github.com/emre-tiryaki) |

---

## içindekiler
1. [Özellikler](#özellikler)
2. [Teknolojiler](#teknolojiler)
3. [Kurulum](#kurulum)
4. [Yapılacaklar](#yapılacaklar)

---

# Özellikler
projemizin öne çıkan özellikleri burada.
- Projemiz klavye hızını geliştirmek isteyen kullanıcılar için kullanıcı dostu bir arayüz ve öğretici içeriği ile kullanıcılara öğretici bir serüven yaşatır.
- Giriş:
	- Projemiz JWT ile hesap açıp kullanmayı destekler. Böylece kullanıcılar ilerlemelerini kaydedebilirler.
	- Kullanıcılar giriş yapmak yerine sadece denemek için girmek isterlerse misafir olarak giriş yapabilirler. Ancak bu sadece 7 günlük bir oturum açar ve 1 hafta sonrasında kullanıcılar ilerlemelerini kaybederler.
- Kullanım

---

# Teknolojiler
projenin hangi kısmılarında neler kullanıldı gibi ayrıntılar burada.
## **frontend**:
Tamamen [Mehmet Sinan Sönmez](https://github.com/10sinan) tarafından yapılmıştır.

### ***kullanılan teknolojiler***
- **HTML5** → Uygulamanın temel yapısı için.
- **CSS** → Düzen, renkler, tipografi.
- **JavaScript** → Oyun mekanikleri(eklenmedi henüz), etkileşimler, vs.
### *kullanılan kütüphaneler:*
- **LocalStorage** →tema dark/ligth bilgilerşni saklamak için
- **Axios API** → Backend ile iletişim (kullanıcı oturum, skor kaydı).
### ***UI Özellikleri***
- **Tema Seçici (Dark / Light )** → Kişiselleştirilebilir görünüm.
- **İlerleme Çubuğu** → Derslerdeki başarı yüzdesini göstermek.
- **Mobil Uyumluluk** → Responsive tasarım.
## ***backend***
Tamamen [Emre Tiryaki](https://github.com/emre-tiryaki) tarafından yapılmıştır.

Backend JavaScript kullanılarak yazılmıştır.
### ***kullanılan teknolojiler*:**
- **Node.js**: JavaScript ile sunucu tarafı kod yazmak için.
- **Express.js**: Node.js yazmanın daha kolay bir yolu olduğu için.
- **MongoDB**: Kullanıcı ve level verisi tutmak için güzel bir NoSQL veritabanı.
- **JWT**: Kimlik doğrulaması ve hesap güvenliği için mükemmel çözüm.
- **Google 0auth**: Google ile giriş yapmayı desteklemek için birebir.
### ***kullanılan kütüphaneler*:**
- **express**: Express.js kullanmak amacıyla kullanılıyor.
- **dotenv**: Gizli ortam değişkenlerini çekmek için 
- **cookie-parser**: çerezleri kullanmak amacıyla kullanılan bir kütüphane.
- **cors**: istekleri güvenli bir şekilde almak amacıyla kullanılan bir kütüphane.
- **mongoose**: MongoDB veritabanıyla işlem yapabilmek için özel bir kütüphane.
- **bcrypt**: şifreleme için gerekli herşeyi barındıran mükemmel bir kütüphane.
- **jsonwebtoken**: JWT teknolojisi için gerekli kütüphane.
- **google-auth-library**: Google girişi için gerekli kütüphane.

---

# Kurulum
Eğer kodları klonlayıp kullanmak isterseniz yapmanız gereken adımlar:
## 1.  .env dosyasını ayarlamak
projenin düzgün bir şekilde çalışabilmesi için bazı değişkenlere ihtiyacı vardır bunların ayarlanması ile proje çalışır '.env.example.env' dosyasında hangi değişkenlerin ayarlanması gerektiği belirtilmiştir.
## 2.  Modülleri yüklemek
öncelikle backend klasörüne girmelisiniz.
```terminal
cd backend
```
sonrasında modülleri yüklemelisiniz..
```terminal
npm install
```
bunları yaptığınızda proje modülleri yüklenmiş olup ve artık proje kullanıma açık olmaktadır
## 3.  Sunucuyu çalıştırmak
env dosyasını düzenledikten ve modülleri yükledikten sonra server'ı açmak için 2 yol vardır.
### 1. normal başlatmak
normalce server açılır.
```terminal
npm run start
```
veya
```terminal
node server.js
```
### 2. nodemon ile başlatmak
projeyi nodemon ile açar. Geliştirme yapmak için gereklidir.
```terminal
npm run devStart
```
veya
```terminal
nodemon server.js
```
## 4. Proje sitesini açmak
Proje sitesini açmak için ayarladığınız porta göre welcome.html dosyasına girmelisiniz.
```URL
http://localhost:{sizin ayarladığınız port}/html/welcome.html
```
veya sadece localhost adresine gitmeniz yeterlidir otomatik olarak ana sayfaya yönlendirileceksiniz.
```URL
http://localhost:{sizin ayarladığınız port}
```

---

# Yapılacaklar
1. Projemize daha çok level ekleyeceğiz.
2. Projemiz google ile giriş yapmayı dahaca desteklememektedir bunu çözeceğiz.
3. Projemiz facebook ile giriş yapmayı desteklememektedir!!! Daha sonradan ekleriz diye koyup vazgeçtik. Butonu görmezden gelin.
4. kayıt olurken mail adresinize kod gelse bile direkt olarak kod girmek için bir arayüz yoktur. Bunuda ekleyeceğiz 😅
5. Projemizlevel bitirmeyi malesefki desteklememektedir bunu en yakın güncellemede getireceğiz.
