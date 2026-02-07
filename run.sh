#!/bin/bash

# Function to kill background processes on exit
cleanup() {
  echo "Stopping Robo-Restorer..."
  kill $(jobs -p)
}

# Set trap to catch SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found. Please create one named 'venv'."
    exit 1
fi

# Start Backend
echo "Starting Backend..."
python -m backend.web_main &

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm run dev &

# Wait for both processes
wait
