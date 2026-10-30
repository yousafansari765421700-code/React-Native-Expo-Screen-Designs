
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { images } from "../../constants/images";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>💜 MyGallery</Text>
      <Text style={styles.subtitle}>Save your favorite moments.</Text>

      {images.slice(0, 2).map((item) => (
        <Pressable
          key={item.id}
          style={styles.card}
          onPress={() =>
            router.push({ pathname: "/image/[id]", params: { id: item.id } })
          }
        >
          <Image source={{ uri: item.url }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.button} onPress={() => router.push("/gallery")}>
        <Text style={styles.buttonText}>Explore Gallery →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7F5FF" },
  content: { padding: 20, paddingTop: 55, paddingBottom: 30 },
  heading: { fontSize: 30, fontWeight: "bold", color: "#7047EB" },
  subtitle: { fontSize: 15, color: "#777", marginTop: 8, marginBottom: 18 },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    marginBottom: 18,
  },
  image: { width: "100%", height: 175, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: "bold", marginTop: 10, color: "#292344" },
  description: { fontSize: 13, color: "#777", marginTop: 5, marginBottom: 5 },
  button: {
    backgroundColor: "#7047EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 3,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
