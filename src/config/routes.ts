// ./src/config/routes.ts
export default {
  rebox: {
    defaults: {
      source: '/',
      returnBase: '/login',
      mainRedirect: '/painel',
    },
    privates: {
      panel: {
        path: '/painel',
        routeFragment: '/painel',
        next: {},
      },
      profile: {
        path: '/perfil',
        routeFragment: '/perfil',
        next: {},
      },
      contract: {
        path: '/contratos',
        routeFragment: '/contratos',
        next: {
          show: {
            path: '/contratos/:id',
            routeFragment: '/:id',
            next: {},
          },
          new: {
            path: '/contratos/novo',
            routeFragment: '/novo',
            next: {},
          },
        },
      },
      called: {
        path: '/chamados',
        routeFragment: '/chamados',
        next: {
          new: {
            path: '/chamados/novo',
            routeFragment: '/novo',
            next: {},
          },
          show: {
            path: '/chamados/:id',
            routeFragment: '/:id',
            next: {},
          },
        },
      },
      help: {
        path: '/ajuda',
        routeFragment: '/ajuda',
        next: {},
      },
      notification: {
        path: '/notificacoes',
        routeFragment: '/notificacoes',
        next: {},
      },
      setting: {
        path: '/configuracoes',
        routeFragment: '/configuracoes',
        next: {},
      },
      vehicle: {
        path: '/veiculos',
        routeFragment: '/veiculos',
        next: {
          show: {
            path: '/veiculos/:id',
            routeFragment: '/:id',
            next: {},
          },
        },
      },
    },
    publics: {
      landingPage: {
        path: '/',
        routeFragment: '/',
        next: {},
      },
      signIn: {
        path: '/login',
        routeFragment: '/login',
        next: {},
      },
      recoverPassword: {
        path: '/esqueci-minha-senha',
        routeFragment: '/esqueci-minha-senha',
        next: {},
      },
      about: {
        path: '/quem-somos',
        routeFragment: '/quem-somos',
        next: {},
      },
      plan: {
        path: '/nossos-planos',
        routeFragment: '/nossos-planos',
        next: {},
      },
      privacyPolicy: {
        path: '/politica-de-privacidade',
        routeFragment: '/politica-de-privacidade',
        next: {},
      },
      register: {
        path: '/cadastro',
        routeFragment: '/cadastro',
        next: {},
      },
      checkout: {
        path: '/checkout',
        routeFragment: '/checkout',
        next: {
          thanks: {
            path: '/checkout/obrigado',
            routeFragment: '/obrigado',
            next: {},
          },
        },
      },
      debts: {
        path: '/boleto',
        routeFragment: '/boleto',
        next: {},
      },
      assistance: {
        path: '/socorro',
        routeFragment: '/socorro',
        next: {},
      },
    },
  },
};
