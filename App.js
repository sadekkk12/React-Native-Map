import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { database } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function App() {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  const mapView = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Foreground location access is required.");
        return;
      }

      let backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== "granted") {
        alert("Background location access is required.");
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          distanceInterval: 100,
          accuracy: Location.Accuracy.High,
        },
        (location) => {
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setRegion(newRegion);
          if (mapView.current) {
            mapView.current.animateToRegion(newRegion);
          }
        }
      );
    }
    startListening();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  async function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
    const newMarker = {
      coordinate: { latitude, longitude },
      key: `${latitude}-${longitude}-${Date.now()}`,
    };
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    try {
      await addDoc(collection(database, "markers"), { latitude, longitude });
    } catch (error) {
      console.log("Error adding to Firebase: " + error);
    }
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapView} style={styles.map} region={region} onLongPress={addMarker}>
        {markers.map((marker) => (
          <Marker coordinate={marker.coordinate} key={marker.key} />
        ))}
      </MapView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
