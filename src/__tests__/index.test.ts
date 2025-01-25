import UmamiReact from '../index';

describe('UmamiReact', () => {
  beforeEach(() => {
    // Clear all script tags before each test
    document.head.innerHTML = '';
    // Reset the initialized state
    (UmamiReact as any).initialized = false;
  });

  it('should initialize with website ID', () => {
    UmamiReact.initialize({
      websiteId: 'test-id'
    });

    const script = document.querySelector('script[data-website-id="test-id"]');
    expect(script).toBeTruthy();
    expect(script?.getAttribute('src')).toBe('https://analytics.umami.is/script.js');
  });

  it('should prevent multiple initializations', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    
    UmamiReact.initialize({ websiteId: 'test-id-1' });
    UmamiReact.initialize({ websiteId: 'test-id-2' });
    
    const scripts = document.querySelectorAll('script[data-website-id]');
    expect(scripts.length).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith('UmamiReact: already initialized');
  });

  it('should handle all configuration options', () => {
    UmamiReact.initialize({
      websiteId: 'test-id',
      hostUrl: 'https://custom.analytics.com',
      autoTrack: false,
      domains: ['example.com', 'example2.com'],
      tag: 'test-tag'
    });

    const script = document.querySelector('script[data-website-id="test-id"]');
    expect(script?.getAttribute('data-host-url')).toBe('https://custom.analytics.com');
    expect(script?.getAttribute('data-auto-track')).toBe('false');
    expect(script?.getAttribute('data-domains')).toBe('example.com,example2.com');
    expect(script?.getAttribute('data-tag')).toBe('test-tag');
  });

  it('should track events when initialized', () => {
    const mockTrack = jest.fn();
    window.umami = { track: mockTrack };

    UmamiReact.initialize({ websiteId: 'test-id' });
    UmamiReact.track('test-event', { data: 'test' });

    expect(mockTrack).toHaveBeenCalledWith('test-event', { data: 'test' });
  });

  it('should warn when tracking without initialization', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    UmamiReact.track('test-event');
    
    expect(consoleSpy).toHaveBeenCalledWith('UmamiReact: Please call initialize() first');
  });
});
