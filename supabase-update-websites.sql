-- Update universities with website and city
UPDATE universities SET 
  website = 'https://bsu.by',
  city = 'Минск'
WHERE id = 'bsu';

UPDATE universities SET 
  website = 'https://bsuir.by',
  city = 'Минск'
WHERE id = 'bsuir';

UPDATE universities SET 
  website = 'https://bntu.by',
  city = 'Минск'
WHERE id = 'bntu';

UPDATE universities SET 
  website = 'https://bseu.by',
  city = 'Минск'
WHERE id = 'bseu';

UPDATE universities SET 
  website = 'https://bsmu.by',
  city = 'Минск'
WHERE id = 'bsmu';

UPDATE universities SET 
  website = 'https://bspu.by',
  city = 'Минск'
WHERE id = 'bspu';

UPDATE universities SET 
  website = 'https://grsu.by',
  city = 'Гродно'
WHERE id = 'grsu';

UPDATE universities SET 
  website = 'https://vsu.by',
  city = 'Витебск'
WHERE id = 'vsu';

UPDATE universities SET 
  website = 'https://psu.by',
  city = 'Новополоцк'
WHERE id = 'pgu';

UPDATE universities SET 
  website = 'https://gstu.by',
  city = 'Гомель'
WHERE id = 'gstu';

UPDATE universities SET 
  website = 'https://mslu.by',
  city = 'Минск'
WHERE id = 'bsufl';

UPDATE universities SET 
  website = 'https://pac.by',
  city = 'Минск'
WHERE id = 'au';

UPDATE universities SET 
  website = 'https://amia.by',
  city = 'Минск'
WHERE id = 'amvd';

UPDATE universities SET 
  website = 'https://brsu.by',
  city = 'Брест'
WHERE id = 'brsu';

UPDATE universities SET 
  website = 'https://bgaa.by',
  city = 'Минск'
WHERE id = 'bsaa';

UPDATE universities SET 
  website = 'https://buk.by',
  city = 'Минск'
WHERE id = 'bsuca';

UPDATE universities SET 
  website = 'https://sportedu.by',
  city = 'Минск'
WHERE id = 'bsups';

-- Verify
SELECT id, short_name, city, website FROM universities;
