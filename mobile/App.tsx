import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";

// Render the existing responsive app inside the native shell. One interface
// means the web and mobile versions always retain the same design and features.
const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_URL || process.env.EXPO_PUBLIC_API_URL;

export default function App() {
  if (!WEB_APP_URL || WEB_APP_URL.includes("YOUR_COMPUTER_IP")) {
    return <SafeAreaView style={styles.error}>
      <StatusBar style="dark" />
      <Text style={styles.title}>웹 주소를 설정해 주세요</Text>
      <Text style={styles.message}>mobile/.env 파일에 EXPO_PUBLIC_WEB_URL=http://컴퓨터내부IP:3000 을 입력한 뒤 Expo를 다시 시작해 주세요.</Text>
    </SafeAreaView>;
  }

  return <SafeAreaView style={styles.app}>
    <StatusBar style="dark" />
    <WebView
      source={{ uri: WEB_APP_URL }}
      style={styles.webview}
      startInLoadingState
      javaScriptEnabled
      domStorageEnabled
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      allowsFullscreenVideo
      mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
      onPermissionRequest={(event: any) => event.nativeEvent.grant(event.nativeEvent.resources)}
      renderLoading={() => <View style={styles.loading}><ActivityIndicator size="large" color="#2563EB" /></View>}
      renderError={() => <View style={styles.error}><Text style={styles.title}>웹 앱에 연결할 수 없어요</Text><Text style={styles.message}>웹 서버가 실행 중인지와 휴대폰·컴퓨터가 같은 Wi-Fi에 연결되어 있는지 확인해 주세요.</Text></View>}
    />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: "#F8FAFC" },
  webview: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" },
  error: { flex: 1, padding: 28, justifyContent: "center", backgroundColor: "#F8FAFC", gap: 12 },
  title: { fontSize: 23, fontWeight: "800", color: "#1E3A8A" },
  message: { fontSize: 16, lineHeight: 25, color: "#475569" },
});
