import { useCallback, useEffect, useRef } from 'react';

// Event types for better type safety
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface EcommerceEvent {
  event: 'purchase' | 'add_to_cart' | 'remove_from_cart' | 'view_item' | 'begin_checkout' | 'add_to_wishlist';
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
    brand?: string;
    variant?: string;
  }>;
  transaction_id?: string;
}

export interface UserEvent {
  event: 'login' | 'sign_up' | 'search' | 'share' | 'page_view';
  user_id?: string;
  search_term?: string;
  content_type?: string;
  content_id?: string;
  method?: string;
}

interface UseAnalyticsOptions {
  enableConsoleLogging?: boolean;
  enableGoogleAnalytics?: boolean;
  enableFacebookPixel?: boolean;
  enableCustomTracking?: boolean;
  customTrackingEndpoint?: string;
}

interface UseAnalyticsReturn {
  trackEvent: (event: AnalyticsEvent) => void;
  trackEcommerce: (event: EcommerceEvent) => void;
  trackUser: (event: UserEvent) => void;
  trackPageView: (page: string, title?: string) => void;
  trackConversion: (conversionType: string, value?: number) => void;
  trackError: (error: string, context?: string) => void;
  trackPerformance: (metric: string, value: number, unit?: string) => void;
  setUserProperties: (properties: Record<string, any>) => void;
  identifyUser: (userId: string, properties?: Record<string, any>) => void;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}): UseAnalyticsReturn => {
  const {
    enableConsoleLogging = process.env.NODE_ENV === 'development',
    enableGoogleAnalytics = true,
    enableFacebookPixel = false,
    enableCustomTracking = false,
    customTrackingEndpoint = '/api/analytics'
  } = options;

  const sessionStartTime = useRef<number>(Date.now());
  const pageViewStartTime = useRef<number>(Date.now());

  // Initialize analytics services
  useEffect(() => {
    // Initialize Google Analytics
    if (enableGoogleAnalytics && typeof window !== 'undefined') {
      // Check if gtag is available
      if (typeof window.gtag === 'function') {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID', {
          page_title: document.title,
          page_location: window.location.href
        });
      }
    }

    // Initialize Facebook Pixel
    if (enableFacebookPixel && typeof window !== 'undefined') {
      // Check if fbq is available
      if (typeof window.fbq === 'function') {
        window.fbq('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'FACEBOOK_PIXEL_ID');
        window.fbq('track', 'PageView');
      }
    }
  }, [enableGoogleAnalytics, enableFacebookPixel]);

  const sendToGoogleAnalytics = useCallback((event: any) => {
    if (enableGoogleAnalytics && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }
  }, [enableGoogleAnalytics]);

  const sendToFacebookPixel = useCallback((event: any) => {
    if (enableFacebookPixel && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', event.event, {
        content_category: event.category,
        content_name: event.label,
        value: event.value,
        currency: 'EUR'
      });
    }
  }, [enableFacebookPixel]);

  const sendToCustomEndpoint = useCallback(async (event: any) => {
    if (!enableCustomTracking) return;

    try {
      await fetch(customTrackingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          session_id: sessionStorage.getItem('analytics_session_id') || 'anonymous',
          user_agent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }, [enableCustomTracking, customTrackingEndpoint]);

  const logToConsole = useCallback((event: any) => {
    if (enableConsoleLogging) {
      console.group('📊 Analytics Event');
      console.log('Event:', event.event || event.action);
      console.log('Category:', event.category);
      console.log('Data:', event);
      console.groupEnd();
    }
  }, [enableConsoleLogging]);

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    logToConsole(event);
    sendToGoogleAnalytics(event);
    sendToFacebookPixel(event);
    sendToCustomEndpoint(event);
  }, [logToConsole, sendToGoogleAnalytics, sendToFacebookPixel, sendToCustomEndpoint]);

  const trackEcommerce = useCallback((event: EcommerceEvent) => {
    logToConsole(event);

    // Google Analytics Enhanced Ecommerce
    if (enableGoogleAnalytics && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event.event, {
        currency: event.currency,
        value: event.value,
        items: event.items,
        transaction_id: event.transaction_id
      });
    }

    // Facebook Pixel
    if (enableFacebookPixel && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      const fbEvent = event.event === 'add_to_cart' ? 'AddToCart' :
                     event.event === 'purchase' ? 'Purchase' :
                     event.event === 'view_item' ? 'ViewContent' :
                     event.event === 'begin_checkout' ? 'InitiateCheckout' :
                     event.event === 'add_to_wishlist' ? 'AddToWishlist' : 'CustomEvent';

      window.fbq('track', fbEvent, {
        value: event.value,
        currency: event.currency,
        contents: event.items.map(item => ({
          id: item.item_id,
          quantity: item.quantity,
          item_price: item.price
        }))
      });
    }

    sendToCustomEndpoint(event);
  }, [logToConsole, enableGoogleAnalytics, enableFacebookPixel, sendToCustomEndpoint]);

  const trackUser = useCallback((event: UserEvent) => {
    logToConsole(event);

    // Google Analytics
    if (enableGoogleAnalytics && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event.event, {
        user_id: event.user_id,
        search_term: event.search_term,
        content_type: event.content_type,
        content_id: event.content_id,
        method: event.method
      });
    }

    // Facebook Pixel
    if (enableFacebookPixel && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      const fbEvent = event.event === 'search' ? 'Search' :
                     event.event === 'login' ? 'Login' :
                     event.event === 'sign_up' ? 'CompleteRegistration' :
                     event.event === 'share' ? 'Share' : 'CustomEvent';

      window.fbq('track', fbEvent, {
        search_string: event.search_term,
        content_type: event.content_type,
        content_id: event.content_id
      });
    }

    sendToCustomEndpoint(event);
  }, [logToConsole, enableGoogleAnalytics, enableFacebookPixel, sendToCustomEndpoint]);

  const trackPageView = useCallback((page: string, title?: string) => {
    const event = {
      event: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: page,
      custom_parameters: {
        page_title: title || document.title,
        page_location: window.location.href,
        time_on_previous_page: Date.now() - pageViewStartTime.current
      }
    };

    pageViewStartTime.current = Date.now();
    trackEvent(event);
  }, [trackEvent]);

  const trackConversion = useCallback((conversionType: string, value?: number) => {
    const event = {
      event: 'conversion',
      category: 'conversion',
      action: conversionType,
      value: value,
      custom_parameters: {
        conversion_type: conversionType,
        session_duration: Date.now() - sessionStartTime.current
      }
    };

    trackEvent(event);
  }, [trackEvent]);

  const trackError = useCallback((error: string, context?: string) => {
    const event = {
      event: 'exception',
      category: 'error',
      action: 'error_occurred',
      label: error,
      custom_parameters: {
        error_message: error,
        error_context: context,
        url: window.location.href,
        user_agent: navigator.userAgent
      }
    };

    trackEvent(event);
  }, [trackEvent]);

  const trackPerformance = useCallback((metric: string, value: number, unit?: string) => {
    const event = {
      event: 'timing_complete',
      category: 'performance',
      action: metric,
      value: Math.round(value),
      custom_parameters: {
        metric_name: metric,
        metric_value: value,
        metric_unit: unit || 'ms'
      }
    };

    trackEvent(event);
  }, [trackEvent]);

  const setUserProperties = useCallback((properties: Record<string, any>) => {
    if (enableGoogleAnalytics && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID', {
        custom_map: properties
      });
    }

    if (enableCustomTracking) {
      sendToCustomEndpoint({
        event: 'set_user_properties',
        category: 'user',
        action: 'set_properties',
        custom_parameters: properties
      });
    }

    logToConsole({ event: 'set_user_properties', properties });
  }, [enableGoogleAnalytics, enableCustomTracking, sendToCustomEndpoint, logToConsole]);

  const identifyUser = useCallback((userId: string, properties?: Record<string, any>) => {
    if (enableGoogleAnalytics && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID', {
        user_id: userId
      });
    }

    if (properties) {
      setUserProperties(properties);
    }

    const event = {
      event: 'identify_user',
      category: 'user',
      action: 'identify',
      label: userId,
      custom_parameters: {
        user_id: userId,
        ...properties
      }
    };

    trackEvent(event);
  }, [enableGoogleAnalytics, setUserProperties, trackEvent]);

  return {
    trackEvent,
    trackEcommerce,
    trackUser,
    trackPageView,
    trackConversion,
    trackError,
    trackPerformance,
    setUserProperties,
    identifyUser
  };
};

// Global type declarations for analytics services
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}