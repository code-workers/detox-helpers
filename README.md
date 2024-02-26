This package contains helpful functions to make working with the [detox testing library by wix](https://github.com/wix/Detox) simpler and reduce boilerplate.

We use those functions internally for some time now and thought they might be helpful to others as well.

Additions and PR's are welcome.

## Table of contents

### Functions

- [waitForTap](modules.md#waitfortap)
- [waitForVisible](modules.md#waitforvisible)
- [waitForInvisible](modules.md#waitforinvisible)
- [waitForExists](modules.md#waitforexists)
- [waitForCountVisible](modules.md#waitforcountvisible)
- [withoutSynchronization](modules.md#withoutsynchronization)

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