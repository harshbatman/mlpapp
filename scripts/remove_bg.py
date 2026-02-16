
from PIL import Image
import os

def remove_background(image_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    # We'll assume the background color is the color of the top-left pixel
    bg_color = datas[0]
    
    new_data = []
    for item in datas:
        # If the pixel color is very close to the background color, make it transparent
        # Using a threshold to handle slight variations in the background
        if all(abs(item[i] - bg_color[i]) < 30 for i in range(3)):
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(image_path)
    print(f"Background removed for {image_path}")

if __name__ == "__main__":
    image_path = "assets/images/categories/lands.png"
    if os.path.exists(image_path):
        remove_background(image_path)
    else:
        print(f"File not found: {image_path}")
