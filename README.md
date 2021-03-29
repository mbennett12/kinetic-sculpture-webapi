# kinetic-sculpture-webapi
## About
Web server/API allowing students' kinetic sculptures to start simultaneously, for Barnard's COMS3930 Creative Embedded Systems.

This repo includes example code for setting your sculptures up to run from the web api, as well as the code for running the server yourself (which should not be necessary).

## For students:

Your sculpture should start moving when http://165.227.76.232:3000/YOUR-UNI/running (with your uni) returns true.

This endpoint will return true for 30s when you press the button at http://165.227.76.232:3000/YOUR-UNI, or when we set all sculptures to run together.

For a full example of how you might set up your sculpture to run based on a true response, check out `example_HTTP_get.ino`, although the main querying loop is also pasted below:
```
String address= "http://165.227.76.232:3000/YOUR-UNI/running";

// Wifi setup should go here

void loop() {
  
  if((WiFi.status() == WL_CONNECTED)) {
    HTTPClient http;
    http.begin(address);
 
    int httpCode = http.GET(); // start connection and send HTTP header
    if (httpCode == HTTP_CODE_OK) { 
        String response = http.getString();
        if (response.equals("false")) {
            // Do not run sculpture, perhaps sleep for a couple seconds
        }
        else if(response.equals("true")) {
            // Run sculpture
        }
        USE_SERIAL.println("Response was: " + response);
    } else {
        USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
    delay(500); // sleep for half of a second
  }
}
```
Thanks to Ahmed Alzubairi (@AhmedAlzubairi1) for some foundational example code.

For a python example:

```
>>> import requests
>>> should_i_run = requests.get('http://165.227.76.232:3000/YOUR-UNI/running')
>>> print(should_i_run.json())
False
```

### Running the sculpture
After setting your sculpture up to start upon receiving a "true" response from the webapi, go to http://165.227.76.232:3000/YOUR-UNI/ to find the button to make the webapi return true for 30s.

## Running server (not necessary for students, as server already running)

### Installation
Clone this repo, then:

```
cd kinetic-sculpture-webapi
npm install
```

### Running

```
node server.js
```
