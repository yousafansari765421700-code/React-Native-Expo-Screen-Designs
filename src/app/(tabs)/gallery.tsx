
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useGallery } from "../../context/GalleryContext";
import { useFavorites } from "../../context/FavoritesContext";

export default function GalleryScreen() {
  const router = useRouter();
  const { images, ready, addImages, deleteImage } = useGallery();
  const { favorites, toggleFavorite } = useFavorites();
  const [adding, setAdding] = useState(false);

  async function pickImages() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required", "Please allow photo access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 0,
        quality: 0.8,
      });

      if (result.canceled || !result.assets.length) return;

      setAdding(true);
      await addImages(result.assets.map((asset) => asset.uri));

      Alert.alert("Success", "Your photos have been added to MyGallery.");
    } catch (error) {
      console.log("Add images error:", error);
      Alert.alert("Error", "Photos add nahi ho sakin. Dobara try karein.");
    } finally {
      setAdding(false);
    }
  }

  function confirmDelete(id: string) {
    Alert.alert("Delete photo?", "This will remove your added photo.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteImage(id).catch(() =>
            Alert.alert("Error", "Photo delete nahi ho saki.")
          );
        },
      },
    ]);
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading your gallery...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Gallery</Text>

      <Pressable
        style={styles.addButton}
        onPress={pickImages}
        disabled={adding}
      >
        <Text style={styles.addButtonText}>
          {adding ? "Adding photos..." : "＋ Add Multiple Photos"}
        </Text>
      </Pressable>

      {adding && <ActivityIndicator style={styles.loader} />}

      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text>No photos yet. Add your first photo!</Text>
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
              <Text style={styles.photoTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </Pressable>

            <View style={styles.actions}>
              <Pressable onPress={() => toggleFavorite(item.id)}>
                <Text style={styles.actionText}>
                  {favorites.includes(item.id) ? "❤️" : "🤍"}
                </Text>
              </Pressable>

              {item.isCustom && (
                <Pressable onPress={() => confirmDelete(item.id)}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              )}
            </View>
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
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#35205C",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    marginBottom: 12,
  },
  list: {
    paddingBottom: 30,
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
    maxWidth: "50%",
  },
  photo: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#E9DDFB",
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  actionText: {
    fontSize: 22,
  },
  deleteText: {
    fontSize: 20,
  },
});
