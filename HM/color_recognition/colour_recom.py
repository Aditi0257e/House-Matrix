import colorsys

class ColorRecommender:
    def __init__(self):
        # Define gender-based color preferences (based on common color psychology and fashion trends)
        self.gender_palettes = {
            'masculine': {
                'primary': ['navy', 'dark blue', 'charcoal', 'forest green', 'burgundy'],
                'accent': ['rust', 'olive', 'tan', 'slate gray', 'brown'],
                'neutral': ['gray', 'black', 'white', 'beige', 'navy']
            },
            'feminine': {
                'primary': ['rose', 'coral', 'lavender', 'mint', 'sky blue'],
                'accent': ['peach', 'mauve', 'sage', 'blush', 'periwinkle'],
                'neutral': ['cream', 'light gray', 'soft white', 'taupe', 'nude']
            },
            'neutral': {
                'primary': ['teal', 'emerald', 'sapphire', 'amber', 'crimson'],
                'accent': ['gold', 'silver', 'bronze', 'copper', 'platinum'],
                'neutral': ['gray', 'beige', 'cream', 'white', 'black']
            }
        }

        # Define color hex codes for basic colors
        self.color_codes = {
            'red': '#FF0000',
            'blue': '#0000FF',
            'green': '#00FF00',
            'yellow': '#FFFF00',
            'purple': '#800080',
            'orange': '#FFA500',
            'pink': '#FFC0CB',
            'brown': '#A52A2A',
            'gray': '#808080',
            'black': '#000000',
            'white': '#FFFFFF'
        }

    def hex_to_hsv(self, hex_color):
        """Convert hex color to HSV."""
        # Remove '#' if present
        hex_color = hex_color.lstrip('#')
        # Convert hex to RGB
        rgb = tuple(int(hex_color[i:i+2], 16)/255.0 for i in (0, 2, 4))
        # Convert RGB to HSV
        return colorsys.rgb_to_hsv(*rgb)

    def get_complementary_color(self, hex_color):
        """Get the complementary color (opposite on the color wheel)."""
        hsv = self.hex_to_hsv(hex_color)
        # Add 0.5 to hue to get the opposite color (180 degrees on color wheel)
        complementary_h = (hsv[0] + 0.5) % 1.0
        # Convert back to RGB
        rgb = colorsys.hsv_to_rgb(complementary_h, hsv[1], hsv[2])
        # Convert to hex
        return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))

    def get_recommendations(self, base_color, gender='neutral'):
        """
        Get color recommendations based on input color and gender preference.

        Args:
            base_color (str): Input color (hex code or color name)
            gender (str): 'masculine', 'feminine', or 'neutral'

        Returns:
            dict: Color recommendations including complementary, matching, and gender-specific suggestions
        """
        # Normalize gender input
        gender = gender.lower()
        if gender not in self.gender_palettes:
            gender = 'neutral'

        # Convert color name to hex if needed
        if base_color.startswith('#'):
            base_hex = base_color
        else:
            base_hex = self.color_codes.get(base_color.lower(), '#000000')

        # Get complementary color
        complementary = self.get_complementary_color(base_hex)

        # Get gender-specific recommendations
        gender_recs = {
            'primary_colors': self.gender_palettes[gender]['primary'][:3],
            'accent_colors': self.gender_palettes[gender]['accent'][:3],
            'neutral_colors': self.gender_palettes[gender]['neutral'][:3]
        }

        recommendations = {
            'input_color': base_hex,
            'complementary_color': complementary,
            'gender_specific': gender_recs,
            'color_combinations': {
                'monochromatic': [
                    base_hex,
                    self.adjust_brightness(base_hex, 0.7),
                    self.adjust_brightness(base_hex, 1.3)
                ],
                'analogous': self.get_analogous_colors(base_hex)
            }
        }

        return recommendations

    def adjust_brightness(self, hex_color, factor):
        """Adjust the brightness of a color by a factor."""
        hsv = self.hex_to_hsv(hex_color)
        new_v = max(0, min(1, hsv[2] * factor))
        rgb = colorsys.hsv_to_rgb(hsv[0], hsv[1], new_v)
        return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))

    def get_analogous_colors(self, hex_color):
        """Get analogous colors (adjacent on the color wheel)."""
        hsv = self.hex_to_hsv(hex_color)
        colors = []
        for angle in [-30, 0, 30]:  # 30 degrees apart
            h = (hsv[0] + angle/360) % 1.0
            rgb = colorsys.hsv_to_rgb(h, hsv[1], hsv[2])
            colors.append('#{:02x}{:02x}{:02x}'.format(int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255)))
        return colors

# Example usage (moved outside the class)
if __name__ == "__main__":
    # Create an instance of the recommender
    recommender = ColorRecommender()

    # Get recommendations for a blue color with masculine preference
    recommendations_masc = recommender.get_recommendations('#0000FF', gender='masculine')
    print("\nMasculine recommendations:")
    print(recommendations_masc)

    # Or use color names with feminine preference
    recommendations_fem = recommender.get_recommendations('blue', gender='feminine')
    print("\nFeminine recommendations:")
    print(recommendations_fem)