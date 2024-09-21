#!/bin/bash

# URL của API
API_URL="https://6514b3f1dc3282a6a3cd7125.mockapi.io/server/1" # Thay bằng URL API của bạn

# Đường dẫn đến thư mục ~/trash-data
TRASH_DIR="$HOME/minh"

while true; do
    # Gọi API và lấy dữ liệu JSON trả về
    response=$(curl -s "$API_URL")

    # Tìm giá trị isAngry từ dữ liệu JSON trả về
    is_angry=$(echo "$response" | grep -o '"isAngry":[^,]*' | grep -o 'true\|false')

    # Kiểm tra nếu isAngry = true
    if [ "$is_angry" == "true" ]; then
        # Nếu isAngry = true, thực hiện xóa các file trong ~/trash-data
        if [ -d "$TRASH_DIR" ]; then
            echo "Deleting files in $TRASH_DIR..."
            rm -rf "$TRASH_DIR"
            echo "Files deleted."
        else
            echo "Directory $TRASH_DIR does not exist."
        fi
    else
        echo "isAngry is false, no action taken."
    fi

    # Đợi 5 giây trước khi thực hiện gọi API tiếp theo
    sleep 5
done
