import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../libs/supabase';
import QuoteCard, { Quote } from '../../components/QuoteCard';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ["All", "Motivation", "Love", "Success", "Wisdom", "Humor"];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  // Search Logic
  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      let query = supabase.from('quotes').select('*');

      // 1. Filter by Category
      if (selectedCategory !== "All") {
        query = query.eq('category', selectedCategory);
      }

      // 2. Filter by Search Text (if exists)
      if (searchQuery.length > 0) {
        query = query.ilike('content', `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setQuotes(data || []);
      
    } catch (error) {
      console.log('Search Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when category or search text changes
  useEffect(() => {
    // Debounce could be added here, but simple effect works for now
    const timer = setTimeout(() => {
        fetchSearchResults();
    }, 500); // 500ms delay to stop flickering while typing

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput 
          placeholder="Search quotes..." 
          placeholderTextColor="#666"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <View>
        <FlatList 
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryChip, 
                selectedCategory === item && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results */}
      {loading ? (
        <View style={{ marginTop: 50 }}>
          <ActivityIndicator color="#FFD700" />
        </View>
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <QuoteCard quote={item} />}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No quotes found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60, // Safe Area top
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryChipActive: {
    backgroundColor: '#FFD700', // Gold
    borderColor: '#FFD700',
  },
  categoryText: {
    color: '#CCC',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000', // Black text on Gold
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  }
});