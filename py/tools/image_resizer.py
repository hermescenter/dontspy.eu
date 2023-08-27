
def resize_image_within_range(image_path, target_min_width, target_max_width, target_min_height, target_max_height):
    # Open the image
    image = Image.open(image_path)

    # Get the original dimensions of the image
    original_width, original_height = image.size

    # Calculate the resized dimensions based on the desired range
    new_width = original_width
    new_height = original_height

    # Resize width if necessary
    if original_width > target_max_width:
        new_width = target_max_width
    elif original_width < target_min_width:
        new_width = target_min_width

    # Resize height if necessary
    if original_height > target_max_height:
        new_height = target_max_height
    elif original_height < target_min_height:
        new_height = target_min_height

    # Resize the image proportionally
    image = image.resize((new_width, new_height), Image.ANTIALIAS)

    return image

# Desired minimum and maximum dimensions
min_width = 100
max_width = 800
min_height = 100
max_height = 600


# Resize the image
resized_image = resize_image_within_range(image_path, min_width, max_width, min_height, max_height)

