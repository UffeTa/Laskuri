-- Lukitus on erillinen lippu. Vanhat rivit (myös oletus 'groove') eivät ole lukittuja,
-- joten julkinen sivu arpoo tanssin ja raidan jokaisella latauksella.
-- 0003 ei ehtinyt muuttaa tuotannon rivejä, jos sitä ei ole ajettu.

ALTER TABLE counters ADD COLUMN dance_locked INTEGER NOT NULL DEFAULT 0;
ALTER TABLE counters ADD COLUMN music_locked INTEGER NOT NULL DEFAULT 0;
