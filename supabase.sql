-- ================================================
-- MCU Timeline — Supabase Table Setup
-- Exécuter ce script dans l'éditeur SQL de Supabase
-- ================================================

-- Créer la table watch_status
CREATE TABLE IF NOT EXISTS watch_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unwatched'
    CHECK (status IN ('unwatched', 'watching', 'watched')),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Contrainte d'unicité pour l'upsert
  UNIQUE (session_id, entry_id)
);

-- Index pour les requêtes par session
CREATE INDEX IF NOT EXISTS idx_watch_status_session
  ON watch_status (session_id);

-- Activer Row Level Security
ALTER TABLE watch_status ENABLE ROW LEVEL SECURITY;

-- Politique : chaque session ne peut voir/modifier que ses propres données
CREATE POLICY "Users can manage their own watch status"
  ON watch_status
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Note : pour un usage anonyme avec session_id, on autorise tout.
-- Si vous ajoutez l'auth Supabase plus tard, remplacez les politiques par :
--   USING (auth.uid()::text = session_id)
--   WITH CHECK (auth.uid()::text = session_id)
