const mongoose = require('mongoose');
const Template = require('../models/Template');
const dotenv = require('dotenv');

dotenv.config();

const sampleTemplates = [
  {
    name: 'Cricket Analytics 🏏',
    description: 'Analyze player performance and match predictions using machine learning algorithms',
    type: 'sports_analytics',
    difficulty: 'Beginner',
    estimatedTime: '30 min',
    icon: 'Trophy',
    configuration: {
      modelType: 'classification',
      framework: 'scikit-learn',
      defaultParameters: {
        algorithm: 'random_forest',
        n_estimators: 100,
        max_depth: 10
      },
      requiredDataFormat: 'CSV with columns: player_name, runs, wickets, matches, strike_rate',
      sampleDataset: {
        name: 'IPL Player Stats',
        url: 'https://example.com/ipl-stats.csv',
        description: 'Historical IPL player statistics'
      }
    },
    code: {
      preprocessing: 'import pandas as pd\nfrom sklearn.preprocessing import StandardScaler\n\n# Load and clean data\ndf = pd.read_csv("cricket_data.csv")\ndf = df.dropna()\n\n# Feature engineering\ndf["avg_runs"] = df["runs"] / df["matches"]\ndf["wickets_per_match"] = df["wickets"] / df["matches"]',
      model: 'from sklearn.ensemble import RandomForestClassifier\n\n# Initialize model\nmodel = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)\n\n# Train model\nmodel.fit(X_train, y_train)',
      training: '# Split data\nfrom sklearn.model_selection import train_test_split\n\nX = df[["avg_runs", "wickets_per_match", "strike_rate"]]\ny = df["performance_category"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)',
      evaluation: 'from sklearn.metrics import accuracy_score, classification_report\n\n# Make predictions\ny_pred = model.predict(X_test)\n\n# Evaluate model\naccuracy = accuracy_score(y_test, y_pred)\nprint(f"Accuracy: {accuracy:.2f}")\nprint(classification_report(y_test, y_pred))'
    },
    requirements: {
      dependencies: ['pandas', 'scikit-learn', 'numpy'],
      minimumDataSize: '1000+ records',
      computeRequirements: 'Basic CPU (2+ cores recommended)'
    },
    tags: ['cricket', 'sports', 'analytics', 'classification', 'beginner'],
    category: 'popular',
    usageCount: 150,
    rating: { average: 4.5, count: 23 },
    isPublic: true,
    isActive: true
  },
  {
    name: 'Monsoon Prediction ⛈️',
    description: 'Predict rainfall patterns for agricultural planning using weather data and time series analysis',
    type: 'weather_forecasting',
    difficulty: 'Intermediate',
    estimatedTime: '45 min',
    icon: 'Cloud',
    configuration: {
      modelType: 'time_series',
      framework: 'tensorflow',
      defaultParameters: {
        lstm_units: 50,
        dropout: 0.2,
        epochs: 100,
        batch_size: 32
      },
      requiredDataFormat: 'CSV with columns: date, temperature, humidity, pressure, rainfall',
      sampleDataset: {
        name: 'Indian Meteorological Data',
        url: 'https://example.com/weather-data.csv',
        description: '10 years of weather data from major Indian cities'
      }
    },
    code: {
      preprocessing: 'import pandas as pd\nimport numpy as np\nfrom sklearn.preprocessing import MinMaxScaler\n\n# Load data\ndf = pd.read_csv("weather_data.csv")\ndf["date"] = pd.to_datetime(df["date"])\ndf = df.sort_values("date")\n\n# Normalize features\nscaler = MinMaxScaler()\nscaled_data = scaler.fit_transform(df[["temperature", "humidity", "pressure"]])',
      model: 'from tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import LSTM, Dense, Dropout\n\n# Build LSTM model\nmodel = Sequential([\n    LSTM(50, return_sequences=True, input_shape=(time_steps, features)),\n    Dropout(0.2),\n    LSTM(50, return_sequences=False),\n    Dropout(0.2),\n    Dense(25),\n    Dense(1)\n])\n\nmodel.compile(optimizer="adam", loss="mean_squared_error")',
      training: '# Prepare time series data\ndef create_sequences(data, time_steps):\n    X, y = [], []\n    for i in range(len(data) - time_steps):\n        X.append(data[i:(i + time_steps)])\n        y.append(data[i + time_steps, -1])  # rainfall column\n    return np.array(X), np.array(y)\n\ntime_steps = 30\nX, y = create_sequences(scaled_data, time_steps)\n\n# Train model\nmodel.fit(X, y, epochs=100, batch_size=32, validation_split=0.2)',
      evaluation: 'from sklearn.metrics import mean_squared_error, r2_score\nimport matplotlib.pyplot as plt\n\n# Make predictions\npredictions = model.predict(X_test)\n\n# Evaluate\nmse = mean_squared_error(y_test, predictions)\nr2 = r2_score(y_test, predictions)\n\nprint(f"MSE: {mse:.4f}")\nprint(f"R² Score: {r2:.4f}")'
    },
    requirements: {
      dependencies: ['tensorflow', 'pandas', 'numpy', 'scikit-learn', 'matplotlib'],
      minimumDataSize: '2+ years of daily weather data',
      computeRequirements: 'GPU recommended for training'
    },
    tags: ['weather', 'time-series', 'lstm', 'agriculture', 'forecasting'],
    category: 'trending',
    usageCount: 89,
    rating: { average: 4.2, count: 15 },
    isPublic: true,
    isActive: true
  },
  {
    name: 'Bollywood Sentiment 🎬',
    description: 'Analyze movie reviews in Hindi and English using natural language processing',
    type: 'nlp',
    difficulty: 'Intermediate',
    estimatedTime: '1 hour',
    icon: 'MessageSquare',
    configuration: {
      modelType: 'text_classification',
      framework: 'tensorflow',
      defaultParameters: {
        max_features: 10000,
        max_length: 100,
        embedding_dim: 100,
        lstm_units: 64
      },
      requiredDataFormat: 'CSV with columns: review_text, sentiment (positive/negative/neutral)',
      sampleDataset: {
        name: 'Bollywood Movie Reviews',
        url: 'https://example.com/bollywood-reviews.csv',
        description: 'Hindi-English mixed movie reviews from various platforms'
      }
    },
    code: {
      preprocessing: 'import pandas as pd\nimport re\nfrom tensorflow.keras.preprocessing.text import Tokenizer\nfrom tensorflow.keras.preprocessing.sequence import pad_sequences\n\n# Load data\ndf = pd.read_csv("movie_reviews.csv")\n\n# Text preprocessing\ndef clean_text(text):\n    text = re.sub(r"[^a-zA-Z\\s]", "", text)\n    text = text.lower().strip()\n    return text\n\ndf["clean_review"] = df["review_text"].apply(clean_text)\n\n# Tokenization\ntokenizer = Tokenizer(num_words=10000)\ntokenizer.fit_on_texts(df["clean_review"])\nsequences = tokenizer.texts_to_sequences(df["clean_review"])\nX = pad_sequences(sequences, maxlen=100)',
      model: 'from tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout\n\n# Build model\nmodel = Sequential([\n    Embedding(10000, 100, input_length=100),\n    LSTM(64, dropout=0.2, recurrent_dropout=0.2),\n    Dense(32, activation="relu"),\n    Dropout(0.5),\n    Dense(3, activation="softmax")  # 3 classes: positive, negative, neutral\n])\n\nmodel.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])',
      training: 'from sklearn.model_selection import train_test_split\nfrom tensorflow.keras.utils import to_categorical\nfrom sklearn.preprocessing import LabelEncoder\n\n# Encode labels\nle = LabelEncoder()\ny_encoded = le.fit_transform(df["sentiment"])\ny_categorical = to_categorical(y_encoded)\n\n# Split data\nX_train, X_test, y_train, y_test = train_test_split(X, y_categorical, test_size=0.2, random_state=42)\n\n# Train model\nhistory = model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_test, y_test))',
      evaluation: 'from sklearn.metrics import classification_report, confusion_matrix\nimport numpy as np\n\n# Predictions\ny_pred = model.predict(X_test)\ny_pred_classes = np.argmax(y_pred, axis=1)\ny_true_classes = np.argmax(y_test, axis=1)\n\n# Evaluate\nprint("Classification Report:")\nprint(classification_report(y_true_classes, y_pred_classes, target_names=le.classes_))\n\n# Confusion Matrix\nprint("Confusion Matrix:")\nprint(confusion_matrix(y_true_classes, y_pred_classes))'
    },
    requirements: {
      dependencies: ['tensorflow', 'pandas', 'numpy', 'scikit-learn', 'nltk'],
      minimumDataSize: '5000+ labeled reviews',
      computeRequirements: 'GPU recommended, 8GB+ RAM'
    },
    tags: ['nlp', 'sentiment-analysis', 'bollywood', 'hindi', 'lstm'],
    category: 'featured',
    usageCount: 125,
    rating: { average: 4.7, count: 31 },
    isPublic: true,
    isActive: true
  },
  {
    name: 'Street Food Classification 🍛',
    description: 'Identify Indian street food items using computer vision and deep learning',
    type: 'computer_vision',
    difficulty: 'Advanced',
    estimatedTime: '2 hours',
    icon: 'Camera',
    configuration: {
      modelType: 'image_classification',
      framework: 'tensorflow',
      defaultParameters: {
        image_size: [224, 224],
        batch_size: 32,
        epochs: 50,
        learning_rate: 0.0001
      },
      requiredDataFormat: 'Images organized in folders by food category',
      sampleDataset: {
        name: 'Indian Street Food Images',
        url: 'https://example.com/street-food-images.zip',
        description: '10,000+ labeled images of popular Indian street foods'
      }
    },
    code: {
      preprocessing: 'import tensorflow as tf\nfrom tensorflow.keras.preprocessing.image import ImageDataGenerator\nimport os\n\n# Data augmentation\ntrain_datagen = ImageDataGenerator(\n    rescale=1./255,\n    rotation_range=20,\n    width_shift_range=0.2,\n    height_shift_range=0.2,\n    shear_range=0.2,\n    zoom_range=0.2,\n    horizontal_flip=True,\n    validation_split=0.2\n)\n\n# Load training data\ntrain_generator = train_datagen.flow_from_directory(\n    "food_images/",\n    target_size=(224, 224),\n    batch_size=32,\n    class_mode="categorical",\n    subset="training"\n)',
      model: 'from tensorflow.keras.applications import ResNet50\nfrom tensorflow.keras.layers import Dense, GlobalAveragePooling2D\nfrom tensorflow.keras.models import Model\n\n# Load pre-trained ResNet50\nbase_model = ResNet50(weights="imagenet", include_top=False, input_shape=(224, 224, 3))\n\n# Add custom layers\nx = base_model.output\nx = GlobalAveragePooling2D()(x)\nx = Dense(1024, activation="relu")(x)\nx = Dense(512, activation="relu")(x)\npredictions = Dense(num_classes, activation="softmax")(x)\n\n# Create final model\nmodel = Model(inputs=base_model.input, outputs=predictions)\n\n# Freeze base model layers\nfor layer in base_model.layers:\n    layer.trainable = False',
      training: '# Compile model\nmodel.compile(\n    optimizer=tf.keras.optimizers.Adam(lr=0.0001),\n    loss="categorical_crossentropy",\n    metrics=["accuracy"]\n)\n\n# Train model\nhistory = model.fit(\n    train_generator,\n    steps_per_epoch=train_generator.samples // 32,\n    epochs=50,\n    validation_data=validation_generator,\n    validation_steps=validation_generator.samples // 32\n)\n\n# Fine-tuning\nfor layer in base_model.layers[-20:]:\n    layer.trainable = True\n\nmodel.compile(\n    optimizer=tf.keras.optimizers.Adam(lr=0.00001),\n    loss="categorical_crossentropy",\n    metrics=["accuracy"]\n)\n\n# Continue training\nmodel.fit(train_generator, epochs=20)',
      evaluation: 'import numpy as np\nfrom sklearn.metrics import classification_report, confusion_matrix\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Evaluate model\ntest_loss, test_accuracy = model.evaluate(validation_generator)\nprint(f"Test Accuracy: {test_accuracy:.4f}")\n\n# Predictions\npredictions = model.predict(validation_generator)\ny_pred = np.argmax(predictions, axis=1)\ny_true = validation_generator.classes\n\n# Classification report\nprint("Classification Report:")\nprint(classification_report(y_true, y_pred, target_names=validation_generator.class_indices.keys()))\n\n# Confusion matrix\ncm = confusion_matrix(y_true, y_pred)\nplt.figure(figsize=(12, 8))\nsns.heatmap(cm, annot=True, fmt="d", cmap="Blues")\nplt.title("Confusion Matrix")\nplt.show()'
    },
    requirements: {
      dependencies: ['tensorflow', 'opencv-python', 'matplotlib', 'seaborn', 'pillow'],
      minimumDataSize: '1000+ images per food category',
      computeRequirements: 'GPU with 8GB+ VRAM, 16GB+ RAM'
    },
    tags: ['computer-vision', 'food-classification', 'cnn', 'transfer-learning', 'indian-food'],
    category: 'new',
    usageCount: 45,
    rating: { average: 4.8, count: 8 },
    isPublic: true,
    isActive: true
  }
];

async function seedTemplates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert sample templates
    await Template.insertMany(sampleTemplates);
    console.log(`Inserted ${sampleTemplates.length} sample templates`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  seedTemplates();
}

module.exports = { sampleTemplates, seedTemplates };
