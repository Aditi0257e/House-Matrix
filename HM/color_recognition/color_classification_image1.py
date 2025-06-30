import cv2
import numpy as np
from color_recognition_api import color_histogram_feature_extraction
from color_recognition_api import knn_classifier
import os


COLOR_HEX_MAP = {
    'Black': '#000000',
    'Blue': '#0000FF',
    'Cyan': '#00FFFF',
    'Gray': '#808080',
    'Green': '#008000',
    'Lime': '#00FF00',
    'Magenta': '#FF00FF',
    'Maroon': '#800000',
    'Navy': '#000080',
    'Olive': '#808000',
    'Purple': '#800080',
    'Red': '#FF0000',
    'Silver': '#C0C0C0',
    'Teal': '#008080',
    'White': '#FFFFFF',
    'Yellow': '#FFFF00'
}


def predict_color(image_path):
    """
    Predict the color of the image at the given path and return color name, RGB, and Hex.
    """
    if not image_path:
        print("No image path provided.")
        return None

    source_image = cv2.imread(image_path)
    if source_image is None:
        print("Failed to load image.")
        return None

    prediction = 'n.a.'

    # Ensure training data exists
    PATH = './training.data'
    if not os.path.isfile(PATH) or not os.access(PATH, os.R_OK):
        print('Training data is being created...')
        open('training.data', 'w').close()
        color_histogram_feature_extraction.training()
        print('Training data is ready, classifier is loading...')

    # Get the predicted color name
    color_histogram_feature_extraction.color_histogram_of_test_image(source_image)
    prediction = knn_classifier.main('training.data', 'test.data')
    print('Detected color name:', prediction)

    # Calculate average RGB color
    avg_color_per_row = np.average(source_image, axis=0)
    avg_color = np.average(avg_color_per_row, axis=0)
    rgb_tuple = tuple(map(int, avg_color))  # Convert to (R, G, B)

    # Convert RGB to Hex
    hex_color = '#%02x%02x%02x' % rgb_tuple
    standard_hex = COLOR_HEX_MAP.get(prediction, '#000000')
    print(standard_hex)
    return {
        "color_name": prediction,
        "rgb": rgb_tuple,
        "hex": standard_hex
    }
