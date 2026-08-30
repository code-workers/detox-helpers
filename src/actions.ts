import {
	type DetoxElementsOrMatcher,
	makeElementFromElementOrMatcher,
	pixelsPerDp,
} from "./internal-helpers";
import { waitForExists, waitForHittable, waitForVisible } from "./waiters";

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
	options?: { atIndex?: number; timeout?: number; virtual?: boolean },
) => {
	const elem = makeElementFromElementOrMatcher(
		elementOrMatcher,
		options?.atIndex,
	);

	if (options?.virtual) {
		//device.tap() injects at blind coordinates: the point comes from the same reachability
		//check a real tap passes, and is converted from the pixels of the attributes to the dp
		//device.tap() takes on Android (iOS reports points on both sides)
		const attributes = await waitForHittable(elementOrMatcher, {
			atIndex: options?.atIndex,
			timeout: options?.timeout,
		});
		const point = attributes.hitPoint ?? {
			x: attributes.frame.x + attributes.frame.width / 2,
			y: attributes.frame.y + attributes.frame.height / 2,
		};
		const scale = await pixelsPerDp();

		await device.tap({
			x: Math.round(point.x / scale),
			y: Math.round(point.y / scale),
		});
	} else {
		//elem.tap() natively asserts hittability itself; waiting for visibility is
		//enough and avoids waitForHittable's getAttributes polling, which pays an
		//extra sync round-trip per tap
		await waitForVisible(elem);
		await elem.tap();
	}
};

/**
 * Waits for en element to be visible before replacing text in it.
 * This is helpfull in case it needs a moment before appearing
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await waitForReplaceText(by.id("test"), "some text");
 * await waitForReplaceText(by.label("test"), "some text", { atIndex: 2 });
 * await waitForReplaceText(element(by.id("test")), "some text");
 */
export const waitForReplaceText = async (
	elementOrMatcher: DetoxElementsOrMatcher,
	text: string,
	options?: { atIndex?: number; timeout?: number; virtual?: boolean },
) => {
	const elem = makeElementFromElementOrMatcher(
		elementOrMatcher,
		options?.atIndex,
	);
	//replaceText only needs the element present and visible; the hittability
	//polling costs an extra sync round-trip per call
	await waitForVisible(elem);

	await elem.replaceText(text);
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
	switch (device.getPlatform()) {
		case "android":
			await waitForVisible(scrollView);
			break;
		case "ios":
			//for some reason ios does not consider KeyboardAwareScrollView visible all the time, even though to the user it is
			await waitForExists(scrollView);
			break;
	}

	await waitFor(targetElem)
		.toBeVisible()
		.whileElement(scrollView)
		.scroll(pixels, direction, scrollPos?.[0] ?? 0.5, scrollPos?.[1] ?? 0.5);
};

/**
 * Waits for scroll view to be visible and then scrolls to specified edge
 * @example
 * await scrollToElement(by.id("scrollView"), "bottom");
 */
export const scrollToEdge = async (
	scrollView: Detox.NativeMatcher,
	edge: Detox.Direction,
	scrollPos?: [number, number],
) => {
	const scrollViewElem = makeElementFromElementOrMatcher(scrollView);
	switch (device.getPlatform()) {
		case "android":
			await waitForVisible(scrollView);
			break;
		case "ios":
			//for some reason ios does not consider KeyboardAwareScrollView visible all the time, even though to the user it is
			await waitForExists(scrollView);
			break;
	}

	await scrollViewElem.scrollTo(
		edge,
		scrollPos?.[0] ?? 0.5,
		scrollPos?.[1] ?? 0.5,
	);
};
