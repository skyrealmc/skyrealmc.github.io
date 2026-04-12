/**
 * Sky Realms SMP - WidgetBot Integration
 * Loads the Discord floating chat widget across the site.
 */
(function initWidgetBot() {
    const WIDGETBOT_SCRIPT_ID = 'widgetbot-crate-script';
    const WIDGETBOT_SERVER_ID = '1378690510801342524';
    const WIDGETBOT_CHANNEL_ID = '1398776842680406147';

    function createWidget() {
        if (typeof window.Crate !== 'function') return;
        if (window.__skyRealmsWidgetBotInitialized) return;

        window.__skyRealmsWidgetBotInitialized = true;
        new window.Crate({
            server: WIDGETBOT_SERVER_ID,
            channel: WIDGETBOT_CHANNEL_ID
        });
    }

    function loadWidgetScript() {
        const existingScript = document.getElementById(WIDGETBOT_SCRIPT_ID);
        if (existingScript) {
            if (typeof window.Crate === 'function') {
                createWidget();
            } else {
                existingScript.addEventListener('load', createWidget, { once: true });
            }
            return;
        }

        const script = document.createElement('script');
        script.id = WIDGETBOT_SCRIPT_ID;
        script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3';
        script.async = true;
        script.defer = true;
        script.addEventListener('load', createWidget, { once: true });
        document.head.appendChild(script);
    }

    function scheduleWidgetLoad() {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadWidgetScript, { timeout: 3000 });
            return;
        }
        window.setTimeout(loadWidgetScript, 1200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleWidgetLoad, { once: true });
        return;
    }

    scheduleWidgetLoad();
})();
