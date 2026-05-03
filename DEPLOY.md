# Deploy: People Control Tower en Vercel

## Requisitos previos
- Cuenta en [supabase.com](https://supabase.com)
- Cuenta en [vercel.com](https://vercel.com)
- Cuenta en [platform.openai.com](https://platform.openai.com)

---

## 1. Configurar Supabase

### 1.1 Crear proyecto
1. Ve a [app.supabase.com](https://app.supabase.com) y crea un nuevo proyecto
2. Espera a que se inicialice (~2 min)

### 1.2 Ejecutar el SQL
1. Ve a **SQL Editor** en el panel izquierdo
2. Pega el contenido completo de `supabase/schema.sql`
3. Haz clic en **Run** — debe completarse sin errores

### 1.3 Crear usuarios
1. Ve a **Authentication > Users > Add user**
2. Crea `admin@badamax.cl` con una contraseña segura
3. Crea `visita@badamax.cl` con una contraseña segura

> El trigger en el schema asigna automáticamente `role: admin` al email `admin@badamax.cl` y `role: viewer` a los demás.

### 1.4 Obtener credenciales
1. Ve a **Project Settings > API**
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Obtener OpenAI API Key

1. Ve a [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crea una nueva clave → `OPENAI_API_KEY`
3. Asegúrate de tener créditos activos (Whisper + GPT-4o mini son muy económicos)

---

## 3. Ejecutar localmente

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus valores reales

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:3000
```

---

## 4. Deploy en Vercel

### Opción A: desde GitHub (recomendado)

1. Sube el proyecto a un repositorio GitHub
2. Ve a [vercel.com/new](https://vercel.com/new) e importa el repositorio
3. En la sección **Environment Variables**, agrega:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` |
| `OPENAI_API_KEY` | `sk-proj-...` |

4. Haz clic en **Deploy**

### Opción B: desde la CLI de Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
# El CLI te pedirá las variables de entorno
```

---

## 5. Verificar el deploy

1. Abre la URL de Vercel que te dio el deploy
2. Inicia sesión con `admin@badamax.cl`
3. Verifica que se ven las 6 tarjetas de subsistemas
4. Prueba el botón **🎤 Grabar actualización** en cualquier tarjeta
5. Inicia sesión con `visita@badamax.cl` y verifica que NO aparecen botones de edición

---

## Variables de entorno

```env
# Requeridas
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...
```

> `NEXT_PUBLIC_` es necesario para que Supabase funcione en el cliente (browser).
> `OPENAI_API_KEY` NO lleva el prefijo `NEXT_PUBLIC_` — es solo server-side.

---

## Agregar más usuarios con rol admin

```sql
-- Ejecutar en Supabase SQL Editor
UPDATE public.users
SET role = 'admin'
WHERE email = 'nuevo@badamax.cl';
```

---

## Solución de problemas comunes

| Error | Causa | Solución |
|---|---|---|
| "No autorizado" en login | Usuario no creado en Supabase Auth | Crear el usuario en Authentication > Users |
| Cards vacías | SQL no ejecutado | Ejecutar `supabase/schema.sql` en SQL Editor |
| Error en grabación | OpenAI key inválida o sin créditos | Verificar key en platform.openai.com |
| RLS error al editar | Usuario no tiene role=admin en tabla users | Verificar que el trigger se ejecutó correctamente |
