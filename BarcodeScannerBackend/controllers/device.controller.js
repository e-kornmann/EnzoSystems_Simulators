const httpStatus = require('http-status-codes');

/* //////////////////////////////////////////////////////////////////////////////
//
// Transaction storage as long as the service is running
//
////////////////////////////////////////////////////////////////////////////// */

const DEVICE_STATUS = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  OUT_OF_ORDER: 'OUT_OF_ORDER',
  NOT_FOUND: 'NOT_FOUND'
};

const DEVICE_MODE = {
  ENABLED: 'ENABLED',
  DISABLED: 'DISABLED',
  UNKNOWN: 'UNKNOWN'
};

const LONG_POLLING_INTERVAL_MS = 100;

// static variables
let DeviceStatus = DEVICE_STATUS.NOT_FOUND;
let DeviceMode = DEVICE_MODE.UNKNOWN;
let ConnectionTimeout = 0;
let ScannedData = null;

/* //////////////////////////////////////////////////////////////////////////////
//
// global time-out function to check if React simulator is connected
//
////////////////////////////////////////////////////////////////////////////// */

setInterval(() => {
  ConnectionTimeout--;
  if (ConnectionTimeout === 0 && DeviceStatus !== DEVICE_STATUS.NOT_FOUND) {
    DeviceStatus = DEVICE_STATUS.NOT_FOUND;
    DeviceMode = DEVICE_MODE.UNKNOWN;
    console.log('Device failed to reconnect within the required timeout period');
  }
}, 1000);

/* //////////////////////////////////////////////////////////////////////////////
//
// setDeviceStatus function
// if device status is BUSY (= ON), new scans can be made
//
////////////////////////////////////////////////////////////////////////////// */

async function setDeviceStatus (req, res) {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    res.status(httpStatus.StatusCodes.BAD_REQUEST);

    if (!req.body.status) {
      throw new Error('Body is missing \'status\' property');
    } else if (req.body.status.toUpperCase() !== DEVICE_STATUS.CONNECTED &&
      req.body.status.toUpperCase() !== DEVICE_STATUS.DISCONNECTED &&
      req.body.status.toUpperCase() !== DEVICE_STATUS.OUT_OF_ORDER) {
      throw new Error('Body \'status\' property should be \'connected\', \'disconnected\' or \'out_of_order\'');
    }

    const oldDeviceStatus = DeviceStatus;
    DeviceStatus = req.body.status.toUpperCase();

    if (DeviceStatus === DEVICE_STATUS.CONNECTED && oldDeviceStatus !== DEVICE_STATUS.CONNECTED) {
      DeviceMode = DEVICE_MODE.DISABLED;
    }

    if (process.env.DEVICE_CONNECTION_TIMEOUT_SEC) {
      ConnectionTimeout = parseInt(process.env.DEVICE_CONNECTION_TIMEOUT_SEC, 10);
    } else {
      ConnectionTimeout = 10;
    }

    res.status(httpStatus.StatusCodes.OK).json({ result: 'success', newStatus: DeviceStatus.toLowerCase(), timeoutSecs: ConnectionTimeout });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put status) result: 'success', newStatus: ${DeviceStatus.toLowerCase()}, timeoutSecs: ${ConnectionTimeout}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put status) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// getDeviceStatus function to get the current status of the device
//
////////////////////////////////////////////////////////////////////////////// */

async function getDeviceStatus (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    // check if there are query params, if so, both longPollingSecs and currentState are mandatory
    if (Object.keys(req.query).length) {
      if (!Object.keys(req.query).includes('longPollingSecs') || !Object.keys(req.query).includes('currentStatus')) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string must be empty or contain both the \'longPollingSecs\' and \'currentStatus\' properties');
      }

      if (req.query.currentStatus.toUpperCase() !== DEVICE_STATUS.CONNECTED &&
          req.query.currentStatus.toUpperCase() !== DEVICE_STATUS.DISCONNECTED &&
          req.query.currentStatus.toUpperCase() !== DEVICE_STATUS.NOT_FOUND &&
          req.query.currentStatus.toUpperCase() !== DEVICE_STATUS.OUT_OF_ORDER) {
        // error
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string \'currentStatus\' property must be \'connected\', \'disconnected\', \'not_found\' or \'out_of_order\'');
      }

      if (req.query.longPollingSecs <= 0 || req.query.longPollingSecs > 60) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error(`Invalid longPollingSecs value: ${req.query.longPollingSecs}. It should be any value between 1 and 60`);
      }

      // if mode already changed, return directly
      if (req.query.currentStatus.toUpperCase() !== DeviceStatus) {
        res.status(httpStatus.StatusCodes.OK).json({ status: DeviceStatus.toLowerCase() });
        console.log(`(${req.authenticationType}: ${req.authenticationUser} - get status) deviceStatus: ${DeviceStatus.toLowerCase()}}`);
      } else {
        // use long polling
        let pollingMs = req.query.longPollingSecs * 1000;
        const timer = setInterval(() => {
          try {
            pollingMs -= LONG_POLLING_INTERVAL_MS;
            if ((req.query.currentStatus.toUpperCase() !== DeviceStatus) || pollingMs <= 0) {
              clearInterval(timer);
              res.status(httpStatus.StatusCodes.OK).json({ status: DeviceStatus.toLowerCase() });
              console.log(`(${req.authenticationType} :${req.authenticationUser} - get status) deviceStatus: ${DeviceStatus.toLowerCase()}}`);
            }
          } catch (e) {
            console.log(`(${req.authenticationType}: ${req.authenticationUser} - get mode) ${e.message}`);
            res.json({ error: e.message });
          }
        }, LONG_POLLING_INTERVAL_MS);
      }
    } else {
      // return directly
      res.status(httpStatus.StatusCodes.OK).json({ status: DeviceStatus.toLowerCase() });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - get status) deviceStatus: ${DeviceStatus.toLowerCase()}}`);
    }
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get status) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// setDeviceMode function
// if device mode is ENABLED, new scans can be made
//
////////////////////////////////////////////////////////////////////////////// */

async function setDeviceMode (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    if (DeviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is disconnected');
    } else if (DeviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is not found');
    } else if (DeviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is out of order');
    } else if (DeviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    }

    if (!req.body.mode) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body is missing \'mode\' property');
    } else if (req.body.mode.toUpperCase() !== DEVICE_MODE.ENABLED &&
      req.body.mode.toUpperCase() !== DEVICE_MODE.DISABLED) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body \'mode\' property should be \'enabled\' or \'disabled\'');
    }

    DeviceMode = req.body.mode.toUpperCase();

    res.status(httpStatus.StatusCodes.OK).json({ result: 'success', newMode: DeviceMode.toLowerCase() });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put mode) result: 'success', newMode: ${DeviceMode.toLowerCase()}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put mode) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// getDeviceMode function to get the current mode of the device
//
////////////////////////////////////////////////////////////////////////////// */

async function getDeviceMode (req, res) {
  try {
    // check if there are query params, if so, both longPollingSecs and currentMode are mandatory
    if (Object.keys(req.query).length) {
      if (!Object.keys(req.query).includes('longPollingSecs') || !Object.keys(req.query).includes('currentMode')) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string must be empty or contain both the \'longPollingSecs\' and \'currentMode\' properties');
      }

      if (req.query.currentMode.toUpperCase() !== DEVICE_MODE.ENABLED && req.query.currentMode.toUpperCase() !== DEVICE_MODE.DISABLED) {
        // error
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string \'currentMode\' property must be \'enabled\' or \'disabled\'');
      }

      if (req.query.longPollingSecs <= 0 || req.query.longPollingSecs > 60) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error(`Invalid longPollingSecs value: ${req.query.longPollingSecs}. It should be any value between 1 and 60`);
      }

      // if mode already changed, return directly
      if (req.query.currentMode.toUpperCase() !== DeviceMode) {
        res.status(httpStatus.StatusCodes.OK).json({ mode: DeviceMode.toLowerCase() });
        console.log(`(${req.authenticationType}: ${req.authenticationUser} - get mode) deviceMode: ${DeviceMode.toLowerCase()}}`);
      } else {
        // use long polling
        let pollingMs = req.query.longPollingSecs * 1000;
        const timer = setInterval(() => {
          try {
            pollingMs -= LONG_POLLING_INTERVAL_MS;
            if ((req.query.currentMode.toUpperCase() !== DeviceMode) || pollingMs <= 0) {
              clearInterval(timer);
              res.status(httpStatus.StatusCodes.OK).json({ mode: DeviceMode.toLowerCase() });
              console.log(`(${req.authenticationType}: ${req.authenticationUser} - get mode) deviceMode: ${DeviceMode.toLowerCase()}}`);
            }
          } catch (e) {
            console.log(`(${req.authenticationType}: ${req.authenticationUser} - get mode) ${e.message}`);
            res.json({ error: e.message });
          }
        }, LONG_POLLING_INTERVAL_MS);
      }
    } else {
      // return directly
      res.status(httpStatus.StatusCodes.OK).json({ mode: DeviceMode.toLowerCase() });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - get mode) deviceMode: ${DeviceMode.toLowerCase()}}`);
    }
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get mode) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// newScan function to get a new scan
//
////////////////////////////////////////////////////////////////////////////// */

async function newScan (req, res) {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    if (DeviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is disconnected');
    } else if (DeviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is not not found');
    } else if (DeviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is out of order');
    } else if (DeviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    }

    if (DeviceMode !== DEVICE_MODE.ENABLED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is not in enabled mode');
    }

    if (!req.body.scannedData) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body is missing \'scannedData\' property');
    } else if (!req.body.scannedData.length) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Data property should contain scanned data');
    }

    ScannedData = req.body.scannedData;

    if (process.env.DEVICE_CONNECTION_TIMEOUT_SEC) {
      ConnectionTimeout = parseInt(process.env.DEVICE_CONNECTION_TIMEOUT_SEC, 10);
    } else {
      ConnectionTimeout = 10;
    }

    res.status(httpStatus.StatusCodes.OK).json({ result: 'success', newScannedData: ScannedData });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post scan job) result: 'success', , newScannedData: ${ScannedData}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post scan job) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// getScan function to get a new scan
//
////////////////////////////////////////////////////////////////////////////// */

async function getScan (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    if (DeviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device not found');
    } else if (DeviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is out of order');
    } else if (DeviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    } else if (DeviceMode !== DEVICE_MODE.ENABLED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is not in enabled mode');
    }

    if (!req.query.longPollingSecs) {
      // if (!ScannedData) {
      //   res.status(httpStatus.StatusCodes.NOT_FOUND);
      //   throw new Error('No scan data found');
      // }
      res.status(httpStatus.StatusCodes.OK).json({ scannedData: ScannedData });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - get scan) scannedData: ${ScannedData}}`);
      ScannedData = null;
    } else if (ScannedData) {
      res.status(httpStatus.StatusCodes.OK).json({ scannedData: ScannedData });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - get scan) scannedData: ${ScannedData}}`);
      ScannedData = null;
    } else {
      let pollingMs = 0;
      if (req.query.longPollingSecs) {
        pollingMs = req.query.longPollingSecs;
        if (pollingMs < 0 || pollingMs > 60) {
          throw new Error(`Invalid longPollingSecs value: ${pollingMs}. It should be any value between 0 and 60`);
        }
        pollingMs *= 1000;
      }

      const timer = setInterval(() => {
        try {
          pollingMs -= LONG_POLLING_INTERVAL_MS;
          if (ScannedData || pollingMs <= 0) {
            clearInterval(timer);
            // if (!ScannedData) {
            //   res.status(httpStatus.StatusCodes.NOT_FOUND);
            //   throw new Error('No scan data found');
            // }
            res.status(httpStatus.StatusCodes.OK).json({ scannedData: ScannedData });
            console.log(`(${req.authenticationType}: ${req.authenticationUser} - get scan) scannedData: ${ScannedData}}`);
            ScannedData = null;
          }
        } catch (e) {
          console.log(`(${req.authenticationType}: ${req.authenticationUser} - get scan) ${e.message}`);
          res.json({ error: e.message });
        }
      }, LONG_POLLING_INTERVAL_MS);
    }
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get scan) ${e.message}`);
    res.json({ error: e.message });
  }
}

module.exports = {
  setDeviceStatus,
  getDeviceStatus,
  setDeviceMode,
  getDeviceMode,
  newScan,
  getScan
};
