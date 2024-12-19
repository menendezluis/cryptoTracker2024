import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const News = () => {
    return (
        <View style={styles.screens}>
            <Text>News</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screens: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default News