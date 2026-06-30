-- Saba Exploit OPREC — Seed data
-- Run this THIRD, after 01_schema.sql and 02_policies.sql.
-- Safe to re-run: uses ON CONFLICT / WHERE NOT EXISTS guards where possible.

-- ---- Divisions (5) ----
insert into divisions (name, description, sub_description, icon_name, color_palette, display_order) values
('Photography',       'Divisi fotografi berisi anggota yang ahli di bidang fotografi.',                 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fokus pada peliputan acara dan komposisi visual.', 'Camera',      '#E23636,#1C1C1E,#FAFAFA', 1),
('Design',            'Divisi design berorientasi pada seni desain grafis.',                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Grafis, layout UI, tipografi, dan branding.',     'Palette',     '#8B5CF6,#1C1C1E,#FAFAFA', 2),
('Programming',       'Divisi pemrograman siber, pengembangan website, dan pemecahan algoritma.',       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Webmaster, backend, algoritma, dan keamanan siber.', 'Code2',     '#10B981,#1C1C1E,#FAFAFA', 3),
('Technopreneurship', 'Pengembangan usaha berbasis teknologi modern.',                                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bisnis, merchandising, dan operasi finansial.',    'TrendingUp',  '#F59E0B,#1C1C1E,#FAFAFA', 4),
('Cinematography',    'Divisi pembuatan film pendek berkualitas peraih juara.',                         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Naskah, sinematografi, dan pasca-produksi video.', 'Film',        '#EC4899,#1C1C1E,#FAFAFA', 5);

-- ---- Programs (10) ----
insert into programs (name, description, display_order) values
('SEtrip',           'Lorem ipsum dolores bla bla bla. Kegiatan petualangan dan bonding akrab pengurus Sapa Exploit.', 1),
('MUBES',            'Musyawarah Besar LPJ dan regenerasi ketua umum.',                                              2),
('SEtor',            'Lorem ipsum dolores bla bla bla. Program penyetoran karya kreatif bulanan.',                    3),
('XIT Store',        'Lini technopreneurship penjualan merchandise.',                                                4),
('FPSE',             'Lorem ipsum dolores bla bla bla. Pameran karya internal untuk anggota muda.',                   5),
('XStory',           'Dokumentasi cerita kegiatan organisasi di media sosial.',                                      6),
('VPSE',             'Lorem ipsum... Screening film pendek karya Cinematography.',                                    7),
('Artopia',          'Pameran kolaboratif seni visual digital Sapa Exploit.',                                        8),
('Open Recruitment', 'Sistem penerimaan anggota baru kelas X.',                                                      9),
('Ramber',           'Malam ramah tamah bersama alumni Sapa Exploit.',                                               10)
on conflict (name) do nothing;

-- ---- Achievements (5) ----
insert into achievements (title, display_order) values
('Juara III dan V FLSSN Fotografi 2024 tingkat Nasional', 1),
('Juara III FLSSN Cipta Lagu tingkat Provinsi 2023',      2),
('Juara I FLSSN Desain Poster tingkat Kabupaten 2024',    3),
('Juara V OSN Informatika tingkat Kabupaten 2024',        4),
('Juara II FLSSN Film Pendek 2023',                       5);

-- ---- Site content (hero + about, editable from the CMS) ----
insert into site_content (key, value) values
('hero_eyebrow',   'UKK SMA NEGERI 1 BANTUL'),
('hero_title',     'WE ARE EXPLOIT'),
('hero_tagline',   'Saba Cyber Community — tempat pemula jadi pro di programming, design, dan audio-visual.'),
('hero_cta_label', 'Explore SABA'),
('about_heading',  'Tentang Sapa Exploit'),
('about_body',     'Didirikan tahun 2006 oleh empat anggota Tim Olimpiade Komputer sekolah, Sapa Exploit kini menjadi rumah kreatif semi-profesional dengan 38-39 anggota aktif di bidang teknologi dan seni audio-visual.')
on conflict (key) do nothing;
