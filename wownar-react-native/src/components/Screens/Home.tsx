import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Layout from "../Layout";
import { useApp } from "../../Context/AppContext";

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { displayName, pfp } = useApp();

  const handleCastPress = () => {
    console.log(inputValue);
  };

  return displayName && pfp ? (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.greeting}>
          Hello <Text style={styles.username}>{displayName}... 👋</Text>
        </Text>
        <View style={styles.inputContainer}>
          <Image
            source={{
              uri: pfp,
            }}
            style={styles.avatar}
          />
          <TextInput
            style={styles.input}
            placeholder="Say Something"
            value={inputValue}
            onChangeText={setInputValue}
            placeholderTextColor="#b8b8b8ff"
            multiline={true}
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={styles.castButton} onPress={handleCastPress}>
          <Text style={styles.castButtonText}>Cast</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  ) : (
    <View style={styles.loadingContainer}>
      <Text style={styles.greeting}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 30,
    color: "white",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    paddingTop: 10,
  },
  castButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 1,
  },
  castButtonText: {
    color: "white",
    fontSize: 16,
  },
  username: {
    fontWeight: "500",
    fontSize: 30,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default Home;
