import json

# Cargar productos
with open('src/services/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

required_fields = ['freeShipping', 'officialStore', 'warrantyMonths', 'shippingTimeDays', 'shippingNotes']

print("🔍 Verificando TODOS los productos para WarrantyShipping...")
print("=" * 60)

incomplete = []
complete = []

for product in products:
    missing = [field for field in required_fields if field not in product or product[field] is None]
    
    if missing:
        incomplete.append({
            'id': product['id'], 
            'name': product['name'][:40] + '...' if len(product['name']) > 40 else product['name'],
            'missing': missing
        })
    else:
        complete.append(product['id'])

print(f"✅ PRODUCTOS COMPLETOS: {len(complete)}")
for pid in complete:
    print(f"   ✓ ID {pid}")

print(f"\n❌ PRODUCTOS INCOMPLETOS: {len(incomplete)}")
for item in incomplete:
    print(f"   ✗ ID {item['id']}: {item['name']}")
    print(f"     Faltan: {', '.join(item['missing'])}")

print(f"\n📊 RESUMEN:")
print(f"   Completos: {len(complete)}/{len(products)} ({len(complete)/len(products)*100:.1f}%)")
print(f"   Incompletos: {len(incomplete)}/{len(products)} ({len(incomplete)/len(products)*100:.1f}%)")

if len(incomplete) == 0:
    print("\n🎉 ¡TODOS los productos tienen información completa para WarrantyShipping!")
else:
    print(f"\n⚠️  Faltan {len(incomplete)} productos por completar")