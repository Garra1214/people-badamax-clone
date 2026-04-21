# People & DO — App de Gestión de Personas

Aplicación de gestión de personas para el área de People & Desarrollo Organizacional.  
Funciona como bitácora persistente: todos los datos se guardan en el navegador (localStorage).

## 📦 Módulos

| Módulo | Descripción |
|--------|-------------|
| 📊 Dashboard | Métricas de avance por sistema y responsable |
| 🗂️ Sistemas | Gestión del ciclo de vida del colaborador (Employee Journey) |
| ⚡ Flujos | Creación y gestión de flujos de proceso |
| 🏪 Visitas a Tienda | Informes de visita con registro de equipo |
| 🎯 Nine Box | Evaluación de talento por desempeño × potencial |

---

## 🚀 Deploy en Vercel (recomendado)

### Paso 1: Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit - People DO App"
git remote add origin https://github.com/TU_USUARIO/people-do-app.git
git push -u origin main
```

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `people-do-app`
4. Vercel detecta automáticamente que es un proyecto Vite
5. Haz clic en **Deploy** ✅

¡Listo! Tu app quedará disponible en `https://people-do-app.vercel.app` (o el nombre que elijas).

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

---

## 💾 Persistencia de Datos

Los datos se guardan en `localStorage` del navegador con el prefijo `people_do_`.  
Esto significa que:
- ✅ Los datos persisten entre sesiones en el mismo navegador/dispositivo
- ✅ No requiere base de datos ni servidor backend
- ⚠️ Los datos son por navegador — no se sincronizan entre dispositivos distintos

### Keys de localStorage utilizadas:
- `people_do_subsystems` — Estado de todos los subsistemas
- `people_do_flows` — Flujos de proceso creados
- `people_do_store-visits` — Informes de visita a tienda
- `people_do_ninebox` — Evaluaciones Nine Box

---

## 🧩 Nine Box — Cuestionario

**Desempeño** (3 preguntas, escala 1-5):
1. Cumple metas y KPIs de su tienda
2. Mantiene operación ordenada (estándares, stock, ejecución)
3. Logra resultados a través de su equipo (no solo él/ella)

**Potencial** (3 preguntas, escala 1-5):
1. Aprende rápido y mejora con feedback
2. Toma buenas decisiones sin supervisión
3. Podría manejar una tienda más grande o compleja

**Filtro Obligatorio:** ¿Volverías a contratar a esta persona? (Sí / No)

### Categorización:
| Puntaje Promedio | Nivel |
|------------------|-------|
| 1.00 – 2.33 | Bajo |
| 2.34 – 3.67 | Medio |
| 3.68 – 5.00 | Alto |

---

## 📁 Estructura del Proyecto

```
people-do-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx          # Componente raíz + navegación
    ├── data.js          # Constantes (lifecycle, nine-box, etc.)
    ├── storage.js       # Helpers de localStorage
    └── components/
        ├── shared.jsx         # Badge, ProgressBar, StarRating
        ├── Dashboard.jsx      # Vista de métricas
        ├── SistemasTab.jsx    # Employee Journey
        ├── SubsystemModal.jsx # Modal de edición
        ├── FlowsTab.jsx       # Flujos de proceso
        ├── StoreVisitsTab.jsx # Informes de tienda
        └── NineBoxTab.jsx     # Evaluación 9-box
```
