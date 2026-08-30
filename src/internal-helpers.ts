/// <reference path="./detox-augmentation.d.ts" />
import { device, element } from "detox";

/** Default wait in ms; DETOX_HELPERS_DEFAULT_TIMEOUT raises it for slow devices (a CI emulator). */
export const DEFAULT_TIMEOUT = Number(process.env.DETOX_HELPERS_DEFAULT_TIMEOUT) || 5000;

let pixelsPerDpCache: { deviceId: string; value: number } | undefined;

/**
 * Pixels per dp of the current device: the attributes report pixels on Android while
 * device.tap() takes dp. Read once per device from the density of the view-hierarchy dump,
 * the one place detox exposes it. 1 on iOS, where both sides are points.
 */
export const pixelsPerDp = async () => {
  if (device.getPlatform() !== "android") return 1;
  if (pixelsPerDpCache?.deviceId === device.id) return pixelsPerDpCache.value;

  const hierarchy = await device.generateViewHierarchyXml();
  const density = /density="([\d.]+)"/.exec(hierarchy)?.[1];
  const value = density ? Number(density) : 1;
  pixelsPerDpCache = { deviceId: device.id, value };
  return value;
};

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
