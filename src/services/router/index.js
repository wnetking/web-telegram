import routes from './routes';

function push(path) {
  history.pushState([...(history.state || []), ...['/test/']], '', path);
  window.dispatchEvent(new Event('popstate'));
}

export { push, routes };
