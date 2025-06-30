from flask import Flask, request, jsonify
import os
import base64
from color_classification_image1 import predict_color
import pandas as pd
import math
# Import the furniture recommendation function
from furniture import get_furniture_recommendations

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Create a dictionary with color data
color_data = {
    'Base Color': [
        'gray', 'gold', 'silver', 'emerald', 'azure', 'bronze', 'beige', 'mauve',
        'white', 'oak', 'ivory', 'black', 'navy', 'burgundy', 'crimson', 'walnut',
        'brown', 'coral', 'orange', 'blush', 'teal', 'terra', 'taupe', 'charcoal',
        'plum', 'mint', 'sage', 'olive', 'ochre', 'pearl', 'ruby', 'chrome',
        'sapphire', 'onyx', 'cream', 'brass', 'ash', 'cognac', 'amber', 'copper',
        'crystal', 'concrete', 'steel', 'slate', 'titanium', 'graphite', 'obsidian', 'marble'
    ],
    'Base Color Hex': [
        '#808080', '#FFD700', '#C0C0C0', '#50C878', '#007FFF', '#CD7F32', '#F5F5DC', '#E0B0FF',
        '#FFFFFF', '#806517', '#FFFFF0', '#000000', '#000080', '#800020', '#DC143C', '#773F1A',
        '#964B00', '#FF7F50', '#FFA500', '#FFC0CB', '#008080', '#E2725B', '#483C32', '#36454F',
        '#8E4585', '#3EB489', '#BCB88A', '#808000', '#CC7722', '#EAEAEA', '#E0115F', '#DCDCDC',
        '#0F52BA', '#353839', '#FFFDD0', '#B5A642', '#B2BEB5', '#834A2D', '#FFBF00', '#B87333',
        '#A7D8DE', '#979797', '#71797E', '#708090', '#878681', '#1C1C1C', '#283747', '#F2F2F2'
    ],
    'Complementary Color Hex': [
        '#808080', '#0028FF', '#C0C0C0', '#C850A0', '#FF8000', '#3280CD', '#DCDCF5', '#9FFF00',
        '#FFFFFF', '#F0F0FF', '#F0F0FF', '#000000', '#808000', '#008060', '#14DCB4', '#1A5277',
        '#004B96', '#50D0FF', '#005AFF', '#C0FFF4', '#800000', '#5BCBE2', '#323E48', '#4F4036',
        '#458E4E', '#B43E69', '#8A8EBC', '#000080', '#2277CC', '#EAEAEA', '#11E092', '#DCDCDC',
        '#BA770F', '#393635', '#D0D2FF', '#4251B5', '#BEB2BB', '#2D6683', '#0040FF', '#3378B8',
        '#DEADA7', '#979797', '#7E7671', '#908070', '#818287', '#1C1C1C', '#473828', '#F2F2F2'
    ]
}

# Create a DataFrame
df = pd.DataFrame(color_data)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_lab(rgb):
    """
    Convert RGB to LAB color space.
    Simplified conversion for comparison purposes.
    """
    r, g, b = rgb
    r = r / 255.0
    g = g / 255.0
    b = b / 255.0

    # sRGB to XYZ
    r = (r / 12.92) if r <= 0.04045 else ((r + 0.055) / 1.055) ** 2.4
    g = (g / 12.92) if g <= 0.04045 else ((g + 0.055) / 1.055) ** 2.4
    b = (b / 12.92) if b <= 0.04045 else ((b + 0.055) / 1.055) ** 2.4

    x = r * 0.4124 + g * 0.3576 + b * 0.1805
    y = r * 0.2126 + g * 0.7152 + b * 0.0722
    z = r * 0.0193 + g * 0.1192 + b * 0.9505

    # XYZ to Lab
    x = x / 0.95047
    y = y / 1.00000
    z = z / 1.08883

    x = x ** (1/3) if x > 0.008856 else (7.787 * x) + (16 / 116)
    y = y ** (1/3) if y > 0.008856 else (7.787 * y) + (16 / 116)
    z = z ** (1/3) if z > 0.008856 else (7.787 * z) + (16 / 116)

    L = (116 * y) - 16
    a = 500 * (x - y)
    b = 200 * (y - z)

    return L, a, b

def color_distance(color1_hex, color2_hex):
    """
    Calculate color distance between two hex colors using Euclidean distance in LAB space.
    """
    # Convert hex to RGB
    rgb1 = hex_to_rgb(color1_hex)
    rgb2 = hex_to_rgb(color2_hex)

    # Convert RGB to Lab
    lab1 = rgb_to_lab(rgb1)
    lab2 = rgb_to_lab(rgb2)

    # Calculate Euclidean distance in Lab space
    delta_L = lab1[0] - lab2[0]
    delta_a = lab1[1] - lab2[1]
    delta_b = lab1[2] - lab2[2]

    distance = math.sqrt(delta_L**2 + delta_a**2 + delta_b**2)

    return distance

def find_closest_complementary_matches(input_color_hex, num_matches=5):
    """
    Find the base colors whose complementary colors are closest to the input color.
    Returns the top 'num_matches' base color names and their distance scores.
    """
    distances = []

    for _, row in df.iterrows():
        comp_color_hex = row['Complementary Color Hex']
        distance = color_distance(input_color_hex, comp_color_hex)
        distances.append((row['Base Color'], row['Base Color Hex'], comp_color_hex, distance))

    # Sort by distance
    distances.sort(key=lambda x: x[3])

    # Return the closest matches (limited to the requested number)
    return distances[:num_matches]

@app.route('/upload', methods=['POST'])
def upload_image():
    data = request.get_json()
    
    # New condition: Check if this is a furniture recommendation request from frontend
    if data.get('colorOnly') and 'detected_color' in data and 'roomType' in data and 'furnitureType' in data:
        detected_color = data['detected_color']
        color_name = detected_color.get('name', 'Unknown')
        color_hex = detected_color.get('hex', '#000000')
        room_type = data['roomType']
        furniture_type = data['furnitureType']
        
        # Find closest complementary matches
        color_matches = find_closest_complementary_matches(color_hex, 5)
        
        # Get furniture recommendations based on the color and furniture type
        furniture_recommendations = get_furniture_recommendations(color_name, furniture_type,  room_type)
        
        # Format response
        results = []
        for i, (base_color, base_hex, comp_hex, distance) in enumerate(color_matches, 1):
            results.append({
                "rank": i,
                "base_color_name": base_color,
                "base_color_hex": base_hex,
                "complementary_hex": comp_hex,
                "match_distance": round(distance, 2)
            })
        
        return jsonify({
            "detected_color": {
                "name": color_name,
                "hex": color_hex
            },
            "room_type": room_type,
            "furniture_type": furniture_type,
            "recommendations": results,
            "furniture_recommendations": furniture_recommendations
        }), 200
    
    # Original condition: Check if this is a direct color input (no image processing needed)
    elif data.get('colorOnly') and 'detected_color' in data:
        detected_color = data['detected_color']
        color_name = detected_color.get('name', 'Unknown')
        color_hex = detected_color.get('hex', '#000000')
        
        # Find closest complementary matches
        color_matches = find_closest_complementary_matches(color_hex, 5)
        
        # Format response
        results = []
        for i, (base_color, base_hex, comp_hex, distance) in enumerate(color_matches, 1):
            results.append({
                "rank": i,
                "base_color_name": base_color,
                "base_color_hex": base_hex,
                "complementary_hex": comp_hex,
                "match_distance": round(distance, 2)
            })
        
        return jsonify({
            "detected_color": {
                "name": color_name,
                "hex": color_hex
            },
            "recommendations": results
        }), 200
    
    # Handle image upload and processing
    elif 'image' in data:
        try:
            # Convert base64 string to bytes
            image_bytes = base64.b64decode(data['image'])
            # Save the image to the upload folder
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_image.png')
            with open(image_path, 'wb') as f:
                f.write(image_bytes)
            
            # Predict color immediately after saving
            prediction = predict_color(image_path)
            detected_color_hex = prediction.get("hex", "#000000")  # Default to black if no hex is provided
            print('Detected color:', prediction["color_name"])
            
            # Find closest complementary matches
            color_matches = find_closest_complementary_matches(detected_color_hex, 5)
            
            # Format response
            results = []
            for i, (base_color, base_hex, comp_hex, distance) in enumerate(color_matches, 1):
                results.append({
                    "rank": i,
                    "base_color_name": base_color,
                    "base_color_hex": base_hex,
                    "complementary_hex": comp_hex,
                    "match_distance": round(distance, 2)
                })
            
            return jsonify({
                "detected_color": {
                    "name": prediction["color_name"],
                    "hex": detected_color_hex
                },
                "recommendations": results
            }), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    else:
        return jsonify({"error": "Invalid request. Please provide either an image or color information."}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)