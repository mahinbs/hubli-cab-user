import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HomeMapProps {
    // Add props as needed: region, markers, etc.
}

const HomeMap: React.FC<HomeMapProps> = () => {
    return (
        <View style={[styles.map, { backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#6B7280', fontSize: 16 }}>Map Placeholder (Missing API Key)</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});

export default HomeMap;
