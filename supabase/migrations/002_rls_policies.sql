-- Pulse Heart Share (Nabız) - Satır Seviyesi Güvenlik (RLS) Politikaları
-- Tüm tablolarda RLS'i etkinleştir ve politikaları tanımla

-- =============================================================================
-- PROFILES RLS
-- =============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Herkes profilleri okuyabilir (adikey paylaşımlar için)
CREATE POLICY "Profiller herkese açık okuma"
    ON profiles FOR SELECT
    USING (true);

-- Kullanıcılar sadece kendi profillerini güncelleyebilir
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Yeni kullanıcı kaydı için insert (trigger ile otomatik oluşturulur)
CREATE POLICY "Kullanıcılar sadece kendi profillerini oluşturabilir"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================================================
-- STATUSES RLS
-- =============================================================================
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;

-- Herkes herkese açık durumları görebilir
CREATE POLICY "Herkes herkese açık durumları görebilir"
    ON statuses FOR SELECT
    USING (
        privacy = 'everyone'
        OR user_id = auth.uid()
    );

-- Arkadaşlar sadece arkadaşlara açık durumları görebilir
-- (Bu politika circles tablosuyla ilişkilendirilebilir)
CREATE POLICY "Arkadaşlara açık durumlar"
    ON statuses FOR SELECT
    USING (
        privacy IN ('friends', 'close_friends')
        AND (
            user_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM circles
                WHERE owner_id = user_id
                AND member_id = auth.uid()
            )
        )
    );

-- Yakın arkadaşlara sadece yakın arkadaşlar görebilir
CREATE POLICY "Yakın arkadaşlara açık durumlar"
    ON statuses FOR SELECT
    USING (
        privacy = 'close_friends'
        AND (
            user_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM circles
                WHERE owner_id = user_id
                AND member_id = auth.uid()
                AND circle_type = 'close_friend'
            )
        )
    );

-- Kullanıcılar sadece kendi durumlarını oluşturabilir
CREATE POLICY "Kullanıcılar kendi durumlarını oluşturabilir"
    ON statuses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi durumlarını güncelleyebilir
CREATE POLICY "Kullanıcılar kendi durumlarını güncelleyebilir"
    ON statuses FOR UPDATE
    USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi durumlarını silebilir
CREATE POLICY "Kullanıcılar kendi durumlarını silebilir"
    ON statuses FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================================
-- CIRCLES RLS
-- =============================================================================
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi çevrelerini görebilir
CREATE POLICY "Kullanıcılar kendi çevrelerini görebilir"
    ON circles FOR SELECT
    USING (
        auth.uid() = owner_id
        OR auth.uid() = member_id
    );

-- Kullanıcılar çevre oluşturabilir
CREATE POLICY "Kullanıcılar çevre oluşturabilir"
    ON circles FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Kullanıcılar kendi çevrelerini silebilir
CREATE POLICY "Kullanıcılar kendi çevrelerini silebilir"
    ON circles FOR DELETE
    USING (auth.uid() = owner_id);

-- =============================================================================
-- REACTIONS RLS
-- =============================================================================
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Herkes tepkileri görebilir
CREATE POLICY "Herkes tepkileri görebilir"
    ON reactions FOR SELECT
    USING (true);

-- Kullanıcılar tepki oluşturabilir
CREATE POLICY "Kullanıcılar tepki oluşturabilir"
    ON reactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi tepkilerini silebilir
CREATE POLICY "Kullanıcılar kendi tepkilerini silebilir"
    ON reactions FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================================
-- NUDGES RLS
-- =============================================================================
ALTER TABLE nudges ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi gönderdikleri ve aldıkları nudgeleri görebilir
CREATE POLICY "Kullanıcılar nudge'lerini görebilir"
    ON nudges FOR SELECT
    USING (
        auth.uid() = sender_id
        OR auth.uid() = receiver_id
    );

-- Kullanıcılar nudge gönderebilir
CREATE POLICY "Kullanıcılar nudge gönderebilir"
    ON nudges FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- =============================================================================
-- EMERGENCY ALERTS RLS
-- =============================================================================
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi acil durum uyarılarını görebilir
CREATE POLICY "Kullanıcılar kendi acil durumlarını görebilir"
    ON emergency_alerts FOR SELECT
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM emergency_contacts
            WHERE emergency_contacts.user_id = emergency_alerts.user_id
            AND emergency_contacts.contact_user_id = auth.uid()
        )
    );

-- Kullanıcılar kendi acil durum uyarılarını oluşturabilir
CREATE POLICY "Kullanıcılar acil durum oluşturabilir"
    ON emergency_alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi acil durumlarını güncelleyebilir
CREATE POLICY "Kullanıcılar kendi acil durumlarını güncelleyebilir"
    ON emergency_alerts FOR UPDATE
    USING (auth.uid() = user_id);

-- =============================================================================
-- EMERGENCY CONTACTS RLS
-- =============================================================================
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi acil durum kişilerini görebilir
CREATE POLICY "Kullanıcılar kendi acil kişilerini görebilir"
    ON emergency_contacts FOR SELECT
    USING (auth.uid() = user_id);

-- Kullanıcılar kendi acil durum kişilerini oluşturabilir
CREATE POLICY "Kullanıcılar acil kişiler oluşturabilir"
    ON emergency_contacts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi acil durum kişilerini güncelleyebilir
CREATE POLICY "Kullanıcılar acil kişilerini güncelleyebilir"
    ON emergency_contacts FOR UPDATE
    USING (auth.uid() = user_id);

-- Kullanıcılar kendi acil durum kişilerini silebilir
CREATE POLICY "Kullanıcılar acil kişilerini silebilir"
    ON emergency_contacts FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================================
-- NOTIFICATIONS RLS
-- =============================================================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi bildirimlerini görebilir
CREATE POLICY "Kullanıcılar kendi bildirimlerini görebilir"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Sistem bildirimleri oluşturabilir (Security Definer fonksiyon ile)
CREATE POLICY "Sistem bildirimleri oluşturabilir"
    ON notifications FOR INSERT
    WITH CHECK (true);

-- Kullanıcılar kendi bildirimlerini güncelleyebilir (okundu olarak işaretleme)
CREATE POLICY "Kullanıcılar bildirimlerini güncelleyebilir"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Kullanıcılar kendi bildirimlerini silebilir
CREATE POLICY "Kullanıcılar bildirimlerini silebilir"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);
