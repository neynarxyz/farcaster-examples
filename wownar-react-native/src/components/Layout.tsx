import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Linking,
  StatusBar,
  Image,
} from "react-native";
import SignOutButton from "./SignoutButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleSignIn = () => {};

  const handleOpenGithub = () => {
    const githubRepoUrl = "https://www.google.com";
    Linking.openURL(githubRepoUrl);
  };

  const handleSignOut = () => {
    console.log("Sign out");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/wownar.png")}
            style={styles.logo}
          />
          <Text style={styles.headerText}>Wownar</Text>
        </View>
        <SignOutButton onPress={handleSignOut} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.connectText}>
          Connect Farcaster accounts for free using{" "}
          <Text style={styles.boldText} onPress={handleSignIn}>
            Sign in with Neynar
          </Text>
        </Text>
        <Text style={styles.githubText} onPress={handleOpenGithub}>
          Github Repo -&gt; <Text style={styles.boldText}>Wownar</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 48,
    marginRight: 10,
  },
  container: {
    flex: 1,
    // flexDirection: "column",
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "200",
    color: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    alignItems: "center",
    rowGap: 20,
  },
  connectText: {
    fontSize: 16,
    color: "#fff",
  },
  githubText: {
    fontSize: 16,
    color: "#fff",
  },
  boldText: {
    fontWeight: "700",
  },
});

export default Layout;
