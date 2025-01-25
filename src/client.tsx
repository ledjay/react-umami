import { useEffect } from "react";
import type { UmamiOptions } from "./index";
import { UmamiReact } from "./index";

/**
 * React hook to initialize Umami Analytics
 * @param {UmamiOptions} options - Configuration options for Umami
 * @example
 * ```typescript
 * // In your _app.tsx or layout component:
 * export default function App() {
 *   useUmami({
 *     websiteId: 'your-website-id',
 *     hostUrl: 'https://analytics.mywebsite.com',
 *     debug: true
 *   });
 *
 *   return <Component {...pageProps} />;
 * }
 * ```
 */
export function useUmami(options: UmamiOptions) {
  useEffect(() => {
    UmamiReact.initialize(options);
  }, []); // Empty dependency array means this runs once on mount
}

/**
 * React component to initialize Umami Analytics
 * @param {UmamiOptions} props - Configuration options for Umami
 * @example
 * ```typescript
 * // In your app/layout.tsx:
 * import { UmamiProvider } from 'react-umami/client';
 *
 * export default function RootLayout({
 *   children,
 * }: {
 *   children: React.ReactNode;
 * }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <UmamiProvider
 *           websiteId="your-website-id"
 *           hostUrl="https://analytics.example.com"
 *           debug={true}
 *         />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function UmamiProvider(props: UmamiOptions) {
  useUmami(props);
  return null;
}
