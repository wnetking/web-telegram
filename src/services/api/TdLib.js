import TdClient from 'tdweb/dist/tdweb';
import { WASM_FILE_HASH, WASM_FILE_NAME } from '../../utils/constants.js';
import { getBrowser, getOSName } from '../../utils/common.js';
import config from '../../configs/index.js';
import states from '../response-states';


class TdLib {
  constructor() {
    this.parameters = {
      useTestDC: false,
      readOnly: false,
      verbosity: 1,
      jsVerbosity: 3,
      fastUpdating: true,
      useDatabase: false,
      mode: 'wasm'
    };

    this.disableLog = false;
    this.client = null;
    this.debug = process.env.NODE_ENV === 'development';
  }

  /**
   * Init Tdlib
   */
  init() {
    const {
      verbosity,
      jsVerbosity,
      useTestDC,
      readOnly,
      fastUpdating,
      useDatabase,
      mode
    } = this.parameters;
    const dbName = useTestDC ? 'tdlib_test' : 'tdlib';

    let options = {
      logVerbosityLevel: verbosity,
      jsLogVerbosityLevel: jsVerbosity,
      mode: mode, // 'wasm-streaming'/'wasm'/'asmjs'
      prefix: dbName,
      readOnly: readOnly,
      isBackground: false,
      useDatabase: useDatabase,
      wasmUrl: `${WASM_FILE_NAME}?_sw-precache=${WASM_FILE_HASH}`
    };

    this.client = new TdClient(options);

    this.client.onUpdate = update => {
      states(update);
    };
  }

  /**
   * Send request
   */
  send(request) {
    if (!this.disableLog) {
      return this.client
        .send(request)
        .then(result => {
          return result;
        })
        .catch(error => {
          if (error['@type'] === 'error') {
            if (this.debug) {
              console.error(error.message);
            }
            states(error);
          }
          throw error;
        });
    } else {
      return this.client.send(request);
    }
  }

  sendTdParameters() {
    const { api_id, api_hash } = config;

    const { useTestDC } = this.parameters;

    this.send({
      '@type': 'setTdlibParameters',
      parameters: {
        '@type': 'tdParameters',
        use_test_dc: useTestDC,
        api_id: api_id,
        api_hash: api_hash,
        system_language_code: navigator.language || 'en',
        device_model: getBrowser(),
        system_version: getOSName(),
        application_version: '1.0.0',
        use_secret_chats: false,
        use_message_database: true,
        use_file_database: false,
        database_directory: '/db',
        files_directory: '/'
      }
    });
  }
}

const TdLibCtrl = new TdLib();

export default TdLibCtrl;
