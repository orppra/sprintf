from flask import Flask, request
from pprint import pprint

app = Flask('Server')
allCharList = []
allCharList.extend(c for c in 'abcdefghijklmnopqrstuvwxyz')
allCharList.extend(c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
allCharList.extend(c for c in ',./\'"- ')

gram2 = {}


def buildNGram(line, n, store):
    curr = []
    for c in line:
        if len(curr) < n:
            curr.append(c)
            continue
        d = store
        for ch in curr:
            if ch not in d:
                d[ch] = {}
            d = d[ch]
        if c not in d:
            d[c] = 0
        d[c] += 1
        curr.append(c)
        curr.pop(0)
    return store


def predict(past):
    result = {}
    for c in allCharList:
        result[c] = 1
    gm = gram2
    for i in range(2, 0, -1):
        if past[-i] in gm:
            gm = gm[past[-i]]
        else:
            gm = {}
    pprint(gm)
    for k, v in gm.items():
        if k in result:
            result[k] += v
    sum = 0
    for k, v in result.items():
        sum += v
    for k, v in result.items():
        result[k] /= sum
    pprint(result)
    slist = []
    for k, v in result.items():
        slist.append((v, k))
    slist.sort()
    slist.reverse()
    pprint(slist[:10])
    return result


# process input data
def readFile(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
        for l in lines:
            print(l)
            buildNGram(l, 2, gram2)
        # pprint(gram2)


readFile('../data/training_english_GB.txt')
predict('be')


@app.route('/', methods=['GET'])
def get():
    print('hello')
    data = request.args['last']
    print(data)
    predict(data)
    return '', 200


if __name__ == '__main__':
    app.run(port=5000)
