import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Image,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";

interface RouteParams {
  params: {
    coin: {
      id: string;
      symbol: string;
      name: string;
      image: string;
      current_price: number;
      market_cap: number;
      market_cap_rank: number;
      fully_diluted_valuation: number;
      total_volume: number;
      high_24h: number;
      low_24h: number;
      price_change_24h: number;
      price_change_percentage_24h: number;
      market_cap_change_24h: number;
      market_cap_change_percentage_24h: number;
      circulating_supply: number;
      total_supply: number;
      max_supply: number;
      ath: number;
      ath_change_percentage: number;
      ath_date: string;
      atl: number;
      atl_change_percentage: number;
      atl_date: string;
      roi: null;
      last_updated: string;
    };
  };
}

const GraphCoin = ({ route }: { route: RouteParams }) => {
  const defaultCoin = {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image:
      "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    current_price: 100622,
    market_cap: 1989025275875,
    market_cap_rank: 1,
    fully_diluted_valuation: 2109755747110,
    total_volume: 105058143123,
    high_24h: 104893,
    low_24h: 98840,
    price_change_24h: -3701.546573766507,
    price_change_percentage_24h: -3.54814,
    market_cap_change_24h: -78727993288.62231,
    market_cap_change_percentage_24h: -3.80742,
    circulating_supply: 19798278.0,
    total_supply: 21000000.0,
    max_supply: 21000000.0,
    ath: 108135,
    ath_change_percentage: -7.11347,
    ath_date: "2024-12-17T15:02:41.429Z",
    atl: 67.81,
    atl_change_percentage: 148025.71958,
    atl_date: "2013-07-06T00:00:00.000Z",
    roi: null,
    last_updated: "2024-12-19T16:02:21.609Z",
  };
  const { coin } = route.params || defaultCoin;
  const [granularity, setGranularity] = useState("h1"); // Estado para el zoom
  const [timer, setTimer] = useState("");
  const [historyList, setHistoryList] = useState([]); // Estado local para los datos históricos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [coinList, setCoinList] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`
        );
        const data = await response.json();
        setCoinList(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    fetchCoins();
  }, []);
  // Fetch de datos según la granularidad
  const fetchPriceByTime = async (coinId: string, granularity: string) => {
    try {
      setLoading(true);
      const normalizeId = coinId.toLowerCase();

      const response = await fetch(
        `https://api.coincap.io/v2/assets/${coinId.toLowerCase()}/history?interval=${granularity}`
      );
      const data = await response.json();

      setHistoryList(data.data || []);
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching price history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Llamada inicial y cada vez que cambia la granularidad
  useEffect(() => {
    fetchPriceByTime(coin?.name, granularity);
  }, [granularity]);

  // Actualización automática cada 150 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPriceByTime(coin.id, granularity);
    }, 150000);
    return () => clearInterval(interval);
  }, [granularity]);

  // Cuenta regresiva del temporizador
  useEffect(() => {
    const date = moment().add(150000, "milliseconds").toDate().getTime();
    const timerInterval = setInterval(() => {
      setTimer(getDiff(date));
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Calcula el tiempo restante
  const getDiff = (date) => {
    const now = new Date().getTime();
    const distance = date - now;
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Cambia la granularidad del gráfico
  const changeGranularity = (value) => {
    setGranularity(value);
  };

  const getCoinImageURL = (coinId) => {
    coinList.forEach((coin) => {
      if (coin?.id === coinId) {
        return coin?.image;
      }
    });
    return null;
  };

  const getInterval = () => {
    const minValue = historyList.reduce(
      (min, p) => (p.date < min ? p.date : min),
      historyList[0].date
    );
    const maxValue = historyList.reduce(
      (max, p) => (p.date > max ? p.date : max),
      historyList[0].date
    );
    return `${minValue} - ${maxValue}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: getCoinImageURL(coin) }} />
        <Text style={styles.timer}>{`Update in: ${timer || "..."}`}</Text>
      </View>

      <View style={styles.zoomControls}>
        {["h1", "d1", "w1", "m1"].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.zoomButton,
              granularity === value && styles.activeZoomButton,
            ]}
            onPress={() => changeGranularity(value)}
          >
            <Text style={styles.zoomButtonText}>{value.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size={"large"} color={"#008080"} />
      ) : historyList.length > 0 ? (
        <>
          <LineChart
            data={{
              labels: historyList.map((item: any) =>
                moment(parseFloat(item.priceUsd) * 1000).format("HH:mm")
              ),
              datasets: [
                {
                  data: historyList.map((item) => parseFloat(item?.priceUsd)),
                },
              ],
            }}
            width={Dimensions.get("window").width}
            height={400}
            yAxisLabel={"$"}
            withInnerLines={false}
            withOuterLines={false}
            hideLegend={false}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
          <Text style={styles.timer}>{getInterval()}</Text>
        </>
      ) : (
        <Text style={styles.errorText}>No data available</Text>
      )}
    </View>
  );
};

export default GraphCoin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  timer: {
    fontSize: 16,
    color: "#333",
  },
  zoomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  zoomButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  activeZoomButton: {
    backgroundColor: "#007BFF",
  },
  zoomButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  chart: {
    borderRadius: 10,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "#FF0000",
  },
});
