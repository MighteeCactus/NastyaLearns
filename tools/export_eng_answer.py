# ([a-z\.].*) – ([а-я\.].*)
# {\n    id: 0,\n    'ru': '$2',\n    'en': '$1'\n},

import re

FILE_PATH = 'C:\\Users\\might\\Desktop\\Экспорт.txt'
FILE_PATH1 = 'C:\\Users\\might\\Desktop\\Экспорт_out.txt'

def extract_words_from_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Define the pattern to find the words next to <hr id="answer" />
        pattern = r'<hr id=\"\"answer\"\"\s*/?>\n\n\s*(\w+)\n'

        # Find all matches using regex
        matches = re.findall(pattern, content)

        return matches
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def save_words_to_file(words, output_file):
    try:
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(",".join(words))
        print(f"Words saved to {output_file}")
    except Exception as e:
        print(f"An error occurred while saving to file: {e}")

# Example usage
file_path = FILE_PATH  # Replace with your file path
output_file = FILE_PATH1  # Replace with your desired output file

words = extract_words_from_file(file_path)
save_words_to_file(words, output_file)
print("Words next to <hr id=\"answer\" />:", words)

