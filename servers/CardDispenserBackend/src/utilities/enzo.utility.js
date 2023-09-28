const axios = require('axios').default;
const fs = require('fs').promises;
const path = require('node:path');
const { isUUID } = require('validator');
const httpStatus = require('http-status-codes');

const INDEX_CALLING_CODE = 2;

function initialize () {
  overrideConsoleLoggingFunctions();
  initializeDotEnv();
}

function initializeDotEnv () {
  const dotenv = require('dotenv');
  const dotEnvConfig = dotenv.config();
  if (dotEnvConfig.error) {
    console.error('Error while trying to load .env file');
    console.error(dotEnvConfig.error);
    process.exit(1);
  } else if (Object.keys(dotEnvConfig.parsed).length === 0) {
    console.error('.env file is empty or contains no valid key-value pairs');
    process.exit(1);
  }
}

function validateRequestContentTypeJson (req, res, next) {
  if (req.method.toLocaleLowerCase() === 'post' || req.method.toLocaleLowerCase() === 'put') {
    if (req.headers['content-type'].toLocaleLowerCase() !== 'application/json') {
      return res.status(httpStatus.StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
        error: `Expected request content-type: application/json, received request content-type: ${req.headers['content-type']}`
      });
    }
  }
  next();
}

function overrideConsoleLoggingFunctions () {
  {
    const originalConsoleLog = console.log;
    console.log = function () {
      const stackLines = new Error().stack.split('\n');
      const callingCodeLine = stackLines[INDEX_CALLING_CODE];
      const jsFileEnding = '.js';
      const fileName = callingCodeLine.substring(callingCodeLine.lastIndexOf('\\'), callingCodeLine.lastIndexOf(jsFileEnding) + jsFileEnding.length).slice(1);
      const lineNumberInfo = callingCodeLine.substring(callingCodeLine.lastIndexOf(jsFileEnding) + jsFileEnding.length).slice(1, -1);

      if (arguments.length > 0) {
        arguments[0] = `[${new Date().toISOString()}] [${fileName}:${lineNumberInfo}] ${arguments[0]}`;
      }
      originalConsoleLog.apply(console, arguments);
    };
  }

  {
    const originalConsoleInfo = console.info;
    console.info = function () {
      const stackLines = new Error().stack.split('\n');
      const callingCodeLine = stackLines[INDEX_CALLING_CODE];
      const jsFileEnding = '.js';
      const fileName = callingCodeLine.substring(callingCodeLine.lastIndexOf('\\'), callingCodeLine.lastIndexOf(jsFileEnding) + jsFileEnding.length).slice(1);
      const lineNumberInfo = callingCodeLine.substring(callingCodeLine.lastIndexOf(jsFileEnding) + jsFileEnding.length).slice(1, -1);

      if (arguments.length > 0) {
        arguments[0] = `[${new Date().toISOString()}] [${fileName}:${lineNumberInfo}] ${arguments[0]}`;
      }
      originalConsoleInfo.apply(console, arguments);
    };
  }

  {
    const originalConsoleError = console.error;
    console.error = function () {
      const stackLines = new Error().stack.split('\n');
      const callingCodeLine = stackLines[INDEX_CALLING_CODE];
      const jsFileEnding = '.js';
      const fileName = callingCodeLine.substring(callingCodeLine.lastIndexOf('\\'), callingCodeLine.lastIndexOf(jsFileEnding) + jsFileEnding.length).slice(1);
      const lineNumberInfo = callingCodeLine.substring(callingCodeLine.lastIndexOf(jsFileEnding) + jsFileEnding.length).slice(1, -1);

      if (arguments.length > 0) {
        arguments[0] = `[${new Date().toISOString()}] [${fileName}:${lineNumberInfo}] ${arguments[0]}`;
      }
      originalConsoleError.apply(console, arguments);
    };
  }
}

const retrieveKmsData = async (kmsApiRequestUrl, storedFolder, queryParamsObj = undefined) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${process.env.KMS_API_ACCESS_TOKEN}` },
      ...(queryParamsObj && { params: queryParamsObj })
    };

    const response = await axios.get(`${kmsApiRequestUrl}`, config);
    if (response.data.length === 0) {
      console.warn(`Successfully retrieved ${storedFolder} data from KMS, but response is empty`);
    }

    // Delete all locally stored files (to avoid maintaining old files that no longer exist)
    try {
      await fs.rm(path.join(__dirname, '../../', storedFolder), { force: true, recursive: true });
    } catch (error) {
      console.error(`Failed to delete locally stored files: ${error}`);
      throw Error(error);
    }

    // Create folder for stored files
    try {
      await fs.mkdir(path.join(__dirname, '../../', storedFolder));
    } catch (error) {
      console.error(`Failed to create ${storedFolder} folder: ${error}`);
      throw Error(error);
    }

    try {
      for (const item of response.data) {
        await saveLocalKmsData(storedFolder, item);
      }
    } catch (error) {
      console.error(`Failed to save ${storedFolder} data locally: ${error}`);
      throw Error(error);
    }
  } catch (error) {
    console.error(`Failed to retrieve ${storedFolder} data from KMS: ${error}`);
  }
};

async function getLocalKmsDataFileNames (storedFolder) {
  try {
    let fileNames;
    try {
      fileNames = await fs.readdir(path.join(__dirname, `../../${storedFolder}`));
    } catch (e) {
      throw Error(e);
    }
    const dataFileNames = fileNames.filter(
      (fileName) => {
        return isUUID(path.parse(fileName).name) &&
          path.extname(fileName).toLocaleLowerCase() === '.json';
      }
    );
    return dataFileNames;
  } catch (error) {
    console.error(`Failed to retrieve file names in ${storedFolder} folder: ${error}`);
    throw error;
  }
}

async function getLocalKmsData (storedFolder, companyUuid) {
  try {
    if (companyUuid === undefined) {
      const dataArray = [];
      const fileNames = await getLocalKmsDataFileNames(storedFolder);
      for (const fileName of fileNames) {
        const rawData = await fs.readFile(`./${storedFolder}/${fileName}`);
        dataArray.push(JSON.parse(rawData));
      }
      return dataArray;
    } else {
      const rawData = await fs.readFile(`./${storedFolder}/${companyUuid}.json`);
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error(`Failed to retrieve ${companyUuid} file from ${storedFolder} folder: ${error}`);
    throw error;
  }
}

const getSettings = async () => {
  try {
    const apiConfiguration = await getLocalKmsData('api-configuration');
    if (!apiConfiguration || !apiConfiguration.length) {
      throw Error('API configuration not found');
    }

    const settings = apiConfiguration[0].details;
    return settings;
  } catch (error) {
    console.error('Failed to retrieve API settings from folder: api-configuration');
    throw error;
  }
};

async function saveLocalKmsData (storedFolder, data) {
  try {
    await fs.writeFile(
      `./${storedFolder}/${data.company.uuid}.json`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(`Failed to save ${data.companyUuid} file in ${storedFolder} folder: ${error}`);
    throw error;
  }
}

const randomNumberFromRange = (min, max) => {
  const minNum = Number(min);
  const maxNum = Number(max);
  return (Math.floor(Math.random() * (maxNum - minNum)) + minNum);
};

function isDevelopmentEnvironment () {
  return process.env?.NODE_ENV && process.env.NODE_ENV === 'development';
}

function isProductionEnvironment () {
  return process.env?.NODE_ENV && process.env.NODE_ENV === 'production';
}

module.exports = {
  initialize,
  validateRequestContentTypeJson,
  retrieveKmsData,
  getLocalKmsDataFileNames,
  getLocalKmsData,
  saveLocalKmsData,
  randomNumberFromRange,
  isDevelopmentEnvironment,
  isProductionEnvironment,
  getSettings
};
