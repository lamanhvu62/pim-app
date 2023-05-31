/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy } from 'react';
import { LoginPage, ProfilePage, DigitalAssetsPage, MembersPage } from 'aesirx-uikit';

const DashboardPageProvider = lazy(() => import('../containers/DashboardsPage'));
const SubscriptionPage = lazy(() => import('../containers/SubscriptionPage'));
const DataStreamPage = lazy(() => import('../containers/DataStreamPage'));
const RegionCountryPage = lazy(() => import('../containers/RegionCountryPage'));
const SettingPage = lazy(() => import('containers/SettingPage'));
const HelpCenterPage = lazy(() => import('containers/HelpCenterPage'));
const EditProductProvider = lazy(() => import('containers/ProductsPage/edit'));
const EditCategoryProvider = lazy(() => import('containers/CategoriesPage/edit'));
const EditFieldProvider = lazy(() => import('containers/FieldsPage/edit'));
const EditFieldGroupProvider = lazy(() => import('containers/FieldsGroupPage/edit'));

const EditDebtorGroupProvider = lazy(() => import('containers/DebtorGroupPage/edit'));
const EditProductPriceProvider = lazy(() => import('containers/ProductPricesPage/edit'));
const EditVariantProvider = lazy(() => import('containers/VariantsPage/edit'));
const ProductsPage = lazy(() => import('../containers/ProductsPage'));
const ProductPrice = lazy(() => import('../containers/ProductPricesPage'));
const CategoriesPage = lazy(() => import('../containers/CategoriesPage'));
const FieldsPage = lazy(() => import('../containers/FieldsPage'));
const DebtorGroupPage = lazy(() => import('../containers/DebtorGroupPage'));
const FieldsGroupPage = lazy(() => import('../containers/FieldsGroupPage'));

const authRoutes = [
  {
    path: '/login',
    exact: true,
    main: () => <LoginPage text="PIM" />,
  },
];

const mainRoutes = [
  {
    path: ['/'],
    exact: true,
    main: () => <DashboardPageProvider />,
  },
  {
    path: ['/products', '/products/all'],
    exact: true,
    main: () => <ProductsPage />,
  },
  {
    path: '/variants/add',
    exact: true,
    main: () => <EditVariantProvider />,
  },
  {
    path: '/variants/edit/:id',
    exact: true,
    main: ({ match }) => <EditVariantProvider match={match} />,
  },

  {
    path: ['/categories', '/categories'],
    exact: true,
    main: () => <CategoriesPage />,
  },
  {
    path: '/subscription',
    exact: true,
    main: () => <SubscriptionPage />,
  },
  {
    path: '/members',
    exact: true,
    main: () => <MembersPage />,
  },
  {
    path: '/data-stream',
    exact: true,
    main: () => <DataStreamPage />,
  },
  {
    path: ['/setting', '/setting/configuration'],
    exact: true,
    main: () => <SettingPage />,
  },
  {
    path: '/region-country',
    exact: true,
    main: () => <RegionCountryPage />,
  },
  {
    path: '/help-center',
    exact: true,
    main: () => <HelpCenterPage />,
  },
  {
    path: '/products/edit/:id',
    exact: true,
    main: ({ match }) => <EditProductProvider match={match} />,
  },
  {
    path: '/products/add',
    exact: true,
    main: () => <EditProductProvider />,
  },
  {
    path: '/categories/edit/:id',
    exact: true,
    main: ({ match }) => <EditCategoryProvider match={match} />,
  },
  {
    path: '/categories/add',
    exact: true,
    main: () => <EditCategoryProvider />,
  },
  {
    path: '/fields',
    exact: true,
    main: () => <FieldsPage />,
  },
  {
    path: '/fields/edit/:id',
    exact: true,
    main: ({ match }) => <EditFieldProvider match={match} />,
  },
  {
    path: '/fields/add',
    exact: true,
    main: () => <EditFieldProvider />,
  },
  {
    path: '/fields-group',
    exact: true,
    main: () => <FieldsGroupPage />,
  },
  {
    path: '/fields-group/edit/:id',
    exact: true,
    main: ({ match }) => <EditFieldGroupProvider match={match} />,
  },
  {
    path: '/fields-group/add',
    exact: true,
    main: () => <EditFieldGroupProvider />,
  },
  {
    path: '/dam',
    exact: true,
    main: () => <DigitalAssetsPage />,
  },
  {
    path: '/debtor-group',
    exact: true,
    main: () => <DebtorGroupPage />,
  },
  {
    path: '/debtor-group/edit/:id',
    exact: true,
    main: ({ match }) => <EditDebtorGroupProvider match={match} />,
  },
  {
    path: '/debtor-group/add',
    exact: true,
    main: () => <EditDebtorGroupProvider />,
  },
  {
    path: ['/prices'],
    exact: true,
    main: () => <ProductPrice />,
  },
  {
    path: '/prices/edit/:id',
    exact: true,
    main: ({ match }) => <EditProductPriceProvider match={match} />,
  },
  {
    path: '/prices/add',
    exact: true,
    main: () => <EditProductPriceProvider />,
  },
];

const settingRoutes = [
  {
    path: '/profile',
    exact: false,
    main: () => <ProfilePage />,
  },
];

export { authRoutes, mainRoutes, settingRoutes };
