import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import Sidebar from '../../src/components/ui/Sidebar';
import { COLORS, SIZES } from '../../src/constants/colors';
import { supabase } from '../../supabase/client';

// Data now fetched from Supabase favorite_locations table

export default function FavouriteScreen() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [favourites, setFavourites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchFavourites();
    }, []);

    const fetchFavourites = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('favorite_locations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setFavourites(data);
            }
        } catch (error) {
            console.error('Error fetching favourites:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper
            style={styles.container}
            showHeader
            title="Favourite"
            showMenu
            onMenuPress={() => setIsSidebarOpen(true)}
        >
            <FlatList
                data={favourites}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemCard}>
                        <View style={styles.leftContent}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="location" size={20} color={COLORS.primaryDark} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.typeName}>{item.name}</Text>
                                <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="heart" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View style={{ alignItems: 'center', marginTop: 100 }}>
                            <Ionicons name="heart-dislike-outline" size={60} color="#E5E7EB" />
                            <Text style={{ color: '#9CA3AF', marginTop: 10 }}>No favorites yet</Text>
                        </View>
                    ) : null
                }
            />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 20,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        flex: 1,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    typeName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    address: {
        fontSize: 13,
        color: '#9CA3AF',
    },
});
