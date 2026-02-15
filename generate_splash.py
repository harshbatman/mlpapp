from PIL import Image, ImageDraw, ImageFont

def create_splash():
    size = (1024, 1024)
    # 0,0,0,255 is opaque black
    img = Image.new("RGBA", size, (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        # Adjusted sizes to mimic the relationship in _layout.tsx (80 vs 16 with spacing)
        # 80/16 = 5. Here let's scale up for image resolution.
        # 1024 width.
        # Let's try 140 for Title.
        title_font = ImageFont.truetype(font_path, 140)
        subtitle_font = ImageFont.truetype(font_path, 28) # 140/5 = 28
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    title = "MAHTO"
    subtitle = "LAND & PROPERTIES"
    
    # Measure
    # Using textbbox if available (Pillow >= 9.2.0)
    if hasattr(draw, "textbbox"):
        tb = draw.textbbox((0, 0), title, font=title_font)
        tw = tb[2] - tb[0]
        th = tb[3] - tb[1]
        
        sb = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        sw = sb[2] - sb[0]
        sh = sb[3] - sb[1]
    else:
        tw, th = draw.textsize(title, font=title_font)
        sw, sh = draw.textsize(subtitle, font=subtitle_font)
    
    # Calculate spacing
    gap = 40
    total_h = th + gap + sh
    
    start_y = (1024 - total_h) / 2
    
    # Draw Title
    draw.text(((1024 - tw) / 2, start_y), title, font=title_font, fill="white")
    
    # For subtitle, we want to match the width of title visually (letter spacing).
    # Since we can't easily do letter spacing in simple PIL draw.text without a loop,
    # let's just approximate by drawing character by character or simply center it.
    # The user asked for "preview", so a close approximation is fine.
    # Let's just center it for now, as exact letter spacing logic in PIL is verbose.
    
    draw.text(((1024 - sw) / 2, start_y + th + gap), subtitle, font=subtitle_font, fill=(255, 255, 255, 180))
    
    img.save("assets/images/splash-icon.png")
    print("Generated splash-icon.png")

if __name__ == "__main__":
    create_splash()
