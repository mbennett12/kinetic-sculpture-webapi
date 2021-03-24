# kinetic-sculpture-webapi
Web API allowing students' kinetic sculptures to start simultaneously, for Barnard's COMS3930 Creative Embedded Systems

The site is live at: http://165.227.76.232:3000/YOUR-UNI (though change the url to your uni for your unique page)
and you can use http://165.227.76.232:3000/YOUR-UNI/running for true/false readings

## For students: 
To use this server, change the "YOUR-UNI" part of the address to your uni, and query for true/false to run your sculpture.
For example, in an arduino sketch loop, you might have:

```
// Modified from https://github.com/AhmedAlzubairi1/creative_embeddedsystems_hw3/blob/master/esp32_client/esp32_client.ino
String address= "http://165.227.76.232:3000/YOUR-UNI/running";

if((WiFi.status() == WL_CONNECTED)) {
    HTTPClient http;
    http.begin(address); //HTTP

    int httpCode = http.GET(); // start connection and send HTTP header

    if(httpCode > 0) { // httpCode will be negative on error
        if(httpCode == HTTP_CODE_OK) {
            String response = http.getString();
            if (response.equals("false")) {
                // Do not run sculpture, perhaps sleep for a couple seconds
            }
            else if(response.equals("true")) {
                // Run sculpture
            }
            USE_SERIAL.println("Response was: " + response);
        }
    } else {
        USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
}
```
For another python example:

```
>>> import requests
>>> should_i_run = requests.get('http://165.227.76.232:3000/myuni/running')
>>> print(should_i_run.json())
False
```


### Running the sculpture
After setting your sculpture up to start upon receiving a "true" response from the webapi, go to http://165.227.76.232:3000/YOUR-UNI/ to find the button to make the webapi return true for 30s.

## To set up and run the server (not necessary for students)

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
