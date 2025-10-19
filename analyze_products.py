#!/usr/bin/env python3
import json

# Cargar los productos
with open('src/services/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Campos necesarios para WarrantyShipping
required_fields = ['freeShipping', 'officialStore', 'warrantyMonths', 'shippingTimeDays', 'shippingNotes']

print('Análisis de productos con campos faltantes para WarrantyShipping:')
print('=' * 70)

incomplete_products = []
complete_products = []

for product in products:
    missing_fields = []
    for field in required_fields:
        if field not in product or product[field] is None:
            missing_fields.append(field)
    
    if missing_fields:
        incomplete_products.append({
            'id': product['id'],
            'name': product['name'][:50] + '...' if len(product['name']) > 50 else product['name'],
            'missing': missing_fields
        })
    else:
        complete_products.append({
            'id': product['id'],
            'name': product['name'][:50] + '...' if len(product['name']) > 50 else product['name']
        })

print(f'✅ Productos COMPLETOS ({len(complete_products)}):')
for product in complete_products:
    print(f'  - ID {product["id"]}: {product["name"]}')

print(f'\n❌ Productos INCOMPLETOS ({len(incomplete_products)}):')
for product in incomplete_products[:10]:  # Solo primeros 10 
    print(f'  - ID {product["id"]}: {product["name"]}')
    print(f'    Faltan: {", ".join(product["missing"])}')
    print()

print(f'\nRESUMEN:')
print(f'- Productos completos: {len(complete_products)}/{len(products)}')
print(f'- Productos incompletos: {len(incomplete_products)}/{len(products)}')

# Mostrar los campos que faltan más frecuentemente
from collections import Counter
all_missing = []
for product in incomplete_products:
    all_missing.extend(product['missing'])

missing_counts = Counter(all_missing)
print(f'\n📊 Campos faltantes más comunes:')
for field, count in missing_counts.most_common():
    print(f'  - {field}: {count} productos')