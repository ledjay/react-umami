# react-umami

[![npm version](https://badge.fury.io/js/react-umami.svg)](https://badge.fury.io/js/react-umami)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> A lightweight React integration for Umami Analytics - The privacy-focused alternative to Google Analytics

## Features

✨ **Simple Integration** - Easy to set up and use with any React application  
🔒 **Privacy-Focused** - Built on Umami, respecting user privacy and GDPR compliant  
🎯 **Flexible Tracking** - Track page views and custom events with ease  
📦 **Lightweight** - Zero dependencies, minimal impact on your bundle size  
🔧 **TypeScript Support** - Full TypeScript support with type definitions included  
🌐 **Multi-Domain** - Support for tracking across multiple domains  
🏷️ **Event Tagging** - Organize your analytics with custom event tags

## Installation

```bash
npm install react-umami
# or
yarn add react-umami
# or
pnpm add react-umami
```

## Why react-umami?

- **Privacy First**: Unlike Google Analytics, Umami is privacy-focused and GDPR compliant
- **Simple Setup**: Get started with just a few lines of code
- **Developer Experience**: Built with TypeScript for better development experience
- **Performance**: Lightweight implementation with minimal bundle size impact
- **Flexible**: Support for custom events, domains, and tracking options

## Examples

### Basic Usage
```typescript
import UmamiReact from 'react-umami';

// Initialize once in your app (e.g., in App.tsx)
UmamiReact.initialize({
  websiteId: 'your-website-id'
});

// Track events anywhere in your components
function SubscribeButton() {
  const handleSubscribe = () => {
    UmamiReact.track('Subscribe', {
      plan: 'premium',
      source: 'header'
    });
  };

  return <button onClick={handleSubscribe}>Subscribe Now</button>;
}
```

### With Custom Configuration
```typescript
import UmamiReact from 'react-umami';

UmamiReact.initialize({
  websiteId: 'your-website-id',
  hostUrl: 'https://analytics.mywebsite.com',
  autoTrack: false,
  domains: ['mywebsite.com'],
  tag: 'production'
});
```

## Documentation

### Configuration Options

The `initialize` method accepts the following options:

```typescript
interface UmamiOptions {
  websiteId: string;        // Your Umami website ID (required)
  hostUrl?: string;         // Custom analytics server URL
  autoTrack?: boolean;      // Enable/disable automatic page tracking
  domains?: string[];       // List of allowed domains
  tag?: string;            // Tag to collect events under
}
```

Example usage with all options:

```typescript
import UmamiReact from 'react-umami';

UmamiReact.initialize({
  websiteId: 'your-website-id',
  hostUrl: 'https://analytics.mywebsite.com',  // Optional: custom analytics server
  autoTrack: false,                           // Optional: disable automatic tracking
  domains: ['mywebsite.com', 'mywebsite2.com'], // Optional: limit tracking to specific domains
  tag: 'production'                           // Optional: tag your events
});
```

### Event Tracking

```typescript
import UmamiReact from 'react-umami';

// Track a simple event
UmamiReact.track('Button Click');

// Track an event with custom data
UmamiReact.track('Purchase', {
  product: 'Premium Plan',
  price: 99.99
});
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

- 📝 [Documentation](https://github.com/YOUR_USERNAME/react-umami#documentation)
- 🐛 [Issue Tracker](https://github.com/YOUR_USERNAME/react-umami/issues)
- 💬 [Discussions](https://github.com/YOUR_USERNAME/react-umami/discussions)

## License

MIT 

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://YOUR_WEBSITE.com">YOUR_NAME</a></sub>
</div>
