import React, { FC } from "react";
import {
  TouchableHighlight,
  View,
  Text,
  Animated,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";
import Colors from "../../constants/Colors";

interface ButtonCryptoProps {
  title: string;
  onPress?: () => void;
}

const animatedValue = new Animated.Value(1);

const onPressIn = () => {
  Animated.spring(animatedValue, {
    toValue: 0.9,
    useNativeDriver: true,
  }).start();
};

const onPressOut = () => {
  Animated.spring(animatedValue, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
};

const animatedStyle = {
  transform: [
    {
      scale: animatedValue,
    },
  ],
};

const ButtonCrypto: FC<ButtonCryptoProps> = ({ title, onPress }) => {
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableHighlight
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{ borderRadius: 12 }}
        onPress={() => {
          // Agregamos el háptico y ejecutamos onPress si existe
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (onPress) {
            onPress();
          }
        }}
      >
        <View style={styles.button}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableHighlight>
    </Animated.View>
  );
};

export default ButtonCrypto;

const styles = StyleSheet.create({
  container: {
    width: "85%",
    borderRadius: 8,
  },
  button: {
    width: "100%",
    height: 57,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.ctBlue,
    borderRadius: 12,
  },
  text: {
    color: Colors.ctWhite,
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
