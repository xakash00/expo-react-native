// RecaptchaWebView.js
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { WebView } from 'react-native-webview';

const SITE_KEY = '6LcPZkErAAAAAAiaGf2uQZ2STRXTm36cFihcIkSn'; // Replace with your actual site key

const RecaptchaWebView = forwardRef(({ onVerify }, ref) => {
  const webviewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    execute: (action = 'submit') => {
      webviewRef.current.injectJavaScript(`
        grecaptcha.execute('${SITE_KEY}', {action: '${action}'}).then(function(token) {
          window.ReactNativeWebView.postMessage(token);
        });
        true;
      `);
    }
  }));

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://www.google.com/recaptcha/api.js?render=${SITE_KEY}"></script>
        <script>
          window.onload = function () {
            document.body.style.backgroundColor = 'transparent';
          };
        </script>
      </head>
      <body>
        <h1>reCAPTCHA v3</h1>
      </body>
    </html>
  `;

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      onMessage={(event) => onVerify(event.nativeEvent.data)}
      javaScriptEnabled
      injectedJavaScriptBeforeContentLoaded={''}
      style={{ height: 0, width: 0 }} 
    />
  );
});

export default RecaptchaWebView;
