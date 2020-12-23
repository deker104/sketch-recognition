import cv2
import flask
import numpy as np
import torch
import torchvision.models as models
import torchvision.transforms.functional as TF
from flask import Flask, jsonify, render_template, request, url_for
from torch import nn

from classes import classes

num_classes = len(classes)

model = models.resnet18(pretrained=False)
new_conv1 = nn.Conv2d(1, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False)
new_conv1.weight.data = model.conv1.weight.data.sum(dim=1, keepdim=True)
model.conv1 = new_conv1
model.fc = nn.Linear(in_features=512, out_features=num_classes, bias=True)
model.load_state_dict(torch.load('model_latest.pth', map_location='cpu'))
model.eval()

app = flask.Flask(__name__, template_folder='templates')

def resize_image(click_x, click_y):
    min_x, max_x = min(click_x), max(click_x)
    min_y, max_y = min(click_y), max(click_y)
    return \
        [((i - min_x) * 256) // max(max_x - min_x, max_y - min_y) for i in click_x], \
        [((i - min_y) * 256) // max(max_x - min_x, max_y - min_y) for i in click_y]

def get_strokes(click_x, click_y, click_drag):
    strokes_x, strokes_y = list(), list()
    for x, y, drag in zip(click_x, click_y, click_drag):
        if not drag:
            strokes_x.append(list())
            strokes_y.append(list())
        strokes_x[-1].append(x)
        strokes_y[-1].append(y)
    return strokes_x, strokes_y

def draw_stroke(img, stroke, intensity, line_width=6):
    points = list(zip(*stroke))
    for i, j in zip(points[:-1], points[1:]):
        cv2.line(img, i, j, intensity, line_width)

def get_prediction(img):
    img = TF.to_tensor(img)[None]
    output = model(img)
    return output.argmax().item()

@app.route('/')
def home():
	return render_template('draw.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        req = request.json
        click_x = req['clickX']
        click_y = req['clickY']
        click_drag = req['clickDrag']

        click_x, click_y = resize_image(click_x, click_y)
        strokes_x, strokes_y = get_strokes(click_x, click_y, click_drag)

        img = np.zeros((256, 256), np.uint8)
        for stroke_x, stroke_y in zip(strokes_x, strokes_y):
            draw_stroke(img, [stroke_x, stroke_y], 255)
        img = cv2.resize(img, (64, 64), interpolation=cv2.INTER_LINEAR)
        np.save('img.npy', img)

    return jsonify(result=classes[get_prediction(img)])

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
