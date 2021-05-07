import { pageState } from "./globalPageState";
import i18next from 'i18next';

// Playground is a way to debug and test things.
// Anything you put in here is gonna be run on page initial load
// before rendering.
// Also it only runs when process.env.NODE_ENV == "development"

// Please empty this function before committing.
export async function playground(): Promise<void> {
  console.log("Welcome to Playground!");
  (window as any).pageState = pageState;
  (window as any).i18next = i18next;
}
