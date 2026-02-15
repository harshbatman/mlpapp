
from PIL import Image, ImageDraw, ImageFont

def create_icon(bg_color, fg_color, filename, transparent=False):
    img = Image.new("RGBA", (1024, 1024), bg_color)
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
    w_mahto, h_mahto = draw.textsize(text_mahto, font=font_mahto)
    w_land, h_land = draw.textsize(text_land, font=font_land)

    # Center position
    x_mahto = (1024 - w_mahto) / 2
    y_mahto = (1024 - (h_mahto + h_land + 20)) / 2

    x_land = (1024 - w_land) / 2
    y_land = y_mahto + h_mahto + 20

    # Draw text
    draw.text((x_mahto, y_mahto), text_mahto, fill=fg_color, font=font_mahto)
    draw.text((x_land, y_land), text_land, fill=fg_color, font=font_land)

    img.save(filename)

create_icon((0, 0, 0, 255), (255, 255, 255, 255), "assets/images/icon.png")
create_icon((0, 0, 0, 0), (255, 255, 255, 255), "assets/images/android-icon-foreground.png", transparent=True)

