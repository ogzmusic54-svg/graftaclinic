#!/usr/bin/env bash
# Stok görsel indirme — Unsplash photo URL'lerinden public/images altına
# Her görsel için (yol|unsplash-id|genişlik|yükseklik) tanımlanır.
set -u

DEST="C:/Users/nevvm/Desktop/graftaclinic/public/images"
mkdir -p "$DEST/services" "$DEST/doctors"

download() {
  local path="$1"
  local id="$2"
  local w="$3"
  local h="$4"
  local url="https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format&fm=jpg"
  local out="$DEST/$path"
  echo "→ $path"
  if curl -fsSL --max-time 30 -o "$out" "$url"; then
    local size=$(stat -c%s "$out" 2>/dev/null || wc -c < "$out")
    if [ "$size" -lt 5000 ]; then
      echo "  ! file too small ($size bytes), removing"
      rm -f "$out"
    else
      echo "  ✓ $size bytes"
    fi
  else
    echo "  ✗ failed"
  fi
}

# === Anasayfa ve genel ===
download "hero.jpg"             "photo-1612277795421-9bc7706a4a34" 1920 1080
download "og-cover.jpg"         "photo-1576091160550-2173dba999ef" 1200 630
download "clinic-interior.jpg"  "photo-1629909613654-28e377c37b09" 1600 1100
download "clinic-team.jpg"      "photo-1551076805-e1869033e561"   1200 1500

# === Doktorlar ===
download "doctors/doctor-1.jpg" "photo-1622253692010-333f2da6031d" 800 1000
download "doctors/doctor-2.jpg" "photo-1612349317150-e413f6a5b16d" 800 1000
download "doctors/doctor-3.jpg" "photo-1594824476967-48c8b964273f" 800 1000

# === Saç restorasyonu ===
download "services/hair-transplant.jpg"      "photo-1605497788044-5a32c7078486" 1200 900
download "services/hair-transplant-hero.jpg" "photo-1605497788044-5a32c7078486" 1920 1080
download "services/beard-transplant.jpg"     "photo-1521488264427-3e6098066e8e" 1200 900
download "services/eyebrow-transplant.jpg"   "photo-1571781926291-c477ebfd024b" 1200 900

# === Tedaviler ===
download "services/alopecia.jpg"     "photo-1579684385127-1ef15d508118" 1200 900
download "services/prp.jpg"          "photo-1583912267550-62be9beebd47" 1200 900
download "services/mesotherapy.jpg"  "photo-1570172619644-dfd03ed5d881" 1200 900

# === Medikal estetik ===
download "services/fillers-botox.jpg"  "photo-1576091160399-112ba8d25d1d" 1200 900
download "services/youth-vaccine.jpg"  "photo-1487412947147-5cebf100ffc2" 1200 900

# === Plastik cerrahi ===
download "services/rhinoplasty.jpg"        "photo-1573496359142-b8d87734a5a2" 1200 900
download "services/breast-aesthetics.jpg"  "photo-1532926381893-7542290edf1d" 1200 900

echo ""
echo "=== Done ==="
ls -la "$DEST"/*.jpg "$DEST"/services/*.jpg "$DEST"/doctors/*.jpg 2>/dev/null | awk '{print $NF, "(", $5, "bytes)"}'
