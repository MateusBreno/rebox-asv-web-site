// ./src/routes/index.tsx
import React, { lazy, Suspense } from 'react';

import { Route, Switch } from 'react-router-dom';

import { LoadingSuspense } from '@components/index';
import { ConfigRoutes } from '@config/index';

// Pages
import {
  LandingPage,
  SignIn,
  RecoverPassword,
  About,
  Plan,
  PrivacyPolicy,
  Register,
  Checkout,
  Thanks,
  Debts,
  Assistance,
  Panel,
  Profile,
  Contract,
  ContractNew,
  ContractShow,
  Called,
  CalledNew,
  CalledShow,
  Help,
  Notification,
  Setting,
  VehicleShow,
  NotFound,
  Maintenance,
} from '@pages/index';

import PrivateRoute from './private';

const Routes: React.FC = () => (
  <Switch>
    {/* Atividades liberadas a todos */}
    <Route
      path={ConfigRoutes.rebox.publics.landingPage.path}
      component={LandingPage}
      exact
    />
    <Route
      path={ConfigRoutes.rebox.publics.signIn.path}
      component={SignIn}
      exact
    />
    <Route
      path={ConfigRoutes.rebox.publics.recoverPassword.path}
      component={RecoverPassword}
      exact
    />
    <Route
      path={ConfigRoutes.rebox.publics.about.path}
      component={About}
      exact
    />
    <Route path={ConfigRoutes.rebox.publics.plan.path} component={Plan} exact />
    <Route
      path={ConfigRoutes.rebox.publics.privacyPolicy.path}
      component={PrivacyPolicy}
      exact
    />
    <Route
      path={ConfigRoutes.rebox.publics.register.path}
      component={Register}
      exact
    />
    <Route
      path={ConfigRoutes.rebox.publics.checkout.path}
      component={Checkout}
      exact
    />
    <Route
      path={ConfigRoutes.rebox.publics.checkout.next.thanks.path}
      component={Thanks}
      exact
    />
    <Route
      path={ConfigRoutes.rebox.publics.debts.path}
      component={Debts}
      exact
    />
    <Route
      path={ConfigRoutes.rebox.publics.assistance.path}
      component={Assistance}
      exact
    />
    {/* Atividades apenas para pessoal autorizado */}
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.panel.path}
      component={Panel}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.profile.path}
      component={Profile}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.contract.path}
      component={Contract}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.contract.next.new.path}
      component={ContractNew}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.contract.next.show.path}
      component={ContractShow}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.called.path}
      component={Called}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.called.next.new.path}
      component={CalledNew}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.called.next.show.path}
      component={CalledShow}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.help.path}
      component={Help}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.notification.path}
      component={Notification}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.setting.path}
      component={Setting}
      exact
    />
    <PrivateRoute
      path={ConfigRoutes.rebox.privates.vehicle.next.show.path}
      component={VehicleShow}
      exact
    />
    <Route path="*" component={Maintenance} />
  </Switch>
);

export default Routes;
