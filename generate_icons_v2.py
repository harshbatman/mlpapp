
from PIL import Image, ImageDraw, ImageFont

def create_icon(filename, bg_color, text_color):
    size = (1024, 1024)
    img = Image.new("RGBA", size, bg_color)
    draw = ImageDraw.Draw(img)

    # Load font - default if bold not found
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        title_font = ImageFont.truetype(font_path, 160)
        subtitle_font = ImageFont.truetype(font_path, 40)
    except Exception:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    title = "MAHTO"
    subtitle = "Land & Properties"
    
    # Measure text
    title_box = draw.textbbox((0, 0), title, font=title_font)
    title_w = title_box[2] - title_box[0]
    title_h = title_box[3] - title_box[1]
    
    subtitle_box = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_w = subtitle_box[2] - subtitle_box[0]
    subtitle_h = subtitle_box[3] - subtitle_box[1]
    
    # Calculate positions
    # Center vertically: (1024 - (title + gap + subtitle)) / 2
    gap = 40
    total_h = title_h + gap + subtitle_h
    start_y = (1024 - total_h) / 2
    
    title_x = (1024 - title_w) / 2
    title_y = start_y
    
    subtitle_x = (1024 - subtitle_w) / 2
    subtitle_y = title_y + title_h + gap
    
    # Draw
    draw.text((title_x, title_y), title, fill=text_color, font=title_font)
    draw.text((subtitle_x, subtitle_y), subtitle.upper(), fill=text_color, font=subtitle_font)
    
    img.save(filename)
    print(f"Generated {filename}")

if __name__ == "__main__":
    # Create the main icon (Black bg, White text)
    create_icon("assets/images/icon.png", "#000000", "#FFFFFF")
    # For Android adaptive icon foreground, usually transparent, but user asked for "black background white text".
    # Configuring app.json "backgroundColor": "#000000" handles the adaptive background.
    # The foreground should ideally be transparent with white text.
    # HOWEVER, the user said "dont genrate image variables" and "make the launcher icon also black background".
    # I will create a transparent foreground with white text for the adaptive setup.
    create_icon("assets/images/android-icon-foreground.png", (0, 0, 0, 0), "#FFFFFF")


