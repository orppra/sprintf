from flask import Flask, request
from pprint import pprint
import sys

sys.setrecursionlimit(100000)

app = Flask('Server')
allCharList = []
allCharList.extend(c for c in 'abcdefghijklmnopqrstuvwxyz')
allCharList.extend(c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
allCharList.extend(c for c in ',./\'"- ')


tree = {}
threshold = 100


def buildTree(line, n, max_n, treeDict):
    if n >= max_n:
        return
    if line == '':
        return
    if line[-1] not in treeDict:
        treeDict[line[-1]] = (0, {})
    treeDict[line[-1]] = (treeDict[line[-1]][0] + 1, treeDict[line[-1]][1])
    buildTree(line[:-1], n + 1, max_n, treeDict[line[-1]][1])
    if n == 0:
        buildTree(line[:-1], n, max_n, treeDict)


def predict(past):
    result = {}
    for c in allCharList:
        result[c] = 1

    mTree = tree[past[-1]]
    past = past[:-1]
    while (past != '' and
            past[-1] != ' ' and
            past[-1] in mTree[1] and
            mTree[0] > threshold and
            mTree[1][past[-1]][1] != {}):
        print(past[-1])
        mTree = mTree[1][past[-1]]
        past = past[:-1]

    print(mTree[1])
    for k, v in mTree[1].items():
        if k in result:
            result[k] += v[0]
    for k in result:
        result[k] = min(50, result[k])
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


# process input data
def readFile(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
        for line in lines:
            line = line.lower()
            # print(l)
            buildTree(line, 0, 4, tree)


readFile('../data/training_english_GB.txt')
readFile('../data/training_phrases2_GB.txt')
# readFile('../data/blogs_parsed.txt')
predict('hell')
predict('encount')
# pprint(tree['i'])


@app.route('/', methods=['GET'])
def get():
    print('hello')
    data = request.args['last']
    print(data)
    predict(data)
    return '', 200


if __name__ == '__main__':
    app.run(port=5000)
