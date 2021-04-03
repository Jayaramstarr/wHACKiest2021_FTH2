import os
import pandas as pd
import numpy as np
import librosa
import glob
from math import expm1
import pandas as pd
from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse, fields
from tensorflow import keras
# from flask_ngrok import run_with_ngrok
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
api = Api(app)

lb = LabelEncoder()
lb.fit(['male_calm', 'female_calm', 'male_angry', 'female_angry', 'male_sad',
        'female_sad', 'male_fearful', 'female_fearful', 'male_happy', 'female_happy'])
opt = keras.optimizers.RMSprop(lr=0.00001, decay=1e-6)
json_file = open('model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
loaded_model = keras.models.model_from_json(loaded_model_json)
loaded_model.load_weights("Emotion_Voice_Detection_Model.h5")
loaded_model.compile(loss='categorical_crossentropy',
                     optimizer=opt, metrics=['accuracy'])
print("Loaded model from disk")


class Predict(Resource):
    def get(self):
        return "app running"

    def post(self):
        X, sample_rate = librosa.load(
            request.files['file'], res_type='kaiser_fast', duration=2.5, sr=22050*2, offset=0.5)
        sample_rate = np.array(sample_rate)
        mfccs = np.mean(librosa.feature.mfcc(
            y=X, sr=sample_rate, n_mfcc=13), axis=0)
        featurelive = mfccs
        livedf2 = featurelive
        livedf2 = pd.DataFrame(data=livedf2)
        livedf2 = livedf2.stack().to_frame().T
        twodim = np.expand_dims(livedf2, axis=2)
        livepreds = loaded_model.predict(twodim, batch_size=32, verbose=1)
        livepreds1 = livepreds.argmax(axis=1)
        liveabc = livepreds1.astype(int).flatten()
        livepredictions = (lb.inverse_transform((liveabc)))
        return str(livepredictions[0])


api.add_resource(Predict, "/")
# run_with_ngrok(app)

if __name__ == '__main__':
    app.run()
