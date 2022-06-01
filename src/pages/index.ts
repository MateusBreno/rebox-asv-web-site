// ./src/pages/index.ts

// Telas de exceção
export { default as NotFound } from './exception/NotFound';
export { default as Maintenance } from './exception/Maintenance';

// Telas públicas - sem necessidade de autenticação
export { default as LandingPage } from './public/LandingPage';
export { default as SignIn } from './public/SignIn';
export { default as RecoverPassword } from './public/RecoverPassword';
export { default as About } from './public/About';
export { default as Plan } from './public/Plan';
export { default as PrivacyPolicy } from './public/PrivacyPolicy';
export { default as Register } from './public/Register';
export { default as Checkout } from './public/Checkout';
export { default as Thanks } from './public/Checkout/Thanks';
export { default as Debts } from './public/Debts';
export { default as Assistance } from './public/Home/Assistance';

// Telas privadas
export { default as Panel } from './privates/Dashboard';
export { default as Profile } from './privates/Profile';
export { default as Contract } from './privates/Contract';
export { default as ContractNew } from './privates/Contract/New';
export { default as ContractShow } from './privates/Contract/Show';
export { default as Called } from './privates/Called';
export { default as CalledNew } from './privates/Called/New';
export { default as CalledShow } from './privates/Called/Show';
export { default as Help } from './privates/Help';
export { default as Setting } from './privates/Setting';
export { default as Notification } from './privates/Notification';
export { default as VehicleShow } from './privates/Vehicle/Show';
