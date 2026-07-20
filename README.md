<div align="center">
<img width="1200" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8f74625a-bf32-40a7-b642-78c03e0f7768

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run as a mobile app (React Native)

The `mobile` folder is an Expo React Native app. It uses the phone's native
camera/photo picker and text-to-speech, rather than browser APIs.

1. Start this project's AI server from the repository root: `npm run dev`
2. Copy `mobile/.env.example` to `mobile/.env`, and set `EXPO_PUBLIC_API_URL`
   to the LAN IP address of this computer (for example, `http://192.168.0.15:3000`).
3. In a second terminal: `cd mobile && npm install && npm start`
4. Install **Expo Go** on the phone, connect it to the same Wi-Fi network, and
   scan the QR code. Press `i` or `a` in the Expo terminal to launch an iOS or
   Android simulator instead.
