import { device, element, expect, waitFor } from "detox";
import {
	DEFAULT_TIMEOUT,
	makeElementFromElementOrMatcher,
	type DetoxElementsOrMatcher,
} from "./internal-helpers";
import { waitForExists, waitForInvisible, waitForNotExists, waitForVisible } from "./waiters";

/**
 * The observable actors: every step is a check on something the app shows — reachable, settled,
 * enabled, gone — never a wait for time to pass. They build on the `toBeReachable`, `toBeSettled`
 * and `toBeEnabled` expectations of the codeworkers detox patch (patches/detox.patch in the
 * monorepo, the iOS framework rebuilt by patch-detox-ios-sync.ts), whose failures name what the
 * check last observed.
 */

interface ActorOptions {
	/** index of match to use in case of multiple matches */
	atIndex?: number;
	/** timeout in ms (default: 5000) */
	timeout?: number;
}

const timeoutOf = (options?: { timeout?: number }) => options?.timeout ?? DEFAULT_TIMEOUT;

//iOS does not consider a KeyboardAwareScrollView visible all the time, even though to the user it is
const waitForScrollContainer = (scrollView: Detox.NativeMatcher) =>
	device.getPlatform() === "ios" ? waitForExists(scrollView) : waitForVisible(scrollView);

/**
 * Waits until a tap would reach the element: effectively visible, enabled, outside the system
 * bars and the keyboard, and not covered by another view or window. A timeout names what stood
 * in the way.
 * @example
 * await waitForReachable(by.id("save-button"));
 * await waitForReachable(by.id("row"), { atIndex: 2, timeout: 10000 });
 */
export const waitForReachable = async (
	elementOrMatcher: DetoxElementsOrMatcher,
	options?: ActorOptions,
) => {
	const elem = makeElementFromElementOrMatcher(elementOrMatcher, options?.atIndex);
	await waitFor(elem).toBeReachable().withTimeout(timeoutOf(options));
};

/**
 * Waits until the element's frame, opacity, transform and enabled state stop changing — an
 * entrance or layout animation that detox's synchronisation does not track (Reanimated) has
 * finished.
 * @param options.stableForMs how long the element must stay unchanged (default: 32)
 * @example
 * await waitForSettled(by.id("actionSheet"));
 */
export const waitForSettled = async (
	elementOrMatcher: DetoxElementsOrMatcher,
	options?: ActorOptions & { stableForMs?: number },
) => {
	const elem = makeElementFromElementOrMatcher(elementOrMatcher, options?.atIndex);
	await waitFor(elem).toBeSettled(options?.stableForMs).withTimeout(timeoutOf(options));
};

export interface TapReachableOptions extends ActorOptions {
	/** scroll container moved toward the target until a tap can reach it; without it the target must become reachable where it is */
	in?: Detox.NativeMatcher;
	/** scroll direction inside `in` (default: "down") */
	direction?: Detox.Direction;
	/** scroll step per gesture in dp (default: 200) */
	step?: number;
	/** where each gesture starts inside `in`, as fractions of its width and height (default: the centre) */
	startPositions?: [number, number];
}

/**
 * Taps an element once a tap can reach it, scrolling `in` toward it when given. The scroll loop
 * runs natively with reachability as its stop condition, so it stops where the tap will land —
 * not where 75% of the view has come into the window — and when the container reaches its end
 * with the target still out of reach the failure names the geometry (a hit point inside the
 * navigation-bar inset, a view above the target). A settle wait covers an entrance animation
 * still in flight.
 * @example
 * await tapReachable(by.id("sheet-save"), { in: by.id("genetics-locus-sheet") });
 * await tapReachable(by.id("undo"));
 */
export const tapReachable = async (
	target: DetoxElementsOrMatcher,
	options: TapReachableOptions = {},
) => {
	const elem = makeElementFromElementOrMatcher(target, options.atIndex);

	if (options.in) {
		await waitForScrollContainer(options.in);
		await waitFor(elem)
			.toBeReachable()
			.whileElement(options.in)
			.scroll(
				options.step ?? 200,
				options.direction ?? "down",
				options.startPositions?.[0] ?? 0.5,
				options.startPositions?.[1] ?? 0.5,
			);
	} else {
		await waitFor(elem).toBeReachable().withTimeout(timeoutOf(options));
	}

	await waitFor(elem).toBeSettled().withTimeout(timeoutOf(options));
	await elem.tap();
};

export interface ScrollToEndOptions {
	/** the edge to scroll to (default: "bottom") */
	edge?: Detox.Direction;
	/** element at the content's end that must be reachable once the container stands still, e.g. a sheet's last action */
	sentinel?: DetoxElementsOrMatcher;
	/** where each gesture starts inside the container, as fractions of its width and height (default: the centre) */
	startPositions?: [number, number];
	/** timeout in ms for the sentinel (default: 5000) */
	timeout?: number;
}

/**
 * Scrolls a container to its end and, with a sentinel, waits until that end is actually on
 * screen. The patched detox treats content that no longer moves as the end, so this returns
 * after a gesture or two on any scroll view — including one whose `canScroll` probe never
 * flips — instead of looping.
 * @example
 * await scrollToEnd(by.id("genetics-locus-sheet"), { sentinel: by.id("genetics-locus-sheet-save") });
 * await scrollToEnd(by.id("containerScrollView"), { edge: "top" });
 */
export const scrollToEnd = async (
	scrollView: Detox.NativeMatcher,
	options: ScrollToEndOptions = {},
) => {
	await waitForScrollContainer(scrollView);
	await element(scrollView).scrollTo(
		options.edge ?? "bottom",
		options.startPositions?.[0] ?? 0.5,
		options.startPositions?.[1] ?? 0.5,
	);

	if (options.sentinel) {
		await waitForReachable(options.sentinel, { timeout: options.timeout });
	}
};

export interface TransitionOptions extends ActorOptions {
	/** the intermediate state to observe first: "busy" — the element renders disabled while its action runs */
	through?: "busy";
	/** the final state: "gone" — no longer in the hierarchy; "hidden" — no longer visible; "idle" — enabled again */
	to: "gone" | "hidden" | "idle";
}

type FinalState = TransitionOptions["to"];

const stageFailure = (stage: string, cause: unknown) => {
	const detail = cause instanceof Error ? cause.message : String(cause);
	return new Error(`${stage}\n${detail}`);
};

const isInFinalState = (elem: Detox.NativeElement, state: FinalState) => {
	const check =
		state === "gone"
			? expect(elem).not.toExist()
			: state === "hidden"
				? expect(elem).not.toBeVisible()
				: expect(elem).toBeEnabled();
	return check.then(
		() => true,
		() => false,
	);
};

const waitForFinalState = (elem: Detox.NativeElement, state: FinalState, timeout: number) => {
	if (state === "gone") return waitForNotExists(elem, { timeout });
	if (state === "hidden") return waitForInvisible(elem, { timeout });
	return waitFor(elem).toBeEnabled().withTimeout(timeout);
};

//the busy stage is polled natively in short rounds; between rounds the final state is checked, so
//an action that finished faster than a poll still passes — except for "idle", which is also the
//starting state and so cannot stand in for "was busy"
const waitForBusy = async (
	elem: Detox.NativeElement,
	finalState: FinalState,
	startedAt: number,
	timeout: number,
): Promise<"busy" | "completed"> => {
	const roundMs = 250;
	while (true) {
		const round = await waitFor(elem)
			.not.toBeEnabled()
			.withTimeout(roundMs)
			.then(
				() => undefined,
				(cause: unknown) => cause ?? new Error("not busy"),
			);
		if (round === undefined) return "busy";
		if (finalState !== "idle" && (await isInFinalState(elem, finalState))) return "completed";
		if (Date.now() - startedAt >= timeout) {
			throw stageFailure(
				`the element never reported busy within ${timeout}ms (enabled stayed true, final state "${finalState}" not reached) — the action may not have been delivered`,
				round,
			);
		}
	}
};

/**
 * Observes the transition an action causes on an element, one bounded stage at a time, so a
 * failure says which stage did not happen: the element never went busy (the action was not
 * delivered) or it went busy and never came back (the action did not complete). Call it right
 * after the action.
 * @example
 * await waitForTap(by.id("genetics-undo-strip-undo"));
 * await expectTransition(by.id("genetics-undo-strip-undo"), { through: "busy", to: "gone" });
 */
export const expectTransition = async (
	target: DetoxElementsOrMatcher,
	options: TransitionOptions,
) => {
	const elem = makeElementFromElementOrMatcher(target, options.atIndex);
	const timeout = timeoutOf(options);
	const startedAt = Date.now();

	if (options.through === "busy") {
		const outcome = await waitForBusy(elem, options.to, startedAt, timeout);
		if (outcome === "completed") return;
	}

	const busyForMs = Date.now() - startedAt;
	const busyStage = options.through === "busy" ? `busy after ${busyForMs}ms, then ` : "";
	await waitForFinalState(elem, options.to, timeout).catch((cause: unknown) => {
		throw stageFailure(`${busyStage}not "${options.to}" within ${timeout}ms — the action did not complete`, cause);
	});
};
