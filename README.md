# react-umami

[![npm version](https://badge.fury.io/js/react-umami.svg)](https://badge.fury.io/js/react-umami)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> A lightweight React integration for Umami Analytics - The privacy-focused alternative to Google Analytics

## Features

- 🔄 Easy integration with React and Next.js
- 🎯 Automatic page tracking
- 📊 Custom event tracking
- 🛠 Configurable options
- 📱 TypeScript support
- 🔍 Debug mode for development
- ⚡️ Server-side rendering support
- 🎨 Framework-specific components

## Installation

```bash
npm install react-umami
# or
yarn add react-umami
# or
pnpm add react-umami
```

## Usage

### Next.js App Router (v13+)

```tsx
// app/components/analytics.tsx
'use client';

import { UmamiProvider } from 'react-umami/client';

export function Analytics() {
  return (
    <UmamiProvider
      websiteId="your-website-id"
      hostUrl="https://analytics.example.com"
      debug={true} // Optional: enable debug mode
    />
  );
}

// app/layout.tsx
import { Analytics } from './components/analytics';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
```

### Next.js Pages Router

```tsx
// pages/_app.tsx
'use client';

import type { AppProps } from 'next/app';
import { UmamiProvider } from 'react-umami/client';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UmamiProvider
        websiteId="your-website-id"
        hostUrl="https://analytics.example.com"
        debug={true}
      />
      <Component {...pageProps} />
    </>
  );
}
```

### React (Create React App, Vite, etc.)

```tsx
// App.tsx
import { UmamiReact } from 'react-umami';

// Initialize in your app's entry point
UmamiReact.initialize({
  websiteId: 'your-website-id',
  hostUrl: 'https://analytics.example.com',
  debug: true // Optional: enable debug mode
});

function App() {
  return (
    <div>
      <h1>My App</h1>
    </div>
  );
}
```

### Tracking Custom Events

```tsx
import { UmamiReact } from 'react-umami';

function MyComponent() {
  const handleClick = () => {
    UmamiReact.track('button_click', {
      buttonName: 'submit',
      page: 'home'
    });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `websiteId` | string | Yes | - | The website ID from your Umami instance |
| `hostUrl` | string | No | - | Custom analytics server URL |
| `autoTrack` | boolean | No | true | Enable/disable automatic page tracking |
| `domains` | string[] | No | - | List of allowed domains |
| `tag` | string | No | - | Tag to collect events under |
| `debug` | boolean | No | false | Enable debug mode to log all tracking actions |

### Debug Mode

When debug mode is enabled, the package will log all tracking actions to the console. This is useful for development and troubleshooting:

```typescript
// Console output example:
[UmamiReact] Initializing with options: { websiteId: 'xxx', debug: true }
[UmamiReact] Setting custom host URL: https://analytics.example.com
[UmamiReact] Script added to document head
[UmamiReact] Umami script loaded successfully
[UmamiReact] Tracking event: { name: 'button_click', data: { buttonName: 'submit' } }
[UmamiReact] Event tracked successfully
```

## Framework-Specific Components

### Next.js Components (`react-umami/client`)

For Next.js applications, we provide dedicated components that handle server-side rendering properly:

- `UmamiProvider`: A React component that initializes Umami
- `useUmami`: A React hook for manual initialization

Both components are marked with `'use client'` and are safe to use in Next.js server components.

### React Components (`react-umami`)

For traditional React applications:

- `UmamiReact.initialize()`: Static method to initialize Umami
- `UmamiReact.track()`: Static method to track custom events

## Best Practices

1. **Server-Side Rendering**
   - In Next.js, always use components from `react-umami/client`
   - Place the `UmamiProvider` in a client component

2. **Event Tracking**
   - Use descriptive event names
   - Include relevant context in event data
   - Avoid tracking sensitive information

3. **Debug Mode**
   - Enable debug mode during development
   - Disable debug mode in production

4. **Performance**
   - The script is loaded asynchronously and won't block rendering
   - Use the `domains` option to prevent tracking in development

## Support

- 📝 [Documentation](https://github.com/ledjay/react-umami#documentation)
- 🐛 [Issue Tracker](https://github.com/ledjay/react-umami/issues)
- 💬 [Discussions](https://github.com/ledjay/react-umami/discussions)

## License

MIT 

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/ledjay">ledjay</a></sub>
</div>
