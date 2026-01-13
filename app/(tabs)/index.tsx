import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../libs/supabase';
import QuoteCard, { Quote } from '../../components/QuoteCard';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router'; // Keeps data fresh when switching tabs

export default function HomeScreen() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

const fetchQuotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      const { data: daily } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false }) 
        .limit(1)
        .maybeSingle();

      if (daily) setDailyQuote(daily);

      // 2. Feed: Fetch RANDOM quotes using the SQL function we created
      const { data: feedData, error } = await supabase
        .rpc('get_random_quotes'); // <--- This is the magic change

      if (error) throw error;

      // 3. Check "Is Favorite" status
      let quotesWithLikes = feedData || [];

      if (user) {
        const { data: favorites } = await supabase
          .from('favorites')
          .select('quote_id')
          .eq('user_id', user.id);

        const favoriteIds = new Set(favorites?.map(f => f.quote_id));

        quotesWithLikes = quotesWithLikes.map((q: Quote) => ({
          ...q,
          is_favorite: favoriteIds.has(q.id)
        }));
      }

      setQuotes(quotesWithLikes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh when screen loads
  useEffect(() => {
    fetchQuotes();
  }, []);

  // Auto-refresh when coming back from another tab (like Favorites)
  useFocusEffect(
    useCallback(() => {
      // Silent refresh (no loading spinner) to update likes
      if (!loading) fetchQuotes(); 
    }, [loading])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchQuotes();
  };

  // 2. Handle Like Toggle
  const toggleFavorite = async (quote: Quote) => {
    if (!userId) {
      alert("Please login to save quotes");
      return;
    }

    // A. Optimistic Update (Update UI immediately)
    const isCurrentlyLiked = quote.is_favorite;
    const updatedQuotes = quotes.map(q => 
      q.id === quote.id ? { ...q, is_favorite: !isCurrentlyLiked } : q
    );
    setQuotes(updatedQuotes);

    // B. Database Update
    try {
      if (isCurrentlyLiked) {
        // Remove
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('quote_id', quote.id);
      } else {
        // Add
        await supabase
          .from('favorites')
          .insert([{ user_id: userId, quote_id: quote.id }]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert if failed
      setQuotes(quotes); 
      alert("Failed to update favorite. Check connection.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.greeting}>Good Morning</Text>
      <Text style={styles.subGreeting}>Here is your daily inspiration</Text>

      {dailyQuote && (
        <View style={styles.dailyCard}>
          <View style={styles.dailyBadge}>
            <Ionicons name="sparkles" size={16} color="#000" />
            <Text style={styles.dailyBadgeText}>Quote of the Day</Text>
          </View>
          <Text style={styles.dailyContent}>"{dailyQuote.content}"</Text>
          <Text style={styles.dailyAuthor}>— {dailyQuote.author}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Latest Quotes</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <QuoteCard
            quote={item}
            isLiked={!!item.is_favorite}
            onToggleLike={() => toggleFavorite(item)}
          />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
          />
        }
      />
    </View>
  );
}
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//     paddingTop: 50,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#121212',
//   },
//   headerContainer: {
//     marginBottom: 20,
//   },
//   greeting: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   subGreeting: {
//     fontSize: 16,
//     color: '#888',
//     marginBottom: 24,
//   },
//   dailyCard: {
//     backgroundColor: '#FFD700',
//     borderRadius: 16,
//     padding: 24,
//     marginBottom: 32,
//   },
//   dailyBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     alignSelf: 'flex-start',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 16,
//     gap: 6,
//   },
//   dailyBadgeText: {
//     fontWeight: 'bold',
//     color: '#000',
//     fontSize: 12,
//     textTransform: 'uppercase',
//   },
//   dailyContent: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#121212',
//     lineHeight: 30,
//     marginBottom: 12,
//   },
//   dailyAuthor: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'right',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF',
//     marginBottom: 16,
//   },
//   listContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 60, // Space for status bar
  },
  headerContainer: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subGreeting: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
  },
  dailyCard: {
    backgroundColor: '#FFD700', // Gold Background
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  dailyBadgeText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 12,
  },
  dailyContent: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    lineHeight: 30,
  },
  dailyAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
});