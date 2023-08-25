const axios = require('axios').default;
const { AxiosError } = require('axios');
const fs = require('fs').promises;
const path = require('node:path');
const { isUUID } = require('validator');

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

async function retrieveKmsData (KmsApiRequestUrl, storedFolder, queryParamsObj = undefined) {
  let isKmsRetrievalSucceeded = false;
  let isKmsDataEmpty = true;

  try {
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${process.env.KMS_API_ACCESS_TOKEN}`
      },
      ...(queryParamsObj && { params: queryParamsObj })
    };
    const response = await axios.get(`${KmsApiRequestUrl}`, requestConfig);
    isKmsRetrievalSucceeded = true;

    if (response.data.length === 0) {
      console.warn(`Successfully retrieved ${storedFolder} data from Kms, but list is empty.`);
    } else {
      isKmsDataEmpty = false;

      // Delete all locally stored configurations (i.e. to avoid configurations that may not exist anymore)
      await fs.rm(
        path.join(__dirname, '..', storedFolder),
        {
          recursive: true,
          force: true
        }
      );
    }

    for (const item of response.data) {
      try {
        await fs.mkdir(path.join(__dirname, '..', storedFolder)); // create new storedFolder in parent of /utilities/ folder
      } catch (e) {
        if (e.code !== 'EEXIST') { // folder already exists, ignore error (this is best practice apparently - checking beforehand introduces race condition!)
          throw Error(e);
        }
      }
      await saveLocalKmsData(storedFolder, item);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(`Failed to retrieve ${storedFolder} data from Kms. Axios error: ${error.message}`);
    } else {
      console.error(error);
    }
  }

  if (!isKmsRetrievalSucceeded || isKmsDataEmpty) {
    const dataFileNames = getLocalKmsDataFileNames(storedFolder);
    if (dataFileNames.length === 0) {
      console.error('No local data found.');
    }
  }
}

async function getLocalKmsDataFileNames (storedFolder) {
  try {
    const fileNames = await fs.readdir(path.join(__dirname, `/../${storedFolder}`));
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

async function getLocalKmsData (storedFolder, companyUuid = undefined) {
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
  return Math.floor(Math.random() * (max - min)) + min;
};

function isDevelopmentEnvironment () {
  return process.env?.NODE_ENV && process.env.NODE_ENV === 'development';
}

function isProductionEnvironment () {
  return process.env?.NODE_ENV && process.env.NODE_ENV === 'production';
}

module.exports = {
  initialize,
  retrieveKmsData,
  getLocalKmsDataFileNames,
  getLocalKmsData,
  saveLocalKmsData,
  randomNumberFromRange,
  isDevelopmentEnvironment,
  isProductionEnvironment
};
