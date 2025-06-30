import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load an image
image = cv2.imread('nature.jpg')
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Calculate histograms for each channel
channels = ('r', 'g', 'b')
colors = ('red', 'green', 'blue')

plt.figure(figsize=(10, 5))

for i, color in enumerate(colors):
    histogram = cv2.calcHist([image_rgb], [i], None, [256], [0, 256])
    plt.plot(histogram, color=color)
    plt.xlim([0, 256])
    plt.title('Histogram for ' + 'Red,Green,Blue' + ' channel')

plt.xlabel('Pixel Intensity')
plt.ylabel('Frequency')
plt.legend(channels)
plt.show()
