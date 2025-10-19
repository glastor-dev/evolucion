#!/usr/bin/env python3
import json
import random

def generate_warranty_data():
    """Genera datos realistas de garantía y envío para productos"""
    warranties = [12, 24, 36]  # meses comunes
    shipping_days = [1, 2, 3, 4, 5]  # días de envío
    shipping_notes = [
        "Envío express disponible; zonas rurales 4-6 días.",
        "Producto de alta demanda; envío prioritario incluido.",
        "Entrega en ciudades principales; zonas alejadas 3–5 días.",
        "Envío gratuito en compras superiores a $200.000.",
        "Disponible para entrega inmediata; zonas remotas 5-7 días.",
        "Envío express 24h disponible; costo adicional en zonas rurales.",
        "Producto en stock; entrega garantizada en 1-3 días hábiles.",
        "Envío prioritario incluido; zonas especiales consultar disponibilidad."
    ]
    
    return {
        "freeShipping": random.choice([True, False]),
        "officialStore": True,  # Todos son tienda oficial
        "warrantyMonths": random.choice(warranties),
        "shippingTimeDays": random.choice(shipping_days),
        "shippingNotes": random.choice(shipping_notes)
    }

# Cargar productos existentes
with open('src/services/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Campos necesarios
required_fields = ['freeShipping', 'officialStore', 'warrantyMonths', 'shippingTimeDays', 'shippingNotes']

updated_count = 0

print("Agregando campos faltantes a productos...")
print("=" * 50)

for product in products:
    missing_fields = []
    for field in required_fields:
        if field not in product or product[field] is None:
            missing_fields.append(field)
    
    if missing_fields:
        print(f"📦 Producto ID {product['id']}: {product['name'][:40]}...")
        print(f"   Agregando: {', '.join(missing_fields)}")
        
        # Generar datos para campos faltantes
        warranty_data = generate_warranty_data()
        for field in missing_fields:
            product[field] = warranty_data[field]
        
        updated_count += 1

print(f"\n✅ Actualizados {updated_count} productos")

# Guardar productos actualizados
with open('src/services/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print("✅ Archivo products.json actualizado exitosamente")

# Verificar que todos los productos ahora tienen los campos
print("\n🔍 Verificación final:")
complete_products = 0
for product in products:
    has_all_fields = all(field in product and product[field] is not None for field in required_fields)
    if has_all_fields:
        complete_products += 1

print(f"✅ Productos completos: {complete_products}/{len(products)}")
if complete_products == len(products):
    print("🎉 ¡Todos los productos ahora tienen información completa para WarrantyShipping!")
else:
    print("⚠️  Aún hay productos incompletos")