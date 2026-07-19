import sys
from PIL import Image, ImageDraw

def draw_robot_brain(output_path):
    # Create 1600x1600 image for super-sampled anti-aliased clean rendering (final downscale to 800x800)
    W, H = 1600, 1600
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    navy = (30, 43, 75, 255)
    light_blue = (173, 216, 230, 255)
    cyan = (0, 180, 216, 255)
    brain_pink = (255, 128, 160, 255)
    led_green = (50, 205, 50, 255)
    led_yellow = (255, 215, 0, 255)
    cheek_pink = (255, 200, 200, 255)
    
    # 1. Antennas (Left & Right)
    # Antenna stems
    draw.line([(600, 450), (450, 250)], fill=navy, width=32)
    draw.line([(1000, 450), (1150, 250)], fill=navy, width=32)
    # Antenna bulbs
    draw.ellipse([(400, 200), (500, 300)], fill=led_yellow, outline=navy, width=24)
    draw.ellipse([(1100, 200), (1200, 300)], fill=led_yellow, outline=navy, width=24)
    
    # 2. Ears
    draw.rounded_rectangle([(300, 750), (370, 950)], radius=32, fill=light_blue, outline=navy, width=24)
    draw.rounded_rectangle([(1230, 750), (1300, 950)], radius=32, fill=light_blue, outline=navy, width=24)
    
    # 3. Glass Dome (Upper Head for Brain visibility)
    # Fill the dome with light blue translucent color
    dome_mask = Image.new("L", (W, H), 0)
    dome_mask_draw = ImageDraw.Draw(dome_mask)
    dome_mask_draw.chord([(350, 380), (1250, 1280)], 180, 360, fill=255)
    
    dome_surface = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dome_surf_draw = ImageDraw.Draw(dome_surface)
    dome_surf_draw.chord([(350, 380), (1250, 1280)], 180, 360, fill=(230, 245, 255, 200), outline=navy, width=32)
    
    # 4. Draw the Brain wires (Mechanical/Digital brain style)
    # Left hemisphere brain folds (Pink curls)
    dome_surf_draw.arc([(500, 480), (750, 730)], 90, 270, fill=brain_pink, width=36)
    dome_surf_draw.arc([(550, 530), (750, 730)], 270, 90, fill=brain_pink, width=36)
    dome_surf_draw.arc([(500, 580), (700, 780)], 90, 270, fill=brain_pink, width=36)
    
    # Right hemisphere brain folds (Pink curls)
    dome_surf_draw.arc([(850, 480), (1100, 730)], 270, 90, fill=brain_pink, width=36)
    dome_surf_draw.arc([(850, 530), (1050, 730)], 90, 270, fill=brain_pink, width=36)
    dome_surf_draw.arc([(900, 580), (1100, 780)], 270, 90, fill=brain_pink, width=36)
    
    # Center connection bridge (Stem)
    dome_surf_draw.line([(760, 680), (840, 680)], fill=brain_pink, width=36)
    dome_surf_draw.line([(800, 680), (800, 800)], fill=brain_pink, width=36)
    
    # Digital LED nodes on the brain folds
    dome_surf_draw.ellipse([(620, 500), (660, 540)], fill=cyan, outline=navy, width=8)
    dome_surf_draw.ellipse([(940, 500), (980, 540)], fill=cyan, outline=navy, width=8)
    dome_surf_draw.ellipse([(580, 660), (620, 700)], fill=led_green, outline=navy, width=8)
    dome_surf_draw.ellipse([(980, 660), (1020, 700)], fill=led_green, outline=navy, width=8)
    
    # Crop dome surface to chord shape
    img.alpha_composite(dome_surface)
    
    # 5. Robot Lower Face (Solid plate)
    # Draw lower head rectangle
    draw.rounded_rectangle([(350, 700), (1250, 1150)], radius=64, fill=(255, 255, 255, 255), outline=navy, width=32)
    # Re-draw the boundary line to separate dome and face cleanly
    draw.line([(366, 700), (1234, 700)], fill=navy, width=32)
    
    # 6. Face Details (Eyes, Cheeks, Mouth)
    # Eyes (Left & Right)
    draw.ellipse([(500, 800), (620, 920)], fill=navy)
    draw.ellipse([(980, 800), (1100, 920)], fill=navy)
    # Eye highlights
    draw.ellipse([(540, 820), (590, 870)], fill=(255, 255, 255, 255))
    draw.ellipse([(1020, 820), (1070, 870)], fill=(255, 255, 255, 255))
    
    # Cheeks
    draw.ellipse([(440, 910), (520, 960)], fill=cheek_pink)
    draw.ellipse([(1080, 910), (1160, 960)], fill=cheek_pink)
    
    # Mouth (Cute Smile)
    draw.arc([(700, 880), (900, 1000)], 30, 150, fill=navy, width=24)
    
    # 7. Final resizing for maximum smoothness (Lanczos)
    final_img = img.resize((800, 800), Image.Resampling.LANCZOS)
    final_img.save(output_path, "PNG")
    print(f"Successfully drew robot brain illustration: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python draw_robot_brain.py <output_path>")
    else:
        draw_robot_brain(sys.argv[1])
