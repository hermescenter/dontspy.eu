import face_recognition
from PIL import Image, ImageDraw
import argparse
import argparse
import json

# This is an -hacked- example of running face recognition on a single image
# and drawing a box around each person that was identified.
# It comes from the `examples` folder and I modified it to accept an image
# from the command line.

parser = argparse.ArgumentParser(description='Recognize Faces in Pictures')

# Configure arguments 
parser.add_argument('--source', '-s', type=str, required=True, help='Input image')
parser.add_argument('--output', '-o', type=str, required=True, help='Output image file')
parser.add_argument('--config', '-c', type=str, help='optional JSON config file to change the color/width of the boxes')

args = parser.parse_args()

# Now the options should be available as args.source and args.output
print("Processing image " + args.source)

# Load the picture and find a face.
image = face_recognition.load_image_file(args.source)

if not face_recognition and not face_recognition.face_locations(image):
    print("No faces found in the image, file rejected")
    exit(1)

if len(face_recognition.face_encodings(image)) == 0:
    print("No faces found in the image, file rejected")
    exit(1)

# print the JSON representation of the face encodings
print (json.dumps(face_recognition.face_encodings(image)[0].tolist()))

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
box_color = "#ff2020"
landmarks_color = (163, 255, 238)
box_width = 3
landmarks_width = 2

if args.config:
    with open(args.config) as json_file:
        data = json.load(json_file)
        box_color = data['box_color']
        box_width = data['box_width']
        landmarks_color = data['landmarks_color']
        landmarks_width = data['landmarks_width']
        print("Loaded colos from config file " + args.config)

# Loop through each face found in the unknown image
for (top, right, bottom, left), face_encoding in zip(face_location, face_encodings):
    # See if the face is a match for the known face(s)

    # Draw a box around the face using the Pillow module
    draw.rectangle(((left, top), (right, bottom)), outline=box_color, width=box_width)

    # This second rectangle is meant because sometime the first one can have overlapping
    # colors, and this is hardcoded to be a yellow that contrasts with the default red.
    draw.rectangle(((left -2, top +2), (right +2, bottom -2)), outline='#ffff0a', width=box_width)

    # name = "Unknown"
    # Draw a label with a name below the face
    # text_width, text_height = draw.textsize(name)
    # draw.rectangle(((left, bottom - text_height - 10), (right, bottom)), fill=(0, 0, 255), outline=(0, 0, 255))
    # draw.text((left + 6, bottom - text_height - 5), name, fill=(255, 255, 255, 255))

for face_landmark_name in face_landmarks_list[0]:

    if not face_landmarks_list[0] or (face_landmarks_list[0] and face_landmarks_list[0][face_landmark_name] is None):
        print("No landmarks found for " + face_landmark_name)
        exit(1)
    
    # Draw lines between consequential points
    points = face_landmarks_list[0][face_landmark_name]
    for i in range(len(points) - 1):
        draw.line([points[i], points[i + 1]], fill=landmarks_color, width=landmarks_width)

    # Trace the last line to close the drawing
    draw.line([points[-1], points[0]], fill=landmarks_color, width=landmarks_width)

# Remove the drawing library from memory as per the Pillow docs
del draw

# Display the resulting image
# pil_image.show()

# And we then save a copy of the new image to disk 
pil_image.save(args.output)

# And we're done!
print("Done! Check the file " + args.output)
