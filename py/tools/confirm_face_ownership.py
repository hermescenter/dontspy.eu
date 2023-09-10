import face_recognition
import argparse
import json

parser = argparse.ArgumentParser(description='Recognize Faces in Pictures')

# Configure arguments 
parser.add_argument('--truth', '-t', type=str, required=True, help='Source of Thruth (image)')
parser.add_argument('--source', '-s', type=str, required=True, help='Image to compare with the Truth')
parser.add_argument('--output', '-o', type=str, required=True, help='Output JSON file')

args = parser.parse_args()
# Now the options should be available as args.source and args.output

# Load the jpg files into numpy arrays
truth_image = face_recognition.load_image_file(args.truth)
unknown_image = face_recognition.load_image_file(args.source)

# Get the face encodings for each face in each image file
# Since there could be more than one face in each image, it returns a list of encodings.
# But since I know each image only has one face, I only care about the first encoding in each image, so I grab index 0.
try:
    truth_face_encoding = face_recognition.face_encodings(truth_image)[0]
    unknown_face_encoding = face_recognition.face_encodings(unknown_image)[0]
except IndexError:
    print("I wasn't able to locate any faces in at least one of the images. Check the image files. Aborting...")
    quit()

# results is an array of True/False telling if the unknown face matched anyone in the known_faces array
results = face_recognition.compare_faces([ truth_face_encoding ], unknown_face_encoding)
# Potentially a list of pictures from the source of thurth can go here

# This list constains True or False to the answer "is the same person?"
print("The faces in the file {} and the other in {} are the same person? {}".format(args.truth, args.source, results[0]))

with open(args.output, 'w') as outfile:
    determination = {
        "truth": args.truth,
        "source": args.source,
        "isTheSame": bool(results[0]),
    }
    json.dump(determination, outfile)
    print("Saved result to " + args.output)

