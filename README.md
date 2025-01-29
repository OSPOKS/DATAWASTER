[![Netlify Status](https://api.netlify.com/api/v1/badges/fe83e381-e392-42ed-8b59-5c9e8f566aa9/deploy-status)](https://app.netlify.com/sites/datawaster/deploys)
# Data Waster

This project is a simple web-based application designed to simulate continuous data usage by repeatedly fetching random images from a server. It allows users to experiment with concepts like parallel requests, network speed calculation, and resource tracking. The application runs multiple threads (as configured by the user) to fetch images, measures the total amount of data used (in MB), and calculates the average speed (in Kbps). The runtime is also dynamically tracked and displayed. Users can set a data usage limit to stop the process automatically or run it indefinitely until stopped manually.

### How It Works:
1. Users can configure the number of threads (parallel requests) and set an optional data usage limit.
2. When started, each thread continuously fetches random images from `https://picsum.photos/200`.
3. The application tracks the total data consumed, calculates speed based on fetch times, and updates the displayed runtime.
4. The "Stop Wasting" button halts all running threads and stops data fetching.

### Purpose:
This project was built purely for educational purposes and personal entertainment. It serves as a tool to understand network request handling, parallel processing, and efficient tracking of metrics like speed and data usage. It was created as a fun side project to explore JavaScript functionality and overcome boredom.

### Safety Disclaimer:
This tool is intended solely for learning and experimentation. It is not designed or recommended for malicious activities or server abuse. Always respect server policies and avoid excessive or unauthorized use of resources. Misuse may result in violating terms of service or legal consequences.

### Contribute:
Contribute to this project to make it better! I need your help to add new features, optimize functionality, and make this a more robust tool. Feel free to submit your ideas and improvements!

### Note:
Use this project responsibly and consider the impact of your actions on shared resources and servers. It is meant to entertain and educate, not harm.
