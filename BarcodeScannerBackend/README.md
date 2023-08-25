# BarcodeScannerBackend


## Introduction

This API is used to simulate a barcode scanner. It has endpoints for both the calling application (host) as for the React Frontend simulator (device).

## How to start

To be able to start scanning barcodes, the following steps need to be taken:

- both host and device has to us the LOGIN endpoint to get the required API token
- device has to use the status/PUT endpoint to set the device status to CONNECTED and call the endpoint on a regular base to stay connected
- host can use the status/GET endpoint to get the current device status, optionally long polling can be used
- host has to start a scan session by calling the session/POST endpoint 
- host can stop an active scan session by calling the session/PUT endpoint
- device has to poll for an active session by calling the active-session/GET endpoint (optionally with long polling), if found the scanner simulator can be turned ON
- device can update the active session with a scanned barcode by calling the active-session/PUT endpoint, which finishes the active session
- host can use the session/GET endpoint (with long polling) to poll for the scanned data

See the next section for the details of each endpoint


## API endpoints
Use the correct server address and port number.

### 1. Health check
#### Request
Use this endpoint to see if the backend service is running correctly.

**GET http://localhost:9003/api/simulator/barcode-scanner/v1/health**

    GET http://localhost:9003/api/simulator/barcode-scanner/v1/health



#### Response
On success: HTTP-status: 200

{
  "info": "The BarcodeScanner back-end server is healthy!"
}

### 2. Login (HOST and DEVICE)
#### Request
Use this endpoint to exchange the user name and password for the device or host for the correct access token.
This token is valid for 24 hours.

**POST http://localhost:9003/api/simulator/barcode-scanner/v1/auth**


- As a device, use the following details<br>

        POST http://localhost:9003/api/simulator/barcode-scanner/v1/auth

        Content-type: application/json
        Authorization: Basic device:device

        {
          "deviceId": "BarcodeScanner"
        }

- As a host, use the following details:

        POST http://localhost:9003/api/simulator/barcode-scanner/v1/auth

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
- CONNECTED
- DISCONNECTED
- OUT_OF_ORDER

This endpoint need to be called by the device on a regular base to stay in the requested status.
In the case the status is not updated in time, the internal status will fallback to "not_found"

**PUT http://localhost:9003/api/simulator/barcode-scanner/v1/status**

    PUT http://localhost:9003/api/simulator/barcode-scanner/v1/status

    Content-type: application/json<br>
    Authorization: Bearer -token here-

    {
      "status": "CONNECTED"
    }

#### Response
On success: HTTP-status: 200
The result is the following JSON object:

    {
      "metadata": {
        "previousStatus": "NOT_FOUND",
        "status": "CONNECTED",
        "timeoutMS": 60000
      }
    }

The device has to call this endpoint repeately within the timeoutSecs.

On bad request: HTTP-status: 400
The result is the following JSON object:

    {
      "error": "...error description here..."
    }

### 4. Get device status (HOST only)
#### Request
**GET http://localhost:9003/api/simulator/barcode-scanner/v1/status**

    GET http://localhost:9003/api/simulator/barcode-scanner/v1/status

    Content-type: application/json<br>
    Authorization: Bearer -token here-

### Long polling
Optionally long-polling can be used. With long polling the result is only returned when the status is different than the status that is send with the call or when the long polling timeout expired.

To use long polling, add the two following query parameter: 
- 'longPollingMS' with a value between 500 - 60000
- 'referenceStatus' with a value of 'connected or 'DISCONNECTED', 'OUT_OF_ORDER' or 'NOT_FOUND'
 
Below an example without long polling:

    GET http://localhost:9003/api/simulator/barcode-scanner/v1/status

    Content-type: application/json<br>
    Authorization: Bearer -token here-


Below an example with a long polling setting of 10 seconds and the last know status was not_found:

    GET http://localhost:9003/api/simulator/barcode-scanner/v1/status?longPollingMS=10000&referenceStatus=NOT_FOUND

    Content-type: application/json<br>
    Authorization: Bearer -token here-


#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "status": "CONNECTED"
    }

The result is the following JSON object if long polling of 5000 ms and a referenceStatus of 'NOT_FOUND' is used and the status changed after 2000 ms to the 'CONNECTED' status:
    {
      "metadata": {
        "referenceStatus": "NOT_FOUND",
        "longPollingMS": 5000,
        "pollingDurationMS": 2000
      },
      "status": "CONNECTED"
    }

### 5. Start new scan session (HOST only)
#### Request
The host can call this endpoint to start a new scanning session


**POST http://localhost:9003/api/simulator/barcode-scanner/v1/session**

    POST http://localhost:9003/api/simulator/barcode-scanner/v1/session

    Content-type: application/json<br>
    Authorization: Bearer -token here-

    {
      "command": "SCAN_BARCODE"
    } 

Optionally, a timeout in milliseconds can be added. After this timeout, the session is automatically ended with the status 'TIMED_OUT'.

    POST http://localhost:9003/api/simulator/barcode-scanner/v1/session

    Content-type: application/json<br>
    Authorization: Bearer -token here-

    {
      "command": "SCAN_BARCODE",
      "timeoutMS": 60000
    } 

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "metadata": {
        "sessionId": "f8f5db54-1591-490d-baa1-a6c7269df736",
        "name": "SCAN_BARCODE",
        "status": "WAITING_FOR_BARCODE"
      }
    }


The result is the following JSON object in case a timeoutMS of 60000 ms is added:

    {
      "metadata": {
        "sessionId": "f8f5db54-1591-490d-baa1-a6c7269df736",
        "name": "SCAN_BARCODE",
        "status": "WAITING_FOR_BARCODE",
        "timeoutMS": 60000
      }
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

### 5. Stop active scan session (HOST only)
#### Request
The host can call this endpoint to start a new scanning session


**PUT http://localhost:9003/api/simulator/barcode-scanner/v1/session/:id**

    PUT http://localhost:9003/api/simulator/barcode-scanner/v1/session/f8f5db54-1591-490d-baa1-a6c7269df736

    Content-type: application/json<br>
    Authorization: Bearer -token here-

    {
      "command": "STOP_SCANNING"
    } 

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "metadata": {
        "sessionId": "1b6e119c-9e4f-4c25-9b75-bada4b9fff49",
        "name": "SCAN_BARCODE",
        "status": "STOPPED"
      }
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

### 6. Get scanned data (HOST only)
#### Request
**GET http://localhost:9003/api/simulator/barcode-scanner/v1/session/:id**
The host can call this endpoint to get the result of a specific session. 

    GET http://localhost:9003/api/simulator/barcode-scanner/v1/session/68078474-97ce-4bfe-a496-12a4329b463b

    Content-type: application/json<br>
    Authorization: Bearer -token here-

### Long polling
Optionally long-polling can be used. In this case the result is only returned when there is scanned data available or when the long polling timeout expired.

To use long polling, add the following query parameter: 
- 'longPollingMS' with a value between 500 - 60000
 

Below an example with a long polling setting of 10 seconds:

    GET http://localhost:9003/api/simulator/barcode-scanner/v1/session/68078474-97ce-4bfe-a496-12a4329b463b?longPollingMS=10000

    Content-type: application/json<br>
    Authorization: Bearer -token here-

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object if there is a barcode data available:

    {
      "metadata": {
        "sessionId": "8de075b8-3e33-43df-a529-c72981be0f32",
        "name": "SCAN_BARCODE",
        "status": "FINISHED"
      },
      "barcodeData": "Whatever data stored in the QR-code"
    }

The result is the following JSON object if there is no barcode data available:

    {
      "metadata": {
        "sessionId": "8de075b8-3e33-43df-a529-c72981be0f32",
        "name": "SCAN_BARCODE",
        "status": "WAITING_FOR_BARCODE"
      }
    }   

    {
      "metadata": {
        "sessionId": "8de075b8-3e33-43df-a529-c72981be0f32",
        "name": "SCAN_BARCODE",
        "status": "STOPPED"
      }
    }  

    {
      "metadata": {
        "sessionId": "8de075b8-3e33-43df-a529-c72981be0f32",
        "name": "SCAN_BARCODE",
        "status": "TIMED_OUT"
      }
    }    

On conflict: HTTP-status: 409<br>
The result is the following JSON object:

    {
      "error": "...error description here..."
    }  

### 7. Get active session (DEVICE only)
#### Request
**GET http://localhost:9003/api/simulator/barcode-scanner/v1/active-session**
The device can call this endpoint to poll for a new scan session.
If found, the simulator can turn ON the scanner ands ask for a barcode to presented.

    GET http://localhost:9003/api/simulator/barcode-scanner/v1/active-session

    Content-type: application/json<br>
    Authorization: Bearer -token here-

### Long polling
Optionally long-polling can be used. In this case the result is only returned when there is scanned data available or when the long polling timeout expired.

To use long polling, add the following query parameter: 
- 'longPollingMS' with a value between 500 - 60000
 

Below an example with a long polling setting of 10 seconds:

    GET http://localhost:9003/api/simulator/barcode-scanner/v1/active-session?longPollingMS=10000

    Content-type: application/json<br>
    Authorization: Bearer -token here-

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "metadata": {
        "sessionId": "8de075b8-3e33-43df-a529-c72981be0f32",
        "name": "SCAN_BARCODE",
        "status": "WAITING_FOR_BARCODE"
      }
    }


The result is the following JSON object if long polling of 20 seconds is used and it took 3500 ms before a new session was started:

    {
      "metadata": {
        "sessionId": "a98f3fc5-2548-4508-9ec0-43e286894369",
        "name": "SCAN_BARCODE",
        "status": "WAITING_FOR_BARCODE",
        "longPollingMS": 20000,
        "pollingDurationMS": 3500
      }
    }

On conflict: HTTP-status: 409<br>
The result is the following JSON object is there is no active session:

    {
      "error": "...error description here..."
    }  


### 8. Update active session (DEVICE only)
#### Request
**PUT http://localhost:9003/api/simulator/barcode-scanner/v1/active-session**
The device can call this endpoint to update the active session with a scanned barcode.

    PUT http://localhost:9003/api/simulator/barcode-scanner/v1/active-session

    Content-type: application/json<br>
    Authorization: Bearer -token here-

    {
      "barcodeData": "Whatever data stored in the QR-code"
    }

#### Response
On success: HTTP-status: 200<br>
The result is the following JSON object:

    {
      "metadata": {
        "sessionId": "8de075b8-3e33-43df-a529-c72981be0f32",
        "name": "SCAN_BARCODE",
        "status": FINISHED",
        "barcodeData": "Whatever data stored in the QR-code"
      }
    }

On conflict: HTTP-status: 409<br>
The result is the following JSON object is there is no active session:

    {
      "error": "...error description here..."
    }  

