import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  type AnyRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AudioPlayer } from "./components/AudioPlayer/AudioPlayer";
import { getBasePrefix } from "@/shared/helpers/getBasePrefix";

const stand = import.meta.env?.VITE_APP_STAND || "production";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const routes: AnyRoute[] = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: function Index() {
      return <AudioPlayer />;
    },
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/player",
    component: function Index() {
      return <AudioPlayer />;
    },
  }),
];

if (stand !== 'production') {
  routes.push(
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/private",
      component: function Private() {
        return <AudioPlayer />;
      },
    }),
  );
}

const routeTree = rootRoute.addChildren(routes);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export const getRouter = () => {
  return createRouter({
    routeTree,
    basepath: getBasePrefix(),
  });
};
