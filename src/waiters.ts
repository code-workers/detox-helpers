import { waitFor } from "detox";
import { cloneDeep } from "lodash";
import {
	DEFAULT_TIMEOUT,
	makeElementFromElementOrMatcher,
	type DetoxElementsOrMatcher,
} from "./internal-helpers";

/**
 * Waits for en element to be hittable. This is useful if
 * one wants to run tests without detox automatic sync feature.
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await waitForExists(by.id("test"));
 * await waitForExists(by.label("test"), { atIndex: 2 });
 * await waitForExists(element(by.id("test")));
 */
export const waitForHittable = async (
	elementOrMatcher: DetoxElementsOrMatcher,
	options?: { atIndex?: number; timeout?: number },
) => {
	const elem = makeElementFromElementOrMatcher(
		elementOrMatcher,
		options?.atIndex,
	);

	const signal = AbortSignal.timeout(options?.timeout ?? DEFAULT_TIMEOUT);
	let hittable = false;
	let finalError: unknown;
	while (!hittable && !signal.aborted) {
		try {
			const attrs = await elem.getAttributes();
			hittable =
				(attrs as { hittable?: boolean | unknown } | undefined)?.hittable ===
				true;
			finalError = undefined;
		} catch (err) {
			finalError = err;
		}
	}

	if (signal.aborted || finalError) {
		console.log("Error checking elem hittable", {
			error: finalError,
			hittable,
			signalAborted: signal.aborted,
			signalReason: signal.reason,
		});
		throw finalError || signal.reason;
	}
};

/**
 * Waits for en element to exist until a timeout. This is useful if
 * an element is not instantly created
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await waitForExists(by.id("test"));
 * await waitForExists(by.label("test"), { atIndex: 2 });
 * await waitForExists(element(by.id("test")));
 */
export const waitForExists = async (
	elementOrMatcher: DetoxElementsOrMatcher,
	options?: { atIndex?: number; timeout?: number },
) => {
	const elem = makeElementFromElementOrMatcher(
		elementOrMatcher,
		options?.atIndex,
	);
	await waitFor(elem)
		.toExist()
		.withTimeout(options?.timeout ?? DEFAULT_TIMEOUT);
};

/**
 * Waits for en element to not exist until a timeout. This is useful if
 * an element is not visible anymore due to e.g. opacity, but needs to be fully gone.
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await waitForNotExists(by.id("test"));
 * await waitForNotExists(by.label("test"), { atIndex: 2 });
 * await waitForExwaitForNotExistsists(element(by.id("test")));
 */
export const waitForNotExists = async (
	elementOrMatcher: DetoxElementsOrMatcher,
	options?: { atIndex?: number; timeout?: number },
) => {
	const elem = makeElementFromElementOrMatcher(
		elementOrMatcher,
		options?.atIndex,
	);
	await waitFor(elem)
		.not.toExist()
		.withTimeout(options?.timeout ?? DEFAULT_TIMEOUT);
};

/**
 * Waits for en element to be visible until a timeout. This is usefull if
 * an element is not instantly visible
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await waitForVisible(by.id("test"));
 * await waitForVisible(by.label("test"), { atIndex: 2 });
 * await waitForVisible(element(by.id("test")));
 */
export const waitForVisible = async (
	elementOrMatcher: DetoxElementsOrMatcher,
	options?: { atIndex?: number; timeout?: number },
) => {
	const elem = makeElementFromElementOrMatcher(
		elementOrMatcher,
		options?.atIndex,
	);
	await waitFor(elem)
		.toBeVisible()
		.withTimeout(options?.timeout ?? DEFAULT_TIMEOUT);
};

/**
 * Waits for en element to be invisible until a timeout. This is usefull if
 * an element needs some time to become invisible
 * @param options.atIndex index of match to use in case of multiple matches
 * @param options.timeout timeout in ms (default: 5000)
 * @example
 * await waitForInvisible(by.id("test"));
 * await waitForInvisible(by.label("test"), { atIndex: 2 });
 * await waitForInvisible(element(by.id("test")));
 */
export const waitForInvisible = async (
	elementOrMatcher: DetoxElementsOrMatcher,
	options?: { atIndex?: number; timeout?: number },
) => {
	const elem = makeElementFromElementOrMatcher(
		elementOrMatcher,
		options?.atIndex,
	);
	await waitFor(elem)
		.not.toBeVisible()
		.withTimeout(options?.timeout ?? DEFAULT_TIMEOUT);
};

/**
 * Verifies that at least {count} elements of a matcher are visible.
 * It is possible, that there are more, though
 * @example
 * await waitForCountVisible(by.id("test"), 4);
 * await waitForCountVisible(by.label("test"), 2);
 * await waitForCountVisible(element(by.id("test")), 5);
 */
export const waitForCountVisible = async (
	elementOrMatcher:
		| Detox.IndexableNativeElement
		| Detox.NativeMatcher
		| Detox.NativeElement,
	count: number,
) => {
	for (let i = 0; i < count; i++) {
		/**
		 * Reusing the same element with different indexes fails.
		 * I suspect that applying the index to a matcher which is required
		 * for this function mutates its internal state.
		 * For this reason, cloning it is required.
		 */
		await waitForVisible(cloneDeep(elementOrMatcher), { atIndex: i });
	}
};
