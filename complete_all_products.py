import json
import random

# Datos de ejemplo realistas para completar productos
WARRANTY_OPTIONS = [12, 18, 24, 36]  # meses de garantía
SHIPPING_DAYS = [1, 2, 3, 4, 5]      # días de envío
FREE_SHIPPING_CHANCE = 0.7           # 70% productos con envío gratis

SHIPPING_NOTES = [
    "Envío express disponible; zonas rurales 4-6 días.",
    "Producto de alta demanda; envío prioritario incluido.",
    "Herramienta profesional; envío prioritario incluido.",
    "Accesorio esencial; envío express disponible.",
    "Producto voluminoso; tiempo de envío extendido para carga especial.",
    "Equipo especializado; envío cuidadoso incluido.",
    "Kit completo incluido; envío protegido para componentes delicados.",
    "Herramienta de construcción profesional; incluye accesorios básicos.",
    "Equipo industrial premium; manejo especializado y envío asegurado.",
    "Disponible para entrega inmediata; zonas remotas 5-7 días.",
    "Envío gratuito en compras superiores a $200.000.",
    "Producto en stock; entrega garantizada en 1-3 días hábiles."
]

def complete_product_data(product):
    """Completa los datos faltantes de un producto"""
    required_fields = ['freeShipping', 'officialStore', 'warrantyMonths', 'shippingTimeDays', 'shippingNotes']
    
    missing_fields = []
    for field in required_fields:
        if field not in product or product[field] is None:
            missing_fields.append(field)
    
    if not missing_fields:
        return False  # Ya está completo
    
    # Completar campos faltantes
    if 'freeShipping' in missing_fields:
        product['freeShipping'] = random.random() < FREE_SHIPPING_CHANCE
    
    if 'officialStore' in missing_fields:
        product['officialStore'] = True  # Todos son tienda oficial
    
    if 'warrantyMonths' in missing_fields:
        product['warrantyMonths'] = random.choice(WARRANTY_OPTIONS)
    
    if 'shippingTimeDays' in missing_fields:
        product['shippingTimeDays'] = random.choice(SHIPPING_DAYS)
    
    if 'shippingNotes' in missing_fields:
        product['shippingNotes'] = random.choice(SHIPPING_NOTES)
    
    return True  # Se completó

def main():
    print("🔧 Completando TODOS los productos para WarrantyShipping...")
    print("=" * 60)
    
    # Cargar productos
    try:
        with open('src/services/products.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
    except Exception as e:
        print(f"❌ Error al cargar products.json: {e}")
        return
    
    print(f"📦 Total de productos: {len(products)}")
    
    updated_count = 0
    for product in products:
        was_updated = complete_product_data(product)
        if was_updated:
            updated_count += 1
            print(f"   ✅ ID {product['id']}: {product['name'][:40]}...")
    
    if updated_count == 0:
        print("🎉 ¡Todos los productos ya tenían información completa!")
        return
    
    # Guardar archivo actualizado
    try:
        with open('src/services/products.json', 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Archivo actualizado exitosamente!")
        print(f"📊 Productos completados: {updated_count}/{len(products)}")
        print("🎉 ¡TODOS los productos ahora tienen información completa para WarrantyShipping!")
    except Exception as e:
        print(f"❌ Error al guardar: {e}")

if __name__ == "__main__":
    main()