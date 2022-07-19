// ./src/pages/index.ts

// Telas de exceção
export { default as NotFound } from './exceptions/NotFound';

// Telas públicas - sem necessidade de autenticação
export { default as SignIn } from './publics/SignIn';
export { default as RecoverPassword } from './publics/RecoverPassword';

// Telas privadas
export { default as Dashboard } from './privates/Dashboard';
export { default as Profile } from './privates/Profile';
export { default as User } from './privates/User';
export { default as CustomerList } from './privates/User/Customer/List';
export { default as CustomerShow } from './privates/User/Customer/Show';
export { default as AffiliateList } from './privates/User/Affiliate/List';
export { default as AffiliateShow } from './privates/User/Affiliate/Show';
export { default as ProviderList } from './privates/User/Provider/List';
export { default as Contract } from './privates/Contract';
export { default as ContractList } from './privates/Contract/List';
export { default as ContractShow } from './privates/Contract/Show';
export { default as ContractNew } from './privates/Contract/New';
export { default as Called } from './privates/Called';
export { default as CalledList } from './privates/Called/List';
export { default as CalledShow } from './privates/Called/Show';
export { default as CalledNew } from './privates/Called/New';
export { default as Financial } from './privates/Financial';
export { default as Charge } from './privates/Financial/Charge';
export { default as ChargeShow } from './privates/Financial/Charge/Show';
export { default as Tools } from './privates/Tools';
export { default as Communication } from './privates/Tools/Communication';
export { default as Product } from './privates/Tools/Product';
export { default as Service } from './privates/Tools/Service';
export { default as Rescue } from './privates/Rescue';
export { default as RescueList } from './privates/Rescue/List';
export { default as Help } from './privates/Help';
export { default as Setting } from './privates/Setting';
export { default as Notification } from './privates/Notification';
export { default as VehicleShow } from './privates/Vehicle/Show';
