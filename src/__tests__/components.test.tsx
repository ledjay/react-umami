import React from "react";
import { render, screen, act } from "@testing-library/react";
import { UmamiProvider, useUmami } from "../client";
import { UmamiScript } from "../components/script";
import { UmamiReact } from "../index";

// Mock UmamiReact
jest.mock("../index", () => ({
  UmamiReact: {
    initialize: jest.fn(),
    track: jest.fn(),
  },
}));

describe("UmamiProvider", () => {
  const mockConfig = {
    websiteId: "new-id",
    hostUrl: "https://analytics.test.com",
  };

  const originalWindow = global.window;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Reset window to its original value before each test
    global.window = originalWindow;
  });

  afterEach(() => {
    // Ensure window is restored after each test
    global.window = originalWindow;
    jest.useRealTimers();
  });

  it("should not initialize in SSR environment", async () => {
    // Set SSR environment for this test
    const originalEnv = process.env.TEST_SSR;
    process.env.TEST_SSR = "true";

    await act(async () => {
      render(
        <UmamiProvider {...mockConfig}>
          <div>Test</div>
        </UmamiProvider>
      );
    });

    // Let any pending effects flush
    jest.runAllTimers();
    await act(async () => {
      await Promise.resolve();
    });

    expect(UmamiReact.initialize).not.toHaveBeenCalled();

    // Restore environment
    process.env.TEST_SSR = originalEnv;
  });

  it("should initialize UmamiReact with config", async () => {
    // Mock window to ensure isBrowser returns true
    global.window = { document: {} as Document } as unknown as Window &
      typeof globalThis;

    await act(async () => {
      render(
        <UmamiProvider {...mockConfig}>
          <div>Test</div>
        </UmamiProvider>
      );
    });

    // Wait for effects to complete
    jest.runAllTimers();
    await act(async () => {
      await Promise.resolve();
    });

    expect(UmamiReact.initialize).toHaveBeenCalledWith(mockConfig);
  });

  it("should provide tracking function through context", async () => {
    // Mock window to ensure isBrowser returns true
    global.window = { document: {} as Document } as unknown as Window &
      typeof globalThis;

    const TestComponent = () => {
      const { track } = useUmami();
      React.useEffect(() => {
        track("test-event", { data: "test" });
      }, [track]);
      return null;
    };

    await act(async () => {
      render(
        <UmamiProvider {...mockConfig}>
          <TestComponent />
        </UmamiProvider>
      );
    });

    // Wait for effects to complete
    jest.runAllTimers();
    await act(async () => {
      await Promise.resolve();
    });

    expect(UmamiReact.track).toHaveBeenCalledWith("test-event", {
      data: "test",
    });
  });

  it("should throw error when useUmami is used outside provider", async () => {
    const TestComponent = () => {
      const { track } = useUmami();
      return null;
    };

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error");
    consoleSpy.mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useUmami must be used within a UmamiProvider"
    );

    consoleSpy.mockRestore();
  });
});

describe("UmamiScript", () => {
  const mockProps = {
    websiteId: "new-id",
    hostUrl: "https://analytics.test.com",
  };

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should render script tag with correct attributes", async () => {
    await act(async () => {
      render(<UmamiScript {...mockProps} />);
    });

    // Wait for effects to complete
    jest.runAllTimers();
    await act(async () => {
      await Promise.resolve();
    });

    const scriptElement = document.querySelector("script");
    expect(scriptElement).toBeTruthy();
    expect(scriptElement?.async).toBe(true);
    expect(scriptElement?.defer).toBe(true);
    expect(scriptElement?.getAttribute("data-website-id")).toBe(
      mockProps.websiteId
    );
    expect(scriptElement?.src).toBe(`${mockProps.hostUrl}/script.js`);
  });

  it("should update script attributes when props change", async () => {
    const { rerender } = render(<UmamiScript {...mockProps} />);

    // Wait for initial render effects
    jest.runAllTimers();
    await act(async () => {
      await Promise.resolve();
    });

    const newProps = {
      ...mockProps,
      websiteId: "new-id",
    };

    rerender(<UmamiScript {...newProps} />);

    // Wait for rerender effects
    jest.runAllTimers();
    await act(async () => {
      await Promise.resolve();
    });

    const scriptElement = document.querySelector("script");
    expect(scriptElement?.getAttribute("data-website-id")).toBe(
      newProps.websiteId
    );
    expect(scriptElement?.src).toBe(`${mockProps.hostUrl}/script.js`);
  });
});
