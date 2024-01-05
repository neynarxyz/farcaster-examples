import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type SignOutButtonProps = {
  onPress: () => void;
};

const SignOutButton: React.FC<SignOutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Sign Out</Text>
      <AntDesign name="logout" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  text: {
    color: "white",
    marginRight: 10,
    fontSize: 16,
  },
});

export default SignOutButton;
