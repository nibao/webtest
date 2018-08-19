const _ = require('lodash');
const thrift = require('thrift');
const ShareMgnt = require('./gen-node/ncTShareMgnt');
const ECMSManager = require('./gen-node/ncTECMSManager');
const ShareSite = require('./gen-node/ncTShareSite');
const EVFS = require('./gen-node/ncTEVFS');
const ESearchMgnt = require('./gen-node/ncTESearchMgnt');
const EACPLog = require('./gen-node/ncTEACPLog');
const ECMSUpgrade = require('./gen-node/ncTECMSUpgradeManager');

class ThriftProxy {
  constructor(port, thriftModule) {
    for (const method in thriftModule.Client.prototype) {
      this[method] = async function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        let params = [], callback;

        if (typeof arg0 === 'function') {
          callback = arg0;
        } else {
          const args = Array.from(arguments);
          const last = _.last(args);

          if (_.isFunction(last)) {
            params = args.slice(0, args.length - 1);
            callback = last;
          } else {
            params = args;
          }
        }

        const connection = thrift.createConnection('127.0.0.1', port)
        const client = thrift.createClient(thriftModule, connection)

        connection.on('error', error => {
          if(_.isFunction(callback)) {
            callback(error)
          }
        })

        try {
          const ret = client[method].call(client, ...params);

          if (_.isFunction(callback)) {
            callback(null, await ret)
            connection.end();
          } else {
            setTimeout(() => {
              connection.end()
            }, 1000 * 3)
          }
        } catch (ex) {
          if (_.isFunction(callback)) {
            callback(ex);
          }
          connection.end();
        }
      }
    }
  }
}

const server = thrift.createWebServer({
  cors: { '*': true },
  services: {
    '/ECMSManager': {
      transport: thrift.TBufferedTransport,
      protocol: thrift.TJSONProtocol,
      processor: ECMSManager.Processor,
      handler: new ThriftProxy(9201, ECMSManager)
    },
    '/ShareMgnt': {
      transport: thrift.TBufferedTransport,
      protocol: thrift.TJSONProtocol,
      processor: ShareMgnt.Processor,
      handler: new ThriftProxy(9600, ShareMgnt)
    },
    '/ShareSite': {
      transport: thrift.TBufferedTransport,
      protocol: thrift.TJSONProtocol,
      processor: ShareSite.Processor,
      handler: new ThriftProxy(9601, ShareSite)
    },
    '/EVFS': {
      transport: thrift.TBufferedTransport,
      protocol: thrift.TJSONProtocol,
      processor: EVFS.Processor,
      handler: new ThriftProxy(9064, EVFS)
    },
    '/ESearchMgnt': {
      transport: thrift.TBufferedTransport,
      protocol: thrift.TJSONProtocol,
      processor: ESearchMgnt.Processor,
      handler: new ThriftProxy(9066, ESearchMgnt)
    },
    '/EACPLog': {
      transport: thrift.TBufferedTransport,
      protocol: thrift.TJSONProtocol,
      processor: EACPLog.Processor,
      handler: new ThriftProxy(9993, EACPLog)
    },
    '/ECMSUpgrade': {
      transport: thrift.TBufferedTransport,
      protocol: thrift.TJSONProtocol,
      processor: ECMSUpgrade.Processor,
      handler: new ThriftProxy(9203, ECMSUpgrade)
    }
  }
})

server.timeout = 0;
server.listen(18008);