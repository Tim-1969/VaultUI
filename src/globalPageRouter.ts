import { PageRouter } from "./PageRouter";

export let pageRouter: PageRouter;
export function setPageRouter(router: PageRouter): void {
  pageRouter = router;
}
