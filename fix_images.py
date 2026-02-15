import os
from PIL import Image

cities_dir = "assets/images/cities"

for filename in os.listdir(cities_dir):
    if filename.endswith(".png"):
        filepath = os.path.join(cities_dir, filename)
        try:
            with Image.open(filepath) as img:
                if img.format == "JPEG":
                    print(f"Converting {filename} from JPEG to PNG...")
                    # Convert to RGB first to ensure we can save as PNG (though JPEG is already RGB/CMYK)
                    rgb_img = img.convert("RGB")
                    rgb_img.save(filepath, "PNG")
                    print(f"Successfully converted {filename}")
                else:
                    print(f"{filename} is already {img.format}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
