import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
print(f"# Esportazione Claude\n\nData: {data['timestamp']}\n")
for r in data['risposte']:
    print(f"## Prompt\n{r['prompt']}\n\n### Risposta\n```python\n{r['risposta']}\n```\n")
