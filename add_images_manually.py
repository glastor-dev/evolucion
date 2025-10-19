#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script interactivo para agregar imágenes manualmente a productos específicos.
Útil para productos sin detailsUrl o con URLs personalizadas.
"""

import json
import sys

def add_images_manually(product_id, image_urls, input_file='src/services/products.json', output_file=None):
    """
    Agrega URLs de imágenes manualmente a un producto específico.
    
    Args:
        product_id: ID del producto (ej: "1", "4", "7")
        image_urls: Lista de URLs de imágenes o una sola URL
        input_file: Ruta al archivo JSON de productos
        output_file: Ruta de salida (usa input_file si es None)
    """
    if output_file is None:
        output_file = input_file
    
    if isinstance(image_urls, str):
        image_urls = [image_urls]
    
    # Leer productos
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            products = json.load(f)
    except Exception as e:
        print(f"❌ Error al leer {input_file}: {e}")
        return False
    
    # Buscar producto
    product = None
    for p in products:
        if str(p.get('id')) == str(product_id):
            product = p
            break
    
    if not product:
        print(f"❌ Producto con ID '{product_id}' no encontrado")
        return False
    
    # Obtener galería actual
    current_gallery = product.get('imageGallery', [])
    if not current_gallery:
        current_gallery = []
        if product.get('image'):
            current_gallery = [product['image']]
    
    original_count = len(current_gallery)
    
    # Agregar nuevas imágenes (sin duplicados)
    added_count = 0
    for url in image_urls:
        if url and url not in current_gallery:
            current_gallery.append(url)
            added_count += 1
    
    product['imageGallery'] = current_gallery
    
    # Guardar
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Producto '{product.get('name', '?')[:50]}' actualizado")
        print(f"   📊 Galería: {original_count} → {len(current_gallery)} imágenes (+{added_count})")
        print(f"📁 Guardado en: {output_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error al guardar: {e}")
        return False


def interactive_mode():
    """Modo interactivo para agregar imágenes."""
    print("="*60)
    print("🖼️  AGREGAR IMÁGENES MANUALMENTE A PRODUCTOS")
    print("="*60)
    
    # Leer productos disponibles
    try:
        with open('src/services/products.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    print(f"\n📦 Productos disponibles ({len(products)} total):\n")
    
    # Mostrar solo productos sin galería completa
    products_without_gallery = []
    for p in products:
        gallery_count = len(p.get('imageGallery', []))
        if gallery_count <= 1:
            products_without_gallery.append(p)
            print(f"   • ID: {p['id']:>3} | Galería: {gallery_count} imagen(es) | {p.get('name', '?')[:50]}")
    
    if not products_without_gallery:
        print("✅ Todos los productos tienen galerías completas!")
        return
    
    print(f"\n{'='*60}")
    print("💡 Uso:")
    print("   python add_images_manually.py <product_id> <url1> [url2] [url3]...")
    print("\nEjemplo:")
    print('   python add_images_manually.py 4 "https://cdn.makita.com/image1.png" "https://cdn.makita.com/image2.png"')
    print(f"{'='*60}\n")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        # Modo interactivo
        interactive_mode()
    else:
        # Modo comando: python script.py <id> <url1> <url2> ...
        product_id = sys.argv[1]
        image_urls = sys.argv[2:]
        
        print(f"\n📸 Agregando {len(image_urls)} imagen(es) al producto ID: {product_id}\n")
        add_images_manually(product_id, image_urls)
