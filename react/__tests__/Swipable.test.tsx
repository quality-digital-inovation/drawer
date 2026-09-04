import React from 'react'
import { render } from '@vtex/test-tools/react'

import Swipable from '../Swipable'

const defaultProps = {
  onSwipeLeft: jest.fn(),
  onSwipeRight: jest.fn(),
  onTriggerChange: jest.fn(),
  onLockScroll: jest.fn(),
  onUnlockScroll: jest.fn(),
  onDragStart: jest.fn(),
  onDragEnd: jest.fn(),
  onSetPosition: jest.fn(),
  onUpdateOffset: jest.fn(),
  threshold: 0,
  enabled: false,
  rubberBanding: false,
  element: null as unknown as React.ReactElement,
  position: 'left' as const,
  className: 'drawer-test',
  style: {},
  positionRight: '100%',
  positionLeft: '-100%',
  preserveMomentum: true,
  allowOutsideDrag: false,
}

describe('Swipable a11y', () => {
  it('sets inert when closed and does not use aria-hidden', () => {
    const { container } = render(
      <Swipable {...defaultProps} enabled={false}>
        <div>
          <button type="button">Menu link</button>
        </div>
      </Swipable>
    )

    const drawer = container.firstChild as HTMLElement

    expect(drawer.hasAttribute('inert')).toBe(true)
    expect(drawer.getAttribute('aria-hidden')).toBeNull()
  })

  it('removes inert when open', () => {
    const { container } = render(
      <Swipable {...defaultProps} enabled={true}>
        <div>
          <button type="button">Menu link</button>
        </div>
      </Swipable>
    )

    const drawer = container.firstChild as HTMLElement

    expect(drawer.hasAttribute('inert')).toBe(false)
    expect(drawer.getAttribute('aria-hidden')).toBeNull()
  })

  it('toggles inert when enabled prop changes', () => {
    const { container, rerender } = render(
      <Swipable {...defaultProps} enabled={false}>
        <div>
          <a href="/category">Category</a>
        </div>
      </Swipable>
    )

    const drawer = container.firstChild as HTMLElement

    expect(drawer.hasAttribute('inert')).toBe(true)

    rerender(
      <Swipable {...defaultProps} enabled={true}>
        <div>
          <a href="/category">Category</a>
        </div>
      </Swipable>
    )

    expect(drawer.hasAttribute('inert')).toBe(false)
  })
})
