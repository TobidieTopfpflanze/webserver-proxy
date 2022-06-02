import * as http from 'http';

import { LogType, logger } from './utils/logger';

import { configLoader } from './utils/configloader';
import { exit } from 'process';

const cfg = configLoader();
if (!cfg) {
  logger.log(LogType.Error, 'Failed to load config file: ./config.json');
  exit(1);
}

const request: http.RequestListener = (req, res) => {
  logger.log(LogType.Info, 'Hostname: ' + req.headers.host);
  logger.log(LogType.Info, 'Pipe: ' + req.headers.host + req.url);

  const [tdl, main, ..._sub] = req.headers.host?.split('.').reverse() ?? [];
  const sub = _sub.reverse().join('.');
  logger.log(LogType.Info, 'SubDomain: ' + sub);
  logger.log(LogType.Info, 'MainDomain: ' + main);
  logger.log(LogType.Info, 'TDL: ' + tdl);

  const pipe = cfg.getPipeForSubDomain(sub);

  const options = {
    hostname: pipe.host,
    port: pipe.port,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (pres) => {
    res.writeHead(pres.statusCode ?? 404, pres.headers);
    pres.pipe(res, {
      end: true
    });
  });

  req.pipe(proxy, {
    end: true
  });
};

const httpProxy = http.createServer(request).listen(cfg.port);

httpProxy.on('connection', () => {
  logger.log(LogType.Info, 'New Connection!');
});

httpProxy.on('listening', () => {
  logger.log(LogType.Info, 'Start listening!');
});

httpProxy.on('close', () => {
  logger.log(LogType.Info, 'Closed Proxy!');
});

httpProxy.on('error', (err) => {
  logger.log(LogType.Error, 'Error: ' + err);
});

logger.log(LogType.Info, 'Start proxy!');
console.log(cfg);
