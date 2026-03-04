#!/bin/bash

# Auto-detect script directory and navigate to framework root
SETUP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRAMEWORK_ROOT="$SETUP_DIR/.."
BACKEND_DIR="$FRAMEWORK_ROOT/backend"
VENV_DIR="$BACKEND_DIR/venv"

# 1. Check Directory
echo "[1/3] Checking Backend Directory..."
if [ ! -d "$BACKEND_DIR" ]; then
    echo "Error: Backend directory not found at $BACKEND_DIR"
    exit 1
fi

# 2. Setup Venv
echo "[2/3] Setting up Python Environment (venv)..."
if [ -f "$VENV_DIR/bin/activate" ]; then
    echo "Venv already exists. Skipping creation."
else
    echo "Creating new venv..."
    python3 -m venv "$VENV_DIR"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create venv. Is python3 installed?"
        exit 1
    fi
fi

# 3. Install Dependencies
echo "[3/3] Installing Dependencies..."
if [ -f "$BACKEND_DIR/requirements.txt" ]; then
    "$VENV_DIR/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
    if [ $? -ne 0 ]; then
         echo "Error: Failed to install dependencies."
         exit 1
    fi
else
    echo "No requirements.txt found. Skipping install."
fi

echo "=================================================="
echo "Setup Complete!"
echo "Run source $VENV_DIR/bin/activate to enter venv"
echo "=================================================="
