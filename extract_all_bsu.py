import pdfplumber
import json
import re

def extract_2022_budget(pdf_path):
    results = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if row and row[0] and str(row[0]).strip().isdigit():
                        num = int(row[0])
                        name = row[1].replace('\n', ' ').strip() if row[1] else ''
                        code = row[2].strip() if row[2] else ''
                        score_budget = int(row[3]) if row[3] and str(row[3]).strip().isdigit() else None
                        avg_budget = int(row[5]) if len(row) > 5 and row[5] and str(row[5]).strip().isdigit() else None
                        
                        if name and code:
                            results.append({
                                'year': 2022,
                                'type': 'budget',
                                'num': num,
                                'name': name,
                                'code': code,
                                'score_budget': score_budget,
                                'avg_budget': avg_budget
                            })
    return results

def extract_2023_budget(pdf_path):
    results = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if row and row[0] and str(row[0]).replace('\n', '').strip().isdigit():
                        num_str = str(row[0]).replace('\n', '').strip()
                        num = int(num_str.split()[0]) if num_str else 0
                        faculty = row[1].replace('\n', ' ').strip() if row[1] else ''
                        specialty = row[2].replace('\n', ' ').strip() if row[2] else ''
                        places = row[3] if row[3] else ''
                        score = row[4] if row[4] else ''
                        
                        if specialty and specialty not in ['Название специальности', 'объединенный конкурс:']:
                            results.append({
                                'year': 2023,
                                'type': 'budget',
                                'num': num,
                                'faculty': faculty,
                                'name': specialty,
                                'places_budget': int(places) if places and str(places).isdigit() else None,
                                'score_budget': int(score) if score and str(score).isdigit() else None
                            })
    return results

def extract_2023_paid(pdf_path):
    results = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if row and row[0] and str(row[0]).replace('\n', '').strip().isdigit():
                        num_str = str(row[0]).replace('\n', '').strip()
                        num = int(num_str.split()[0]) if num_str else 0
                        faculty = row[1].replace('\n', ' ').strip() if row[1] else ''
                        specialty = row[2].replace('\n', ' ').strip() if row[2] else ''
                        score_budget = row[3] if row[3] else ''
                        score_paid = row[4] if row[4] else ''
                        
                        if specialty and specialty not in ['Название специальности', 'объединенный конкурс:']:
                            def parse_score(s):
                                if not s:
                                    return None
                                s = str(s).strip()
                                if s.isdigit():
                                    return int(s)
                                parts = s.split()
                                if parts and parts[0].isdigit():
                                    return int(parts[0])
                                return None
                            
                            results.append({
                                'year': 2023,
                                'type': 'paid',
                                'num': num,
                                'faculty': faculty,
                                'name': specialty,
                                'score_budget': parse_score(score_budget),
                                'score_paid': parse_score(score_paid)
                            })
    return results

def extract_2024_2025(pdf_path, year):
    results = []
    current_faculty = ''
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if not row or len(row) < 4:
                        continue
                    
                    faculty = row[0].replace('\n', ' ').strip() if row[0] else ''
                    specialty = row[1].replace('\n', ' ').strip() if len(row) > 1 and row[1] else ''
                    score_budget = row[2] if len(row) > 2 else ''
                    score_paid = row[3] if len(row) > 3 else ''
                    
                    if 'Факультет' in faculty or 'Институт' in faculty or 'Совместный' in faculty or 'Международный' in faculty:
                        current_faculty = faculty
                    
                    if specialty and specialty not in ['Название специальности', 'объединенный конкурс:']:
                        def parse_score(s):
                            if not s:
                                return None
                            s = str(s).strip()
                            if s.isdigit():
                                return int(s)
                            return None
                        
                        results.append({
                            'year': year,
                            'type': 'both',
                            'faculty': current_faculty,
                            'name': specialty,
                            'score_budget': parse_score(score_budget),
                            'score_paid': parse_score(score_paid)
                        })
    return results

def get_2025_manual_data():
    return [
        {'year': 2025, 'type': 'both', 'name': 'математика и компьютерные науки', 'score_budget': 360, 'score_paid': 319},
        {'year': 2025, 'type': 'both', 'name': 'математика', 'score_budget': 262, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'компьютерная математика и системный анализ', 'score_budget': 364, 'score_paid': 333},
        {'year': 2025, 'type': 'both', 'name': 'механика и математическое моделирование', 'score_budget': 354, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'информатика', 'score_budget': 387, 'score_paid': 358},
        {'year': 2025, 'type': 'both', 'name': 'кибербезопасность', 'score_budget': 378, 'score_paid': 341},
        {'year': 2025, 'type': 'both', 'name': 'прикладная математика', 'score_budget': 371, 'score_paid': 358},
        {'year': 2025, 'type': 'both', 'name': 'прикладная информатика', 'score_budget': 391, 'score_paid': 359},
        {'year': 2025, 'type': 'both', 'name': 'механика и математическое моделирование (совместный институт БГУ и ДПУ)', 'score_budget': 367, 'score_paid': 317},
        {'year': 2025, 'type': 'both', 'name': 'интеллектуальная электроника', 'score_budget': 351, 'score_paid': 313},
        {'year': 2025, 'type': 'both', 'name': 'прикладная информатика (ФРКТ)', 'score_budget': 360, 'score_paid': 309},
        {'year': 2025, 'type': 'both', 'name': 'радиофизика и информационные технологии', 'score_budget': 353, 'score_paid': 322},
        {'year': 2025, 'type': 'both', 'name': 'прикладная физика', 'score_budget': 346, 'score_paid': 308},
        {'year': 2025, 'type': 'both', 'name': 'компьютерная физика', 'score_budget': 341, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'фундаментальная физика', 'score_budget': 351, 'score_paid': 322},
        {'year': 2025, 'type': 'both', 'name': 'физика', 'score_budget': 329, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'ядерные физика и технологии', 'score_budget': 337, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'прикладная физика (совместный институт БГУ-ДПУ)', 'score_budget': 371, 'score_paid': 302},
        {'year': 2025, 'type': 'both', 'name': 'медицинская физика', 'score_budget': 271, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'ядерная и радиационная безопасность', 'score_budget': 272, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'биология', 'score_budget': 326, 'score_paid': 290},
        {'year': 2025, 'type': 'both', 'name': 'микробиология', 'score_budget': 335, 'score_paid': 304},
        {'year': 2025, 'type': 'both', 'name': 'биохимия', 'score_budget': 355, 'score_paid': 313},
        {'year': 2025, 'type': 'both', 'name': 'биоинженерия и биоинформатика', 'score_budget': 352, 'score_paid': 325},
        {'year': 2025, 'type': 'both', 'name': 'биотехнология', 'score_budget': 354, 'score_paid': 320},
        {'year': 2025, 'type': 'both', 'name': 'фундаментальная и прикладная биотехнология', 'score_budget': 332, 'score_paid': 314},
        {'year': 2025, 'type': 'both', 'name': 'экология', 'score_budget': 314, 'score_paid': 304},
        {'year': 2025, 'type': 'both', 'name': 'география', 'score_budget': 347, 'score_paid': 295},
        {'year': 2025, 'type': 'both', 'name': 'гидрометеорология', 'score_budget': 327, 'score_paid': 291},
        {'year': 2025, 'type': 'both', 'name': 'космоаэрокартография и геодезия', 'score_budget': 316, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'геоэкология', 'score_budget': 351, 'score_paid': 293},
        {'year': 2025, 'type': 'both', 'name': 'геоинформационные системы', 'score_budget': 309, 'score_paid': 292},
        {'year': 2025, 'type': 'both', 'name': 'геотехнологии туризма и экскурсионная деятельность', 'score_budget': 313, 'score_paid': 293},
        {'year': 2025, 'type': 'both', 'name': 'страноведение и переводческая деятельность', 'score_budget': 331, 'score_paid': 296},
        {'year': 2025, 'type': 'both', 'name': 'геология', 'score_budget': 229, 'score_paid': 209},
        {'year': 2025, 'type': 'both', 'name': 'дизайн предметно-пространственной среды', 'score_budget': 234, 'score_paid': 215},
        {'year': 2025, 'type': 'both', 'name': 'дизайн костюма и текстиля', 'score_budget': 254, 'score_paid': 220},
        {'year': 2025, 'type': 'both', 'name': 'графический дизайн и мультимедиадизайн (сокращенный срок обучения)', 'score_budget': 251, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'компьютерное моделирование и разработка веб-приложений', 'score_budget': 342, 'score_paid': 301},
        {'year': 2025, 'type': 'both', 'name': 'социально-культурный менеджмент и коммуникации', 'score_budget': 366, 'score_paid': 342},
        {'year': 2025, 'type': 'both', 'name': 'современные иностранные языки', 'score_budget': 350, 'score_paid': 293},
        {'year': 2025, 'type': 'both', 'name': 'переводческое дело', 'score_budget': 377, 'score_paid': 297},
        {'year': 2025, 'type': 'both', 'name': 'теология', 'score_budget': 288, 'score_paid': 313},
        {'year': 2025, 'type': 'both', 'name': 'архивное дело', 'score_budget': 315, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'мировая экономика (совместный институт БГУ и ДПУ)', 'score_budget': 322, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'история', 'score_budget': 347, 'score_paid': 296},
        {'year': 2025, 'type': 'both', 'name': 'регионоведение', 'score_budget': 374, 'score_paid': 301},
        {'year': 2025, 'type': 'both', 'name': 'музейное дело и охрана историко-культурного наследия', 'score_budget': 324, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'журналистика', 'score_budget': 341, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'информация и коммуникация', 'score_budget': 362, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'востоковедение', 'score_budget': 388, 'score_paid': 340},
        {'year': 2025, 'type': 'both', 'name': 'международное право', 'score_budget': 398, 'score_paid': 353},
        {'year': 2025, 'type': 'both', 'name': 'международные отношения', 'score_budget': 395, 'score_paid': 358},
        {'year': 2025, 'type': 'both', 'name': 'менеджмент (ФМО)', 'score_budget': 396, 'score_paid': 329},
        {'year': 2025, 'type': 'both', 'name': 'мировая экономика', 'score_budget': 398, 'score_paid': 348},
        {'year': 2025, 'type': 'both', 'name': 'международная конфликтология', 'score_budget': 394, 'score_paid': 344},
        {'year': 2025, 'type': 'both', 'name': 'международная логистика', 'score_budget': 393, 'score_paid': 316},
        {'year': 2025, 'type': 'both', 'name': 'таможенное дело', 'score_budget': 387, 'score_paid': 342},
        {'year': 2025, 'type': 'both', 'name': 'экономическая безопасность (ФМО)', 'score_budget': 377, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'менеджмент (ЭФ)', 'score_budget': 373, 'score_paid': 344},
        {'year': 2025, 'type': 'both', 'name': 'финансы и кредит', 'score_budget': 382, 'score_paid': 357},
        {'year': 2025, 'type': 'both', 'name': 'экономика', 'score_budget': 368, 'score_paid': 347},
        {'year': 2025, 'type': 'both', 'name': 'экономическая информатика', 'score_budget': 368, 'score_paid': 332},
        {'year': 2025, 'type': 'both', 'name': 'природоохранная деятельность', 'score_budget': 288, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'медико-биологическое дело', 'score_budget': None, 'score_paid': 282},
        {'year': 2025, 'type': 'both', 'name': 'информационные системы и технологии', 'score_budget': None, 'score_paid': 271},
        {'year': 2025, 'type': 'both', 'name': 'социальные коммуникации', 'score_budget': None, 'score_paid': 322},
        {'year': 2025, 'type': 'both', 'name': 'классическая филология', 'score_budget': 344, 'score_paid': 295},
        {'year': 2025, 'type': 'both', 'name': 'химия (научно-педагогическая деятельность)', 'score_budget': 329, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'химия', 'score_budget': 355, 'score_paid': 330},
        {'year': 2025, 'type': 'both', 'name': 'химия высоких энергий', 'score_budget': 351, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'фундаментальная химия', 'score_budget': 357, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'химия лекарственных соединений', 'score_budget': 358, 'score_paid': 324},
        {'year': 2025, 'type': 'both', 'name': 'геоинформационные системы (специальные) (ж)', 'score_budget': 335, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'геоинформационные системы (специальные) (м)', 'score_budget': 359, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'правоведение (юрисконсультская работа в военной сфере)(м)', 'score_budget': 338, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'правоведение (юрисконсультская работа в военной сфере)(ж)', 'score_budget': 323, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'международные отношения (военная сфера)(м)', 'score_budget': 394, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'международные отношения (информационная сфера)(м)', 'score_budget': 335, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'международные отношения (информационная сфера)(ж)', 'score_budget': 359, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'радиационная, химическая и биологическая защита', 'score_budget': 231, 'score_paid': None},
        {'year': 2025, 'type': 'both', 'name': 'маркетинг', 'score_budget': None, 'score_paid': 320},
        {'year': 2025, 'type': 'both', 'name': 'управление информационными ресурсами', 'score_budget': None, 'score_paid': 318},
        {'year': 2025, 'type': 'both', 'name': 'бизнес-администрирование', 'score_budget': None, 'score_paid': 346},
        {'year': 2025, 'type': 'both', 'name': 'логистика', 'score_budget': None, 'score_paid': 312},
    ]

print("=" * 100)
print("EXTRACTING ALL BSU ADMISSION DATA")
print("=" * 100)

all_data = []

print("\n[1/5] БГУ 2022 - БЮДЖЕТ...")
data_2022 = extract_2022_budget("graduates/БГУ2022.pdf")
all_data.extend(data_2022)
print(f"  Extracted {len(data_2022)} entries")

print("\n[2/5] БГУ 2023 - БЮДЖЕТ...")
data_2023_budget = extract_2023_budget("graduates/БГУ2023.pdf")
all_data.extend(data_2023_budget)
print(f"  Extracted {len(data_2023_budget)} entries")

print("\n[3/5] БГУ 2023 - ПЛАТНЫЕ...")
data_2023_paid = extract_2023_paid("graduates/БГУ2023платные.pdf")
all_data.extend(data_2023_paid)
print(f"  Extracted {len(data_2023_paid)} entries")

print("\n[4/5] БГУ 2024...")
data_2024 = extract_2024_2025("graduates/БГУ2024.pdf", 2024)
all_data.extend(data_2024)
print(f"  Extracted {len(data_2024)} entries")

print("\n[5/5] БГУ 2025...")
data_2025 = get_2025_manual_data()
all_data.extend(data_2025)
print(f"  Extracted {len(data_2025)} entries")

with open('bsu_admission_all_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 100)
print("SUMMARY")
print("=" * 100)
print(f"2022 Budget: {len(data_2022)} entries")
print(f"2023 Budget: {len(data_2023_budget)} entries")
print(f"2023 Paid:   {len(data_2023_paid)} entries")
print(f"2024:        {len(data_2024)} entries")
print(f"2025:        {len(data_2025)} entries")
print(f"\nTOTAL:       {len(all_data)} records")
print(f"\nSaved to: bsu_admission_all_data.json")

print("\n" + "=" * 100)
print("SAMPLE DATA BY YEAR")
print("=" * 100)

for year in [2022, 2023, 2024, 2025]:
    print(f"\n--- {year} ---")
    year_data = [d for d in all_data if d['year'] == year][:5]
    for item in year_data:
        if year == 2022:
            print(f"  {item['code']:15} | {item['score_budget'] or '-':>5} | {item['name'][:50]}")
        elif year == 2023:
            score_type = 'budget' if item['type'] == 'budget' else 'paid'
            score = item.get('score_budget') or item.get('score_paid') or '-'
            print(f"  {score_type:6} | {str(score):>5} | {item['name'][:50]}")
        else:
            print(f"  {str(item['score_budget'] or '-'):>5} | {str(item['score_paid'] or '-'):>5} | {item['name'][:50]}")
