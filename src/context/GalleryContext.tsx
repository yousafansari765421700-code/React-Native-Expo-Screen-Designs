
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { images as initialImages } from "../constants/images";

export type GalleryImage = {
  id: string;
  title: string;
  description: string;
  url: string;
  isCustom?: boolean;
};

type GalleryContextType = {
  images: GalleryImage[];
  ready: boolean;
  addImages: (uris: string[]) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
};

const GalleryContext = createContext<GalleryContextType | undefined>(
  undefined
);

const STORAGE_KEY = "mygallery_custom_images";

export function GalleryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customImages, setCustomImages] = useState<GalleryImage[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadImages() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved) as GalleryImage[];
          setCustomImages(parsed);
        }
      } catch (error) {
        console.log("Gallery load error:", error);
      } finally {
        setReady(true);
      }
    }

    loadImages();
  }, []);

  async function addImages(uris: string[]) {
    const directory = FileSystem.documentDirectory;

    if (!directory) {
      throw new Error("App storage is unavailable.");
    }

    const newImages: GalleryImage[] = [];

    for (const uri of uris) {
      const extension = uri.split(".").pop()?.split("?")[0] || "jpg";
      const safeExtension = /^[a-zA-Z0-9]+$/.test(extension)
        ? extension
        : "jpg";
      const id = `custom-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const destination = `${directory}${id}.${safeExtension}`;

      await FileSystem.copyAsync({
        from: uri,
        to: destination,
      });

      newImages.push({
        id,
        title: `My Photo ${customImages.length + newImages.length + 1}`,
        description: "Added to MyGallery",
        url: destination,
        isCustom: true,
      });
    }

    const updated = [...customImages, ...newImages];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCustomImages(updated);
  }

  async function deleteImage(id: string) {
    const image = customImages.find((item) => item.id === id);
    const updated = customImages.filter((item) => item.id !== id);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCustomImages(updated);

    if (image?.url.startsWith(FileSystem.documentDirectory ?? "\0")) {
      try {
        await FileSystem.deleteAsync(image.url, { idempotent: true });
      } catch (error) {
        console.log("Image file delete error:", error);
      }
    }
  }

  return (
    <GalleryContext.Provider
      value={{
        images: [...initialImages, ...customImages],
        ready,
        addImages,
        deleteImage,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);

  if (!context) {
    throw new Error("useGallery must be used inside GalleryProvider");
  }

  return context;
}
