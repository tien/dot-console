/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as IndexImport } from './routes/index'
import { Route as LayoutQueriesImport } from './routes/_layout/queries'
import { Route as LayoutParachainsImport } from './routes/_layout/parachains'
import { Route as LayoutExtrinsicsImport } from './routes/_layout/extrinsics'
import { Route as LayoutExplorerImport } from './routes/_layout/explorer'
import { Route as LayoutAssetsImport } from './routes/_layout/assets'
import { Route as LayoutUtilitiesIndexImport } from './routes/_layout/utilities/index'
import { Route as LayoutStakingIndexImport } from './routes/_layout/staking/index'
import { Route as LayoutReferendaIndexImport } from './routes/_layout/referenda/index'
import { Route as LayoutCollectivesIndexImport } from './routes/_layout/collectives/index'
import { Route as LayoutUtilitiesLayoutImport } from './routes/_layout/utilities/_layout'
import { Route as LayoutStakingLayoutImport } from './routes/_layout/staking/_layout'
import { Route as LayoutCollectivesLayoutImport } from './routes/_layout/collectives/_layout'
import { Route as LayoutAccountsLayoutImport } from './routes/_layout/accounts/_layout'
import { Route as LayoutAccountsLayoutIndexImport } from './routes/_layout/accounts/_layout/index'
import { Route as LayoutUtilitiesLayoutPlanckConvertorImport } from './routes/_layout/utilities/_layout/planck-convertor'
import { Route as LayoutStakingLayoutValidatorsImport } from './routes/_layout/staking/_layout/validators'
import { Route as LayoutStakingLayoutNominationPoolsImport } from './routes/_layout/staking/_layout/nomination-pools'
import { Route as LayoutCollectivesLayoutFellowshipImport } from './routes/_layout/collectives/_layout/fellowship'
import { Route as LayoutCollectivesLayoutAmbassadorImport } from './routes/_layout/collectives/_layout/ambassador'
import { Route as LayoutAccountsLayoutValidatorsImport } from './routes/_layout/accounts/_layout/validators'

// Create Virtual Routes

const LayoutUtilitiesImport = createFileRoute('/_layout/utilities')()
const LayoutStakingImport = createFileRoute('/_layout/staking')()
const LayoutCollectivesImport = createFileRoute('/_layout/collectives')()
const LayoutAccountsImport = createFileRoute('/_layout/accounts')()

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LayoutUtilitiesRoute = LayoutUtilitiesImport.update({
  id: '/utilities',
  path: '/utilities',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutStakingRoute = LayoutStakingImport.update({
  id: '/staking',
  path: '/staking',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutCollectivesRoute = LayoutCollectivesImport.update({
  id: '/collectives',
  path: '/collectives',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAccountsRoute = LayoutAccountsImport.update({
  id: '/accounts',
  path: '/accounts',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutQueriesRoute = LayoutQueriesImport.update({
  id: '/queries',
  path: '/queries',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutParachainsRoute = LayoutParachainsImport.update({
  id: '/parachains',
  path: '/parachains',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutExtrinsicsRoute = LayoutExtrinsicsImport.update({
  id: '/extrinsics',
  path: '/extrinsics',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutExplorerRoute = LayoutExplorerImport.update({
  id: '/explorer',
  path: '/explorer',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAssetsRoute = LayoutAssetsImport.update({
  id: '/assets',
  path: '/assets',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutUtilitiesIndexRoute = LayoutUtilitiesIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutUtilitiesRoute,
} as any)

const LayoutStakingIndexRoute = LayoutStakingIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutStakingRoute,
} as any)

const LayoutReferendaIndexRoute = LayoutReferendaIndexImport.update({
  id: '/referenda/',
  path: '/referenda/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutCollectivesIndexRoute = LayoutCollectivesIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutCollectivesRoute,
} as any)

const LayoutUtilitiesLayoutRoute = LayoutUtilitiesLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => LayoutUtilitiesRoute,
} as any)

const LayoutStakingLayoutRoute = LayoutStakingLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => LayoutStakingRoute,
} as any)

const LayoutCollectivesLayoutRoute = LayoutCollectivesLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => LayoutCollectivesRoute,
} as any)

const LayoutAccountsLayoutRoute = LayoutAccountsLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => LayoutAccountsRoute,
} as any)

const LayoutAccountsLayoutIndexRoute = LayoutAccountsLayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutAccountsLayoutRoute,
} as any)

const LayoutUtilitiesLayoutPlanckConvertorRoute =
  LayoutUtilitiesLayoutPlanckConvertorImport.update({
    id: '/planck-convertor',
    path: '/planck-convertor',
    getParentRoute: () => LayoutUtilitiesLayoutRoute,
  } as any)

const LayoutStakingLayoutValidatorsRoute =
  LayoutStakingLayoutValidatorsImport.update({
    id: '/validators',
    path: '/validators',
    getParentRoute: () => LayoutStakingLayoutRoute,
  } as any)

const LayoutStakingLayoutNominationPoolsRoute =
  LayoutStakingLayoutNominationPoolsImport.update({
    id: '/nomination-pools',
    path: '/nomination-pools',
    getParentRoute: () => LayoutStakingLayoutRoute,
  } as any)

const LayoutCollectivesLayoutFellowshipRoute =
  LayoutCollectivesLayoutFellowshipImport.update({
    id: '/fellowship',
    path: '/fellowship',
    getParentRoute: () => LayoutCollectivesLayoutRoute,
  } as any)

const LayoutCollectivesLayoutAmbassadorRoute =
  LayoutCollectivesLayoutAmbassadorImport.update({
    id: '/ambassador',
    path: '/ambassador',
    getParentRoute: () => LayoutCollectivesLayoutRoute,
  } as any)

const LayoutAccountsLayoutValidatorsRoute =
  LayoutAccountsLayoutValidatorsImport.update({
    id: '/validators',
    path: '/validators',
    getParentRoute: () => LayoutAccountsLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/assets': {
      id: '/_layout/assets'
      path: '/assets'
      fullPath: '/assets'
      preLoaderRoute: typeof LayoutAssetsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/explorer': {
      id: '/_layout/explorer'
      path: '/explorer'
      fullPath: '/explorer'
      preLoaderRoute: typeof LayoutExplorerImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/extrinsics': {
      id: '/_layout/extrinsics'
      path: '/extrinsics'
      fullPath: '/extrinsics'
      preLoaderRoute: typeof LayoutExtrinsicsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/parachains': {
      id: '/_layout/parachains'
      path: '/parachains'
      fullPath: '/parachains'
      preLoaderRoute: typeof LayoutParachainsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/queries': {
      id: '/_layout/queries'
      path: '/queries'
      fullPath: '/queries'
      preLoaderRoute: typeof LayoutQueriesImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/accounts': {
      id: '/_layout/accounts'
      path: '/accounts'
      fullPath: '/accounts'
      preLoaderRoute: typeof LayoutAccountsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/accounts/_layout': {
      id: '/_layout/accounts/_layout'
      path: '/accounts'
      fullPath: '/accounts'
      preLoaderRoute: typeof LayoutAccountsLayoutImport
      parentRoute: typeof LayoutAccountsRoute
    }
    '/_layout/collectives': {
      id: '/_layout/collectives'
      path: '/collectives'
      fullPath: '/collectives'
      preLoaderRoute: typeof LayoutCollectivesImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/collectives/_layout': {
      id: '/_layout/collectives/_layout'
      path: '/collectives'
      fullPath: '/collectives'
      preLoaderRoute: typeof LayoutCollectivesLayoutImport
      parentRoute: typeof LayoutCollectivesRoute
    }
    '/_layout/staking': {
      id: '/_layout/staking'
      path: '/staking'
      fullPath: '/staking'
      preLoaderRoute: typeof LayoutStakingImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/staking/_layout': {
      id: '/_layout/staking/_layout'
      path: '/staking'
      fullPath: '/staking'
      preLoaderRoute: typeof LayoutStakingLayoutImport
      parentRoute: typeof LayoutStakingRoute
    }
    '/_layout/utilities': {
      id: '/_layout/utilities'
      path: '/utilities'
      fullPath: '/utilities'
      preLoaderRoute: typeof LayoutUtilitiesImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/utilities/_layout': {
      id: '/_layout/utilities/_layout'
      path: '/utilities'
      fullPath: '/utilities'
      preLoaderRoute: typeof LayoutUtilitiesLayoutImport
      parentRoute: typeof LayoutUtilitiesRoute
    }
    '/_layout/collectives/': {
      id: '/_layout/collectives/'
      path: '/'
      fullPath: '/collectives/'
      preLoaderRoute: typeof LayoutCollectivesIndexImport
      parentRoute: typeof LayoutCollectivesImport
    }
    '/_layout/referenda/': {
      id: '/_layout/referenda/'
      path: '/referenda'
      fullPath: '/referenda'
      preLoaderRoute: typeof LayoutReferendaIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/staking/': {
      id: '/_layout/staking/'
      path: '/'
      fullPath: '/staking/'
      preLoaderRoute: typeof LayoutStakingIndexImport
      parentRoute: typeof LayoutStakingImport
    }
    '/_layout/utilities/': {
      id: '/_layout/utilities/'
      path: '/'
      fullPath: '/utilities/'
      preLoaderRoute: typeof LayoutUtilitiesIndexImport
      parentRoute: typeof LayoutUtilitiesImport
    }
    '/_layout/accounts/_layout/validators': {
      id: '/_layout/accounts/_layout/validators'
      path: '/validators'
      fullPath: '/accounts/validators'
      preLoaderRoute: typeof LayoutAccountsLayoutValidatorsImport
      parentRoute: typeof LayoutAccountsLayoutImport
    }
    '/_layout/collectives/_layout/ambassador': {
      id: '/_layout/collectives/_layout/ambassador'
      path: '/ambassador'
      fullPath: '/collectives/ambassador'
      preLoaderRoute: typeof LayoutCollectivesLayoutAmbassadorImport
      parentRoute: typeof LayoutCollectivesLayoutImport
    }
    '/_layout/collectives/_layout/fellowship': {
      id: '/_layout/collectives/_layout/fellowship'
      path: '/fellowship'
      fullPath: '/collectives/fellowship'
      preLoaderRoute: typeof LayoutCollectivesLayoutFellowshipImport
      parentRoute: typeof LayoutCollectivesLayoutImport
    }
    '/_layout/staking/_layout/nomination-pools': {
      id: '/_layout/staking/_layout/nomination-pools'
      path: '/nomination-pools'
      fullPath: '/staking/nomination-pools'
      preLoaderRoute: typeof LayoutStakingLayoutNominationPoolsImport
      parentRoute: typeof LayoutStakingLayoutImport
    }
    '/_layout/staking/_layout/validators': {
      id: '/_layout/staking/_layout/validators'
      path: '/validators'
      fullPath: '/staking/validators'
      preLoaderRoute: typeof LayoutStakingLayoutValidatorsImport
      parentRoute: typeof LayoutStakingLayoutImport
    }
    '/_layout/utilities/_layout/planck-convertor': {
      id: '/_layout/utilities/_layout/planck-convertor'
      path: '/planck-convertor'
      fullPath: '/utilities/planck-convertor'
      preLoaderRoute: typeof LayoutUtilitiesLayoutPlanckConvertorImport
      parentRoute: typeof LayoutUtilitiesLayoutImport
    }
    '/_layout/accounts/_layout/': {
      id: '/_layout/accounts/_layout/'
      path: '/'
      fullPath: '/accounts/'
      preLoaderRoute: typeof LayoutAccountsLayoutIndexImport
      parentRoute: typeof LayoutAccountsLayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutAccountsLayoutRouteChildren {
  LayoutAccountsLayoutValidatorsRoute: typeof LayoutAccountsLayoutValidatorsRoute
  LayoutAccountsLayoutIndexRoute: typeof LayoutAccountsLayoutIndexRoute
}

const LayoutAccountsLayoutRouteChildren: LayoutAccountsLayoutRouteChildren = {
  LayoutAccountsLayoutValidatorsRoute: LayoutAccountsLayoutValidatorsRoute,
  LayoutAccountsLayoutIndexRoute: LayoutAccountsLayoutIndexRoute,
}

const LayoutAccountsLayoutRouteWithChildren =
  LayoutAccountsLayoutRoute._addFileChildren(LayoutAccountsLayoutRouteChildren)

interface LayoutAccountsRouteChildren {
  LayoutAccountsLayoutRoute: typeof LayoutAccountsLayoutRouteWithChildren
}

const LayoutAccountsRouteChildren: LayoutAccountsRouteChildren = {
  LayoutAccountsLayoutRoute: LayoutAccountsLayoutRouteWithChildren,
}

const LayoutAccountsRouteWithChildren = LayoutAccountsRoute._addFileChildren(
  LayoutAccountsRouteChildren,
)

interface LayoutCollectivesLayoutRouteChildren {
  LayoutCollectivesLayoutAmbassadorRoute: typeof LayoutCollectivesLayoutAmbassadorRoute
  LayoutCollectivesLayoutFellowshipRoute: typeof LayoutCollectivesLayoutFellowshipRoute
}

const LayoutCollectivesLayoutRouteChildren: LayoutCollectivesLayoutRouteChildren =
  {
    LayoutCollectivesLayoutAmbassadorRoute:
      LayoutCollectivesLayoutAmbassadorRoute,
    LayoutCollectivesLayoutFellowshipRoute:
      LayoutCollectivesLayoutFellowshipRoute,
  }

const LayoutCollectivesLayoutRouteWithChildren =
  LayoutCollectivesLayoutRoute._addFileChildren(
    LayoutCollectivesLayoutRouteChildren,
  )

interface LayoutCollectivesRouteChildren {
  LayoutCollectivesLayoutRoute: typeof LayoutCollectivesLayoutRouteWithChildren
  LayoutCollectivesIndexRoute: typeof LayoutCollectivesIndexRoute
}

const LayoutCollectivesRouteChildren: LayoutCollectivesRouteChildren = {
  LayoutCollectivesLayoutRoute: LayoutCollectivesLayoutRouteWithChildren,
  LayoutCollectivesIndexRoute: LayoutCollectivesIndexRoute,
}

const LayoutCollectivesRouteWithChildren =
  LayoutCollectivesRoute._addFileChildren(LayoutCollectivesRouteChildren)

interface LayoutStakingLayoutRouteChildren {
  LayoutStakingLayoutNominationPoolsRoute: typeof LayoutStakingLayoutNominationPoolsRoute
  LayoutStakingLayoutValidatorsRoute: typeof LayoutStakingLayoutValidatorsRoute
}

const LayoutStakingLayoutRouteChildren: LayoutStakingLayoutRouteChildren = {
  LayoutStakingLayoutNominationPoolsRoute:
    LayoutStakingLayoutNominationPoolsRoute,
  LayoutStakingLayoutValidatorsRoute: LayoutStakingLayoutValidatorsRoute,
}

const LayoutStakingLayoutRouteWithChildren =
  LayoutStakingLayoutRoute._addFileChildren(LayoutStakingLayoutRouteChildren)

interface LayoutStakingRouteChildren {
  LayoutStakingLayoutRoute: typeof LayoutStakingLayoutRouteWithChildren
  LayoutStakingIndexRoute: typeof LayoutStakingIndexRoute
}

const LayoutStakingRouteChildren: LayoutStakingRouteChildren = {
  LayoutStakingLayoutRoute: LayoutStakingLayoutRouteWithChildren,
  LayoutStakingIndexRoute: LayoutStakingIndexRoute,
}

const LayoutStakingRouteWithChildren = LayoutStakingRoute._addFileChildren(
  LayoutStakingRouteChildren,
)

interface LayoutUtilitiesLayoutRouteChildren {
  LayoutUtilitiesLayoutPlanckConvertorRoute: typeof LayoutUtilitiesLayoutPlanckConvertorRoute
}

const LayoutUtilitiesLayoutRouteChildren: LayoutUtilitiesLayoutRouteChildren = {
  LayoutUtilitiesLayoutPlanckConvertorRoute:
    LayoutUtilitiesLayoutPlanckConvertorRoute,
}

const LayoutUtilitiesLayoutRouteWithChildren =
  LayoutUtilitiesLayoutRoute._addFileChildren(
    LayoutUtilitiesLayoutRouteChildren,
  )

interface LayoutUtilitiesRouteChildren {
  LayoutUtilitiesLayoutRoute: typeof LayoutUtilitiesLayoutRouteWithChildren
  LayoutUtilitiesIndexRoute: typeof LayoutUtilitiesIndexRoute
}

const LayoutUtilitiesRouteChildren: LayoutUtilitiesRouteChildren = {
  LayoutUtilitiesLayoutRoute: LayoutUtilitiesLayoutRouteWithChildren,
  LayoutUtilitiesIndexRoute: LayoutUtilitiesIndexRoute,
}

const LayoutUtilitiesRouteWithChildren = LayoutUtilitiesRoute._addFileChildren(
  LayoutUtilitiesRouteChildren,
)

interface LayoutRouteChildren {
  LayoutAssetsRoute: typeof LayoutAssetsRoute
  LayoutExplorerRoute: typeof LayoutExplorerRoute
  LayoutExtrinsicsRoute: typeof LayoutExtrinsicsRoute
  LayoutParachainsRoute: typeof LayoutParachainsRoute
  LayoutQueriesRoute: typeof LayoutQueriesRoute
  LayoutAccountsRoute: typeof LayoutAccountsRouteWithChildren
  LayoutCollectivesRoute: typeof LayoutCollectivesRouteWithChildren
  LayoutStakingRoute: typeof LayoutStakingRouteWithChildren
  LayoutUtilitiesRoute: typeof LayoutUtilitiesRouteWithChildren
  LayoutReferendaIndexRoute: typeof LayoutReferendaIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutAssetsRoute: LayoutAssetsRoute,
  LayoutExplorerRoute: LayoutExplorerRoute,
  LayoutExtrinsicsRoute: LayoutExtrinsicsRoute,
  LayoutParachainsRoute: LayoutParachainsRoute,
  LayoutQueriesRoute: LayoutQueriesRoute,
  LayoutAccountsRoute: LayoutAccountsRouteWithChildren,
  LayoutCollectivesRoute: LayoutCollectivesRouteWithChildren,
  LayoutStakingRoute: LayoutStakingRouteWithChildren,
  LayoutUtilitiesRoute: LayoutUtilitiesRouteWithChildren,
  LayoutReferendaIndexRoute: LayoutReferendaIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof LayoutRouteWithChildren
  '/assets': typeof LayoutAssetsRoute
  '/explorer': typeof LayoutExplorerRoute
  '/extrinsics': typeof LayoutExtrinsicsRoute
  '/parachains': typeof LayoutParachainsRoute
  '/queries': typeof LayoutQueriesRoute
  '/accounts': typeof LayoutAccountsLayoutRouteWithChildren
  '/collectives': typeof LayoutCollectivesLayoutRouteWithChildren
  '/staking': typeof LayoutStakingLayoutRouteWithChildren
  '/utilities': typeof LayoutUtilitiesLayoutRouteWithChildren
  '/collectives/': typeof LayoutCollectivesIndexRoute
  '/referenda': typeof LayoutReferendaIndexRoute
  '/staking/': typeof LayoutStakingIndexRoute
  '/utilities/': typeof LayoutUtilitiesIndexRoute
  '/accounts/validators': typeof LayoutAccountsLayoutValidatorsRoute
  '/collectives/ambassador': typeof LayoutCollectivesLayoutAmbassadorRoute
  '/collectives/fellowship': typeof LayoutCollectivesLayoutFellowshipRoute
  '/staking/nomination-pools': typeof LayoutStakingLayoutNominationPoolsRoute
  '/staking/validators': typeof LayoutStakingLayoutValidatorsRoute
  '/utilities/planck-convertor': typeof LayoutUtilitiesLayoutPlanckConvertorRoute
  '/accounts/': typeof LayoutAccountsLayoutIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof LayoutRouteWithChildren
  '/assets': typeof LayoutAssetsRoute
  '/explorer': typeof LayoutExplorerRoute
  '/extrinsics': typeof LayoutExtrinsicsRoute
  '/parachains': typeof LayoutParachainsRoute
  '/queries': typeof LayoutQueriesRoute
  '/accounts': typeof LayoutAccountsLayoutIndexRoute
  '/collectives': typeof LayoutCollectivesIndexRoute
  '/staking': typeof LayoutStakingIndexRoute
  '/utilities': typeof LayoutUtilitiesIndexRoute
  '/referenda': typeof LayoutReferendaIndexRoute
  '/accounts/validators': typeof LayoutAccountsLayoutValidatorsRoute
  '/collectives/ambassador': typeof LayoutCollectivesLayoutAmbassadorRoute
  '/collectives/fellowship': typeof LayoutCollectivesLayoutFellowshipRoute
  '/staking/nomination-pools': typeof LayoutStakingLayoutNominationPoolsRoute
  '/staking/validators': typeof LayoutStakingLayoutValidatorsRoute
  '/utilities/planck-convertor': typeof LayoutUtilitiesLayoutPlanckConvertorRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/assets': typeof LayoutAssetsRoute
  '/_layout/explorer': typeof LayoutExplorerRoute
  '/_layout/extrinsics': typeof LayoutExtrinsicsRoute
  '/_layout/parachains': typeof LayoutParachainsRoute
  '/_layout/queries': typeof LayoutQueriesRoute
  '/_layout/accounts': typeof LayoutAccountsRouteWithChildren
  '/_layout/accounts/_layout': typeof LayoutAccountsLayoutRouteWithChildren
  '/_layout/collectives': typeof LayoutCollectivesRouteWithChildren
  '/_layout/collectives/_layout': typeof LayoutCollectivesLayoutRouteWithChildren
  '/_layout/staking': typeof LayoutStakingRouteWithChildren
  '/_layout/staking/_layout': typeof LayoutStakingLayoutRouteWithChildren
  '/_layout/utilities': typeof LayoutUtilitiesRouteWithChildren
  '/_layout/utilities/_layout': typeof LayoutUtilitiesLayoutRouteWithChildren
  '/_layout/collectives/': typeof LayoutCollectivesIndexRoute
  '/_layout/referenda/': typeof LayoutReferendaIndexRoute
  '/_layout/staking/': typeof LayoutStakingIndexRoute
  '/_layout/utilities/': typeof LayoutUtilitiesIndexRoute
  '/_layout/accounts/_layout/validators': typeof LayoutAccountsLayoutValidatorsRoute
  '/_layout/collectives/_layout/ambassador': typeof LayoutCollectivesLayoutAmbassadorRoute
  '/_layout/collectives/_layout/fellowship': typeof LayoutCollectivesLayoutFellowshipRoute
  '/_layout/staking/_layout/nomination-pools': typeof LayoutStakingLayoutNominationPoolsRoute
  '/_layout/staking/_layout/validators': typeof LayoutStakingLayoutValidatorsRoute
  '/_layout/utilities/_layout/planck-convertor': typeof LayoutUtilitiesLayoutPlanckConvertorRoute
  '/_layout/accounts/_layout/': typeof LayoutAccountsLayoutIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/assets'
    | '/explorer'
    | '/extrinsics'
    | '/parachains'
    | '/queries'
    | '/accounts'
    | '/collectives'
    | '/staking'
    | '/utilities'
    | '/collectives/'
    | '/referenda'
    | '/staking/'
    | '/utilities/'
    | '/accounts/validators'
    | '/collectives/ambassador'
    | '/collectives/fellowship'
    | '/staking/nomination-pools'
    | '/staking/validators'
    | '/utilities/planck-convertor'
    | '/accounts/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/assets'
    | '/explorer'
    | '/extrinsics'
    | '/parachains'
    | '/queries'
    | '/accounts'
    | '/collectives'
    | '/staking'
    | '/utilities'
    | '/referenda'
    | '/accounts/validators'
    | '/collectives/ambassador'
    | '/collectives/fellowship'
    | '/staking/nomination-pools'
    | '/staking/validators'
    | '/utilities/planck-convertor'
  id:
    | '__root__'
    | '/'
    | '/_layout'
    | '/_layout/assets'
    | '/_layout/explorer'
    | '/_layout/extrinsics'
    | '/_layout/parachains'
    | '/_layout/queries'
    | '/_layout/accounts'
    | '/_layout/accounts/_layout'
    | '/_layout/collectives'
    | '/_layout/collectives/_layout'
    | '/_layout/staking'
    | '/_layout/staking/_layout'
    | '/_layout/utilities'
    | '/_layout/utilities/_layout'
    | '/_layout/collectives/'
    | '/_layout/referenda/'
    | '/_layout/staking/'
    | '/_layout/utilities/'
    | '/_layout/accounts/_layout/validators'
    | '/_layout/collectives/_layout/ambassador'
    | '/_layout/collectives/_layout/fellowship'
    | '/_layout/staking/_layout/nomination-pools'
    | '/_layout/staking/_layout/validators'
    | '/_layout/utilities/_layout/planck-convertor'
    | '/_layout/accounts/_layout/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  LayoutRoute: typeof LayoutRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LayoutRoute: LayoutRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_layout"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/assets",
        "/_layout/explorer",
        "/_layout/extrinsics",
        "/_layout/parachains",
        "/_layout/queries",
        "/_layout/accounts",
        "/_layout/collectives",
        "/_layout/staking",
        "/_layout/utilities",
        "/_layout/referenda/"
      ]
    },
    "/_layout/assets": {
      "filePath": "_layout/assets.tsx",
      "parent": "/_layout"
    },
    "/_layout/explorer": {
      "filePath": "_layout/explorer.tsx",
      "parent": "/_layout"
    },
    "/_layout/extrinsics": {
      "filePath": "_layout/extrinsics.tsx",
      "parent": "/_layout"
    },
    "/_layout/parachains": {
      "filePath": "_layout/parachains.tsx",
      "parent": "/_layout"
    },
    "/_layout/queries": {
      "filePath": "_layout/queries.tsx",
      "parent": "/_layout"
    },
    "/_layout/accounts": {
      "filePath": "_layout/accounts",
      "parent": "/_layout",
      "children": [
        "/_layout/accounts/_layout"
      ]
    },
    "/_layout/accounts/_layout": {
      "filePath": "_layout/accounts/_layout.tsx",
      "parent": "/_layout/accounts",
      "children": [
        "/_layout/accounts/_layout/validators",
        "/_layout/accounts/_layout/"
      ]
    },
    "/_layout/collectives": {
      "filePath": "_layout/collectives",
      "parent": "/_layout",
      "children": [
        "/_layout/collectives/_layout",
        "/_layout/collectives/"
      ]
    },
    "/_layout/collectives/_layout": {
      "filePath": "_layout/collectives/_layout.tsx",
      "parent": "/_layout/collectives",
      "children": [
        "/_layout/collectives/_layout/ambassador",
        "/_layout/collectives/_layout/fellowship"
      ]
    },
    "/_layout/staking": {
      "filePath": "_layout/staking",
      "parent": "/_layout",
      "children": [
        "/_layout/staking/_layout",
        "/_layout/staking/"
      ]
    },
    "/_layout/staking/_layout": {
      "filePath": "_layout/staking/_layout.tsx",
      "parent": "/_layout/staking",
      "children": [
        "/_layout/staking/_layout/nomination-pools",
        "/_layout/staking/_layout/validators"
      ]
    },
    "/_layout/utilities": {
      "filePath": "_layout/utilities",
      "parent": "/_layout",
      "children": [
        "/_layout/utilities/_layout",
        "/_layout/utilities/"
      ]
    },
    "/_layout/utilities/_layout": {
      "filePath": "_layout/utilities/_layout.tsx",
      "parent": "/_layout/utilities",
      "children": [
        "/_layout/utilities/_layout/planck-convertor"
      ]
    },
    "/_layout/collectives/": {
      "filePath": "_layout/collectives/index.tsx",
      "parent": "/_layout/collectives"
    },
    "/_layout/referenda/": {
      "filePath": "_layout/referenda/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/staking/": {
      "filePath": "_layout/staking/index.tsx",
      "parent": "/_layout/staking"
    },
    "/_layout/utilities/": {
      "filePath": "_layout/utilities/index.tsx",
      "parent": "/_layout/utilities"
    },
    "/_layout/accounts/_layout/validators": {
      "filePath": "_layout/accounts/_layout/validators.tsx",
      "parent": "/_layout/accounts/_layout"
    },
    "/_layout/collectives/_layout/ambassador": {
      "filePath": "_layout/collectives/_layout/ambassador.tsx",
      "parent": "/_layout/collectives/_layout"
    },
    "/_layout/collectives/_layout/fellowship": {
      "filePath": "_layout/collectives/_layout/fellowship.tsx",
      "parent": "/_layout/collectives/_layout"
    },
    "/_layout/staking/_layout/nomination-pools": {
      "filePath": "_layout/staking/_layout/nomination-pools.tsx",
      "parent": "/_layout/staking/_layout"
    },
    "/_layout/staking/_layout/validators": {
      "filePath": "_layout/staking/_layout/validators.tsx",
      "parent": "/_layout/staking/_layout"
    },
    "/_layout/utilities/_layout/planck-convertor": {
      "filePath": "_layout/utilities/_layout/planck-convertor.tsx",
      "parent": "/_layout/utilities/_layout"
    },
    "/_layout/accounts/_layout/": {
      "filePath": "_layout/accounts/_layout/index.tsx",
      "parent": "/_layout/accounts/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
