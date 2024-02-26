import { element } from "detox";

export const DEFAULT_TIMEOUT = 5000;

export type DetoxElementsOrMatcher = Detox.IndexableNativeElement | Detox.NativeMatcher | Detox.NativeElement;

/**
 * This function is for internal use and allways returns a detox element
 * when given a detox delement or a matcher. This allows the external
 * helpers to directly accept matchers and thus reducing boilerplate.
 *
 * @param elementOrMatcher detox element or matcher
 * @param atIndex optional index to target in case of multiple matches
 * @returns detox element
 */
export const makeElementFromElementOrMatcher = (elementOrMatcher: DetoxElementsOrMatcher, atIndex?: number) => {
  const detoxElement = isNativeMatcher(elementOrMatcher) ? element(elementOrMatcher) : elementOrMatcher;

  if (typeof atIndex !== "number") return detoxElement;
  if (isIndexable(detoxElement)) return detoxElement.atIndex(atIndex);

  throw new Error("trying to index non-indexable NativeElement");
};

export const isNativeMatcher = (input: DetoxElementsOrMatcher): input is Detox.NativeMatcher => "withAncestor" in input;
export const isIndexable = (input: DetoxElementsOrMatcher): input is Detox.IndexableNativeElement => "atIndex" in input;
