import type { ReactElement, ReactNode } from "react";
import RootLayout from "@/app/layout";
import { Footer } from "@/components/Footer";

jest.mock("@/components/Footer", () => ({
  Footer: () => <footer>Footer</footer>,
}));

describe("Root layout", () => {
  it("includes children and footer", () => {
    const layout = RootLayout({
      children: <main>App content</main>,
    });

    expect(layout.type).toBe("html");

    const body = (layout.props as { children: ReactElement }).children;
    expect(body.type).toBe("body");

    const bodyChildren = (body.props as { children: ReactNode }).children;
    const childrenArray = Array.isArray(bodyChildren) ? bodyChildren : [bodyChildren];

    const hasAppContent = childrenArray.some(
      (child) => (child as ReactElement)?.props?.children === "App content"
    );
    const hasFooter = childrenArray.some(
      (child) => (child as ReactElement)?.type === Footer
    );

    expect(hasAppContent).toBe(true);
    expect(hasFooter).toBe(true);
  });
});
