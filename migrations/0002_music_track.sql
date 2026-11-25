-- Taustaraidan oletus laskuria kohden. 'random' valitsee julkisella sivulla yhden rekisterin raidoista.
-- Vanhat rivit saavat oletuksen random. music_enabled säilyy ennallaan.

ALTER TABLE counters ADD COLUMN music_track TEXT NOT NULL DEFAULT 'random';
