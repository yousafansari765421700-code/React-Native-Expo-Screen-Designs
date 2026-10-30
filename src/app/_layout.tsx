
import React from "react";
import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";
import { GalleryProvider } from "../context/GalleryContext";

export default function RootLayout() {
  return (
    <GalleryProvider>
      <FavoritesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="image/[id]"
            options={{ title: "Photo Details" }}
          />
        </Stack>
      </FavoritesProvider>
    </GalleryProvider>
  );
}
