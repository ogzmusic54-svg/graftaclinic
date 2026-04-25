# Grafta Clinic — Web Sitesi

Next.js 15 + TypeScript + Tailwind CSS v4 + next-intl ile hazırlanmış,
TR / EN / DE çok dilli, SEO uyumlu klinik sitesi.

## Hızlı Başlangıç

```bash
npm install      # Bağımlılıkları kur (zaten yapıldı)
npm run dev      # Geliştirme sunucusu — http://localhost:3000
npm run build    # Üretim derlemesi
npm run start    # Üretim sunucusu
```

Site, `/` üzerine geldiğinizde otomatik olarak varsayılan dile (`/tr`) yönlenir.

## Doldurulması Gerekenler

### 1) Klinik bilgileri — `src/config/site.ts`

Bu tek dosyada **telefon, WhatsApp, e-posta, adres, sosyal medya** ve
**Google Maps embed** alanları var. Buraya yazdığınız her şey otomatik olarak
header, footer, iletişim sayfası ve schema.org meta verisinde kullanılır.

### 2) Görseller — `public/images/`

Aşağıdaki dosyaları yerleştirin (eksik olanlar yerine `placeholder.svg` görünür):

| Dosya | Boyut (öneri) | Nereye düşer |
|---|---|---|
| `logo.svg` (veya `.png`) | 320×80 | Header & footer |
| `hero.jpg` | 1920×1080 | Anasayfa hero arka plan |
| `og-cover.jpg` | 1200×630 | Sosyal medya paylaşım kartı |
| `clinic-interior.jpg` | 1600×1100 | Hakkımızda hero |
| `clinic-team.jpg` | 1200×1500 | Hakkımızda hikâye bölümü |
| `doctors/doctor-1.jpg` … `doctor-3.jpg` | 800×1000 | Doktor kartları |
| `services/<slug>.jpg` | 1200×900 | Hizmet kartları (10 dosya) |
| `services/hair-transplant-hero.jpg` | 1920×1080 | Saç ekimi hero (opsiyonel) |

Slug listesi: `hair-transplant`, `beard-transplant`, `eyebrow-transplant`,
`alopecia`, `prp`, `mesotherapy`, `fillers-botox`, `youth-vaccine`,
`rhinoplasty`, `breast-aesthetics`.

### 3) Favicon

`src/app/` altına `favicon.ico` (32×32 önerilir) ekleyin. İsterseniz
`apple-touch-icon.png` (180×180) da ekleyebilirsiniz.

### 4) Domain — `src/config/site.ts`

`url` alanını gerçek üretim domaininizle (ör. `https://www.graftaclinic.com`)
değiştirin. Sitemap, hreflang ve OpenGraph URL'leri buradan üretilir.

## Çeviri Düzenleme

İçerik metinleri `messages/tr.json`, `messages/en.json`, `messages/de.json`
içinde. Yapı her dilde aynıdır; bir anahtarı değiştirirseniz üç dosyada da
değiştirin.

Yeni dil eklemek için:
1. `messages/<locale>.json` oluşturun
2. `src/i18n/routing.ts` içindeki `locales` dizisine ekleyin
3. `src/components/LanguageSwitcher.tsx` içindeki etiket sözlüklerine ekleyin

## Hizmet Eklemek/Çıkarmak

- `src/config/services.ts` içine slug + kategori + görsel yolu ekleyin
- 3 dilin de `messages/<lang>.json` dosyasında `services.<slug>` bloğunu
  doldurun (title, shortDescription, metaTitle, metaDescription, heroTitle,
  heroSubtitle, description, benefits[], process[], faq[])

## Yayına Alma (Vercel)

1. Bu klasörü bir GitHub reposuna yükleyin
2. Vercel'de "New Project" → repoyu içe aktarın
3. Framework otomatik algılanır, ek ayar gerekmez
4. Domain bağlayın → `src/config/site.ts` içindeki `url` alanını güncelleyin

## Performans / SEO Notları

- Tüm sayfalar statik üretilir (SSG) — Vercel CDN'den anında servis edilir
- `sitemap.xml` ve `robots.txt` otomatik oluşturulur (`/sitemap.xml`, `/robots.txt`)
- Her sayfa için locale-aware `title`, `description`, OpenGraph ve hreflang etiketleri
- Hizmet sayfalarında `MedicalProcedure` ve `FAQPage` JSON-LD schema'sı
- Anasayfada `MedicalBusiness` schema'sı

## Lisanslar

İçerik © Grafta Clinic. Site mimarisi MIT.
