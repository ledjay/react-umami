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

Simply import UmamiAnalytics in your root layout:

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
          debug={process.env.NODE_ENV === 'development'}
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

There are two ways to use react-umami:

### 1. Simple Usage (Meta Tag)

The simplest way is to add a meta tag to your HTML head with your website ID:

```html
<head>
  <meta name="umami-website-id" content="your-website-id-here" />
</head>
```

Then use the hook directly in your components:

```tsx
'use client'; // Required for Next.js App Router

import { useUmami } from 'react-umami/client';

function MyComponent() {
  const { track } = useUmami();
  
  const handleClick = () => {
    track('button_clicked');
  };

  return <button onClick={handleClick}>Click me!</button>;
}
```

### 2. Advanced Usage (Provider)

For more control over the configuration, you can use the UmamiProvider:

#### Next.js (App Router)

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
          debug={process.env.NODE_ENV === 'development'}
        >
          {children}
        </UmamiAnalytics>
      </body>
    </html>
  );
}
```

#### Next.js (Pages Router)

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

Then use the hook in your components:

```tsx
'use client'; // Required for Next.js App Router

import { useUmami } from 'react-umami/client';

function MyComponent() {
  const { track } = useUmami();
  
  // Basic event
  const handleClick = () => {
    track('button_clicked');
  };

  // Event with data
  const handlePurchase = () => {
    track('purchase_completed', {
      product: 'Premium Plan',
      price: 99.99,
      currency: 'USD'
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Click me!</button>
      <button onClick={handlePurchase}>Buy now</button>
    </div>
  );
}
```

### Default Tracking Object

You can set up a default tracking object that will be merged with all tracking calls:

```tsx
// app/layout.tsx
import { UmamiAnalytics } from 'react-umami';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UmamiAnalytics
          websiteId="your-website-id"
          defaultTracking={{
            name: 'default_event',  // Fallback event name if none provided
            data: {
              app_version: '1.0.0',
              environment: process.env.NODE_ENV,
              // Any default properties you want to include in all events
            }
          }}
        >
          {children}
        </UmamiAnalytics>
      </body>
    </html>
  );
}
```

Now all tracking calls will automatically include the default data:

```tsx
function MyComponent() {
  const { track } = useUmami();
  
  const handleClick = () => {
    // This will include app_version and environment from the default tracking object
    track('button_clicked', { button_id: 'submit' });
  };

  return <button onClick={handleClick}>Click me!</button>;
}
```

The final event data will be:
```json
{
  "app_version": "1.0.0",
  "environment": "production",
  "button_id": "submit"
}
```

If no event name is provided, it will use the default event name:
```tsx
track(null, { some_data: 'value' }); // Will use 'default_event' as the name
```

### Configuration Options

When using the provider approach, you can configure the following options:

- `websiteId` (required): Your Umami website ID
- `hostUrl` (optional): URL of your Umami instance (defaults to cloud.umami.is)
- `debug` (optional): Enable debug logging (defaults to false)
- `domains` (optional): Array of allowed domains
- `cache` (optional): Enable caching (defaults to true)
- `autoTrack` (optional): Enable auto tracking (defaults to true)
- `respectDNT` (optional): Respect Do Not Track setting (defaults to false)

## Configuration

| Option      | Type     | Required | Description                                         |
| ----------- | -------- | -------- | --------------------------------------------------- |
| `websiteId` | string   | Yes      | Your Umami website ID                               |
| `hostUrl`   | string   | Yes      | Your Umami server URL                               |
| `autoTrack` | boolean  | No       | Enable automatic page view tracking (default: true) |
| `domains`   | string[] | No       | List of allowed domains                             |
| `debug`     | boolean  | No       | Enable debug logging (default: false)               |

## Debugging

There are two ways to enable debug mode in react-umami:

### 1. Environment Variable

Add `UMAMI_DEBUG=true` to your project's `.env` file:

```env
UMAMI_DEBUG=true
```

This will enable detailed logging of all tracking events and internal operations.

### 2. Runtime Configuration

You can also enable/disable debug mode programmatically:

```typescript
import { Logger } from 'react-umami';

// Enable debug mode
Logger.setDebug(true);

// Disable debug mode
Logger.setDebug(false);
```

When debug mode is enabled, you'll see detailed logs in your browser's console with the following information:
- Timestamp of each event
- Log level (DEBUG, INFO, WARN, ERROR)
- Event details and any associated data

This is particularly useful when:
- Setting up Umami Analytics for the first time
- Debugging tracking events
- Verifying that events are being sent correctly
- Troubleshooting configuration issues

## Package Structure

- Import from `react-umami` for Server Components
- Import from `react-umami/client` for Client Components

```tsx
// Server Components (e.g., layout.tsx)
import { UmamiAnalytics } from 'react-umami';

// Client Components
import { useUmami } from 'react-umami/client';
```

## Troubleshooting

### Common Issues

1. **Events not tracking**
   - Verify websiteId and hostUrl are correct
   - Check browser console for errors when debug is enabled
   - Ensure your Umami server is accessible

2. **Using hooks in Server Components**
   - Only use useUmami in Client Components
   - Import useUmami from 'react-umami/client'
   - Mark components using useUmami with 'use client'

## Browser Support

- All modern browsers
- IE11+ (with appropriate polyfills)

## TypeScript Support

Full TypeScript support included. No additional setup needed.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## License

MIT 

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/ledjay">ledjay</a></sub>
</div>
