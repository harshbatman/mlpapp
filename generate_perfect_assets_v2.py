
from PIL import Image, ImageDraw, ImageFont

def create_image(filename, bg_color):
    size = (1024, 1024)
    img = Image.new("RGBA", size, bg_color)
    
    draw = ImageDraw.Draw(img)
    
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        title_font = ImageFont.truetype(font_path, 160)
        subtitle_font = ImageFont.truetype(font_path, 32)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    title = "MAHTO"
    subtitle = "LAND & PROPERTIES"
    
    # Measure Title
    tb = draw.textbbox((0, 0), title, font=title_font)
    title_w = tb[2] - tb[0]
    title_h = tb[3] - tb[1]
    
    # Calculate Center Y
    # Layout:
    # Title
    # Gap (40)
    # Subtitle
    
    sb = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_h = sb[3] - sb[1]
    
    total_h = title_h + 40 + subtitle_h
    start_y = (1024 - total_h) / 2
    
    title_x = (1024 - title_w) / 2
    
    # Draw Title
    draw.text((title_x, start_y), title, font=title_font, fill="white")
    
    # Draw Subtitle - Spaced to match Title Width
    subtitle_len = len(subtitle)
    
    # Width of characters only (sum)
    char_w_sum = 0
    for c in subtitle:
        cb = draw.textbbox((0, 0), c, font=subtitle_font)
        char_w_sum += (cb[2] - cb[0])
    
    # Remaining space to distribute
    total_space = title_w - char_w_sum
    if subtitle_len > 1:
        gap_per_char = total_space / (subtitle_len - 1)
    else:
        gap_per_char = 0
        
    current_x = title_x
    sub_y = start_y + title_h + 40
    
    for c in subtitle:
        draw.text((current_x, sub_y), c, font=subtitle_font, fill="white")
        cb = draw.textbbox((0, 0), c, font=subtitle_font)
        w = cb[2] - cb[0]
        current_x += w + gap_per_char
        
    img.save(filename)
    print(f"Generated {filename}")

if __name__ == "__main__":
    create_image("assets/images/icon.png", "black")
    create_image("assets/images/splash-icon.png", (0,0,0,0))
    create_image("assets/images/android-icon-foreground.png", (0,0,0,0))
    create_image("assets/images/android-icon-background.png", "black")
    create_image("assets/images/android-icon-monochrome.png", (0,0,0,0))
    create_image("assets/images/favicon.png", "black")

