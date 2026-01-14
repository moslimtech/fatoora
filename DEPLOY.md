# تعليمات رفع التطبيق على Vercel

## ربط Vercel مع GitHub

### الطريقة 1: من Vercel Dashboard (الأسهل)

1. **اذهب إلى [vercel.com](https://vercel.com)**
2. **سجل دخول بـ GitHub**
   - اضغط "Sign Up" أو "Log In"
   - اختر "Continue with GitHub"
   - سجل دخول بحساب GitHub الخاص بك

3. **أنشئ مشروع جديد**
   - اضغط "Add New..." > "Project"
   - اختر مستودع `moslimtech/fatoora`
   - إذا لم يظهر، اضغط "Adjust GitHub App Permissions" واختر المستودع

4. **إعدادات المشروع**
   - **Project Name:** `fatoora` (أو أي اسم تريده)
   - **Framework Preset:** Other (أو Static Site)
   - **Root Directory:** `./` (افتراضي)
   - **Build Command:** اتركه فارغاً (لا يوجد build)
   - **Output Directory:** اتركه فارغاً

5. **Environment Variables (اختياري)**
   - لا حاجة لإضافة متغيرات في الوقت الحالي

6. **اضغط "Deploy"**
   - Vercel سيرفع الملفات تلقائياً
   - ستحصل على رابط مثل: `https://fatoora.vercel.app`

### الطريقة 2: من سطر الأوامر

```bash
# 1. ثبت Vercel CLI
npm i -g vercel

# 2. سجل دخول
vercel login

# 3. ارفع المشروع
cd /home/zero/Desktop/metools
vercel

# 4. اتبع التعليمات:
# - Set up and deploy? Y
# - Which scope? اختر حسابك
# - Link to existing project? N (للمرة الأولى)
# - Project name? fatoora
# - Directory? ./
```

### الطريقة 3: ربط Vercel مع GitHub (للتحديث التلقائي)

بعد الرفع الأولي من Vercel Dashboard:

1. **في Vercel Dashboard:**
   - اذهب إلى Settings > Git
   - تأكد من أن المستودع مربوط
   - كل push على GitHub سيحدث التطبيق تلقائياً

2. **في GitHub (اختياري - لإضافة Environment):**
   - اذهب إلى Settings > Environments
   - اضغط "New environment"
   - اسمه: `vercel`
   - يمكنك إضافة protection rules إذا أردت

## بعد الرفع

✅ التطبيق سيكون متاح على: `https://fatoora.vercel.app`  
✅ Service Worker سيعمل (HTTPS متوفر)  
✅ PWA سيعمل بشكل كامل  
✅ يمكن تثبيت التطبيق على الموبايل  

## تحديث التطبيق

بعد ربط Vercel مع GitHub:
- كل مرة ترفع تغييرات على GitHub (`git push`)
- Vercel سيحدث التطبيق تلقائياً خلال دقائق

## ملاحظات

- Vercel مجاني للمشاريع الشخصية
- HTTPS تلقائياً (مطلوب للـ Service Worker)
- CDN عالمي (سرعة عالية)
- تحديث تلقائي عند الـ push
