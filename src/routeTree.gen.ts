/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from "@tanstack/react-router";

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as LayoutImport } from "./routes/_layout";
import { Route as IndexImport } from "./routes/index";
import { Route as LayoutQueriesImport } from "./routes/_layout/queries";
import { Route as LayoutExtrinsicsImport } from "./routes/_layout/extrinsics";
import { Route as LayoutExplorerImport } from "./routes/_layout/explorer";
import { Route as LayoutUtilitiesIndexImport } from "./routes/_layout/utilities/index";
import { Route as LayoutUtilitiesLayoutImport } from "./routes/_layout/utilities/_layout";
import { Route as LayoutAccountsLayoutImport } from "./routes/_layout/accounts/_layout";
import { Route as LayoutAccountsLayoutIndexImport } from "./routes/_layout/accounts/_layout/index";
import { Route as LayoutUtilitiesLayoutPlanckConvertorImport } from "./routes/_layout/utilities/_layout/planck-convertor";
import { Route as LayoutAccountsLayoutValidatorsImport } from "./routes/_layout/accounts/_layout/validators";

// Create Virtual Routes

const LayoutUtilitiesImport = createFileRoute("/_layout/utilities")();
const LayoutAccountsImport = createFileRoute("/_layout/accounts")();

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: "/_layout",
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any);

const LayoutUtilitiesRoute = LayoutUtilitiesImport.update({
  id: "/utilities",
  path: "/utilities",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutAccountsRoute = LayoutAccountsImport.update({
  id: "/accounts",
  path: "/accounts",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutQueriesRoute = LayoutQueriesImport.update({
  id: "/queries",
  path: "/queries",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutExtrinsicsRoute = LayoutExtrinsicsImport.update({
  id: "/extrinsics",
  path: "/extrinsics",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutExplorerRoute = LayoutExplorerImport.update({
  id: "/explorer",
  path: "/explorer",
  getParentRoute: () => LayoutRoute,
} as any);

const LayoutUtilitiesIndexRoute = LayoutUtilitiesIndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => LayoutUtilitiesRoute,
} as any);

const LayoutUtilitiesLayoutRoute = LayoutUtilitiesLayoutImport.update({
  id: "/_layout",
  getParentRoute: () => LayoutUtilitiesRoute,
} as any);

const LayoutAccountsLayoutRoute = LayoutAccountsLayoutImport.update({
  id: "/_layout",
  getParentRoute: () => LayoutAccountsRoute,
} as any);

const LayoutAccountsLayoutIndexRoute = LayoutAccountsLayoutIndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => LayoutAccountsLayoutRoute,
} as any);

const LayoutUtilitiesLayoutPlanckConvertorRoute =
  LayoutUtilitiesLayoutPlanckConvertorImport.update({
    id: "/planck-convertor",
    path: "/planck-convertor",
    getParentRoute: () => LayoutUtilitiesLayoutRoute,
  } as any);

const LayoutAccountsLayoutValidatorsRoute =
  LayoutAccountsLayoutValidatorsImport.update({
    id: "/validators",
    path: "/validators",
    getParentRoute: () => LayoutAccountsLayoutRoute,
  } as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    "/_layout": {
      id: "/_layout";
      path: "";
      fullPath: "";
      preLoaderRoute: typeof LayoutImport;
      parentRoute: typeof rootRoute;
    };
    "/_layout/explorer": {
      id: "/_layout/explorer";
      path: "/explorer";
      fullPath: "/explorer";
      preLoaderRoute: typeof LayoutExplorerImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/extrinsics": {
      id: "/_layout/extrinsics";
      path: "/extrinsics";
      fullPath: "/extrinsics";
      preLoaderRoute: typeof LayoutExtrinsicsImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/queries": {
      id: "/_layout/queries";
      path: "/queries";
      fullPath: "/queries";
      preLoaderRoute: typeof LayoutQueriesImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/accounts": {
      id: "/_layout/accounts";
      path: "/accounts";
      fullPath: "/accounts";
      preLoaderRoute: typeof LayoutAccountsImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/accounts/_layout": {
      id: "/_layout/accounts/_layout";
      path: "/accounts";
      fullPath: "/accounts";
      preLoaderRoute: typeof LayoutAccountsLayoutImport;
      parentRoute: typeof LayoutAccountsRoute;
    };
    "/_layout/utilities": {
      id: "/_layout/utilities";
      path: "/utilities";
      fullPath: "/utilities";
      preLoaderRoute: typeof LayoutUtilitiesImport;
      parentRoute: typeof LayoutImport;
    };
    "/_layout/utilities/_layout": {
      id: "/_layout/utilities/_layout";
      path: "/utilities";
      fullPath: "/utilities";
      preLoaderRoute: typeof LayoutUtilitiesLayoutImport;
      parentRoute: typeof LayoutUtilitiesRoute;
    };
    "/_layout/utilities/": {
      id: "/_layout/utilities/";
      path: "/";
      fullPath: "/utilities/";
      preLoaderRoute: typeof LayoutUtilitiesIndexImport;
      parentRoute: typeof LayoutUtilitiesImport;
    };
    "/_layout/accounts/_layout/validators": {
      id: "/_layout/accounts/_layout/validators";
      path: "/validators";
      fullPath: "/accounts/validators";
      preLoaderRoute: typeof LayoutAccountsLayoutValidatorsImport;
      parentRoute: typeof LayoutAccountsLayoutImport;
    };
    "/_layout/utilities/_layout/planck-convertor": {
      id: "/_layout/utilities/_layout/planck-convertor";
      path: "/planck-convertor";
      fullPath: "/utilities/planck-convertor";
      preLoaderRoute: typeof LayoutUtilitiesLayoutPlanckConvertorImport;
      parentRoute: typeof LayoutUtilitiesLayoutImport;
    };
    "/_layout/accounts/_layout/": {
      id: "/_layout/accounts/_layout/";
      path: "/";
      fullPath: "/accounts/";
      preLoaderRoute: typeof LayoutAccountsLayoutIndexImport;
      parentRoute: typeof LayoutAccountsLayoutImport;
    };
  }
}

// Create and export the route tree

interface LayoutAccountsLayoutRouteChildren {
  LayoutAccountsLayoutValidatorsRoute: typeof LayoutAccountsLayoutValidatorsRoute;
  LayoutAccountsLayoutIndexRoute: typeof LayoutAccountsLayoutIndexRoute;
}

const LayoutAccountsLayoutRouteChildren: LayoutAccountsLayoutRouteChildren = {
  LayoutAccountsLayoutValidatorsRoute: LayoutAccountsLayoutValidatorsRoute,
  LayoutAccountsLayoutIndexRoute: LayoutAccountsLayoutIndexRoute,
};

const LayoutAccountsLayoutRouteWithChildren =
  LayoutAccountsLayoutRoute._addFileChildren(LayoutAccountsLayoutRouteChildren);

interface LayoutAccountsRouteChildren {
  LayoutAccountsLayoutRoute: typeof LayoutAccountsLayoutRouteWithChildren;
}

const LayoutAccountsRouteChildren: LayoutAccountsRouteChildren = {
  LayoutAccountsLayoutRoute: LayoutAccountsLayoutRouteWithChildren,
};

const LayoutAccountsRouteWithChildren = LayoutAccountsRoute._addFileChildren(
  LayoutAccountsRouteChildren,
);

interface LayoutUtilitiesLayoutRouteChildren {
  LayoutUtilitiesLayoutPlanckConvertorRoute: typeof LayoutUtilitiesLayoutPlanckConvertorRoute;
}

const LayoutUtilitiesLayoutRouteChildren: LayoutUtilitiesLayoutRouteChildren = {
  LayoutUtilitiesLayoutPlanckConvertorRoute:
    LayoutUtilitiesLayoutPlanckConvertorRoute,
};

const LayoutUtilitiesLayoutRouteWithChildren =
  LayoutUtilitiesLayoutRoute._addFileChildren(
    LayoutUtilitiesLayoutRouteChildren,
  );

interface LayoutUtilitiesRouteChildren {
  LayoutUtilitiesLayoutRoute: typeof LayoutUtilitiesLayoutRouteWithChildren;
  LayoutUtilitiesIndexRoute: typeof LayoutUtilitiesIndexRoute;
}

const LayoutUtilitiesRouteChildren: LayoutUtilitiesRouteChildren = {
  LayoutUtilitiesLayoutRoute: LayoutUtilitiesLayoutRouteWithChildren,
  LayoutUtilitiesIndexRoute: LayoutUtilitiesIndexRoute,
};

const LayoutUtilitiesRouteWithChildren = LayoutUtilitiesRoute._addFileChildren(
  LayoutUtilitiesRouteChildren,
);

interface LayoutRouteChildren {
  LayoutExplorerRoute: typeof LayoutExplorerRoute;
  LayoutExtrinsicsRoute: typeof LayoutExtrinsicsRoute;
  LayoutQueriesRoute: typeof LayoutQueriesRoute;
  LayoutAccountsRoute: typeof LayoutAccountsRouteWithChildren;
  LayoutUtilitiesRoute: typeof LayoutUtilitiesRouteWithChildren;
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutExplorerRoute: LayoutExplorerRoute,
  LayoutExtrinsicsRoute: LayoutExtrinsicsRoute,
  LayoutQueriesRoute: LayoutQueriesRoute,
  LayoutAccountsRoute: LayoutAccountsRouteWithChildren,
  LayoutUtilitiesRoute: LayoutUtilitiesRouteWithChildren,
};

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren);

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "": typeof LayoutRouteWithChildren;
  "/explorer": typeof LayoutExplorerRoute;
  "/extrinsics": typeof LayoutExtrinsicsRoute;
  "/queries": typeof LayoutQueriesRoute;
  "/accounts": typeof LayoutAccountsLayoutRouteWithChildren;
  "/utilities": typeof LayoutUtilitiesLayoutRouteWithChildren;
  "/utilities/": typeof LayoutUtilitiesIndexRoute;
  "/accounts/validators": typeof LayoutAccountsLayoutValidatorsRoute;
  "/utilities/planck-convertor": typeof LayoutUtilitiesLayoutPlanckConvertorRoute;
  "/accounts/": typeof LayoutAccountsLayoutIndexRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "": typeof LayoutRouteWithChildren;
  "/explorer": typeof LayoutExplorerRoute;
  "/extrinsics": typeof LayoutExtrinsicsRoute;
  "/queries": typeof LayoutQueriesRoute;
  "/accounts": typeof LayoutAccountsLayoutIndexRoute;
  "/utilities": typeof LayoutUtilitiesIndexRoute;
  "/accounts/validators": typeof LayoutAccountsLayoutValidatorsRoute;
  "/utilities/planck-convertor": typeof LayoutUtilitiesLayoutPlanckConvertorRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/": typeof IndexRoute;
  "/_layout": typeof LayoutRouteWithChildren;
  "/_layout/explorer": typeof LayoutExplorerRoute;
  "/_layout/extrinsics": typeof LayoutExtrinsicsRoute;
  "/_layout/queries": typeof LayoutQueriesRoute;
  "/_layout/accounts": typeof LayoutAccountsRouteWithChildren;
  "/_layout/accounts/_layout": typeof LayoutAccountsLayoutRouteWithChildren;
  "/_layout/utilities": typeof LayoutUtilitiesRouteWithChildren;
  "/_layout/utilities/_layout": typeof LayoutUtilitiesLayoutRouteWithChildren;
  "/_layout/utilities/": typeof LayoutUtilitiesIndexRoute;
  "/_layout/accounts/_layout/validators": typeof LayoutAccountsLayoutValidatorsRoute;
  "/_layout/utilities/_layout/planck-convertor": typeof LayoutUtilitiesLayoutPlanckConvertorRoute;
  "/_layout/accounts/_layout/": typeof LayoutAccountsLayoutIndexRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | ""
    | "/explorer"
    | "/extrinsics"
    | "/queries"
    | "/accounts"
    | "/utilities"
    | "/utilities/"
    | "/accounts/validators"
    | "/utilities/planck-convertor"
    | "/accounts/";
  fileRoutesByTo: FileRoutesByTo;
  to:
    | "/"
    | ""
    | "/explorer"
    | "/extrinsics"
    | "/queries"
    | "/accounts"
    | "/utilities"
    | "/accounts/validators"
    | "/utilities/planck-convertor";
  id:
    | "__root__"
    | "/"
    | "/_layout"
    | "/_layout/explorer"
    | "/_layout/extrinsics"
    | "/_layout/queries"
    | "/_layout/accounts"
    | "/_layout/accounts/_layout"
    | "/_layout/utilities"
    | "/_layout/utilities/_layout"
    | "/_layout/utilities/"
    | "/_layout/accounts/_layout/validators"
    | "/_layout/utilities/_layout/planck-convertor"
    | "/_layout/accounts/_layout/";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  LayoutRoute: typeof LayoutRouteWithChildren;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LayoutRoute: LayoutRouteWithChildren,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

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
        "/_layout/explorer",
        "/_layout/extrinsics",
        "/_layout/queries",
        "/_layout/accounts",
        "/_layout/utilities"
      ]
    },
    "/_layout/explorer": {
      "filePath": "_layout/explorer.tsx",
      "parent": "/_layout"
    },
    "/_layout/extrinsics": {
      "filePath": "_layout/extrinsics.tsx",
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
    "/_layout/utilities/": {
      "filePath": "_layout/utilities/index.tsx",
      "parent": "/_layout/utilities"
    },
    "/_layout/accounts/_layout/validators": {
      "filePath": "_layout/accounts/_layout/validators.tsx",
      "parent": "/_layout/accounts/_layout"
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
