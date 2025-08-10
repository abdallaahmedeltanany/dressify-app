import AppColors from "@/constants/Colors";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  secureTextEntry: boolean;
  keyboardType?: any;
  error?: string;
  textContentType?: any;
}
const CustomInput: React.FC<CustomInputProps> = ({
  placeholder = "please enter text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  textContentType,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      {error ? (
        <Text style={{ color: "red", marginTop: 4 }}>{error}</Text>
      ) : null}

      <TextInput
        autoCapitalize="none"
        autoComplete="off"
        importantForAutofill="no"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#888"
        style={isFocused ? styles.focusedInput : styles.input}
        textContentType={textContentType}
      />
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  input: {
    borderColor: AppColors.text.tertiary,
    borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 8,
    padding: 5,
    fontSize: 16,
    backgroundColor: AppColors.gray[100],
    fontFamily: "Inter-Regular",
  },
  focusedInput: {
    borderColor: AppColors.primary[700],
    borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 8,
    padding: 5,
    fontSize: 16,
    backgroundColor: AppColors.gray[100],
    fontFamily: "Inter-Regular",
  },
  label: {
    fontSize: 18,
    fontFamily: "Inter-Regular",
    color: AppColors.text.primary,
    marginBottom: 5,
    marginLeft: 3,
  },
});
