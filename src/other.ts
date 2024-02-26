import { device } from "detox";

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