import os
import json
import re

# Ham HTML verilerinin bulunduğu girdi metni veya dosyası
raw_html_data = """
Women's Performance Gs Suit <a id="7620770693202" href="https://outdoorcollectivellc.pxf.io/c/6291870/3914972/52001?prodsku=7620770693202&u=https%3A%2F%2Fwww.spyder.com%2Fproducts%2Fwomens-performance-gs-suit&intsrc=PUI2_34091" target="_top"><img src="https://cdn.shopify.com/s/files/1/0080/6777/6627/files/38SD613602_BLK_GH_1.jpg?v=1789595985" border="0" alt=""/></a>
"""

def generate_unique_description(title):
    # İleride buraya Gemini API entegrasyonu ekleyerek 
    # başlığa özel tamamen özgün pazarlama metinleri üretebilirsin.
    return f"Experience unmatched quality and professional design with {title}. Crafted for top-tier performance."

def parse_html_to_json(html_content, region="us", brand_name="spyder"):
    products = []
    
    # HTML içindeki her bir satırı veya blokları ayıkla
    lines = html_content.strip().split('\n')
    
    for line in lines:
        if not line.strip():
            continue
            
        match_a = re.search(r'<a id="([^"]+)" href="([^"]+)"', line)
        match_img = re.search(r'<img src="([^"]+)"', line)
        title_part = line.split('<a')[0].strip()

        if match_a and match_img:
            product_id = match_a.group(1)
            product_link = match_a.group(2)
            product_image = match_img.group(1)
            product_title = title_part
            
            product_description = generate_unique_description(product_title)

            product_obj = {
                "id": product_id,
                "title": product_title,
                "image": product_image,
                "link": product_link,
                "description": product_description
            }
            products.append(product_obj)

    # Klasör yapısını oluştur (data/us/spyder.json gibi)
    output_dir = os.path.join("data", region)
    os.makedirs(output_dir, exist_ok=True)
    
    file_path = os.path.join(output_dir, f"{brand_name}.json")
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
        
    print(f"Başarılı! JSON dosyası oluşturuldu: {file_path}")

if __name__ == "__main__":
    # Test çalıştırması
    parse_html_to_json(raw_html_data, region="us", brand_name="spyder")
