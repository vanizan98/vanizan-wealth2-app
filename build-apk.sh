#!/bin/bash
# ============================================
# 💎 گرداب ثروت ونیزان - اسکریپت ساخت APK
# vanizan.com
# ============================================

echo "💎 شروع ساخت APK گرداب ثروت ونیزان..."
echo ""

# رنگ‌ها
GOLD='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# گام ۱: ساخت نسخه وب
echo -e "${GOLD}[۱/۴] ساخت نسخه وب (npm run build)...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo "❌ خطا در ساخت نسخه وب"
  exit 1
fi
echo -e "${GREEN}✅ نسخه وب ساخته شد${NC}"
echo ""

# گام ۲: بررسی نصب Capacitor
echo -e "${GOLD}[۲/۴] بررسی Capacitor...${NC}"
if [ ! -d "node_modules/@capacitor/core" ]; then
  echo "نصب Capacitor..."
  npm install @capacitor/core @capacitor/cli @capacitor/android
fi
echo -e "${GREEN}✅ Capacitor آماده است${NC}"
echo ""

# گام ۳: افزودن/همگام‌سازی پلتفرم اندروید
echo -e "${GOLD}[۳/۴] همگام‌سازی پلتفرم اندروید...${NC}"
if [ ! -d "android" ]; then
  npx cap add android
fi
npx cap sync android
echo -e "${GREEN}✅ پلتفرم اندروید همگام شد${NC}"
echo ""

# گام ۴: ساخت APK
echo -e "${GOLD}[۴/۴] ساخت فایل APK...${NC}"
cd android
./gradlew assembleDebug
cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ APK با موفقیت ساخته شد!${NC}"
echo -e "${GREEN}📁 مسیر: android/app/build/outputs/apk/debug/app-debug.apk${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "💎 برای نصب: فایل APK را در گوشی اندروید باز کنید"
echo "🌐 vanizan.com"
