import { PageRouter } from "./PageSystem/PageRouter";
import { PageState } from "./PageState";
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
  window.pageState = router.state;
  window.i18next = i18next;
  window.router = router;
}
