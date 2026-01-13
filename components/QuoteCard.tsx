import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export type Quote = {
  id: string; 
  content: string;
  author: string;
  category: string;
  is_favorite?: boolean; 
};

type Props = {
  quote: Quote;
  onToggleLike?: () => void; // Renamed to match FavoritesScreen
  isLiked?: boolean;
};

export default function QuoteCard({ quote, onToggleLike, isLiked = false }: Props) {
  const viewRef = useRef<ViewShot>(null);

  const shareImage = async () => {
    try {
      if (viewRef.current && viewRef.current.capture) {
        const uri = await viewRef.current.capture();

        if (Platform.OS === 'web') {
          Alert.alert("Not supported on web");
          return;
        }

        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.log("Snapshot failed", error);
      Alert.alert("Error", "Could not share image.");
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* 1. ViewShot wraps ONLY the text. 
           We kept the background color here so the image isn't transparent.
      */}
      <ViewShot 
        ref={viewRef} 
        options={{ format: "png", quality: 1.0 }} 
        style={{ backgroundColor: '#1E1E1E' }}
      >
        <View style={styles.cardContent} collapsable={false}>
          <View style={styles.badgeContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{quote.category}</Text>
            </View>
          </View>
          
          <Text style={styles.content}>"{quote.content}"</Text>
          <Text style={styles.author}>— {quote.author}</Text>
        </View>
      </ViewShot>

      {/* 2. Buttons are OUTSIDE ViewShot so they don't appear in the photo */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={shareImage} style={styles.iconBtn}>
          <Ionicons name="share-social-outline" size={22} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onToggleLike} style={styles.iconBtn}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? "#FF4444" : "#888"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden', 
  },
  cardContent: {
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  badgeContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    color: '#FFF',
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 26,
    marginBottom: 16,
  },
  author: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 20, 
    borderTopWidth: 1,
    borderTopColor: '#252525',
    paddingTop: 12,
  },
  iconBtn: {
    padding: 4,
  },
});