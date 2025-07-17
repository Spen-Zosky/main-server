#!/bin/bash
mkdir -p .vscode .devcontainer
cp ../.vscode/settings.json .vscode/settings.json
cp ../.vscode/tasks.json .vscode/tasks.json
cp ../.vscode/claude.code-snippets .vscode/claude.code-snippets
cp ../.devcontainer/devcontainer.json .devcontainer/devcontainer.json
echo "Ambiente di sviluppo configurato correttamente."
