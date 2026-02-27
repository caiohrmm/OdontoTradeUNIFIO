-- Anúncios (listings) e imagens (apenas URLs).
CREATE TABLE listing (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    price       DECIMAL(12, 2),
    status      VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listing_user_id ON listing (user_id);
CREATE INDEX idx_listing_status ON listing (status);
CREATE INDEX idx_listing_created_at ON listing (created_at DESC);

CREATE TABLE listing_image (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
    url        VARCHAR(2048) NOT NULL,
    position   INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_listing_image_listing_id ON listing_image (listing_id);

COMMENT ON TABLE listing IS 'Anúncios do sistema (CRUD + filtros)';
COMMENT ON COLUMN listing.status IS 'ACTIVE, SOLD, RESERVED';
COMMENT ON TABLE listing_image IS 'URLs de imagens do anúncio (upload em fase futura)';
