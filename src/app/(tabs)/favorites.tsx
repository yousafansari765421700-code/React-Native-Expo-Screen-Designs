
import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useGallery } from "../../context/GalleryContext";
import { useFavorites } from "../../context/FavoritesContext";

export default function FavoritesScreen() {
  const router = useRouter();
  const { images, ready } = useGallery();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteImages = images.filter((image) =>
    favorites.includes(image.id)
  );

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Favorites ❤️</Text>

      <FlatList
        data={favoriteImages}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No favorites yet. Add photos to your favorites!
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/image/[id]",
                  params: { id: item.id },
                })
              }
            >
              <Image source={{ uri: item.url }} style={styles.photo} />
              <Text style={styles.photoTitle}>{item.title}</Text>
            </Pressable>

            <Pressable onPress={() => toggleFavorite(item.id)}>
              <Text style={styles.remove}>❤️ Remove Favorite</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF",
    padding: 16,
    paddingTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#35205C",
    marginBottom: 20,
  },
  empty: {
    marginTop: 20,
    color: "#666",
  },
  card: {
    flex: 1,
    maxWidth: "50%",
    margin: 5,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  photo: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  photoTitle: {
    fontWeight: "600",
    marginTop: 8,
  },
  remove: {
    color: "#8B5CF6",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
});
