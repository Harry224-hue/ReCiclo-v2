# ReCiclo v2.0 ♻️

[![Compilar y Validar ReCiclo Web](https://github.com/Harry224-hue/ReCiclo-v2/actions/workflows/build.yml/badge.svg)](https://github.com/Harry224-hue/ReCiclo-v2/actions/workflows/build.yml)

> **ReCiclo — Visión Inteligente para Reciclaje en el IT Morelia**  
> Aplicación web progresiva multiplataforma con IA para reconocimiento y clasificación automatizada de residuos sólidos.

---

## 🚀 Novedades de la Versión 2.0

- **Arquitectura Web Pura:** Eliminada la dependencia pesada de contenedores nativos (Android/Capacitor y Windows/Electron), operando con estándares web modernos (`MediaDevices API`, `ServiceWorker`, interfaces fluidas con Framer Motion).
- **Integración Continua (CI):** Pipeline automatizado con **GitHub Actions** para comprobación de linting y compilación en cada cambio.
- **Rendimiento Mejorado:** Cargas dinámicas con `React.lazy`, optimización de bundle con Vite y Tailwind CSS v4.

---

## 🛠️ Tecnologías Principales

- **Frontend:** React 19 + TypeScript + Vite
- **Estilos:** Tailwind CSS v4 + Framer Motion + Lenis Smooth Scroll
- **Visión por Computadora / IA:** TensorFlow.js MobileNet + Google Gemini Vision API
- **Backend / Datos:** Firebase Authentication & Cloud Firestore
- **Mapas:** Leaflet / OpenStreetMap

---

## 💻 Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build

# 4. Validar linter
npm run lint
```
