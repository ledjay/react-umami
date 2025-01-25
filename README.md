# react-umami

[![npm version](https://badge.fury.io/js/react-umami.svg)](https://badge.fury.io/js/react-umami)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> React integration for Umami Analytics - Privacy-focused alternative to Google Analytics

## Installation

```bash
npm install react-umami
# or
pnpm add react-umami
# or
yarn add react-umami
```

## Framework Setup

### Next.js (App Router)

```tsx
// app/layout.tsx
import { UmamiAnalytics } from 'react-umami';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UmamiAnalytics
          websiteId="your-website-id"
          hostUrl="https://analytics.example.com"
        >
          {children}
        </UmamiAnalytics>
      </body>
    </html>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { UmamiAnalytics } from 'react-umami';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UmamiAnalytics
      websiteId="your-website-id"
      hostUrl="https://analytics.example.com"
    >
      <Component {...pageProps} />
    </UmamiAnalytics>
  );
}
```

## Usage

Use the `useUmami` hook in your components to track events:

```tsx
'use client'; // Required for Next.js App Router

import { useUmami } from 'react-umami';

function MyComponent() {
  const { track } = useUmami();
  
  const handleClick = () => {
    track('button_clicked');
  };

  return <button onClick={handleClick}>Click me!</button>;
}
```

### Default Tracking

You can set up default tracking data that will be included with all events:

```tsx
import { UmamiAnalytics } from 'react-umami';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UmamiAnalytics
      websiteId="your-website-id"
      hostUrl="https://analytics.example.com"
      defaultTracking={{
        name: 'page_view',
        data: {
          app_version: '1.0.0',
          environment: process.env.NODE_ENV
        }
      }}
    >
      <Component {...pageProps} />
    </UmamiAnalytics>
  );
}
```

### Tracking Events

The `track` function accepts two parameters:
```tsx
track(eventName: string, data?: Record<string, any>)
```

Example with custom data:
```tsx
track('button_clicked', {
  button_id: 'submit',
  page: '/checkout'
});
```

If no event name is provided, it will use the default event name:
```tsx
track(null, { some_data: 'value' }); // Will use 'page_view' as the name
```

### Configuration Options

| Option            | Type    | Required | Description                                       |
| ----------------- | ------- | -------- | ------------------------------------------------- |
| `websiteId`       | string  | Yes      | Your Umami website ID                             |
| `hostUrl`         | string  | No       | Custom Umami server URL (default: cloud.umami.is) |
| `defaultTracking` | object  | No       | Default tracking data for all events              |
| `disabled`        | boolean | No       | Disable tracking (default: false)                 |

## Bundle Size

This package is designed to be lightweight:

```
dist/client/index.js     0.14 kB │ gzip: 0.13 kB
dist/index.js            0.18 kB │ gzip: 0.14 kB
dist/client/analytics.js 0.34 kB │ gzip: 0.24 kB
```

The core functionality is split into modules to enable tree-shaking:
- Import from `react-umami` for Server Components
- Import from `react-umami` for Client Components (hooks will automatically use client-side code)

This ensures you only include the code you actually use.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

MIT 
