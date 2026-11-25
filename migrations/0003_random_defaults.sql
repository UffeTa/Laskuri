-- Arvonta on oletus. Vanha skeema käytti tanssille oletusta 'groove',
-- eikä lukitusta tallennettu erikseen. Vain tuo oletus muutetaan arvontaan.
-- Ylläpidon erikseen valitsema tyyli tai raita jätetään ennalleen.

UPDATE counters
SET dance_style = 'random'
WHERE dance_style IS NULL OR dance_style = '' OR dance_style = 'groove';

UPDATE counters
SET music_track = 'random'
WHERE music_track IS NULL OR music_track = '';
