# -*- coding: utf-8 -*-
"""
Furniture Recommendation System Based on Color, Type and Room Type
"""

import numpy as np
import pandas as pd
import difflib
import joblib
import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class FurnitureRecommender:
    def __init__(self, model_path='furniture_model.pkl', feature_path='features.json'):
        self.model_path = model_path
        self.feature_path = feature_path
        self.furniture_df = None
        self.similarity_matrix = None
        self.feature_dict = None
        self.vectorizer = None

        if os.path.exists(model_path) and os.path.exists(feature_path):
            self.load_model()
        else:
            print("Model not found. Training a new one...")
            self.train_model('furniture_data.csv')

    def train_model(self, data_path='furniture_data.csv'):
        furniture_df = pd.read_csv(data_path)
        furniture_df = self._prepare_data(furniture_df)
        similarity_matrix, furniture_df = self._create_similarity_matrix(furniture_df)
        self.feature_dict = self._save_features_to_json(furniture_df)
        self._save_model(furniture_df, similarity_matrix)

    def load_model(self):
        model_data = joblib.load(self.model_path)
        self.furniture_df = model_data['furniture_df']
        self.similarity_matrix = model_data['similarity_matrix']
        self.vectorizer = model_data['vectorizer']
        with open(self.feature_path, 'r') as f:
            self.feature_dict = json.load(f)

    def _prepare_data(self, df):
        if 'type' in df.columns:
            df = df.rename(columns={'type': 'dypes'})
        if 'index' not in df.columns:
            df.insert(0, 'index', range(len(df)))
        return df

    def _create_similarity_matrix(self, df):
        features = ['style', 'color', 'material', 'details', 'room_type']
        for f in features:
            df[f] = df[f].fillna('')
        combined = df['style'] + ' ' + df['color'] + ' ' + df['material'] + ' ' + df['details'] + ' ' + df['room_type']
        self.vectorizer = TfidfVectorizer()
        feature_vectors = self.vectorizer.fit_transform(combined)
        similarity = cosine_similarity(feature_vectors)
        return similarity, df

    def _save_model(self, df, sim_matrix):
        joblib.dump({
            'furniture_df': df,
            'similarity_matrix': sim_matrix,
            'vectorizer': self.vectorizer
        }, self.model_path)

    def _save_features_to_json(self, df):
        features = ['dypes', 'style', 'color', 'material', 'shape', 'details', 'room_type', 'price_range']
        feature_dict = {f: list(map(str, set(df[f]))) for f in features if f in df.columns}
        with open(self.feature_path, "w") as f:
            json.dump(feature_dict, f)
        return feature_dict

    def get_recommendations_by_color_type_room(self, color, furniture_type, room_type, top_n=2):
        # Find closest matches for input parameters
        color_match = difflib.get_close_matches(color, self.feature_dict.get('color', []), n=1)
        type_match = difflib.get_close_matches(furniture_type, self.feature_dict.get('dypes', []), n=1)
        room_match = difflib.get_close_matches(room_type, self.feature_dict.get('room_type', []), n=1)

        # Return empty list if any of the parameters don't have a match
        if not color_match or not type_match or not room_match:
            return []

        color = color_match[0]
        furniture_type = type_match[0]
        room_type = room_match[0]

        # Filter based on all three parameters
        filtered = self.furniture_df[
            (self.furniture_df['color'].astype(str) == color) &
            (self.furniture_df['dypes'].astype(str) == furniture_type) &
            (self.furniture_df['room_type'].astype(str) == room_type)
        ]

        # If no exact matches with all three parameters, try with just color and type
        if filtered.empty:
            filtered = self.furniture_df[
                (self.furniture_df['color'].astype(str) == color) &
                (self.furniture_df['dypes'].astype(str) == furniture_type)
            ]

        # Return formatted recommendations
        return [{
            'Type': row['dypes'],
            'Style': row['style'],
            'Color': row['color'],
            'Material': row['material'],
            'Room Type': row['room_type'],
            'Details': row['details'],
            'Price Range': row['price_range']
        } for _, row in filtered.iterrows()][:top_n]


# ✅ Public method to receive and pass parameters directly:
def get_furniture_recommendations(color, furniture_type, room_type):
    recommender = FurnitureRecommender()
    return recommender.get_recommendations_by_color_type_room(color, furniture_type, room_type)


# Example of how this would be imported and used by another module:
"""
from furniture_recommender import get_furniture_recommendations

# Call the function directly with parameters:
results = get_furniture_recommendations("white", "sofa", "living room")

# Process the results:
if results:
    for recommendation in results:
        print(recommendation)
else:
    print("No recommendations found.")
"""