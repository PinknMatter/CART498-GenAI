## KORN GPT Dream Interpreter

### Implementation of Jungian Ideas
This project integrates Carl Jung’s theories, such as archetypes, the collective unconscious, and individuation, into the prompts for dream analysis and image generation. Archetypes like the Shadow, Anima/Animus, and the Self are used to interpret dream symbols, while the collective unconscious informs the generative process to create meaningful and symbolic imagery.

### Implementation Process
The implementation process involved creating a Flask web app that integrates OpenAI’s GPT model for dream analysis and image generation. The app takes user input (a dream description), processes it using Jungian archetypes, and generates symbolic interpretations. These interpretations are then used to create prompts for image generation, which are rendered using OpenAI’s DALL·E model.

### GPT Model Interpretations
The GPT model often produces interpretations that can seem abstract or even bizarre. For example, a dream about a tree might be interpreted as a symbol of growth or a representation of the Self, but it could also generate unexpected associations, such as linking the tree to a specific mythological figure. While these interpretations may not always align with traditional Jungian theory, they can still offer unique insights.

### Finding Truth in Weird Interpretations
Even when the interpretations seem strange, they can prompt deeper reflection. For instance, an unconventional interpretation might reveal subconscious connections or highlight overlooked aspects of the dream. By encouraging users to engage with these interpretations critically, the app fosters a process of individuation—helping users integrate disparate parts of their psyche.

### User Guide
1. **Input Your Dream**: Enter a description of your dream in the provided text field.
2. **Analyze Symbols**: The app will analyze the dream using Jungian archetypes and provide insights.
3. **Generate Images**: Based on the analysis, the app will generate symbolic images representing the dream’s themes.
4. **Save and Reflect**: Save your results and reflect on the interpretations to gain personal insights.

### Reflection and Improvements
The integration of Jungian ideas has provided a unique approach to dream analysis and image generation. However, improvements could include:
- Enhanced archetype recognition for more nuanced interpretations.
- User customization of archetypal frameworks.
- Integration of user feedback to refine the generative process.

# Create virtual environment
python3 -m venv ./venv

# Activate your virtual environment
source venv/bin/activate

# Install the required packages. 
pip3 install -r requirements.txt

# Rename the file .env-bup to .env. 
# Add your OPENAI_API_KEY to the .env file.

# Run the app
python3 app.py
