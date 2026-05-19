import sys
from rembg import remove

try:
    with open("image/YUNN_Web_image_1.png", "rb") as i:
        input_data = i.read()
    output_data = remove(input_data)
    with open("image/YUNN_Web_image_1_nobg.png", "wb") as o:
        o.write(output_data)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
