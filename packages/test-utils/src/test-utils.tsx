import theme from "@chakra-ui/theme"
import { GlobalStyle, ThemeProvider, WithChildren } from "@chakra-ui/system"
import CSSReset from "@chakra-ui/css-reset"
import "@testing-library/jest-dom/extend-expect"
import {
  render as rtlRender,
  RenderOptions,
  fireEvent,
  RenderResult,
} from "@testing-library/react"
import * as React from "react"
import { toHaveNoViolations, axe } from "jest-axe"
import serializer from "jest-emotion"
import { RunOptions } from "axe-core"

expect.addSnapshotSerializer(serializer)

expect.extend(toHaveNoViolations)

type UI = Parameters<typeof rtlRender>[0]

// UI-less passthrough fallback to prevent using conditional logic in render
function ChildrenPassthrough({ children }: { children: React.ReactElement }) {
  return children
}

export interface TestOptions extends Omit<RenderOptions, "wrapper"> {
  /**
   * optional additional wrapper, e.g. Context
   *
   * @example
   * ```ts
   * // single wrapper
   * render(<MyConponent />, {
   *  wrapper: MyContext
   * });
   *
   * // multiple wrapper
   * render(<MyConponent />, {
   *  wrapper: ({ children }) => (
   *    <ContextA>
   *      <ContextB>
   *        {children}
   *      <ContextB />
   *    <ContextA />
   *  )
   * });
   *
   * ```
   */
  wrapper?: typeof ChildrenPassthrough
}

/**
 * Custom render for @testing-library/react
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 * @param component the component under test
 * @param options customized test options
 */
const render = (
  ui: UI,
  { wrapper: Wrapper = ChildrenPassthrough, ...options }: TestOptions = {},
): RenderResult => {
  return rtlRender(
    <ThemeProvider theme={theme}>
      <CSSReset />
      <GlobalStyle />
      <Wrapper>{ui}</Wrapper>
    </ThemeProvider>,
    options,
  )
}

export * from "@testing-library/react"

export {
  act as invoke,
  renderHook,
  RenderHookOptions,
  RenderHookResult,
} from "@testing-library/react-hooks"

export { default as userEvent } from "@testing-library/user-event"

export { render }

export const escape = (ui: HTMLElement) =>
  fireEvent.keyDown(ui, { key: "Escape", keyCode: 27 })

export const testA11y = async (
  ui: UI,
  options?: TestOptions,
  axeOptions?: RunOptions,
) => {
  const { container } = render(ui, options)

  const results = await axe(container, axeOptions)

  expect(results).toHaveNoViolations()
}
