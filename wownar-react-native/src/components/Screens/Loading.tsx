import { StyleSheet, View, Text } from "react-native";

const Loading: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "white",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default Loading;
