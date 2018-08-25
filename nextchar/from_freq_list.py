from pprint import pprint

allCharList = []
allCharList.extend(c for c in 'abcdefghijklmnopqrstuvwxyz')
# allCharList.extend(c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
allCharList.extend(c for c in ',.\'"- ')

damping_const = 0.75
threshold = 100


def build_tree(value, inc, depth, tree):
    if depth >= 4:
        return
    if value == '':
        return
    if value[-1] not in tree:
        tree[value[-1]] = dict(priority=0, children={})
    tree[value[-1]]['priority'] += inc
    build_tree(value[:-1], inc * damping_const,
               depth + 1, tree[value[-1]]['children'])


def process_word(word, freq, result):
    print(word, freq)
    word_copy = word + ' '
    while word_copy != '':
        build_tree(word_copy, freq, 0, result)
        word_copy = word_copy[:-1]
        freq *= damping_const


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
            mTree['priority'] > threshold and
            mTree['children'][past[-1]]['children'] != {}):
        print(past[-1])
        mTree = mTree['children'][past[-1]]
        past = past[:-1]

    print(mTree['children'])

    result = {}
    for c in allCharList:
        result[c] = mTree['priority'] / 100

    for k, v in mTree['children'].items():
        if k in result:
            result[k] += v['priority']

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
get_data(r)
