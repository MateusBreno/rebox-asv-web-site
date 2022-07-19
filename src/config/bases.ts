// ./src/config/bases.ts
export default {
  rebox: {
    baseUrls: {
      // carAssistance: 'http://localhost:3333/v1.0',
      carAssistance: 'https://rebox2.com.br/v1.0',
      // carAssistance: 'https://c874-187-72-168-161.sa.ngrok.io/v1.0',
    },
    externalLinks: {
      provider: 'https://prestador.rebox.com.br',
      affiliate: 'https://afiliado.rebox.com.br',
      shareProducts: 'https://rebox.com.br/nossos-planos?i=',
    },
    emails: {
      contactUs: 'faleconosco@rebox.com.br',
    },
  },
  viaCep: {
    baseUrls: {
      address: 'https://viacep.com.br/ws',
    },
  },
  ibge: {
    baseUrls: {
      serviceData: 'https://servicodados.ibge.gov.br/api/v1',
    },
  },
  correio: {
    baseUrls: {
      buscaCepInter:
        'https://buscacepinter.correios.com.br/app/endereco/index.php?t',
    },
  },
  google: {
    baseUrls: {
      maps: 'https://maps.googleapis.com/maps/api',
    },
  },
};
