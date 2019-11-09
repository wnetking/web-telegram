import routes from './routes';
import Router from './Router';

function push(path) {
  history.pushState([...(history.state || []), ...[path]], '', path);
  window.dispatchEvent(new Event('popstate'));
}

export { push, routes, Router };
