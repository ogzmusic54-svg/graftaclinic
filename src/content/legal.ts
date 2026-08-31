import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

/**
 * Hukuki sayfa içerikleri (Impressum + Datenschutzerklärung).
 *
 * NEDEN messages/*.json DEĞİL: Bu metinler çeviri akışının parçası değil,
 * hukuki belge. Avukat düzeltmesi geldiğinde tek dosyada, paragraf paragraf
 * güncellenmeleri gerekir; JSON içinde satır satır kaçışlanmış hâlde bakımı
 * hataya açık. Ayrıca bölüm başlıkları diller arasında bilerek birebir
 * eşleşmiyor (Alman pazarı için DE sürümü daha ayrıntılı).
 *
 * ⚠️ ADRES: Künye için sokak/kapı no ve posta kodu zorunludur.
 * `siteConfig.contact.address` içindeki `street` ve `postalCode` alanları
 * müşteriden gelince doldurulacak; buradaki metinler otomatik güncellenir.
 *
 * ⚠️ Bu metinler NEVVMEDIA tarafından hazırlanan TASLAKTIR; avukat onayından
 * sonra kesinleşir. Onaylı sürüm geldiğinde bu dosya değiştirilir.
 */

export type Bolum = { baslik: string; paragraflar: string[] };
export type HukukSayfasi = {
  baslik: string;
  aciklama: string;
  guncelleme: string;
  bolumler: Bolum[];
};

const a = siteConfig.contact.address;
// Aynı değer birden çok alanda olabiliyor (street === district gibi);
// tekrarı ayıkla ki künyede "Eyüpsultan, Eyüpsultan" çıkmasın.
const adresSatiri = [...new Set(
  [a.street, a.postalCode, a.district, a.city, a.country].filter(Boolean),
)].join(", ");

const eposta = siteConfig.contact.email;
const telefon = siteConfig.contact.phone;

/** Son güncelleme — metin değiştikçe elle güncellenir. */
const TARIH = "2026-08-31";

export const impressum: Record<Locale, HukukSayfasi> = {
  de: {
    baslik: "Impressum",
    aciklama: "Anbieterkennzeichnung gemäß § 5 DDG.",
    guncelleme: TARIH,
    bolumler: [
      {
        baslik: "Anbieter",
        paragraflar: [
          `${siteConfig.brand.legalName}`,
          adresSatiri,
          `E-Mail: ${eposta}`,
          `Telefon: ${telefon}`,
        ],
      },
      {
        baslik: "Vertreter in der Europäischen Union",
        paragraflar: [
          "Ein Vertreter in der Europäischen Union wird derzeit benannt. " +
            "Bis zur Eintragung erreichen Sie uns unmittelbar unter den oben " +
            "genannten Kontaktdaten.",
        ],
      },
      {
        baslik: "Berufsrechtliche Angaben",
        paragraflar: [
          "Die Klinik erbringt ihre Leistungen in der Republik Türkei und " +
            "unterliegt den dortigen berufsrechtlichen Vorschriften des " +
            "Gesundheitsministeriums (T.C. Sağlık Bakanlığı).",
          "Ärztliche Leitung und Zulassungsangaben werden auf Anfrage " +
            "unter " + eposta + " mitgeteilt.",
        ],
      },
      {
        baslik: "Verantwortlich für den Inhalt",
        paragraflar: [`${siteConfig.brand.legalName}, ${adresSatiri}`],
      },
      {
        baslik: "Haftung für Inhalte",
        paragraflar: [
          "Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. " +
            "Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte " +
            "können wir jedoch keine Gewähr übernehmen.",
          "Die Informationen auf dieser Website dienen ausschließlich der " +
            "allgemeinen Information und ersetzen keine ärztliche Beratung, " +
            "Diagnose oder Behandlung. Ergebnisse medizinischer Behandlungen " +
            "sind individuell verschieden und können nicht zugesichert werden.",
        ],
      },
      {
        baslik: "Haftung für Links",
        paragraflar: [
          "Unser Angebot enthält Links zu externen Websites Dritter, auf " +
            "deren Inhalte wir keinen Einfluss haben. Für die Inhalte der " +
            "verlinkten Seiten ist stets der jeweilige Anbieter " +
            "verantwortlich.",
        ],
      },
      {
        baslik: "Urheberrecht",
        paragraflar: [
          "Die auf dieser Website veröffentlichten Inhalte, Texte und Bilder " +
            "sind urheberrechtlich geschützt. Jede Verwertung außerhalb der " +
            "gesetzlich zugelassenen Fälle bedarf der vorherigen schriftlichen " +
            "Zustimmung.",
        ],
      },
      {
        baslik: "Streitbeilegung",
        paragraflar: [
          "Wir sind nicht bereit und nicht verpflichtet, an " +
            "Streitbeilegungsverfahren vor einer " +
            "Verbraucherschlichtungsstelle teilzunehmen.",
        ],
      },
    ],
  },

  en: {
    baslik: "Legal Notice",
    aciklama: "Provider identification.",
    guncelleme: TARIH,
    bolumler: [
      {
        baslik: "Provider",
        paragraflar: [
          `${siteConfig.brand.legalName}`,
          adresSatiri,
          `E-mail: ${eposta}`,
          `Phone: ${telefon}`,
        ],
      },
      {
        baslik: "Professional information",
        paragraflar: [
          "The clinic provides its services in the Republic of Türkiye and " +
            "is subject to the professional regulations of the Turkish " +
            "Ministry of Health.",
          `Details of the responsible physician and licensing are available on request at ${eposta}.`,
        ],
      },
      {
        baslik: "Medical disclaimer",
        paragraflar: [
          "The information on this website is for general information only " +
            "and does not replace medical advice, diagnosis or treatment. " +
            "Results of medical treatments vary from person to person and " +
            "cannot be guaranteed.",
        ],
      },
      {
        baslik: "Liability and copyright",
        paragraflar: [
          "Content has been compiled with the greatest care; no guarantee is " +
            "given for accuracy or completeness. We are not responsible for " +
            "the content of external websites we link to.",
          "All content published on this website is protected by copyright.",
        ],
      },
    ],
  },

  tr: {
    baslik: "Künye",
    aciklama: "Hizmet sağlayıcı bilgileri.",
    guncelleme: TARIH,
    bolumler: [
      {
        baslik: "Hizmet sağlayıcı",
        paragraflar: [
          `${siteConfig.brand.legalName}`,
          adresSatiri,
          `E-posta: ${eposta}`,
          `Telefon: ${telefon}`,
        ],
      },
      {
        baslik: "Mesleki bilgiler",
        paragraflar: [
          "Klinik hizmetlerini Türkiye Cumhuriyeti'nde sunmakta ve T.C. " +
            "Sağlık Bakanlığı mevzuatına tabidir.",
          `Sorumlu hekim ve ruhsat bilgileri ${eposta} adresinden talep edilebilir.`,
        ],
      },
      {
        baslik: "Tıbbi bilgilendirme",
        paragraflar: [
          "Bu sitedeki bilgiler yalnızca genel bilgilendirme amaçlıdır; " +
            "hekim muayenesi, teşhis veya tedavinin yerine geçmez. Tıbbi " +
            "işlem sonuçları kişiden kişiye değişir ve garanti edilemez.",
        ],
      },
      {
        baslik: "Sorumluluk ve telif",
        paragraflar: [
          "İçerikler özenle hazırlanmıştır; güncellik ve eksiksizlik " +
            "konusunda garanti verilmez. Bağlantı verilen dış sitelerin " +
            "içeriğinden ilgili sağlayıcı sorumludur.",
          "Sitede yayımlanan tüm içerik telif hakkı ile korunmaktadır.",
        ],
      },
    ],
  },
};

export const datenschutz: Record<Locale, HukukSayfasi> = {
  de: {
    baslik: "Datenschutzerklärung",
    aciklama:
      "Informationen zur Verarbeitung personenbezogener Daten nach Art. 13, 14 DSGVO.",
    guncelleme: TARIH,
    bolumler: [
      {
        baslik: "1. Verantwortlicher",
        paragraflar: [
          `${siteConfig.brand.legalName}, ${adresSatiri}`,
          `E-Mail: ${eposta} · Telefon: ${telefon}`,
        ],
      },
      {
        baslik: "2. Vertreter in der Europäischen Union (Art. 27 DSGVO)",
        paragraflar: [
          "Der Verantwortliche hat seinen Sitz außerhalb der Europäischen " +
            "Union. Ein Vertreter nach Art. 27 DSGVO wird derzeit benannt; " +
            "die Angaben werden hier veröffentlicht, sobald die Benennung " +
            "abgeschlossen ist.",
          `Bis dahin erreichen Sie uns in allen Datenschutzangelegenheiten unter ${eposta}.`,
        ],
      },
      {
        baslik: "3. Kontaktanfragen über das Formular",
        paragraflar: [
          "Verarbeitet werden Name bzw. gewähltes Pseudonym, der von Ihnen " +
            "gewählte Kontaktweg, Ihre Kontaktdaten, Ihre Nachricht sowie " +
            "Datum und Uhrzeit des Eingangs.",
          "Machen Sie freiwillig Angaben zu Ihrer Gesundheit, verarbeiten wir " +
            "diese ausschließlich auf Grundlage Ihrer ausdrücklichen " +
            "Einwilligung nach Art. 9 Abs. 2 lit. a DSGVO. Solche Angaben " +
            "sind nicht erforderlich; Ihre Anfrage wird auch ohne sie " +
            "bearbeitet.",
          "Rechtsgrundlagen: Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines " +
            "Behandlungsverhältnisses) und Art. 6 Abs. 1 lit. a DSGVO " +
            "(Einwilligung).",
        ],
      },
      {
        baslik: "4. Kommunikation über WhatsApp",
        paragraflar: [
          "Kontaktieren Sie uns über WhatsApp, werden Ihre Telefonnummer, Ihr " +
            "Profilname und die Inhalte Ihrer Nachrichten verarbeitet. " +
            "Anbieter ist WhatsApp Ireland Ltd. bzw. Meta Platforms Ireland " +
            "Ltd.; auf die Verarbeitung von Metadaten durch den Anbieter " +
            "haben wir keinen Einfluss.",
          "Für sensible Angaben stehen Ihnen gleichwertig E-Mail und das " +
            "Kontaktformular zur Verfügung. Die Nutzung von WhatsApp ist " +
            "freiwillig.",
        ],
      },
      {
        baslik: "5. Server-Logfiles",
        paragraflar: [
          "Beim Aufruf der Website werden technisch notwendige Daten " +
            "verarbeitet (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, " +
            "Referrer, Browser- und Gerätetyp). Rechtsgrundlage ist Art. 6 " +
            "Abs. 1 lit. f DSGVO (sicherer und störungsfreier Betrieb).",
        ],
      },
      {
        baslik: "6. Meta-Pixel — nur mit Einwilligung",
        paragraflar: [
          "Wir setzen das Meta-Pixel der Meta Platforms Ireland Ltd. ein, um " +
            "die Wirksamkeit unserer Werbeanzeigen zu messen. Das Pixel wird " +
            "erst nach Ihrer ausdrücklichen Einwilligung geladen; ohne " +
            "Einwilligung findet keine Übertragung statt.",
          "Auf Seiten mit besonders sensiblen Inhalten wird das Pixel " +
            "grundsätzlich nicht geladen — auch dann nicht, wenn Sie zuvor " +
            "eingewilligt haben.",
          "Hinsichtlich der Erhebung und Übermittlung der Daten besteht eine " +
            "gemeinsame Verantwortlichkeit nach Art. 26 DSGVO. Eine " +
            "Übermittlung in die USA kann stattfinden. Rechtsgrundlage: " +
            "Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG. Ihre Einwilligung " +
            "können Sie jederzeit mit Wirkung für die Zukunft widerrufen.",
        ],
      },
      {
        baslik: "7. Übermittlung in die Türkei",
        paragraflar: [
          "Ihre Anfragedaten werden an die Klinik in der Türkei übermittelt. " +
            "Für die Türkei liegt kein Angemessenheitsbeschluss der " +
            "Europäischen Kommission vor.",
          "Die Übermittlung erfolgt auf Grundlage Ihrer ausdrücklichen " +
            "Einwilligung (Art. 49 Abs. 1 lit. a DSGVO) bzw. weil sie zur " +
            "Erfüllung eines auf Ihren Wunsch eingeleiteten vorvertraglichen " +
            "Verhältnisses erforderlich ist (Art. 49 Abs. 1 lit. b DSGVO). " +
            "Wir weisen darauf hin, dass dort möglicherweise kein dem " +
            "EU-Recht gleichwertiges Datenschutzniveau besteht.",
        ],
      },
      {
        baslik: "8. Speicherdauer",
        paragraflar: [
          "Wir speichern personenbezogene Daten nur so lange, wie es für die " +
            "genannten Zwecke erforderlich ist oder gesetzliche " +
            "Aufbewahrungspflichten bestehen. Anfragen, die nicht zu einem " +
            "Behandlungsverhältnis führen, werden nach abschließender " +
            "Bearbeitung gelöscht.",
        ],
      },
      {
        baslik: "9. Ihre Rechte",
        paragraflar: [
          "Sie haben das Recht auf Auskunft (Art. 15), Berichtigung " +
            "(Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung " +
            "(Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch " +
            "(Art. 21 DSGVO).",
          "Eine erteilte Einwilligung können Sie jederzeit widerrufen; die " +
            "Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt " +
            "unberührt. Ihnen steht zudem ein Beschwerderecht bei einer " +
            "Aufsichtsbehörde zu (Art. 77 DSGVO).",
          `Zur Ausübung Ihrer Rechte genügt eine Nachricht an ${eposta}.`,
        ],
      },
      {
        baslik: "10. Keine automatisierte Entscheidungsfindung",
        paragraflar: [
          "Eine automatisierte Entscheidungsfindung einschließlich Profiling " +
            "nach Art. 22 DSGVO findet nicht statt.",
        ],
      },
    ],
  },

  en: {
    baslik: "Privacy Policy",
    aciklama: "How we process personal data (GDPR Art. 13, 14).",
    guncelleme: TARIH,
    bolumler: [
      {
        baslik: "1. Controller",
        paragraflar: [
          `${siteConfig.brand.legalName}, ${adresSatiri}`,
          `E-mail: ${eposta} · Phone: ${telefon}`,
        ],
      },
      {
        baslik: "2. EU representative (GDPR Art. 27)",
        paragraflar: [
          "The controller is established outside the European Union. A " +
            "representative under Art. 27 GDPR is currently being appointed; " +
            `until then please contact us at ${eposta}.`,
        ],
      },
      {
        baslik: "3. Contact form",
        paragraflar: [
          "We process your name or chosen pseudonym, preferred contact " +
            "channel, contact details, your message and the time of receipt.",
          "If you voluntarily provide health information, we process it only " +
            "on the basis of your explicit consent (Art. 9(2)(a) GDPR). Such " +
            "details are not required.",
        ],
      },
      {
        baslik: "4. WhatsApp",
        paragraflar: [
          "If you contact us via WhatsApp, your phone number, profile name " +
            "and message content are processed by WhatsApp Ireland Ltd. / " +
            "Meta Platforms Ireland Ltd. E-mail and the contact form are " +
            "offered as equivalent alternatives.",
        ],
      },
      {
        baslik: "5. Meta Pixel — consent only",
        paragraflar: [
          "The Meta Pixel is loaded only after your explicit consent and is " +
            "never loaded on pages with particularly sensitive content, even " +
            "if consent was given. You may withdraw consent at any time.",
        ],
      },
      {
        baslik: "6. Transfer to Türkiye",
        paragraflar: [
          "Your enquiry is transferred to the clinic in Türkiye, for which " +
            "no EU adequacy decision exists. The transfer is based on your " +
            "explicit consent (Art. 49(1)(a) GDPR) or on pre-contractual " +
            "necessity (Art. 49(1)(b) GDPR).",
        ],
      },
      {
        baslik: "7. Your rights",
        paragraflar: [
          "You have the right of access, rectification, erasure, restriction, " +
            "data portability and objection, and the right to lodge a " +
            `complaint with a supervisory authority. Contact: ${eposta}.`,
        ],
      },
    ],
  },

  tr: {
    baslik: "Gizlilik Bildirimi",
    aciklama: "Kişisel verilerin işlenmesine ilişkin bilgilendirme.",
    guncelleme: TARIH,
    bolumler: [
      {
        baslik: "1. Veri sorumlusu",
        paragraflar: [
          `${siteConfig.brand.legalName}, ${adresSatiri}`,
          `E-posta: ${eposta} · Telefon: ${telefon}`,
        ],
      },
      {
        baslik: "2. İşlenen veriler",
        paragraflar: [
          "İletişim formunda ad veya rumuz, tercih ettiğiniz iletişim kanalı, " +
            "iletişim bilgileriniz, mesajınız ve başvuru zamanı işlenir.",
          "Sağlığınıza ilişkin bilgileri paylaşmanız zorunlu değildir; " +
            "paylaşırsanız yalnızca açık rızanıza dayanarak işlenir.",
        ],
      },
      {
        baslik: "3. WhatsApp üzerinden iletişim",
        paragraflar: [
          "WhatsApp ile yazdığınızda telefon numaranız, profil adınız ve " +
            "mesaj içerikleriniz WhatsApp Ireland Ltd. / Meta Platforms " +
            "Ireland Ltd. tarafından da işlenir. E-posta ve form eşdeğer " +
            "alternatif olarak sunulmaktadır.",
        ],
      },
      {
        baslik: "4. Ölçümleme (Meta Pixel)",
        paragraflar: [
          "Reklam ölçümü için kullanılan Meta Pixel yalnızca açık rızanızdan " +
            "sonra yüklenir; hassas içerikli sayfalarda rıza verilmiş olsa " +
            "bile yüklenmez. Rızanızı dilediğiniz zaman geri alabilirsiniz.",
        ],
      },
      {
        baslik: "5. Haklarınız",
        paragraflar: [
          "Verilerinize erişme, düzeltme, silme, işlemenin sınırlandırılmasını " +
            "isteme, veri taşınabilirliği ve itiraz haklarına sahipsiniz. " +
            `Başvuru: ${eposta}`,
        ],
      },
    ],
  },
};
