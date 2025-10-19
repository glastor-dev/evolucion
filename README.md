# Shadcn/UI Landing Page Template

## <a href="https://ui.shadcn.com/" target="_blank">ShadcnUI</a> + <a href="https://react.dev/" target="_blank">React</a> + <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> + <a href="https://tailwindcss.com/" target="_blank">Tailwind</a>.

![shadch-landing-page](https://github.com/leoMirandaa/shadcn-landing-page/assets/61714687/3ba7b51f-9589-4541-800a-5ab7cecad1b5)

Build your React landing page effortlessly with the required sections to your project. <a href="https://shadcn-landing-page.vercel.app/" target="_blank">Live Demo</a>

## Sections

- [x] Navbar
- [x] Sidebar(mobile)
- [x] Hero
- [x] Sponsors
- [x] About
- [x] Stats
- [x] How It Works
- [x] Features
- [x] Services
- [x] Call-to-Action (CTA)
- [x] Testimonials
- [x] Team
- [x] Pricing
- [x] Newsletter
- [x] Frequently Asked Questions(FAQ)
- [x] Footer

## Features

- [x] Fully Responsive Design
- [x] User Friendly Navigation
- [x] Dark Mode
- [x] Meta tags

## Configuración de Firebase (Login con Google)

Para habilitar el inicio de sesión con Google en local:

1) Crea `.env.local` en la raíz del proyecto `glastor/` con tus credenciales de Firebase:

```bash
VITE_FIREBASE_API_KEY=tuApiKey
VITE_FIREBASE_AUTH_DOMAIN=tuProyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tuProyectoId
VITE_FIREBASE_APP_ID=1:XXXXXXXXX:web:YYYYYYYYYYYY
```

2) En Firebase Console → Authentication → Sign-in method: habilita Google.

3) En Firebase Console → Authentication → Settings → Authorized domains: agrega `localhost`.

4) Reinicia el servidor de Vite después de guardar `.env.local`.

Notas:
- Si el navegador bloquea el popup, la app usa `signInWithRedirect` como fallback.
- Si ves un toast con “Dominio no autorizado”, asegúrate de agregar `localhost`.
- Si ves “verifica tus variables VITE_FIREBASE_*”, revisa `.env.local` y reinicia.

## How to install

1. Clone this repository:

```bash
git clone https://github.com/leoMirandaa/shadcn-landing-page.git
```

2. Go into project

```bash
cd shadcn-landing-page
```

3. Install dependencies

```bash
npm install
```

4. Run project

```bash
npm run dev
```
