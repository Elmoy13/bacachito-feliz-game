# 🚀 Guía de Deploy - Bacachito Feliz

## Opción 1: Firebase Hosting (Recomendado - Gratis)

### Pasos:

1. **Instalar Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login a Firebase:**
   ```bash
   firebase login
   ```

3. **Construir el proyecto:**
   ```bash
   npm run build
   ```

4. **Desplegar:**
   ```bash
   firebase deploy
   ```

Tu app estará en: `https://qlosino-6f549.web.app`

### Deploy automático (cada vez que hagas cambios):
```bash
npm run build && firebase deploy
```

---

## Opción 2: Vercel (Súper Fácil)

### Pasos:

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login y Deploy:**
   ```bash
   vercel
   ```

3. **Deploy a producción:**
   ```bash
   vercel --prod
   ```

---

## Opción 3: Netlify (También muy fácil)

### Desde su web (sin comandos):

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist` después de hacer `npm run build`
3. ¡Listo!

### Con CLI:

1. **Instalar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build y Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

---

## 🔥 Deploy Rápido (Recomendación)

**Para Firebase Hosting (el más integrado con tu proyecto):**

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Build y Deploy en un solo comando
npm run build && firebase deploy

# Tu sitio estará en:
# https://qlosino-6f549.web.app
# o
# https://qlosino-6f549.firebaseapp.com
```

---

## 📝 Notas Importantes

- Ya están configurados los archivos `firebase.json` y `.firebaserc`
- El proyecto se construye en la carpeta `dist/`
- Firebase Hosting es gratis para tu uso
- Tus datos ya están en Firestore del mismo proyecto
- No necesitas configurar nada más, ¡solo haz deploy!

---

## 🎯 Comando Único (Copy-Paste)

```bash
npm install -g firebase-tools && firebase login && npm run build && firebase deploy
```

Esto instala todo, te loguea, construye y despliega tu app. ✨
