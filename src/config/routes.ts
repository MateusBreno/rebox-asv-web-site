// ./src/config/routes.ts
export default {
  rebox: {
    defaults: {
      source: '/',
      returnBase: '/login',
      mainRedirect: '/usuarios',
    },
    privates: {
      dashboad: {
        path: '/dashboard',
        routeFragment: '/dashboard',
        next: {},
      },
      profile: {
        path: '/perfil',
        routeFragment: '/perfil',
        next: {},
      },
      users: {
        path: '/usuarios',
        routeFragment: '/usuarios',
        next: {
          customers: {
            path: '/usuarios/clientes',
            routeFragment: '/clientes',
            next: {
              show: {
                path: '/usuarios/clientes/:id',
                routeFragment: '/:id',
              },
            },
          },
          affiliates: {
            path: '/usuarios/afiliados',
            routeFragment: '/afiliados',
            next: {
              show: {
                path: '/usuarios/afiliados/:id',
                routeFragment: '/:id',
              },
            },
          },
          providers: {
            path: '/usuarios/prestadores',
            routeFragment: '/prestadores',
            next: {
              show: {
                path: '/usuarios/prestadores/:id',
                routeFragment: '/:id',
              },
            },
          },
        },
      },
      sales: {
        path: '/vendas',
        routeFragment: '/vendas',
        next: {
          contracts: {
            path: '/vendas/contratos',
            routeFragment: '/contratos',
            next: {
              show: {
                path: '/vendas/contratos/:id',
                routeFragment: '/:id',
                next: {},
              },
            },
          },
          new: {
            path: '/vendas/nova',
            routeFragment: '/nova',
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
          drives: {
            path: '/chamados/acionamentos',
            routeFragment: '/acionamentos',
            next: {
              show: {
                path: '/chamados/acionamentos/:id',
                routeFragment: '/:id',
                next: {},
              },
            },
          },
        },
      },
      financial: {
        path: '/financeiro',
        routeFragment: '/cobrancas',
        next: {
          charges: {
            path: '/financeiro/cobrancas',
            routeFragment: '/cobrancas',
            next: {
              show: {
                path: '/financeiro/cobrancas/:id',
                routeFragment: '/:id',
                next: {},
              },
            },
          },
        },
      },
      rescues: {
        path: '/resgates',
        routeFragment: '/resgates',
        next: {
          commissions: {
            path: '/resgates/comissoes',
            routeFragment: '/comissoes',
            next: {},
          },
        },
      },
      help: {
        path: '/ajuda',
        routeFragment: '/ajuda',
        next: {},
      },
      notifications: {
        path: '/notificacoes',
        routeFragment: '/notificacoes',
        next: {},
      },
      settings: {
        path: '/configuracoes',
        routeFragment: '/configuracoes',
        next: {},
      },
      vehicles: {
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
      tools: {
        path: '/ferramentas',
        routeFragment: '/ferramentas',
        next: {
          products: {
            path: '/ferramentas/produtos',
            routeFragment: '/produtos',
            next: {},
          },
          services: {
            path: '/ferramentas/servicos',
            routeFragment: '/servicos',
            next: {},
          },
          communication: {
            path: '/ferramentas/comunicacao',
            routeFragment: '/comunicacao',
            next: {},
          },
        },
      },
    },
    publics: {
      login: {
        path: '/login',
        routeFragment: '/login',
        next: {},
      },
      recoverPassword: {
        path: '/esqueci-minha-senha',
        routeFragment: '/esqueci-minha-senha',
        next: {},
      },
    },
  },
};
