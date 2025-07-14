'use client'

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props) => {
    const scannerRef = useRef(null);
    const isInitializedRef = useRef(false);
    const elementIdRef = useRef(`html5qr-code-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        // Prevent double initialization in the same component instance
        if (isInitializedRef.current) {
            return;
        }

        const elementId = elementIdRef.current;
        const config = createConfig(props);
        const verbose = props.verbose === true;
        
        // Success callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }

        // Small delay to ensure DOM element is ready
        const initScanner = () => {
            try {
                const element = document.getElementById(elementId);
                if (!element) {
                    console.error("QR scanner element not found");
                    return;
                }

                const html5QrcodeScanner = new Html5QrcodeScanner(elementId, config, verbose);
                scannerRef.current = html5QrcodeScanner;
                isInitializedRef.current = true;
                
                html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
            } catch (error) {
                console.error("Failed to initialize QR scanner:", error);
                isInitializedRef.current = false;
            }
        };

        // Initialize scanner after a short delay to ensure DOM is ready
        const timer = setTimeout(initScanner, 100);

        // cleanup function when component will unmount
        return () => {
            clearTimeout(timer);
            if (scannerRef.current && isInitializedRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                }).finally(() => {
                    scannerRef.current = null;
                    isInitializedRef.current = false;
                });
            }
        };
    }, [props.qrCodeSuccessCallback, props.qrCodeErrorCallback]);

    return (
        <div id={elementIdRef.current} style={{ width: '100%' }} />
    );
};

export default Html5QrcodePlugin;