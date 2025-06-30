import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, accuracy_score, confusion_matrix
from sklearn.ensemble import RandomForestClassifier 
data_dir = "training_dataset"
categories = ["black", "blue", "green", "orange", "red", "violet", "white", "yellow"]
label_dict = {category: idx for idx, category in enumerate(categories)}
X = []
y = []
for category in categories:
    folder_path = os.path.join(data_dir, category) 
    label = label_dict[category]
    for img_name in os.listdir(folder_path):  
        img_path = os.path.join(folder_path, img_name)  
        img = cv2.imread(img_path)
        if img is not None:
            img = cv2.resize(img, (64, 64))  
            X.append(img)  
            y.append(label) 
X = np.array(X)
y = np.array(y)
X = X.reshape(X.shape[0], -1)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier()
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
f1 = f1_score(y_test, y_pred, average="weighted")
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
print(f"F1 Score: {f1:.2f}")
print(f"Accuracy: {accuracy:.2f}")
print("Confusion Matrix:")
print(conf_matrix)