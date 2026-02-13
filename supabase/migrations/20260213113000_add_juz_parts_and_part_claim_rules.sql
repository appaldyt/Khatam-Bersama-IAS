/*
  Add part-based claims model.
  - Create juz_parts table
  - Seed parts from one day one juz.docx
  - Migrate claims to reference part_id
  - Update uniqueness rules:
    * One part can be claimed once per campaign+group
    * One participant can claim max one part per juz in a campaign+group
*/

CREATE TABLE IF NOT EXISTS juz_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  juz_number integer NOT NULL CHECK (juz_number >= 1 AND juz_number <= 30),
  part_number integer NOT NULL CHECK (part_number >= 1),
  part_label text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (juz_number, part_number)
);

ALTER TABLE juz_parts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view juz parts" ON juz_parts;
CREATE POLICY "Anyone can view juz parts"
  ON juz_parts FOR SELECT
  USING (true);

INSERT INTO juz_parts (juz_number, part_number, part_label)
VALUES
  (1, 1, 'Al-Fatihah + Al-Baqarah Ayat (1–7 (lanjut), 1-50)'),
  (1, 2, 'Al-Baqarah Ayat (51–100)'),
  (1, 3, 'Al-Baqarah Ayat (101–141)'),
  (2, 1, 'Al-Baqarah Ayat (142–200)'),
  (2, 2, 'Al-Baqarah Ayat (201–252)'),
  (3, 1, 'Al-Baqarah Ayat (253–286)'),
  (3, 2, 'Ali ‘Imran Ayat (1–50)'),
  (3, 3, 'Ali ‘Imran Ayat (51- 92)'),
  (4, 1, 'Ali ‘Imran Ayat (93 - 143)'),
  (4, 2, 'Ali ‘Imran Ayat (143 - 200)'),
  (4, 3, 'An-Nisa (1–23)'),
  (5, 1, 'An-Nisa (24 - 47)'),
  (5, 2, 'An-Nisa (48 - 70)'),
  (5, 3, 'An-Nisa (71 - 116)'),
  (5, 4, 'An-Nisa (117 - 139)'),
  (5, 5, 'An-Nisa (140 - 147)'),
  (6, 1, 'An-Nisa (148 - 176)'),
  (6, 2, 'Al-Ma’idah Ayat (1–30)'),
  (6, 3, 'Al-Ma’idah Ayat (31–60)'),
  (6, 4, 'Al-Ma’idah Ayat (61–81)'),
  (7, 1, 'Al-Ma’idah Ayat (82 - 120)'),
  (7, 2, 'Al-An’am Ayat (1–40)'),
  (7, 3, 'Al-An’am Ayat (41–80)'),
  (7, 4, 'Al-An’am Ayat (81–110)'),
  (8, 1, 'Al-An’am Ayat (111-140)'),
  (8, 2, 'Al-An’am Ayat (141-165)'),
  (8, 3, 'Al-A’raf Ayat (1–35)'),
  (8, 4, 'Al-A’raf Ayat (36–87)'),
  (9, 1, 'Al-A’raf Ayat (88–110)'),
  (9, 2, 'Al-A’raf Ayat (111–150)'),
  (9, 3, 'Al-A’raf Ayat (151-206)'),
  (9, 4, 'Al-Anfal Ayat (1–40)'),
  (10, 1, 'Al-Anfal Ayat (41–75)'),
  (10, 2, 'At-Taubah Ayat (1–30)'),
  (10, 3, 'At-Taubah Ayat (31–60)'),
  (10, 4, 'At-Taubah Ayat (61–92)'),
  (11, 1, 'At-Taubah (93–129)'),
  (11, 2, 'Yunus  Ayat (1–35)'),
  (11, 3, 'Yunus Ayat (36–70)'),
  (11, 4, 'Yunus Ayat (71–109)'),
  (11, 5, 'Hud Ayat (1– 5)'),
  (12, 1, 'Hud Ayat (6–40)'),
  (12, 2, 'Hud Ayat (41–80)'),
  (12, 3, 'Hud Ayat (81–123)'),
  (12, 4, 'Yusuf Ayat  (1–52)'),
  (13, 1, 'Yusuf Ayat  (53 - 111 )'),
  (13, 2, 'Ar-Ra’d (1–43)'),
  (13, 3, 'Ibrahim (1–52)'),
  (14, 1, 'Al-Hijr Ayat (1–33)'),
  (14, 2, 'Al-Hijr Ayat (34–66)'),
  (14, 3, 'Al-Hijr Ayat (67–99)'),
  (14, 4, 'An-Nahl Ayat (1–32)'),
  (14, 5, 'An-Nahl Ayat (33–64)'),
  (14, 6, 'An-Nahl Ayat (65–96)'),
  (14, 7, 'An-Nahl Ayat (97–128)'),
  (15, 1, 'Al-Isra Ayat (1–35)'),
  (15, 2, 'Al-Isra Ayat (36–70)'),
  (15, 3, 'Al-Isra Ayat (71–111)'),
  (15, 4, 'Al-Kahfi Ayat (1–35)'),
  (15, 5, 'Al-Kahfi Ayat (36–74)'),
  (16, 1, 'Al-Kahfi Ayat (75–110)'),
  (16, 2, 'Maryam Ayat (1–49)'),
  (16, 3, 'Maryam Ayat (50–98)'),
  (16, 4, 'Ta-Ha Ayat (1–45)'),
  (16, 5, 'Ta-Ha Ayat (46–90)'),
  (16, 6, 'Ta-Ha Ayat (91–135)'),
  (17, 1, 'Al-Anbiya Ayat  (1–40)'),
  (17, 2, 'Al-Anbiya Ayat (41–80)'),
  (17, 3, 'Al-Anbiya Ayat (81–112)'),
  (17, 4, 'Al-Hajj  Ayat (1–26)'),
  (17, 5, 'Al-Hajj  Ayat (27–52)'),
  (17, 6, 'Al-Hajj  Ayat (53–78)'),
  (18, 1, 'Al-Mu’minun  Ayat (1–39)'),
  (18, 2, 'Al-Mu’minun  Ayat (40–78)'),
  (18, 3, 'Al-Mu’minun  Ayat (79–118)'),
  (18, 4, 'An-Nur  Ayat (1–32)'),
  (18, 5, 'An-Nur  Ayat (33–64)'),
  (18, 6, 'Al-Furqan  Ayat (1–20)'),
  (19, 1, 'Al-Furqan  Ayat (21 - 39)'),
  (19, 2, 'Al-Furqan  Ayat (40–77)'),
  (19, 3, 'Asy-Syu’ara  Ayat (1–75)'),
  (19, 4, 'Asy-Syu’ara  Ayat (76–150)'),
  (19, 5, 'Asy-Syu’ara Ayat (151–227)'),
  (19, 6, 'An-Naml  Ayat (1–25)'),
  (19, 7, 'An-Naml  Ayat (26–55)'),
  (20, 1, 'An-Naml  Ayat (56–93)'),
  (20, 2, 'Al-Qasas Ayat (1–29)'),
  (20, 3, 'Al-Qasas Ayat (30–58)'),
  (20, 4, 'Al-Qasas Ayat (59–88)'),
  (20, 5, 'Al-Ankabut Ayat (1–25)'),
  (20, 6, 'Al-Ankabut Ayat (25–45)'),
  (21, 1, 'Al-Ankabut Ayat (46–69)'),
  (21, 2, 'Ar-Rum Ayat (1–20)'),
  (21, 3, 'Ar-Rum Ayat (21–40)'),
  (21, 4, 'Ar-Rum Ayat (41–60)'),
  (21, 5, 'Luqman Ayat (1–34)'),
  (21, 6, 'As-Sajdah Ayat (1–30)'),
  (21, 7, 'Al-Ahzab Ayat (1–30)'),
  (22, 1, 'Al-Ahzab Ayat (31–73)'),
  (22, 2, 'Saba Ayat (1–27)'),
  (22, 3, 'Saba Ayat (28–54)'),
  (22, 4, 'Fatir Ayat (1–45)'),
  (22, 5, 'Ya-Sin Ayat (1–83)'),
  (23, 1, 'As-Saffat Ayat (1–61)'),
  (23, 2, 'As-Saffat Ayat (62–122)'),
  (23, 3, 'As-Saffat Ayat (123–182)'),
  (23, 4, 'Sad Ayat (1–44)'),
  (23, 5, 'Sad Ayat (45–88)'),
  (23, 6, 'Az-Zumar Ayat (1–31)'),
  (24, 1, 'Az-Zumar Ayat (32–75)'),
  (24, 2, 'Ghafir Ayat (1–28)'),
  (24, 3, 'Ghafir Ayat (29–56)'),
  (24, 4, 'Ghafir Ayat (57–85)'),
  (24, 5, 'Fussilat Ayat (1–46)'),
  (25, 1, 'Fussilat Ayat (47–54)'),
  (25, 2, 'Asy-Syura Ayat (1–27)'),
  (25, 3, 'Asy-Syura Ayat (28–53)'),
  (25, 4, 'Az-Zukhruf Ayat (1–29)'),
  (25, 5, 'Az-Zukhruf Ayat (30–59)'),
  (25, 6, 'Az-Zukhruf Ayat (60–89)'),
  (25, 7, 'Ad-Dukhan Ayat (1–29)'),
  (25, 8, 'Ad-Dukhan Ayat (30–59)'),
  (25, 9, 'Al-Jatsiyah Ayat (1–37)'),
  (26, 1, 'Al-Ahqaf Ayat (1–45)'),
  (26, 2, 'Muhammad Ayat (1–38)'),
  (26, 3, 'Al-Fath Ayat (1–29)'),
  (26, 4, 'Al-Hujurat Ayat (1–18)'),
  (26, 5, 'Qaf Ayat (1–45)'),
  (26, 6, 'Adz-Dzariyat Ayat (1–30)'),
  (27, 1, 'Adz-Dzariyat Ayat (31–60)'),
  (27, 2, 'At-Tur Ayat (1–24)'),
  (27, 3, 'At-Tur Ayat (25–49)'),
  (27, 4, 'An-Najm Ayat (1–31)'),
  (27, 5, 'An-Najm Ayat (32–62)'),
  (27, 6, 'Al-Qamar Ayat (1–28)'),
  (27, 7, 'Al-Qamar Ayat (29–55)'),
  (27, 8, 'Ar-Rahman Ayat (1–39)'),
  (27, 9, 'Ar-Rahman Ayat (40–78)'),
  (27, 10, 'Al-Waqi’ah Ayat (1–48)'),
  (27, 11, 'Al-Waqi’ah Ayat (49–96)'),
  (27, 12, 'Al-Hadid Ayat (1–29)'),
  (28, 1, 'Al-Mujadilah Ayat (1–22)'),
  (28, 2, 'Al-Hasyr Ayat (1–24)'),
  (28, 3, 'Al-Mumtahanah Ayat (1–13)'),
  (28, 4, 'As-Saff Ayat (1–14)'),
  (28, 5, 'Al-Jumu’ah Ayat (1–11)'),
  (28, 6, 'Al-Munafiqun Ayat (1–11)'),
  (28, 7, 'At-Taghabun Ayat (1–18)'),
  (28, 8, 'At-Talaq Ayat (1–12)'),
  (28, 9, 'At-Tahrim Ayat (1–12)'),
  (29, 1, 'Al-Mulk Ayat (1–30)'),
  (29, 2, 'Al-Qalam Ayat (1–52)'),
  (29, 3, 'Al-Haqqah Ayat (1–52)'),
  (29, 4, 'Al-Ma’arij Ayat (1–44)'),
  (29, 5, 'Nuh Ayat (1–28)'),
  (29, 6, 'Al-Jinn Ayat (1–28)'),
  (29, 7, 'Al-Muzzammil Ayat (1–20)'),
  (29, 8, 'Al-Muddatstsir Ayat (1–56)'),
  (29, 9, 'Al-Qiyamah Ayat (1–40)'),
  (29, 10, 'Al-Insan Ayat (1–31)'),
  (29, 11, 'Al-Mursalat Ayat (1–50)'),
  (30, 1, 'An-Naba'),
  (30, 2, 'An-Nazi’at'),
  (30, 3, 'Abasa'),
  (30, 4, 'At-Takwir'),
  (30, 5, 'Al-Infitar'),
  (30, 6, 'Al-Mutaffifin'),
  (30, 7, 'Al-Insyiqaq'),
  (30, 8, 'Al-Buruj'),
  (30, 9, 'At-Tariq'),
  (30, 10, 'Al-A’la'),
  (30, 11, 'Al-Ghasyiyah'),
  (30, 12, 'Al-Fajr'),
  (30, 13, 'Al-Balad'),
  (30, 14, 'Asy-Syams'),
  (30, 15, 'Al-Lail'),
  (30, 16, 'Ad-Dhuha'),
  (30, 17, 'Al-Insyirah'),
  (30, 18, 'At-Tin'),
  (30, 19, 'Al-‘Alaq'),
  (30, 20, 'Al-Qadr'),
  (30, 21, 'Al-Bayyinah'),
  (30, 22, 'Az-Zalzalah'),
  (30, 23, 'Al-‘Adiyat'),
  (30, 24, 'Al-Qari’ah'),
  (30, 25, 'At-Takatsur'),
  (30, 26, 'Al-‘Asr'),
  (30, 27, 'Al-Humazah'),
  (30, 28, 'Al-Fil'),
  (30, 29, 'Quraisy'),
  (30, 30, 'Al-Ma’un'),
  (30, 31, 'Al-Kautsar'),
  (30, 32, 'Al-Kafirun'),
  (30, 33, 'An-Nasr'),
  (30, 34, 'Al-Lahab'),
  (30, 35, 'Al-Ikhlas'),
  (30, 36, 'Al-Falaq'),
  (30, 37, 'An-Nas')
ON CONFLICT (juz_number, part_number) DO UPDATE
SET part_label = EXCLUDED.part_label;

ALTER TABLE claims
ADD COLUMN IF NOT EXISTS part_id uuid REFERENCES juz_parts(id) ON DELETE RESTRICT;

WITH first_parts AS (
  SELECT DISTINCT ON (juz_number) id, juz_number
  FROM juz_parts
  ORDER BY juz_number, part_number
)
UPDATE claims c
SET part_id = fp.id
FROM first_parts fp
WHERE c.part_id IS NULL
  AND c.juz_number = fp.juz_number;

ALTER TABLE claims
ALTER COLUMN part_id SET NOT NULL;

ALTER TABLE claims
DROP CONSTRAINT IF EXISTS claims_campaign_id_group_id_juz_number_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'claims_campaign_group_part_unique'
  ) THEN
    ALTER TABLE claims
    ADD CONSTRAINT claims_campaign_group_part_unique
    UNIQUE (campaign_id, group_id, part_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'claims_campaign_group_participant_juz_unique'
  ) THEN
    ALTER TABLE claims
    ADD CONSTRAINT claims_campaign_group_participant_juz_unique
    UNIQUE (campaign_id, group_id, participant_id, juz_number);
  END IF;
END $$;
