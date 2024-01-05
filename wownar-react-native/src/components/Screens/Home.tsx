import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const handleCastPress = () => {
    console.log(inputValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello Shreyas...👋</Text>
      <View style={styles.inputContainer}>
        <Image
          source={{
            uri: "https://demo.neynar.com/_next/image?url=https%3A%2F%2Fi.imgur.com%2FLPzRlQl.jpg&w=96&q=75",
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
    fontSize: 24,
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
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  castButtonText: {
    color: "black",
    fontSize: 16,
  },
});

export default Home;
