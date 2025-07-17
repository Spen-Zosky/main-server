New-Item -ItemType Directory -Force -Path .vscode, .devcontainer
Copy-Item -Path ../.vscode/settings.json -Destination .vscode/settings.json -Force
Copy-Item -Path ../.vscode/tasks.json -Destination .vscode/tasks.json -Force
Copy-Item -Path ../.vscode/claude.code-snippets -Destination .vscode/claude.code-snippets -Force
Copy-Item -Path ../.devcontainer/devcontainer.json -Destination .devcontainer/devcontainer.json -Force
Write-Host "Ambiente di sviluppo configurato correttamente."
