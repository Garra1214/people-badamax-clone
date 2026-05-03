-- ============================================================
-- People Control Tower — Badamax
-- Ejecuta este SQL completo en Supabase > SQL Editor
-- ============================================================

-- ── 1. TABLAS ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id         UUID  REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT  NOT NULL,
  role       TEXT  NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subsystems (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'green' CHECK (status IN ('green', 'yellow', 'red')),
  kpi         TEXT NOT NULL DEFAULT '',
  alert       TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.updates (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  subsystem_id  TEXT        REFERENCES public.subsystems(id) ON DELETE CASCADE,
  type          TEXT        NOT NULL CHECK (type IN ('problema', 'avance', 'riesgo')),
  title         TEXT        NOT NULL,
  description   TEXT        NOT NULL DEFAULT '',
  impact        TEXT        NOT NULL DEFAULT '',
  priority      TEXT        NOT NULL DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baja')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. ROW LEVEL SECURITY ──────────────────────────────────

ALTER TABLE public.users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subsystems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates    ENABLE ROW LEVEL SECURITY;

-- users: cada uno lee su propio perfil
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- subsystems: cualquier usuario autenticado puede leer
CREATE POLICY "subsystems_select_authenticated"
  ON public.subsystems FOR SELECT
  USING (auth.role() = 'authenticated');

-- subsystems: solo admin puede modificar
CREATE POLICY "subsystems_all_admin"
  ON public.subsystems FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- updates: cualquier usuario autenticado puede leer
CREATE POLICY "updates_select_authenticated"
  ON public.updates FOR SELECT
  USING (auth.role() = 'authenticated');

-- updates: solo admin puede insertar
CREATE POLICY "updates_insert_admin"
  ON public.updates FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- updates: solo admin puede borrar
CREATE POLICY "updates_delete_admin"
  ON public.updates FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ── 3. TRIGGER: crear perfil al registrar usuario ──────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN NEW.email = 'admin@badamax.cl' THEN 'admin'
      ELSE 'viewer'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 4. DATOS INICIALES (subsistemas) ──────────────────────

INSERT INTO public.subsystems (id, name, status, kpi, alert, description)
VALUES
  ('atraccion',   'Atracción',   'green',  '45 postulantes activos',       'Pipeline saludable',             'Gestión del proceso de reclutamiento, selección y employer branding para atraer talento al retail.'),
  ('ingreso',     'Ingreso',     'yellow', '8 ingresos pendientes',        '3 sin completar inducción',      'Onboarding e inducción organizacional para nuevos colaboradores en tiendas.'),
  ('desarrollo',  'Desarrollo',  'green',  '78% cobertura capacitación',   'Plan Q4 en marcha',              'Capacitación, planes de carrera y desarrollo de liderazgo en la red de tiendas.'),
  ('desempeno',   'Desempeño',   'red',    '12 evaluaciones vencidas',     'Proceso atrasado 2 semanas',     'Ciclo de evaluación de desempeño, feedback continuo y gestión de metas.'),
  ('experiencia', 'Experiencia', 'yellow', 'eNPS: +34',                    'Encuesta clima pendiente',       'Bienestar, clima organizacional, beneficios y experiencia general del colaborador.'),
  ('operacion',   'Operación',   'green',  '96% dotación completa',        'Sin alertas críticas',           'Gestión operativa de personas: dotación, turnos, ausencias y cumplimiento normativo.')
ON CONFLICT (id) DO NOTHING;

-- ── FIN ────────────────────────────────────────────────────
-- Recuerda también:
-- 1. En Supabase > Authentication > Providers: habilita Email/Password
-- 2. Crea los usuarios en Authentication > Users:
--    admin@badamax.cl  (contraseña segura)
--    visita@badamax.cl (contraseña segura)
