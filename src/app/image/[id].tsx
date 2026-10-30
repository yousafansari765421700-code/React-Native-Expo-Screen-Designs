
import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGallery } from "../../context/GalleryContext";
import { useFavorites } from "../../context/FavoritesContext";

export default function ImageDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { images, ready } = useGallery();
  const { favorites, toggleFavorite } = useFavorites();

  const photo = images.find((image) => image.id === id);
  const isFavorite = photo ? favorites.includes(photo.id) : false;

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>Loading photo...</Text>
      </View>
    );
  }

  if (!photo) {
    return (
      <View style={styles.center}>
        <Text>Photo not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: photo.url }} style={styles.photo} />
      <Text style={styles.title}>{photo.title}</Text>
      <Text style={styles.description}>{photo.description}</Text>

      <Pressable
        style={styles.button}
        onPress={() => toggleFavorite(photo.id)}
      >
        <Text style={styles.buttonText}>
          {isFavorite ? "❤️ Remove Favorite" : "🤍 Add Favorite"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F5FF",
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: 350,
    borderRadius: 16,
    backgroundColor: "#E9DDFB",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#35205C",
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#8B5CF6",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
