import face_recognition
from PIL import Image, ImageDraw
import argparse
from pathlib import Path

# This is an -hacked- example of running face recognition on a single image
# and drawing a box around each person that was identified.
# It comes from the `examples` folder and I modified it to accept an image
# from the command line.

parser = argparse.ArgumentParser(description="Hacked example for DNTSPYEU")

parser.add_argument("--input-file", help="Source image")
args = parser.parse_args()

image_input_file = args.input_file if args.input_file else None 

if image_input_file is None:
    print("Please provide a source image with --input-file")
    exit(1)

print("Processing image " + image_input_file)
# Load the picture and find a face.
image = face_recognition.load_image_file(image_input_file)
face_encoding = face_recognition.face_encodings(image)[0]

face_landmarks_list = face_recognition.face_landmarks(image)
# print(face_landmarks_list)

face_location = face_recognition.face_locations(image)
face_encodings = face_recognition.face_encodings(image, face_location)

# Convert the image to a PIL-format image so that we can draw on top of it with the Pillow library
# See http://pillow.readthedocs.io/ for more about PIL/Pillow
pil_image = Image.fromarray(image)

# Create a Pillow ImageDraw Draw instance to draw with
draw = ImageDraw.Draw(pil_image)

# Two color codes in RGB format
electric_blue = (0, 74, 81)
lime_green = (163, 255, 238)

# Loop through each face found in the unknown image
for (top, right, bottom, left), face_encoding in zip(face_location, face_encodings):
    # See if the face is a match for the known face(s)

    # Draw a box around the face using the Pillow module
    draw.rectangle(((left, top), (right, bottom)), outline=electric_blue, width=5)

    # name = "Unknown"
    # Draw a label with a name below the face
    # text_width, text_height = draw.textsize(name)
    # draw.rectangle(((left, bottom - text_height - 10), (right, bottom)), fill=(0, 0, 255), outline=(0, 0, 255))
    # draw.text((left + 6, bottom - text_height - 5), name, fill=(255, 255, 255, 255))

for face_landmark_name in face_landmarks_list[0]:
    # Draw lines between consequential points
    points = face_landmarks_list[0][face_landmark_name]
    for i in range(len(points) - 1):
        draw.line([points[i], points[i + 1]], fill=lime_green, width=3)

    # Trace the last line to close the drawing
    draw.line([points[-1], points[0]], fill=lime_green, width=3)

# Remove the drawing library from memory as per the Pillow docs
del draw

# Display the resulting image
# pil_image.show()

# With pathlib we get the base filename 
path_obj = Path(image_input_file)

# And we then save a copy of the new image to disk 
pil_image.save('modded_' + path_obj.name)

# And we're done!
print("Done! Check the file modded_" + path_obj.name)