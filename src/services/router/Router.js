class Router {
  constructor($root, routes, store) {
    this.$root = $root;
    this.routes = routes;
    this.defaultRoute = '/';
    this.store = store;
    this.detachedRoutes = {};
  }

  render(hash = this.defaultRoute) {
    const route = this.routes[hash]
      ? this.routes[hash]
      : this.routes[this.defaultRoute];

    // const $routeComponent = document.createElement(route.component);

    // route.storeAttr &&
    //   route.storeAttr.forEach(prop => {
    //     if (this.store[prop]) {
    //       $routeComponent.setAttribute(prop, this.store[prop]);
    //     }
    //   });

    if (this.$root.firstChild) {
      // this.detachedRoutes[
      //   this.$root.firstChild.tagName
      // ] = this.$root.firstChild.cloneNode(true);
      this.$root.firstChild.remove();
      this.$root.innerHTML = `<${route.component}></${route.component}>`;
    }
  }

  init() {
    window.addEventListener('popstate', () => {
      const hash = window.location.hash;
      this.render(hash);
    });

    this.render();
  }
}

export default Router;
