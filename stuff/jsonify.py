import csv
import json

data = []
out = []

with open("data/data2.csv") as f:
    reader = csv.reader(f)
    for row in reader:
        data.append(row)

dataClean = [x for x in data if x and len(x) > 1]
head = dataClean[0][2:]
dataClean = dataClean[1:]

for obj in dataClean:
    temp = {}
    temp["country"] = obj[0]
    temp["variable"] = obj[1]
    temp["values"] = []

    for x in range(0,len(head)):
        temp["values"].append({head[x] : obj[x + 2]})

    out.append(temp)

with open("data/data.json", "w") as f:
    f.write("[")
    i = 0
    l = len(out) - 1
    for x in out:
        f.write(json.dumps(x))
        f.write(",")
        f.write("\n")
    f.write("]")
