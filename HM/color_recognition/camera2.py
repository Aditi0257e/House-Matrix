import socket
import numpy as np
import cv2

# Set up socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(("0.0.0.0", 5000))  # Bind to all interfaces and the correct port

while True:
    # Receive frame
    frame, _ = sock.recvfrom(65535)  # Adjust buffer size if necessary

    # Convert to image
    nparr = np.frombuffer(frame, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Display image
    cv2.imshow('Received Video', img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

sock.close()
cv2.destroyAllWindows()
