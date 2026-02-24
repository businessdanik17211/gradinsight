import pdfplumber

print("Analyzing БГУ2025.pdf structure...")
with pdfplumber.open("graduates/БГУ2025.pdf") as pdf:
    for page_num, page in enumerate(pdf.pages):
        print(f"\n{'='*80}")
        print(f"PAGE {page_num + 1}")
        print('='*80)
        tables = page.extract_tables()
        for i, table in enumerate(tables):
            print(f"\nTable {i+1}:")
            for row in table[:10]:
                print(f"  {row}")
            if len(table) > 10:
                print(f"  ... ({len(table)} total rows)")
