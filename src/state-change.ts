import { DetoxElementsOrMatcher } from "./internal-helpers";
import { waitForInvisible, waitForVisible } from "./waiters";

/**
 * Checks if an element is invisible at first and changes to
 * visible after an action was performed.
 * This is usefull to verify that an element was not visible to begin with
 * which would lead to a false positve test result.
 * @param matcher element that is invisible first but should become visible
 * after executing action
 * @param action async function containing the code/action to be performed
 * that is expected to make the element become visible
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await verifyChangesToVisible(
 *   by.id("some_field"),
 *   async () => {
 *     await waitForTap(by.id("some_button"));
 *   }
 * )
 */
export const verifyChangesToVisible = async (
  matcher: DetoxElementsOrMatcher,
  action: () => Promise<void>,
  options?: { atIndex?: number; timeout?: number }
) => {
  await waitForInvisible(matcher, options);
  await action();
  await waitForVisible(matcher, options);
};

/**
 * Checks if an element is visible at first and changes to
 * invisible after an action was performed.
 * This is usefull to verify that an element was not invisible to begin with
 * which would lead to a false positve test result.
 * @param matcher element that is visible first but should become invisible
 * after executing action
 * @param action async function containing the code/action to be performed
 * that is expected to make the element become invisible
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await verifyChangesToVisible(
 *   by.id("some_field"),
 *   async () => {
 *     await waitForTap(by.id("some_button"));
 *   }
 * )
 */
export const verifyChangesToInvisible = async (
  matcher: DetoxElementsOrMatcher,
  action: () => Promise<void>,
  options?: { atIndex?: number; timeout?: number }
) => {
  await waitForVisible(matcher, options);
  await action();
  await waitForInvisible(matcher, options);
};
