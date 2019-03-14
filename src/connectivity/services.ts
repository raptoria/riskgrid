export const Services = {
  env: (window as IWindow).CONFIG_ENV || 'prod',
  serviceHosts: {
    dev: 'http://localhost:8890',
    uat: 'http://uathost:6000',
    prod: 'http://prodhost:6000'
  },
  servicePaths: ['/api/fetchdata'],
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json'
  }
};
