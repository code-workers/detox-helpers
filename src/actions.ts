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

/**
 * Waits for scroll view to be visible and then scrolls to target
 * @example
 * await scrollToElement(by.id("scrollView"), by.id("button"), "bottom", 400);
 */
export const scrollToElement = async (
  scrollView: Detox.NativeMatcher,
  target: DetoxElementsOrMatcher,
  direction: Detox.Direction,
  pixels: number,
  scrollPos?: [number, number],
) => {
  const targetElem = makeElementFromElementOrMatcher(target);
  await waitForVisible(scrollView);

  await waitFor(targetElem).toBeVisible().whileElement(scrollView).scroll(pixels, direction, scrollPos?.[0] ?? 0.5, scrollPos?.[1] ?? 0.5);
};

/**
 * Waits for scroll view to be visible and then scrolls to specified edge
 * @example
 * await scrollToElement(by.id("scrollView"), "bottom");
 */
export const scrollToEdge = async (scrollView: Detox.NativeMatcher, edge: Detox.Direction) => {
  const scrollViewElem = makeElementFromElementOrMatcher(scrollView);
  await waitForVisible(scrollView);

  await scrollViewElem.scrollTo(edge);
};
