#include <WiFi.h>
#include <HTTPClient.h>
#define USE_SERIAL Serial

const char *ssid_Router     = YOUR_WIFI_NAME; //Enter the router name
const char *password_Router = YOUR_WIFI_PASSWORD; //Enter the router password

String address= "http://165.227.76.232:3000/YOUR-UNI/running";

void setup(){
  
  USE_SERIAL.begin(115200);

  WiFi.begin(ssid_Router, password_Router);
  USE_SERIAL.println(String("Connecting to ")+ssid_Router);
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    USE_SERIAL.print(".");
  }
  USE_SERIAL.println("\nConnected, IP address: ");
  USE_SERIAL.println(WiFi.localIP());
  USE_SERIAL.println("Setup End");
}
 
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
