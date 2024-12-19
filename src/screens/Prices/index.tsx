import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_24h: string;
}

const CryptoListScreen = ({ navigation }: { navigation: any }) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<Crypto[]>([]);
  const [minChange, setMinChange] = useState<string>("");
  const [isOffline, setIsOffline] = useState(false);
  const COIN_LORE_API =
    "https://api.coinlore.net/api/tickers/?start=0&limit=50";

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const cachedData = await AsyncStorage.getItem("cryptos");
        if (cachedData) {
          setCryptos(JSON.parse(cachedData));
          setFilteredCryptos(JSON.parse(cachedData));
        } else {
          const response = await fetch(COIN_LORE_API);
          const data = await response.json();
          setCryptos(data.data);
          setFilteredCryptos(data.data);
          await AsyncStorage.setItem("cryptos", JSON.stringify(data.data));
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch cryptocurrencies.");
      }
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    fetchCryptos();

    return () => {
      unsubscribe();
    };
  }, []);

  const filterCryptos = () => {
    if (minChange === "") {
      setFilteredCryptos(cryptos);
      return;
    }

    const minChangeValue = parseFloat(minChange);
    if (isNaN(minChangeValue)) {
      Alert.alert("Invalid Input", "Please enter a valid number.");
      return;
    }

    const filtered = cryptos.filter(
      (crypto) => parseFloat(crypto.percent_change_24h) >= minChangeValue
    );
    setFilteredCryptos(filtered);
  };

  const renderItem = ({ item }: { item: Crypto }) => (
    <TouchableOpacity
      style={styles.cryptoItem}
      disabled={isOffline}
      onPress={() =>
        navigation.navigate("Actions", { coin: item, name: item.name })
      }
    >
      <Text style={styles.cryptoName}>
        {item.name} ({item.symbol})
      </Text>
      <Text style={styles.cryptoPrice}>${item.price_usd}</Text>
      <Text
        style={
          parseFloat(item.percent_change_24h) < 0
            ? styles.cryptoChangeNegative
            : styles.cryptoChange
        }
      >
        {item.percent_change_24h}% (24h)
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.overlay}>
          <Text style={styles.offlineText}>
            You are offline. Actions are limited.
          </Text>
        </View>
      )}

      <Text style={styles.welcomeText}>Welcome, User!</Text>
      <TextInput
        style={styles.input}
        placeholder="Minimum 24-hr % Change"
        value={minChange}
        onChangeText={setMinChange}
        keyboardType="numeric"
      />
      <Button title="Filter" onPress={filterCryptos} />

      <FlatList
        data={filteredCryptos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  cryptoItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cryptoPrice: {
    fontSize: 14,
  },
  cryptoChange: {
    fontSize: 12,
    color: "green",
  },
  cryptoChangeNegative: {
    fontSize: 12,
    color: "red",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    zIndex: 1,
  },
  offlineText: {
    color: "#fff",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default CryptoListScreen;
