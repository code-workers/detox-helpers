import { device } from "detox";
import { DetoxElementsOrMatcher, makeElementFromElementOrMatcher } from "./internal-helpers";
import { waitForExists, waitForVisible } from "./waiters";

/**
 * Runs some code without synchronization and turns it on again afterwards, even in
 * case of an error.
 * @see https://wix.github.io/Detox/docs/api/device/#devicedisablesynchronization
 * @param callback async function containing the code to run without synchronization
 * @example
 * await withoutSynchronization(async () => {
 *   await waitForTap(by.id("click_to_open_webview"));
 *   await device.pressBack();
 * })
 *
 */
export const withoutSynchronization = async (callback: () => Promise<void>) => {
  await device.disableSynchronization();
  try {
    await callback();
  } catch (err) {
    throw err;
  } finally {
    await device.enableSynchronization();
  }
};

/**
 *
 * @returns text from the matched element
 */
export const getText = async (elementOrMatcher: DetoxElementsOrMatcher) => {
  const elem = makeElementFromElementOrMatcher(elementOrMatcher);
  await (device.getPlatform() === "ios" ? waitForVisible(elem) : waitForExists(elem));
  const attrs = await elem.getAttributes();
  return (attrs as any).text as string;
};

/**
 *
 * @returns matcher for a button in a system dialog/alert by button text
 * @example
 * await waitForTap(systemDialog("Delete"));
 * 
 */
export const systemDialog = (label: string) => {
  if (device.getPlatform() === "ios") {
    return element(by.label(label).and(by.type("_UIAlertControllerActionView")));
  }
  return element(by.text(label.toUpperCase()));
};
