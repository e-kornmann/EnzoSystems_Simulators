# BarcodeScannerBackend


## Introduction

This API is used to simulate a barcode scanner. It has endpoints for both the calling application (host) as for the React Frontend simulator (device).

The following endpoints are available:

- Generic health check
- Login for host and device, to exchange username/password for an API access token that is valid for 24 hours
- Set status endpoint to set simulator in connected status, to be called on regular base (DEVICE only)
- Get status endpoint to get the current status (HOST only)
- Set mode endpoint to set the scanner in scanning mode (HOST only)
- Get mode endpoint to get the current mode (DEVICE only)
- New scan endpoint to store scanned barcode data (DEVICE only)
- Get scan endpoint to retrieve scanned barcode data (HOST only)


## How to start

To be able to start scanning barcodes, the following steps need to be taken:

- both host and device has to us the LOGIN endpoint to get the required API token
- device has to use the SET STATUS endpoint to set the status to CONNECTED and call the endpoint on a regular base to stay connected
- host has to use the SET MODE endpoint to set the mode to ENABLED 
- device is now ready to scan a barcode and store the scanned data via the NEW SCAN endpoint
- host can use the GET SCAN endpoint (with long polling) to poll for the scanned data

See the next section for the details of each endpoint


## API endpoints
Use the correct server address and port number.

### 1. Health check
#### Request
Use this endpoint to see if the backend service is running correctly.

**GET http://localhost:8080/api/simulator/barcode-scanner/v1/health**

    GET http://localhost:8080/api/simulator/barcode-scanner/v1/health



#### Response
On success: HTTP-status: 200

{
  "info": "The BarcodeScanner back-end server is healthy!"
}

### 2. Login (HOST and DEVICE)
#### Request
Use this endpoint to exchange the user name and password for the device or host for the correct access token.
This token is valid for 24 hours.

**POST http://localhost:8080/api/simulator/barcode-scanner/v1/auth**


- As a device, use the following details<br>

        POST http://localhost:8080/api/simulator/barcode-scanner/v1/auth

        Content-type: application/json
        Authorization: Basic device:device

        {
        "deviceId": "BarcodeScanner"
        }

- As a host, use the following details:

        POST http://localhost:8080/api/simulator/barcode-scanner/v1/auth

        Content-type: application/json
        Authorization: Basic host:host

        {
        "hostId": "AnyNameYouWant"
        }

#### Response
On success: HTTP-status: 201

The result is a JWT access token that is returned in the following JSON structure:

    {
      "accessToken": "...here the access token data..."
    }


### 3. Set device status (DEVICE only)
#### Request
The device can call this endpoint to set the device in one of the following statuses:
- connected
- disconnected
- out_of_order

This endpoint need to be called by the device on a regular base to stay in the requested status.
In the case the status is not updated in time, the internal status will fallback to "not_found"

**PUT http://localhost:8080/api/simulator/barcode-scanner/v1/status**

    PUT http://localhost:8080/api/simulator/barcode-scanner/v1/status

    Content-type: application/json<br>
    Authorization: Bearer -token here-

    {
      "status": "CONNECTED"
    }

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "result: "success",
      "status": "connected",
      "timeoutSecs": 30
    }

The device has to call this endpoint repeately within the timeoutSecs.

On bad request: HTTP-status: 400<br>
The result is the following JSON object:

    {
      "error": "...error description here..."
    }

### 4. Get device status (HOST only)
#### Request
**GET http://localhost:8080/api/simulator/barcode-scanner/v1/status**

    GET http://localhost:8080/api/simulator/barcode-scanner/v1/status

    Content-type: application/json<br>
    Authorization: Bearer -token here-

### Long polling
Optionally long-polling can be used. With long polling the result is only returned when the status is different than the status that is send with the call or when the long polling timeout expired.

To use long polling, add the two following query parameter: 
- 'longPollingSecs' with a value between 1 - 60
- 'currentStatus' with a value of 'connected or 'disconnected', 'out_of_order' or 'not_found'
 

Below an example with a long polling setting of 10 seconds and the last know status was not_found:

    GET http://localhost:8080/api/simulator/barcode-scanner/v1/status?longPollingSecs=10&currentStatus=not_found

    Content-type: application/json<br>
    Authorization: Bearer -token here-

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "status": "connected"
    }


### 5. Set device mode (HOST only)
#### Request
The host can call this endpoint to set the device in one of the following modes:
- enabled  (scanner sesnor is turned ON)
- disabled (scanner sensor is turned OFF)

**PUT http://localhost:8080/api/simulator/barcode-scanner/v1/mode**

    http://localhost:8080/api/simulator/barcode-scanner/v1/mode

    Content-type: application/json<br>
    Authorization: Bearer -token here-

    {
      "mode": "enabled"
    }

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "result": "success",
      "newMode": "enabled"
    }

On bad request: HTTP-status: 400<br>
The result is the following JSON object:

    {
      "error": "...error description here..."
    }

On conflict: HTTP-status: 409<br>
The result is the following JSON object:

    {
      "error": "Device is not found"
    }    

### 6. Get device mode (DEVICE only)
#### Request
**GET http://localhost:8080/api/simulator/barcode-scanner/v1/mode**

    GET http://localhost:8080/api/simulator/barcode-scanner/v1/mode

    Content-type: application/json<br>
    Authorization: Bearer -token here-

### Long polling
Optionally long-polling can be used. With long polling the result is only returned when the mode is different than the mode that is send with the call or when the long polling timeout expired.

To use long polling, add the two following query parameter: 
- 'longPollingSecs' with a value between 1 - 60
- 'currentMode' with a value of 'enabled or 'disabled'
 

Below an example with a long polling setting of 10 seconds and the last know mode was disabled:

    GET http://localhost:8080/api/simulator/barcode-scanner/v1/mode?longPollingSecs=10&currentMode=disabled

    Content-type: application/json<br>
    Authorization: Bearer -token here-
#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "mode": "enabled"
    }

On conflict: HTTP-status: 409<br>
The result is the following JSON object:

    {
      "error": "...error description here..."
    }  

### 7. Post new scanned data (DEVICE only)
#### Request
The device can call this endpoint to post the data of a new scanned barcode


**POST http://localhost:8080/api/simulator/barcode-scanner/v1/scan**

    POST http://localhost:8080/api/simulator/barcode-scanner/v1/scan

    Content-type: application/json<br>
    Authorization: Bearer -token here-

    {
      "scannedData": "This is the content or the QR-code"
    } 

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "result": "success",
      "newScannedData": "This is the content or the QR-code"
    }

On bad request: HTTP-status: 400<br>
The result is the following JSON object:

    {
      "error": "...error description here..."
    }

On conflict: HTTP-status: 409<br>
The result is the following JSON object:

    {
      "error": "...error description here..."
    }    

### 8. Get scanned data (HOST only)
#### Request
**GET http://localhost:8080/api/simulator/barcode-scanner/v1/scan**
The host can call this endpoint to get the scanned data of the last code scanned. 
Scanned data can only be retrieved once, so a next call will return null for the scanned data.

    GET http://localhost:8080/api/simulator/barcode-scanner/v1/scan

    Content-type: application/json<br>
    Authorization: Bearer -token here-

### Long polling
Optionally long-polling can be used. In this case the result is only returned when there is scanned data available or when the long polling timeout expired.

To use long polling, add the following query parameter: 
- 'longPollingSecs' with a value between 1 - 60
 

Below an example with a long polling setting of 10 seconds:

    GET http://localhost:8080/api/simulator/barcode-scanner/v1/scan?longPollingSecs=10

    Content-type: application/json<br>
    Authorization: Bearer -token here-

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object if there is a barcode data available:

    {
      "result": "success",
      "scannedData": "This is the content or the QR-code"
    }

The result is the following JSON object if there is no barcode data available:

    {
      "result": "no_barcode_scanned",
      "scannedData": ""
    }    

On conflict: HTTP-status: 409<br>
The result is the following JSON object:

    {
      "error": "...error description here..."
    }  

