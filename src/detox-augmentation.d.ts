/**
 * The expectations and attributes the codeworkers detox patch adds (patches/detox.patch and
 * patch-detox-ios-sync.ts in the monorepo). Declared here so this package compiles against a
 * stock detox; at runtime the actors need the patched detox — without it `toBeReachable` and its
 * siblings are not functions.
 */
declare global {
	namespace Detox {
		interface Expect<R> {
			toBeReachable(): R;
			toBeSettled(stableForMs?: number): R;
			toBeEnabled(): R;
		}

		interface IosElementAttributes {
			hitPoint?: Point2D;
			notHittableReason?: string;
		}

		interface AndroidElementAttributes {
			hittable: boolean;
			hitPoint: Point2D;
			notHittableReason?: string;
		}
	}
}

export {};
