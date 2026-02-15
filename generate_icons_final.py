
from PIL import Image, ImageDraw, ImageFont

def create_icon(filename, bg_color, text_color):
    size = (1024, 1024)
    img = Image.new("RGBA", size, bg_color)
    draw = ImageDraw.Draw(img)

    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        font_mahto = ImageFont.truetype(font_path, 160)
        font_land = ImageFont.truetype(font_path, 40)
    except IOError:
        font_mahto = ImageFont.load_default()
        font_land = ImageFont.load_default()

    text_mahto = "MAHTO"
    text_land = "Land & Properties"

    # Calculate text sizes
    # textsize is deprecated, use textbbox or getsize
    # For older PIL versions, textsize is fine. For newer, textbbox
    if hasattr(draw, "textbbox"):
        bbox_mahto = draw.textbbox((0, 0), text_mahto, font=font_mahto)
        w_mahto = bbox_mahto[2] - bbox_mahto[0]
        h_mahto = bbox_mahto[3] - bbox_mahto[1]

        bbox_land = draw.textbbox((0, 0), text_land, font=font_land)
        w_land = bbox_land[2] - bbox_land[0]
        h_land = bbox_land[3] - bbox_land[1]
    else:
        w_mahto, h_mahto = draw.textsize(text_mahto, font=font_mahto)
        w_land, h_land = draw.textsize(text_land, font=font_land)

    # Center position
    total_h = h_mahto + h_land + 20
    start_y = (1024 - total_h) / 2

    x_mahto = (1024 - w_mahto) / 2
    y_mahto = start_y

    x_land = (1024 - w_land) / 2
    y_land = y_mahto + h_mahto + 20

    # Draw text
    draw.text((x_mahto, y_mahto), text_mahto, fill=text_color, font=font_mahto)
    draw.text((x_land, y_land), text_land.upper(), fill=text_color, font=font_land)

    img.save(filename)
    print(f"Generated {filename}")

if __name__ == "__main__":
    create_icon("assets/images/icon.png", (0, 0, 0, 255), (255, 255, 255, 255))
    create_icon("assets/images/android-icon-foreground.png", (0, 0, 0, 0), (255, 255, 255, 255))

