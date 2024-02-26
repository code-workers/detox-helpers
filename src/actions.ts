import { makeElementFromElementOrMatcher, type DetoxElementsOrMatcher } from "./internal-helpers";
import { waitForVisible } from "./waiters";

/**
 * Waits for en element to be visible before tapping it.
 * This is helpfull in case it needs a moment before appearing
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await waitForTap(by.id("test"));
 * await waitForTap(by.label("test"), { atIndex: 2 });
 * await waitForTap(element(by.id("test")));
 */
export const waitForTap = async (
  elementOrMatcher: DetoxElementsOrMatcher,
  options?: { atIndex?: number; timeout?: number }
) => {
  const elem = makeElementFromElementOrMatcher(elementOrMatcher, options?.atIndex);
  await waitForVisible(elem);
  await elem.tap();
};
