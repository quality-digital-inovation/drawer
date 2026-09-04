# A11y platform gap: vtex.store-drawer aria-hidden-focus

**Jira:** TA-85  
**Axe rule:** [aria-hidden-focus](https://dequeuniversity.com/rules/axe/4.10/aria-hidden-focus?application=axeAPI) (impact: serious)  
**CSS handle:** `vtex-store-drawer-0-x-drawer`

## Summary

When the store drawer is closed, the platform component `vtex.store-drawer` sets `aria-hidden="true"` on the drawer container (`.vtex-store-drawer-0-x-drawer`) while lazy/eager rendering keeps focusable children (menu links, close button) in the DOM. Keyboard users can Tab into those elements, triggering the `aria-hidden-focus` violation.

## Root cause (platform)

In `vtex.store-drawer` → `Swipable` component, the closed drawer uses:

```html
<div aria-hidden="true" class="vtex-store-drawer-0-x-drawer vtex-store-drawer-0-x-closed ...">
  <!-- focusable links and buttons remain in DOM -->
</div>
```

`aria-hidden="true"` hides content from assistive technology but does **not** remove focusable descendants from the tab order. Axe correctly flags this as a serious accessibility issue.

## Fix in acctglobal.poc-traction-drawer

This fork replaces `aria-hidden` with the HTML [`inert`](https://html.spec.whatwg.org/multipage/interaction.html#inert) attribute when the drawer is closed. `inert` removes the subtree from the accessibility tree **and** prevents keyboard focus, satisfying the axe rule without unmounting lazy-rendered children.

## Store theme workaround (CSS-only — not recommended)

CSS overrides in the store theme (`styles/css/vtex.store-drawer.css`) cannot fix this issue because:

- `aria-hidden` is set by React at runtime, not by CSS
- Theme CSS cannot add/remove `inert` or manage focusability of dynamic children

**Recommended store theme action:** depend on `acctglobal.poc-traction-drawer` (this fork) instead of `vtex.store-drawer`, or wait for an upstream VTEX platform fix.

## Platform report

The same bug exists in the native `vtex.store-drawer@0.x` app used by [storetheme.vtex.com](https://storetheme.vtex.com). This should be reported to VTEX platform team for inclusion in a future `vtex.store-drawer` release.

## Verification

1. Open the store with the patched app linked in a VTEX IO workspace
2. Wait for hydration
3. Tab through the page with the drawer closed
4. Run axe `aria-hidden-focus` — the `.vtex-store-drawer-0-x-drawer` target should pass
