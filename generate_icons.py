from PIL import Image, ImageDraw, ImageFont
import os

def create_text_icon(filename, bg_color, text_color, transparent=False):
    size = (1024, 1024)
    if transparent:
        img = Image.new('RGBA', size, (0, 0, 0, 0))
    else:
        img = Image.new('RGB', size, bg_color)
    
    draw = ImageDraw.Draw(img)
    
    # Load font - trying to find a bold sans-serif
    try:
        # Common paths for linux
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if not os.path.exists(font_path):
             font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
        
        # Title "MAHTO"
        title_font = ImageFont.truetype(font_path, 160)
        # Subtitle "Land & Properties"
        subtitle_font = ImageFont.truetype(font_path, 40)
    except Exception:
        # Fallback if specific fonts fail
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Calculate text positions to center them
    # Center is 512, 512
    
    title = "MAHTO"
    subtitle = "Land & Properties"
    
    # Get text sizes
    # Using getbbox because getsize is deprecated in newer Pillows
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_w = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_h = subtitle_bbox[3] - subtitle_bbox[1]
    
    # Spacing
    gap = 30
    
    total_h = title_h + gap + subtitle_h
    
    start_y = (1024 - total_h) // 2
    
    # Draw Title
    draw.text(((1024 - title_w) // 2, start_y), title, font=title_font, fill=text_color)
    
    # Draw Subtitle
    draw.text(((1024 - subtitle_w) // 2, start_y + title_h + gap), subtitle.upper(), font=subtitle_font, fill=text_color)
    
    # Save
    img.save(f"assets/images/{filename}")
    print(f"Generated {filename}")

if __name__ == "__main__":
    # 1. Main Icon: Black background, White text
    create_text_icon("icon.png", "#000000", "#FFFFFF", transparent=False)
    
    # 2. Adaptive Foreground: Transparent background, White text
    # Note: Android adaptive icons shave off closer to 72dp mask, so we need to ensure text is centered and safe.
    # The current sizing (160 font) should be safe within the 66% safe zone of 1024x1024.
    create_text_icon("android-icon-foreground.png", "#000000", "#FFFFFF", transparent=True)

