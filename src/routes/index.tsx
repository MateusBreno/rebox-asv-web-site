// ./src/routes/index.tsx
import React, { lazy, Suspense } from 'react';

import { Route, Switch } from 'react-router-dom';

import { LoadingSuspense } from '@components/index';
import { ConfigRoutes } from '@config/index';
import {
  // NotFound,
  // SignIn,
  RecoverPassword,
  Dashboard,
  Profile,
  User,
  CustomerList,
  CustomerShow,
  AffiliateList,
  AffiliateShow,
  ProviderList,
  Contract,
  ContractList,
  ContractShow,
  ContractNew,
  Called,
  CalledList,
  CalledShow,
  CalledNew,
  Financial,
  Charge,
  ChargeShow,
  Product,
  Service,
  Rescue,
  RescueList,
  Help,
  Setting,
  Notification,
  VehicleShow,
  Tools,
  Communication,
} from '@pages/index';

import PrivateRoute from './private';

// Páginas
const NotFound = lazy(() => import('@pages/exceptions/NotFound'));

const SignIn = lazy(() => import('@pages/publics/SignIn'));
// const RecoverPassword = lazy(() => import('@pages/publics/RecoverPassword'));

// const Dashboard = lazy(() => import('@pages/privates/Dashboard'));
// const Profile = lazy(() => import('@pages/privates/Profile'));
// const User = lazy(() => import('@pages/privates/User'));
// const CustomerList = lazy(() => import('@pages/privates/User/Customer/List'));
// const CustomerShow = lazy(() => import('@pages/privates/User/Customer/Show'));
// const AffiliateList = lazy(() => import('@pages/privates/User/Affiliate/List'));
// const AffiliateShow = lazy(() => import('@pages/privates/User/Affiliate/Show'));
// const ProviderList = lazy(() => import('@pages/privates/User/Provider/List'));
// const Contract = lazy(() => import('@pages/privates/Contract'));
// const ContractList = lazy(() => import('@pages/privates/Contract/List'));
// const ContractShow = lazy(() => import('@pages/privates/Contract/Show'));
// const ContractNew = lazy(() => import('@pages/privates/Contract/New'));
// const Called = lazy(() => import('@pages/privates/Called'));
// const CalledList = lazy(() => import('@pages/privates/Called/List'));
// const CalledNew = lazy(() => import('@pages/privates/Called/New'));
// const Financial = lazy(() => import('@pages/privates/Financial'));
// const Charge = lazy(() => import('@pages/privates/Financial/Charge'));
// const ChargeShow = lazy(() => import('@pages/privates/Financial/Charge/Show'));
// const Product = lazy(() => import('@pages/privates/Product'));
// const Service = lazy(() => import('@pages/privates/Service'));
// const Rescue = lazy(() => import('@pages/privates/Rescue'));
// const RescueList = lazy(() => import('@pages/privates/Rescue/List'));
// const Help = lazy(() => import('@pages/privates/Help'));
// const Setting = lazy(() => import('@pages/privates/Setting'));
// const Notification = lazy(() => import('@pages/privates/Notification'));
// const VehicleShow = lazy(() => import('@pages/privates/Vehicle/Show'));

const Routes: React.FC = () => (
  <Suspense fallback={<LoadingSuspense />}>
    <Switch>
      {/* Atividades liberadas a todos */}
      <Route
        path={ConfigRoutes.rebox.defaults.source}
        component={SignIn}
        exact
      />
      <Route
        path={ConfigRoutes.rebox.publics.login.path}
        component={SignIn}
        exact
      />
      <Route
        path={ConfigRoutes.rebox.publics.recoverPassword.path}
        component={RecoverPassword}
        exact
      />

      {/* Atividades apenas para pessoal autorizado */}
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.dashboad.path}
        component={Dashboard}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.profile.path}
        component={Profile}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.users.path}
        component={User}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.users.next.customers.path}
        component={CustomerList}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.users.next.customers.next.show.path}
        component={CustomerShow}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.users.next.affiliates.path}
        component={AffiliateList}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.users.next.affiliates.next.show.path}
        component={AffiliateShow}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.users.next.providers.path}
        component={ProviderList}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.sales.path}
        component={Contract}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.sales.next.contracts.path}
        component={ContractList}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.sales.next.new.path}
        component={ContractNew}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.sales.next.contracts.next.show.path}
        component={ContractShow}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.called.path}
        component={Called}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.called.next.drives.path}
        component={CalledList}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.called.next.drives.next.show.path}
        component={CalledShow}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.called.next.new.path}
        component={CalledNew}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.financial.path}
        component={Financial}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.financial.next.charges.path}
        component={Charge}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.financial.next.charges.next.show.path}
        component={ChargeShow}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.tools.path}
        component={Tools}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.tools.next.communication.path}
        component={Communication}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.tools.next.products.path}
        component={Product}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.tools.next.services.path}
        component={Service}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.rescues.path}
        component={Rescue}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.rescues.next.commissions.path}
        component={RescueList}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.notifications.path}
        component={Notification}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.settings.path}
        component={Setting}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.help.path}
        component={Help}
        exact
      />
      <PrivateRoute
        path={ConfigRoutes.rebox.privates.vehicles.next.show.path}
        component={VehicleShow}
        exact
      />
      <Route path="*" component={NotFound} />
    </Switch>
  </Suspense>
);

export default Routes;
