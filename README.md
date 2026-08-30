This package contains helpful functions to make working with the [detox testing library by wix](https://github.com/wix/Detox) simpler and reduce boilerplate.

We use those functions internally for some time now and thought they might be helpful to others as well.

Additions and PR's are welcome.

## Table of contents

### Functions

- [waitForTap](#waitfortap)
- [waitForVisible](#waitforvisible)
- [waitForInvisible](#waitforinvisible)
- [waitForExists](#waitforexists)
- [waitForCountVisible](#waitforcountvisible)
- [withoutSynchronization](#withoutsynchronization)

### Observable actors

- [waitForReachable](#waitforreachable)
- [tapReachable](#tapreachable)
- [scrollToEnd](#scrolltoend)
- [waitForSettled](#waitforsettled)
- [expectTransition](#expecttransition)

### Configuration

- [DETOX_HELPERS_DEFAULT_TIMEOUT](#detox_helpers_default_timeout)

### waitForTap

▸ **waitForTap**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits for en element to be visible before tapping it.
This is helpfull in case it needs a moment before appearing

**`Example`**

```ts
await waitForTap(by.id("test"));
await waitForTap(by.label("test"), { atIndex: 2 });
await waitForTap(element(by.id("test")));
```

---

### waitForVisible

▸ **waitForVisible**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits for en element to be visible until a timeout. This is usefull if
an element is not instantly visible

**`Example`**

```ts
await waitForVisible(by.id("test"));
await waitForVisible(by.label("test"), { atIndex: 2 });
await waitForVisible(element(by.id("test")));
```
---

### waitForInvisible

▸ **waitForInvisible**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits for en element to be invisible until a timeout. This is usefull if
an element needs some time to become invisible

**`Example`**

```ts
await waitForInvisible(by.id("test"));
await waitForInvisible(by.label("test"), { atIndex: 2 });
await waitForInvisible(element(by.id("test")));
```
---

### waitForExists

▸ **waitForExists**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits for en element to exist until a timeout. This is usefull if
an element is not instantly created

**`Example`**

```ts
await waitForExists(by.id("test"));
await waitForExists(by.label("test"), { atIndex: 2 });
await waitForExists(element(by.id("test")));
```
---

### waitForCountVisible

▸ **waitForCountVisible**(`elementOrMatcher`, `count`): `Promise`\<`void`\>

Verifies that at least {count} elements of a matcher are visible.
It is possible, that there are more, though

**`Example`**

```ts
await waitForCountVisible(by.id("test"), 4);
await waitForCountVisible(by.label("test"), 2);
await waitForCountVisible(element(by.id("test")), 5);
```
---

### withoutSynchronization

▸ **withoutSynchronization**(`callback`): `Promise`\<`void`\>

Runs some code without synchronization and turns it on again afterwards, even in
case of an error.

**`See`**

https://wix.github.io/Detox/docs/api/device/#devicedisablesynchronization

**`Example`**

```ts
await withoutSynchronization(async () => {
  await waitForTap(by.id("click_to_open_webview"));
  await device.pressBack();
});
```

## Observable actors

Every step of a test should be a check on something the app shows, never a wait for time to
pass. The actors below make the four checks that plain detox cannot express — *a tap would reach
this*, *this has stopped moving*, *this is enabled*, *this went busy and then away* — and every
failure names what was last observed instead of "timeout expired".

They rely on the **codeworkers detox patch**, which adds `toBeReachable()`, `toBeSettled()` and
`toBeEnabled()` to `expect`/`waitFor` on both platforms, the `hittable`/`hitPoint`/`notHittableReason`
attributes, a scroll edge detection that stops when the content stops moving, and timeout
messages that carry the last observation. Without the patch the actors throw
`toBeReachable is not a function`.

### waitForReachable

▸ **waitForReachable**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits until a tap would reach the element: effectively visible, enabled, outside the system bars
and the keyboard, not covered by another view or window. Visibility alone is not enough on an
edge-to-edge window — a button under the three-button navigation bar is fully "visible" and a tap
on it is refused by the input system.

**`Example`**

```ts
await waitForReachable(by.id("save-button"));
await waitForReachable(by.id("row"), { atIndex: 2, timeout: 10000 });
```
---

### tapReachable

▸ **tapReachable**(`target`, `options?`): `Promise`\<`void`\>

Taps an element once a tap can reach it, scrolling `in` toward it when given. The scroll loop
runs natively with reachability as its stop condition, so it stops where the tap will land — not
where 75% of the view has entered the window — and when the container reaches its end with the
target still out of reach the failure names the geometry (the hit point inside the navigation-bar
inset, the view a touch is dispatched to instead). A settle wait covers an entrance animation
still in flight. With `in`, the target's existence is waited for before the search: a row the
screen is still loading or a strip a write is about to answer with is a state to wait for, not a
search that ends at the container's edge after zero attempts. `scrollToElement` waits the same way.

| option | meaning |
| --- | --- |
| `in` | scroll container to move; without it the target must become reachable where it is |
| `direction` | scroll direction inside `in` (default `"down"`) |
| `step` | dp per scroll gesture (default `200`) |
| `startPositions` | where each gesture starts inside `in`, as fractions (default the centre) |
| `atIndex`, `timeout` | as everywhere |

**`Example`**

```ts
await tapReachable(by.id("sheet-save"), { in: by.id("sheet-scroll-view") });
await tapReachable(by.id("undo"));
```
---

### scrollToEnd

▸ **scrollToEnd**(`scrollView`, `options?`): `Promise`\<`void`\>

Scrolls a container to its end (`edge`, default `"bottom"`) and, with a `sentinel`, waits until
that end is actually on screen. The patched detox treats content that no longer moves as the end,
so this returns after a gesture or two on any scroll view instead of looping.

**`Example`**

```ts
await scrollToEnd(by.id("sheet-scroll-view"), { sentinel: by.id("sheet-save") });
await scrollToEnd(by.id("containerScrollView"), { edge: "top" });
```
---

### waitForSettled

▸ **waitForSettled**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits until the element's frame, opacity, transform and enabled state stop changing for
`options.stableForMs` (default 32) — an entrance or layout animation detox's synchronisation does
not track (Reanimated) has finished.

**`Example`**

```ts
await waitForSettled(by.id("actionSheet"));
```
---

### expectTransition

▸ **expectTransition**(`target`, `options`): `Promise`\<`void`\>

Observes the transition an action causes on an element, one bounded stage at a time, so a failure
says which stage did not happen: the element never went busy (the action was not delivered), or
it went busy and never came back (the action did not complete). Call it right after the action.

| option | meaning |
| --- | --- |
| `through` | `"busy"`: the element renders `disabled` while its action runs |
| `to` | `"gone"` (left the hierarchy), `"hidden"` (not visible), `"idle"` (enabled again) |

The busy stage is polled natively in short rounds; between rounds the final state is checked, so
an action that finished faster than a poll still passes — except with `to: "idle"`, where enabled
is also the starting state and busy must be seen. The app side is plain accessibility: a control
that is busy renders `disabled`, which is what a screen reader gets too.

**`Example`**

```ts
await waitForTap(by.id("undo"));
await expectTransition(by.id("undo"), { through: "busy", to: "gone" });
```

## Configuration

### DETOX_HELPERS_DEFAULT_TIMEOUT

The default wait of every helper is 5000 ms. `DETOX_HELPERS_DEFAULT_TIMEOUT=15000` raises it
process-wide — for slow devices such as a software-rendered CI emulator — without touching call
sites; an explicit `options.timeout` still wins.
