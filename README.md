This package contains helpful functions to make working with the [detox testing library by wix](https://github.com/wix/Detox) simpler and reduce boilerplate.

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

#### Parameters

| Name               | Type                     | Description                                       |
| :----------------- | :----------------------- | :------------------------------------------------ |
| `elementOrMatcher` | `DetoxElementsOrMatcher` | -                                                 |
| `options?`         | `Object`                 | -                                                 |
| `options.atIndex?` | `number`                 | index of match to use in case of multiple matches |
| `options.timeout?` | `number`                 | timeout in ms (default: 5000)                     |

#### Returns

`Promise`\<`void`\>

**`Example`**

```ts
await waitForTap(by.id("test"));
await waitForTap(by.label("test"), { atIndex: 2 });
await waitForTap(element(by.id("test")));
```

#### Defined in

[actions.ts:14](https://github.com/code-workers/detox-helpers/blob/8a6c131/src/actions.ts#L14)

---

### waitForVisible

▸ **waitForVisible**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits for en element to be visible until a timeout. This is usefull if
an element is not instantly visible

#### Parameters

| Name               | Type                     | Description                                       |
| :----------------- | :----------------------- | :------------------------------------------------ |
| `elementOrMatcher` | `DetoxElementsOrMatcher` | -                                                 |
| `options?`         | `Object`                 | -                                                 |
| `options.atIndex?` | `number`                 | index of match to use in case of multiple matches |
| `options.timeout?` | `number`                 | timeout in ms (default: 5000)                     |

#### Returns

`Promise`\<`void`\>

**`Example`**

```ts
await waitForVisible(by.id("test"));
await waitForVisible(by.label("test"), { atIndex: 2 });
await waitForVisible(element(by.id("test")));
```

#### Defined in

[waiters.ts:35](https://github.com/code-workers/detox-helpers/blob/8a6c131/src/waiters.ts#L35)

---

### waitForInvisible

▸ **waitForInvisible**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits for en element to be invisible until a timeout. This is usefull if
an element needs some time to become invisible

#### Parameters

| Name               | Type                     | Description                                       |
| :----------------- | :----------------------- | :------------------------------------------------ |
| `elementOrMatcher` | `DetoxElementsOrMatcher` | -                                                 |
| `options?`         | `Object`                 | -                                                 |
| `options.atIndex?` | `number`                 | index of match to use in case of multiple matches |
| `options.timeout?` | `number`                 | timeout in ms (default: 5000)                     |

#### Returns

`Promise`\<`void`\>

**`Example`**

```ts
await waitForInvisible(by.id("test"));
await waitForInvisible(by.label("test"), { atIndex: 2 });
await waitForInvisible(element(by.id("test")));
```

#### Defined in

[waiters.ts:55](https://github.com/code-workers/detox-helpers/blob/8a6c131/src/waiters.ts#L55)

---

### waitForExists

▸ **waitForExists**(`elementOrMatcher`, `options?`): `Promise`\<`void`\>

Waits for en element to exist until a timeout. This is usefull if
an element is not instantly created

#### Parameters

| Name               | Type                     | Description                                       |
| :----------------- | :----------------------- | :------------------------------------------------ |
| `elementOrMatcher` | `DetoxElementsOrMatcher` | -                                                 |
| `options?`         | `Object`                 | -                                                 |
| `options.atIndex?` | `number`                 | index of match to use in case of multiple matches |
| `options.timeout?` | `number`                 | timeout in ms (default: 5000)                     |

#### Returns

`Promise`\<`void`\>

**`Example`**

```ts
await waitForExists(by.id("test"));
await waitForExists(by.label("test"), { atIndex: 2 });
await waitForExists(element(by.id("test")));
```

#### Defined in

[waiters.ts:15](https://github.com/code-workers/detox-helpers/blob/8a6c131/src/waiters.ts#L15)

---

### waitForCountVisible

▸ **waitForCountVisible**(`elementOrMatcher`, `count`): `Promise`\<`void`\>

Verifies that at least {count} elements of a matcher are visible.
It is possible, that there are more, though

#### Parameters

| Name               | Type                                                           |
| :----------------- | :------------------------------------------------------------- |
| `elementOrMatcher` | `IndexableNativeElement` \| `NativeElement` \| `NativeMatcher` |
| `count`            | `number`                                                       |

#### Returns

`Promise`\<`void`\>

**`Example`**

```ts
await waitForCountVisible(by.id("test"), 4);
await waitForCountVisible(by.label("test"), 2);
await waitForCountVisible(element(by.id("test")), 5);
```

#### Defined in

[waiters.ts:73](https://github.com/code-workers/detox-helpers/blob/8a6c131/src/waiters.ts#L73)

---

### withoutSynchronization

▸ **withoutSynchronization**(`callback`): `Promise`\<`void`\>

Runs some code without synchronization and turns it on again afterwards, even in
case of an error.

#### Parameters

| Name       | Type                      | Description                                                       |
| :--------- | :------------------------ | :---------------------------------------------------------------- |
| `callback` | () => `Promise`\<`void`\> | async function containing the code to run without synchronization |

#### Returns

`Promise`\<`void`\>

**`See`**

https://wix.github.io/Detox/docs/api/device/#devicedisablesynchronization

**`Example`**

```ts
await withoutSynchronization(async () => {
  await waitForTap(by.id("click_to_open_webview"));
  await device.pressBack();
});
```

#### Defined in

[other.ts:15](https://github.com/code-workers/detox-helpers/blob/8a6c131/src/other.ts#L15)
