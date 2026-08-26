-- Pulse Heart Share (Nabız) - İlk Veritabanı Şeması
-- Bu dosya tüm tabloları, indeksleri ve tetikleyicileri oluşturur

-- Gerekli eklentileri etkinleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA extensions;

-- Özel veri türleri (ENUM)
CREATE TYPE circle_type AS ENUM ('close_friend', 'friend', 'acquaintance', 'family');
CREATE TYPE reaction_kind AS ENUM ('heart', 'fire', 'prayer', 'hug', 'wave');
CREATE TYPE privacy_level AS ENUM ('everyone', 'friends', 'close_friends', 'only_me');
CREATE TYPE emergency_status AS ENUM ('active', 'acknowledged', 'resolved', 'cancelled');

-- =============================================================================
-- PROFILES (Kullanıcı Profilleri)
-- =============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Profil indeksleri
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_full_name ON profiles(full_name);

-- Yeni kullanıcı kaydedildiğinde otomatik profil oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Kullanıcı'),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- STATUSES (Durum Paylaşımları)
-- =============================================================================
CREATE TABLE statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status_id TEXT NOT NULL,
    privacy privacy_level DEFAULT 'everyone' NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ
);

-- Status indeksleri
CREATE INDEX idx_statuses_user_id ON statuses(user_id);
CREATE INDEX idx_statuses_created_at ON statuses(created_at DESC);
CREATE INDEX idx_statuses_expires_at ON statuses(expires_at);
CREATE INDEX idx_statuses_status_id ON statuses(status_id);

-- =============================================================================
-- CIRCLES (Sosyal Çevre/Halka)
-- =============================================================================
CREATE TABLE circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    circle_type circle_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(owner_id, member_id, circle_type)
);

-- Circle indeksleri
CREATE INDEX idx_circles_owner_id ON circles(owner_id);
CREATE INDEX idx_circles_member_id ON circles(member_id);
CREATE INDEX idx_circles_circle_type ON circles(circle_type);

-- =============================================================================
-- REACTIONS (Tepkiler)
-- =============================================================================
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status_id UUID NOT NULL REFERENCES statuses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reaction_kind reaction_kind NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(status_id, user_id)
);

-- Reaction indeksleri
CREATE INDEX idx_reactions_status_id ON reactions(status_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);

-- =============================================================================
-- NUDGES (İtme/Bildirim Sinyalleri)
-- =============================================================================
CREATE TABLE nudges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Nudge indeksleri
CREATE INDEX idx_nudges_sender_id ON nudges(sender_id);
CREATE INDEX idx_nudges_receiver_id ON nudges(receiver_id);
CREATE INDEX idx_nudges_created_at ON nudges(created_at DESC);

-- =============================================================================
-- EMERGENCY ALERTS (Acil Durum Uyarıları)
-- =============================================================================
CREATE TABLE emergency_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    message TEXT,
    status emergency_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ
);

-- Emergency alerts indeksleri
CREATE INDEX idx_emergency_alerts_user_id ON emergency_alerts(user_id);
CREATE INDEX idx_emergency_alerts_status ON emergency_alerts(status);
CREATE INDEX idx_emergency_alerts_created_at ON emergency_alerts(created_at DESC);
CREATE INDEX idx_emergency_alerts_location ON emergency_alerts USING GIST(location);

-- =============================================================================
-- EMERGENCY CONTACTS (Acil Durum Kişileri)
-- =============================================================================
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    contact_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    contact_phone TEXT,
    notify_order INT DEFAULT 1 NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL
);

-- Emergency contacts indeksleri
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_emergency_contacts_contact_user_id ON emergency_contacts(contact_user_id);

-- =============================================================================
-- NOTIFICATIONS (Bildirimler)
-- =============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Notifications indeksleri
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- =============================================================================
-- OTOMATİK updated_at TETİKLEYİCİSİ
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ESKİLERI TEMİZLEME FONKSİYONU (Süresi dolan durumlar)
-- =============================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_statuses()
RETURNS void AS $$
BEGIN
    DELETE FROM statuses
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
