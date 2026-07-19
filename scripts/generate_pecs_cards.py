import os
import sys
from PIL import Image, ImageDraw, ImageFont

def remove_checkerboard(img):
    img = img.convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        max_val = max(r, g, b)
        min_val = min(r, g, b)
        diff = max_val - min_val
        
        # High-sensitivity filter for removing checkerboard grids
        # Grayscale pixels (difference < 40) with brightness > 160
        if a > 0 and (diff < 40) and (min_val > 160):
            new_data.append((255, 255, 255, 0)) # Make it transparent
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img

def create_pecs_card(source_path, text, output_path):
    W, H = 2048, 2048
    
    border_color = (30, 43, 75, 255) # Dark navy (#1e2b4b)
    bg_cream = (250, 246, 235, 255) # Light cream (#faf6eb)
    bg_white = (255, 255, 255, 255) # White (#ffffff)
    
    # 1. Create rounded corner mask
    mask = Image.new("L", (W, H), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(12, 12), (W-12, H-12)], radius=120, fill=255)
    
    # 2. Base background layers
    bg = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)
    bg_draw.rectangle([(0, 0), (W, 1536)], fill=bg_cream) # Cream upper 3/4
    bg_draw.rectangle([(0, 1536), (W, H)], fill=bg_white) # White lower 1/4
    
    card_face = Image.composite(bg, Image.new("RGBA", (W, H), (0, 0, 0, 0)), mask)
    
    # 3. Navy divider and border
    card_draw = ImageDraw.Draw(card_face)
    card_draw.line([(0, 1536), (W, 1536)], fill=border_color, width=12)
    card_draw.rounded_rectangle([(12, 12), (W-12, H-12)], radius=120, outline=border_color, width=12)
    
    # 4. Load, crop and clean illustration
    if os.path.exists(source_path):
        illustration = Image.open(source_path).convert("RGBA")
        
        # If the source is an existing full webp card (1024x1024), crop the center illustration area first
        if illustration.size == (1024, 1024):
            # Crop the bounding box of the illustration
            illustration = illustration.crop((200, 100, 824, 724))
            
        # Run background checkerboard transparentizer
        illustration = remove_checkerboard(illustration)
        
        ill_w, ill_h = illustration.size
        scale = min(1100 / ill_w, 1100 / ill_h)
        new_w, new_h = int(ill_w * scale), int(ill_h * scale)
        illustration = illustration.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Center in cream area
        offset_x = (W - new_w) // 2
        offset_y = (1536 - new_h) // 2
        
        card_face.alpha_composite(illustration, (offset_x, offset_y))
    else:
        print(f"Error: Source image not found: {source_path}")
        return
        
    # 5. Write navy text
    font_path = "C:\\Windows\\Fonts\\malgunbd.ttf"
    font_size = 240 if len(text) <= 3 else 180
    if len(text) > 5:
        font_size = 130
        
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        font = ImageFont.load_default()
        
    text_draw = ImageDraw.Draw(card_face)
    left, top, right, bottom = text_draw.textbbox((0, 0), text, font=font)
    text_w = right - left
    text_h = bottom - top
    
    text_x = (W - text_w) // 2
    text_y = 1536 + (512 - text_h) // 2 - top // 2
    
    text_draw.text((text_x, text_y), text, fill=border_color, font=font)
    
    # 6. Save as final 1024x1024 WebP
    final_card = card_face.resize((1024, 1024), Image.Resampling.LANCZOS)
    final_card.save(output_path, "WEBP", quality=95)
    print(f"Successfully compiled card to {output_path} ('{text}')")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python generate_pecs_cards.py <source_path> <text> <output_path>")
    else:
        create_pecs_card(sys.argv[1], sys.argv[2], sys.argv[3])
