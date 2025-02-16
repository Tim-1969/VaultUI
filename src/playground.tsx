import { PageRouter } from "z-pagerouter";
import { PageState } from "./state/PageState";
import i18next from "i18next";

// Playground is a way to debug and test things.
// Anything you put in here is gonna be run on page initial load
// before rendering.
// Also it only runs when process.env.NODE_ENV == "development"

declare global {
  interface Window {
    pageState: PageState;
    i18next: unknown;
    router: PageRouter;
  }
}

// Please empty this function before committing.
export async function playground(router: PageRouter): Promise<void> {
  console.log("Welcome to Playground!");
  window.pageState = router.state as PageState;
  window.i18next = i18next;
  window.router = router;
}
