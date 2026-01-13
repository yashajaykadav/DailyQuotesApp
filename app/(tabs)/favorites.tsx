import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react'; // Added useCallback
import { supabase } from '../../libs/supabase';
import QuoteCard, { Quote } from '../../components/QuoteCard';
import { useFocusEffect } from 'expo-router'; // 1. Auto-refresh on tab switch

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          quote:quotes (*) 
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform: Extract the nested 'quote' object
      const formattedQuotes = data.map((item: any) => ({
        ...item.quote,
        is_favorite: true 
      }));

      setFavorites(formattedQuotes);
    } catch (error) {
      console.log('Error fetching favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 2. Auto-fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

 const handleRemoveFavorite = async (quoteId: string) => {
    // 1. Optimistically update UI (Remove it immediately so it feels fast)
    setFavorites((prev) => prev.filter((q) => q.id !== quoteId));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Actually delete from Database
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('quote_id', quoteId);

      if (error) {
        throw error;
      }

    } catch (error) {
      console.log('Error removing favorite:', error);
      // Optional: If it fails, add it back to the list or show an alert
      alert("Failed to remove favorite. Please check your internet.");
      fetchFavorites(); // Re-fetch to sync data
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FFD700" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Collection</Text>
      
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <QuoteCard 
            quote={item} 
            isLiked={true} 
            // Pass a callback to remove it visually if user unlikes it here
            onToggleLike={() => handleRemoveFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No favorites yet.</Text>
            <Text style={styles.subEmptyText}>Go to the Daily or Browse tabs to add some!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 28,
    color: "#FFD700",
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  subEmptyText: {
    color: "#888",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});