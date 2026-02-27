-- Categorias para anúncios.
CREATE TABLE category (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category_slug ON category (slug);

ALTER TABLE listing
    ADD COLUMN category_id UUID REFERENCES category(id) ON DELETE SET NULL;

CREATE INDEX idx_listing_category_id ON listing (category_id);

COMMENT ON TABLE category IS 'Categorias de anúncios (Feature 4)';
