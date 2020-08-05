import * as React from "react"
import { render, testA11y, screen } from "@chakra-ui/test-utils"
import { Avatar, AvatarGroup } from "../src"

describe("<AvatarGroup />", () => {
  test("AvatarGroup renders correctly", () => {
    const tools = render(
      <AvatarGroup>
        <Avatar />
      </AvatarGroup>,
    )
    expect(tools.asFragment()).toMatchSnapshot()
  })

  it("passes a11y test", async () => {
    await testA11y(
      <AvatarGroup>
        <Avatar />
      </AvatarGroup>,
    )
  })

  test("renders a number avatar showing count of truncated avatars", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar />
        <Avatar />
        <Avatar />
        <Avatar />
        <Avatar />
      </AvatarGroup>,
    )
    const moreLabel = screen.getByText("+3")
    expect(moreLabel).toBeInTheDocument()
  })
})
