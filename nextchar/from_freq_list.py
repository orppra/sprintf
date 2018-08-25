from pprint import pprint
from flask import Flask
from flask_cors import CORS
import json

allCharList = []
allCharList.extend(c for c in 'abcdefghijklmnopqrstuvwxyz')
allCharList.extend(c for c in ',.\'"- ')

print(''.join(allCharList))

damping_const = 0.75
threshold = 100


# tree contains priority: next character prediction
# tree contains children: if search forward another character
def build_tree(nxtChar, value, inc, depth, tree):
    if depth >= 4:
        return
    if nxtChar not in tree['priority']:
        tree['priority'][nxtChar] = 0
    tree['priority'][nxtChar] += inc
    tree['sum_priority'] += inc
    if value == '':
        return
    if value[-1] not in tree['children']:
        tree['children'][value[-1]] = dict(
            priority={}, children={}, sum_priority=0)
    build_tree(nxtChar, value[:-1], inc * damping_const,
               depth + 1, tree['children'][value[-1]])


def process_word(word, freq, result):
    word_copy = word + ' '
    while len(word_copy) >= 2:
        build_tree(
            word_copy[-1], word_copy[:-2],
            freq, 0, result[word_copy[-2]])
        word_copy = word_copy[:-1]


def get_data(result):
    with open('../data/flist.txt') as f:
        f.readline()
        lines = f.readlines()
        for line in lines:
            x = line.strip().split('\t')
            if len(x) != 3:
                continue
            [word, pos, freq] = x
            freq = float(freq)
            word = word.lower()
            if any(ch not in allCharList for ch in word):
                continue
            if len(word) <= 2:
                continue
            process_word(word, freq, result)


def predict(past, tree):

    mTree = tree[past[-1]]
    past = past[:-1]
    while (past != '' and
            past[-1] != ' ' and
            past[-1] in mTree['children'] and
            mTree['sum_priority'] > threshold and
            mTree['children'][past[-1]]['sum_priority'] != 0):
        mTree = mTree['children'][past[-1]]
        past = past[:-1]

    result = {}
    for c in allCharList:
        result[c] = mTree['sum_priority'] / 100

    for k, v in mTree['priority'].items():
        if k in result:
            result[k] += v

    # for k in result:
    #     result[k] = min(50, result[k])
    sum = 0
    for k, v in result.items():
        sum += v
    for k, v in result.items():
        result[k] /= sum
    slist = []
    for k, v in result.items():
        slist.append((v, k))
    slist.sort()
    slist.reverse()
    pprint(slist[:10])
    return result


r = {}
for c in allCharList:
    r[c] = {'priority': {}, 'children': {}, 'sum_priority': 0}
get_data(r)

predict('q', r)
predict('hell', r)
predict('morn', r)


app = Flask('Server')
CORS(app)


@app.route('/', methods=['GET'])
def get():
    return json.dumps(r), 200


if __name__ == '__main__':
    app.run(port=5000)
