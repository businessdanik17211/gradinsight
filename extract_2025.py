import pdfplumber
import json

def extract_2025(pdf_path):
    results = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if not row:
                        continue
                    
                    cols = [str(c).strip() if c else '' for c in row]
                    
                    specialty = ''
                    score_budget = None
                    score_paid = None
                    
                    for i, col in enumerate(cols):
                        if col.isdigit() and len(col) == 3:
                            if score_budget is None:
                                score_budget = int(col)
                            elif score_paid is None:
                                score_paid = int(col)
                                break
                    
                    if cols[1] and 'Факультет' not in cols[0] and 'Институт' not in cols[0]:
                        name_parts = []
                        for c in cols[1:5]:
                            if c and not c.isdigit() and 'Факультет' not in c and 'Институт' not in c:
                                name_parts.append(c)
                        specialty = ' '.join(name_parts).strip()
                    
                    if score_budget and score_paid and specialty:
                        if specialty not in ['Название специальности', '']:
                            results.append({
                                'name': specialty.replace('\n', ' '),
                                'score_budget': score_budget,
                                'score_paid': score_paid
                            })
    return results

def clean_2025_data():
    manual_data = [
        {'name': 'математика и компьютерные науки', 'score_budget': 360, 'score_paid': 319},
        {'name': 'математика', 'score_budget': 262, 'score_paid': None},
        {'name': 'компьютерная математика и системный анализ', 'score_budget': 364, 'score_paid': 333},
        {'name': 'механика и математическое моделирование', 'score_budget': 354, 'score_paid': None},
        {'name': 'информатика', 'score_budget': 387, 'score_paid': 358},
        {'name': 'кибербезопасность', 'score_budget': 378, 'score_paid': 341},
        {'name': 'прикладная математика', 'score_budget': 371, 'score_paid': 358},
        {'name': 'прикладная информатика', 'score_budget': 391, 'score_paid': 359},
        {'name': 'механика и математическое моделирование (совместный институт БГУ и ДПУ)', 'score_budget': 367, 'score_paid': 317},
        {'name': 'интеллектуальная электроника', 'score_budget': 351, 'score_paid': 313},
        {'name': 'прикладная информатика', 'score_budget': 360, 'score_paid': 309},
        {'name': 'радиофизика и информационные технологии', 'score_budget': 353, 'score_paid': 322},
        {'name': 'прикладная физика', 'score_budget': 346, 'score_paid': 308},
        {'name': 'компьютерная физика', 'score_budget': 341, 'score_paid': None},
        {'name': 'фундаментальная физика', 'score_budget': 351, 'score_paid': 322},
        {'name': 'физика', 'score_budget': 329, 'score_paid': None},
        {'name': 'ядерные физика и технологии', 'score_budget': 337, 'score_paid': None},
        {'name': 'прикладная физика (совместный институт БГУ-ДПУ)', 'score_budget': 371, 'score_paid': 302},
        {'name': 'медицинская физика', 'score_budget': 271, 'score_paid': None},
        {'name': 'ядерная и радиационная безопасность', 'score_budget': 272, 'score_paid': None},
        {'name': 'биология', 'score_budget': 326, 'score_paid': 290},
        {'name': 'микробиология', 'score_budget': 335, 'score_paid': 304},
        {'name': 'биохимия', 'score_budget': 355, 'score_paid': 313},
        {'name': 'биоинженерия и биоинформатика', 'score_budget': 352, 'score_paid': 325},
        {'name': 'биотехнология', 'score_budget': 354, 'score_paid': 320},
        {'name': 'фундаментальная и прикладная биотехнология', 'score_budget': 332, 'score_paid': 314},
        {'name': 'экология', 'score_budget': 314, 'score_paid': 304},
        {'name': 'география', 'score_budget': 347, 'score_paid': 295},
        {'name': 'гидрометеорология', 'score_budget': 327, 'score_paid': 291},
        {'name': 'космоаэрокартография и геодезия', 'score_budget': 316, 'score_paid': None},
        {'name': 'геоэкология', 'score_budget': 351, 'score_paid': 293},
        {'name': 'геоинформационные системы', 'score_budget': 309, 'score_paid': 292},
        {'name': 'геотехнологии туризма и экскурсионная деятельность', 'score_budget': 313, 'score_paid': 293},
        {'name': 'страноведение и переводческая деятельность', 'score_budget': 331, 'score_paid': 296},
        {'name': 'геология', 'score_budget': 229, 'score_paid': 209},
        {'name': 'дизайн предметно-пространственной среды', 'score_budget': 234, 'score_paid': 215},
        {'name': 'дизайн костюма и текстиля', 'score_budget': 254, 'score_paid': 220},
        {'name': 'графический дизайн и мультимедиадизайн (сокращенный срок обучения)', 'score_budget': 251, 'score_paid': None},
        {'name': 'компьютерное моделирование и разработка веб-приложений', 'score_budget': 342, 'score_paid': 301},
        {'name': 'социально-культурный менеджмент и коммуникации', 'score_budget': 366, 'score_paid': 342},
        {'name': 'современные иностранные языки', 'score_budget': 350, 'score_paid': 293},
        {'name': 'переводческое дело', 'score_budget': 377, 'score_paid': 297},
        {'name': 'теология', 'score_budget': 288, 'score_paid': 313},
        {'name': 'архивное дело', 'score_budget': 315, 'score_paid': None},
        {'name': 'мировая экономика (совместный институт БГУ и ДПУ)', 'score_budget': 322, 'score_paid': None},
        {'name': 'история', 'score_budget': 347, 'score_paid': 296},
        {'name': 'регионоведение', 'score_budget': 374, 'score_paid': 301},
        {'name': 'музейное дело и охрана историко-культурного наследия', 'score_budget': 324, 'score_paid': None},
        {'name': 'журналистика', 'score_budget': 341, 'score_paid': None},
        {'name': 'информация и коммуникация', 'score_budget': 362, 'score_paid': None},
        {'name': 'востоковедение', 'score_budget': 388, 'score_paid': 340},
        {'name': 'международное право', 'score_budget': 398, 'score_paid': 353},
        {'name': 'международные отношения', 'score_budget': 395, 'score_paid': 358},
        {'name': 'менеджмент', 'score_budget': 396, 'score_paid': 329},
        {'name': 'мировая экономика', 'score_budget': 398, 'score_paid': 348},
        {'name': 'международная конфликтология', 'score_budget': 394, 'score_paid': 344},
        {'name': 'международная логистика', 'score_budget': 393, 'score_paid': 316},
        {'name': 'таможенное дело', 'score_budget': 387, 'score_paid': 342},
        {'name': 'экономическая безопасность', 'score_budget': 377, 'score_paid': None},
        {'name': 'менеджмент', 'score_budget': 373, 'score_paid': 344},
        {'name': 'финансы и кредит', 'score_budget': 382, 'score_paid': 357},
        {'name': 'экономика', 'score_budget': 368, 'score_paid': 347},
        {'name': 'экономическая информатика', 'score_budget': 368, 'score_paid': 332},
        {'name': 'природоохранная деятельность', 'score_budget': 288, 'score_paid': None},
        {'name': 'экология', 'score_budget': None, 'score_paid': None},
        {'name': 'медико-биологическое дело', 'score_budget': None, 'score_paid': 282},
        {'name': 'информационные системы и технологии', 'score_budget': None, 'score_paid': 271},
        {'name': 'социальные коммуникации', 'score_budget': None, 'score_paid': 322},
        {'name': 'социология', 'score_budget': None, 'score_paid': None},
        {'name': 'философия', 'score_budget': None, 'score_paid': None},
        {'name': 'социальная работа и консультирование', 'score_budget': None, 'score_paid': None},
        {'name': 'белорусская филология', 'score_budget': None, 'score_paid': None},
        {'name': 'славянская (славянская и белорусская) филология', 'score_budget': None, 'score_paid': None},
        {'name': 'классическая филология', 'score_budget': 344, 'score_paid': 295},
        {'name': 'восточная (китайская) филология', 'score_budget': None, 'score_paid': None},
        {'name': 'романо-германская (английская) филология', 'score_budget': None, 'score_paid': None},
        {'name': 'романо-германская (итальянская) филология', 'score_budget': None, 'score_paid': None},
        {'name': 'романо-германская (немецкая) филология', 'score_budget': None, 'score_paid': None},
        {'name': 'романо-германская (французская) филология', 'score_budget': None, 'score_paid': None},
        {'name': 'славянская (славянская и русская) филология', 'score_budget': None, 'score_paid': None},
        {'name': 'русская филология', 'score_budget': None, 'score_paid': None},
        {'name': 'химия (научно-педагогическая деятельность)', 'score_budget': 329, 'score_paid': None},
        {'name': 'химия', 'score_budget': 355, 'score_paid': 330},
        {'name': 'химия высоких энергий', 'score_budget': 351, 'score_paid': None},
        {'name': 'фундаментальная химия', 'score_budget': 357, 'score_paid': None},
        {'name': 'химия лекарственных соединений', 'score_budget': 358, 'score_paid': 324},
        {'name': 'менеджмент', 'score_budget': None, 'score_paid': None},
        {'name': 'финансы и кредит', 'score_budget': None, 'score_paid': None},
        {'name': 'экономика', 'score_budget': None, 'score_paid': None},
        {'name': 'экономическая информатика', 'score_budget': None, 'score_paid': None},
        {'name': 'экономическая безопасность', 'score_budget': None, 'score_paid': None},
        {'name': 'государственный аудит', 'score_budget': None, 'score_paid': None},
        {'name': 'политология', 'score_budget': None, 'score_paid': None},
        {'name': 'правоведение (сокращенный срок обучения)', 'score_budget': None, 'score_paid': None},
        {'name': 'правоведение', 'score_budget': None, 'score_paid': None},
        {'name': 'экономическое право', 'score_budget': None, 'score_paid': None},
        {'name': 'правоведение (профилизация - юрисконсультская работа в военной сфере)(м)', 'score_budget': None, 'score_paid': None},
        {'name': 'правоведение (профилизация - юрисконсультская работа в военной сфере)(ж)', 'score_budget': None, 'score_paid': None},
        {'name': 'международные отношения (профилизация – международные отношения в военной сфере)(м)', 'score_budget': None, 'score_paid': None},
        {'name': 'международные отношения (профилизация – международные отношения в информационной сфере)(м)', 'score_budget': None, 'score_paid': None},
        {'name': 'международные отношения (профилизация – международные отношения в информационной сфере)(ж)', 'score_budget': None, 'score_paid': None},
        {'name': 'геоинформационные системы (профилизация – геоинформационные системы (специальные)) (ж)', 'score_budget': 335, 'score_paid': None},
        {'name': 'геоинформационные системы (профилизация – геоинформационные системы (специальные)) (м)', 'score_budget': 359, 'score_paid': None},
        {'name': 'правоведение (профилизация - юрисконсультская работа в военной сфере)(м)', 'score_budget': 338, 'score_paid': None},
        {'name': 'правоведение (профилизация - юрисконсультская работа в военной сфере)(ж)', 'score_budget': 323, 'score_paid': None},
        {'name': 'международные отношения (профилизация – международные отношения в военной сфере)(м)', 'score_budget': 394, 'score_paid': None},
        {'name': 'международные отношения (профилизация – международные отношения в информационной сфере)(м)', 'score_budget': 335, 'score_paid': None},
        {'name': 'международные отношения (профилизация – международные отношения в информационной сфере)(ж)', 'score_budget': 359, 'score_paid': None},
        {'name': 'радиационная, химическая и биологическая защита', 'score_budget': 231, 'score_paid': None},
        {'name': 'маркетинг', 'score_budget': None, 'score_paid': 320},
        {'name': 'управление информационными ресурсами', 'score_budget': None, 'score_paid': 318},
        {'name': 'бизнес-администрирование', 'score_budget': None, 'score_paid': 346},
        {'name': 'логистика', 'score_budget': None, 'score_paid': 312},
    ]
    return manual_data

print("БГУ 2025 (бюджет | платно)")
print("=" * 100)
print(f"{'Бюдж':>5} | {'Плат':>5} | Специальность")
print("-" * 100)

data_2025 = clean_2025_data()
for item in data_2025:
    budget = f"{item['score_budget']}" if item['score_budget'] else "-"
    paid = f"{item['score_paid']}" if item['score_paid'] else "-"
    print(f"{budget:>5} | {paid:>5} | {item['name']}")
print(f"\nИтого: {len(data_2025)} специальностей")
