const routes = {
  '/': {
    component: 'chat'
  },
  '#/auth': {
    component: 'app-auth',
    storeAttr: ['test']
  },
  '#/code-confirm': {
    component: 'app-auth-code-confirm'
  },

  '#/password': {
    component: 'app-auth-password'
  },
  '#/chat': {
    component: 'app-chat-container'
  }
};

export default routes;
