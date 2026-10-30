
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400";

const STORAGE_KEY = "mygallery_profile_image";

export default function ProfileScreen() {
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(true);

  // App open hone par saved profile image load karein
  useEffect(() => {
    async function loadProfileImage() {
      try {
        const savedImage = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.log("Image load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfileImage();
  }, []);

  // New image select aur permanently save karein
  async function changeProfileImage() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const selectedImage = result.assets[0].uri;
      const directory = FileSystem.documentDirectory;

      if (!directory) {
        Alert.alert("Error", "Could not access phone storage.");
        return;
      }

      const extension = selectedImage.split(".").pop()?.split("?")[0] || "jpg";
      const permanentUri =
        `${directory}profile-${Date.now()}.${extension}`;

      // Image ko app ke permanent document folder mein copy karein
      await FileSystem.copyAsync({
        from: selectedImage,
        to: permanentUri,
      });

      // Saved image ka path phone storage mein save karein
      await AsyncStorage.setItem(STORAGE_KEY, permanentUri);

      // Screen par new image show karein
      setProfileImage(permanentUri);

      Alert.alert("Success", "Your profile picture has been saved!");
    } catch (error) {
      console.log("Image save error:", error);
      Alert.alert("Error", "Image save nahi ho saki. Dobara try karein.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Image
          source={{ uri: profileImage }}
          style={styles.profileImage}
        />
      )}

      <Pressable
        style={styles.changeButton}
        onPress={changeProfileImage}
      >
        <Text style={styles.changeButtonText}>
          📷 Change Profile Picture
        </Text>
      </Pressable>

      <Text style={styles.name}>Sania</Text>
      <Text style={styles.subtitle}>Welcome to MyGallery!</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About MyGallery</Text>
        <Text style={styles.infoText}>
          Your personal space for beautiful pictures.
        </Text>
      </View>

      <Pressable
        style={styles.favoritesButton}
        onPress={() => router.push("/(tabs)/favorites")}
      >
        <Text style={styles.favoritesButtonText}>
          View My Favorites ❤️
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF",
    alignItems: "center",
    padding: 24,
    paddingTop: 55,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 28,
    color: "#35205C",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#8B5CF6",
    backgroundColor: "#E9DDFB",
  },
  changeButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 18,
  },
  changeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#35205C",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#777777",
    marginTop: 6,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#35205C",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  favoritesButton: {
    backgroundColor: "#35205C",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginTop: 25,
  },
  favoritesButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
