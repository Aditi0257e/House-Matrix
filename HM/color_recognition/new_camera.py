from flask import Flask, request, jsonify
import cv2
import numpy as np
from color_recognition_api import color_histogram_feature_extraction, knn_classifier
import os

app = Flask(__name__)

# Load training data
PATH = './training.data'
if not (os.path.isfile(PATH) and os.access(PATH, os.R_OK)):
    print('Training data is being created...')
    open('training.data', 'w').close()
    color_histogram_feature_extraction.training()
print('Training data is ready, classifier is loading...')

@app.route('/classify', methods=['POST'])
def classify_color():
    nparr = np.frombuffer(request.data, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Process the frame
    color_histogram_feature_extraction.color_histogram_of_test_image(img_np)
    prediction = knn_classifier.main('training.data', 'test.data')

    return jsonify(prediction=prediction)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
