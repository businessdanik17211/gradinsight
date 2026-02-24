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
                                'num': num,
                                'faculty': faculty,
                                'name': specialty,
                                'score_budget': parse_score(score_budget),
                                'score_paid': parse_score(score_paid)
                            })
    return results

def extract_2024_2025(pdf_path):
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
                            'faculty': current_faculty,
                            'name': specialty,
                            'score_budget': parse_score(score_budget),
                            'score_paid': parse_score(score_paid)
                        })
    return results

print("=" * 100)
print("БГУ 2022 - БЮДЖЕТ (проходной балл | средний балл)")
print("=" * 100)
data_2022 = extract_2022_budget("graduates/БГУ2022.pdf")
print(f"{'№':>3} | {'Код':^15} | {'Бюджет':>6} | {'Средн':>5} | Специальность")
print("-" * 100)
for item in data_2022:
    budget = f"{item['score_budget']}" if item['score_budget'] else "-"
    avg = f"{item['avg_budget']}" if item['avg_budget'] else "-"
    print(f"{item['num']:>3} | {item['code']:<15} | {budget:>6} | {avg:>5} | {item['name'][:60]}")
print(f"\nИтого: {len(data_2022)} специальностей")

print("\n" + "=" * 100)
print("БГУ 2023 - БЮДЖЕТ (места | проходной балл)")
print("=" * 100)
data_2023_budget = extract_2023_budget("graduates/БГУ2023.pdf")
print(f"{'№':>3} | {'Мест':>5} | {'Балл':>5} | Специальность")
print("-" * 100)
for item in data_2023_budget:
    places = f"{item['places_budget']}" if item['places_budget'] else "-"
    score = f"{item['score_budget']}" if item['score_budget'] else "-"
    print(f"{item['num']:>3} | {places:>5} | {score:>5} | {item['name'][:70]}")
print(f"\nИтого: {len(data_2023_budget)} специальностей")

print("\n" + "=" * 100)
print("БГУ 2023 - ПЛАТНЫЕ (бюджетный балл | платный балл)")
print("=" * 100)
data_2023_paid = extract_2023_paid("graduates/БГУ2023платные.pdf")
print(f"{'№':>3} | {'Бюдж':>5} | {'Плат':>5} | Специальность")
print("-" * 100)
for item in data_2023_paid:
    budget = f"{item['score_budget']}" if item['score_budget'] else "-"
    paid = f"{item['score_paid']}" if item['score_paid'] else "-"
    print(f"{item['num']:>3} | {budget:>5} | {paid:>5} | {item['name'][:70]}")
print(f"\nИтого: {len(data_2023_paid)} специальностей")

print("\n" + "=" * 100)
print("БГУ 2024 (бюджет | платно)")
print("=" * 100)
data_2024 = extract_2024_2025("graduates/БГУ2024.pdf")
print(f"{'Бюдж':>5} | {'Плат':>5} | Специальность")
print("-" * 100)
for item in data_2024:
    budget = f"{item['score_budget']}" if item['score_budget'] else "-"
    paid = f"{item['score_paid']}" if item['score_paid'] else "-"
    print(f"{budget:>5} | {paid:>5} | {item['name'][:70]}")
print(f"\nИтого: {len(data_2024)} специальностей")

print("\n" + "=" * 100)
print("БГУ 2025 (бюджет | платно)")
print("=" * 100)
data_2025 = extract_2024_2025("graduates/БГУ2025.pdf")
print(f"{'Бюдж':>5} | {'Плат':>5} | Специальность")
print("-" * 100)
for item in data_2025:
    budget = f"{item['score_budget']}" if item['score_budget'] else "-"
    paid = f"{item['score_paid']}" if item['score_paid'] else "-"
    print(f"{budget:>5} | {paid:>5} | {item['name'][:70]}")
print(f"\nИтого: {len(data_2025)} специальностей")

all_data = {
    '2022_budget': data_2022,
    '2023_budget': data_2023_budget,
    '2023_paid': data_2023_paid,
    '2024': data_2024,
    '2025': data_2025
}

with open('bsu_admission_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 100)
print(f"ОБЩИЙ ИТОГ: {len(data_2022) + len(data_2023_budget) + len(data_2023_paid) + len(data_2024) + len(data_2025)} записей")
print("Данные сохранены в bsu_admission_data.json")
