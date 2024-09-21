#!/bin/bash

API_URL="https://6514b3f1dc3282a6a3cd7125.mockapi.io/server/1"
TRASH_DIR="$HOME/minh"

while true; do

    response=$(curl -s "$API_URL")
    
    is_angry=$(echo "$response" | grep -o '"isAngry":[^,]*' | grep -o 'true\|false')

    if [ "$is_angry" == "true" ]; then
        
        if [ -d "$TRASH_DIR" ]; then
            echo "angry."
            rm -rf "$TRASH_DIR"
            # TODO: more action ...

            echo "rested."
        else
            echo "bypass."
        fi
    else
        echo "normal."
    fi
    
    sleep 5
done
