import os
import sys
from rembg import remove
from PIL import Image

def process_images(directory):
    # Process only PNGs that aren't already processed
    for filename in os.listdir(directory):
        if filename.endswith(".png") and not filename.endswith("_nobg.png") and filename != "yuun_logo png.png" and filename != "YUNN_Web_image_1.png":
            input_path = os.path.join(directory, filename)
            output_path = os.path.join(directory, filename.replace(".png", "_nobg.png"))
            
            print(f"Processing {filename}...")
            try:
                # Open image
                with open(input_path, "rb") as i:
                    input_data = i.read()
                
                # Remove background
                output_data = remove(input_data)
                
                # Save result
                with open(output_path, "wb") as o:
                    o.write(output_data)
                print(f"Saved {output_path}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    process_images("image")
