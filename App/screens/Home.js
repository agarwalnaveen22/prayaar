import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, FlatList, ScrollView, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Header from '../components/Header';
import TempleBlock from '../components/TempleBlock';
import CONSTANTS from '../styles/constants';

const templeList1 = [
    {
        id: 1,
        image: require('../assets/image/Balaji.png'),
        name: "Balaji Temple",
        location: "Tirupathi"
    },
    {
        id: 2,
        image: require('../assets/image/Meenakshi.png'),
        name: "Meenakshi Temple",
        location: "Madurai"
    },
    {
        id: 3,
        image: require('../assets/image/Kukke.jpeg'),
        name: "Kukke Subramanya",
        location: "Kukke"
    }
]

const templeList2 = [
    {
        id: 1,
        image: require('../assets/image/Kedarnath.jpeg'),
        name: "Shri Kedarnath Temple (Shiva)",
        location: "Kedarnath"
    },
    {
        id: 2,
        image: require('../assets/image/badrinath.jpeg'),
        name: "Shri Badrinath (Vishnu)",
        location: "Nadrinath"
    },
    {
        id: 3,
        image: require('../assets/image/jagannatha.jpeg'),
        name: "Jagannath Temple",
        location: "Puri"
    }
]

export default Home = ({ navigation }) => {

    const [allTemples, setAllTemples] = useState(templeList2)
    const [search, setSearch] = useState(false)
    const [searchValue, setSearchValue] = useState("")

    const sectionHeader = (title = "") => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderTitle}>{title}</Text>
        </View>
    )

    const navigateToDetail = (item) => {
        navigation.navigate('Details', { "temple": item })
        setSearchValue("")
        setSearch(false)
        setAllTemples(templeList2)
    }

    const renderPopularItem = ({ item }) => (
        <TempleBlock
            temple={item}
            type={"fixed"}
            onPress={() => navigateToDetail(item)}
        />
    );

    const renderAllItem = ({ item }) => (
        <TempleBlock
            temple={item}
            type={"full"}
            onPress={() => navigateToDetail(item)}
        />
    );

    const onSearch = (text) => {
        if (text.length) {
            setSearchValue(text)
            setSearch(true)
            let data = [...templeList1, ...templeList2]
            data = data.filter(item => (item?.name?.toLowerCase()).includes(text.toLowerCase()))
            setAllTemples(data)
        } else {
            setSearchValue("")
            setSearch(false)
            setAllTemples(templeList2)
        }
    }

    const noDataFound = () => (
        <View style={{ alignItems: "center", flex: 1, marginTop: hp("5%") }}>
            <Image
                source={require('../assets/image/temple_no_image.png')}
                style={{
                    width: wp("50%"),
                    height: hp("20%")
                }}
            />
            <Text style={{ fontSize: wp("4.5%"), marginTop: hp("5%") }}>No Temple found</Text>
        </View>
    )

    return (
        <SafeAreaView style={styles.screenContainer}>
            <Header searchValue={searchValue} onSearch={onSearch} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    width: "90%",
                    alignSelf: "center"
                }}>
                {
                    !search && <>
                        {sectionHeader("Popular temples")}
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={templeList1}
                            renderItem={renderPopularItem}
                            keyExtractor={item => item.id}
                        />
                    </>
                }
                {sectionHeader("All temples")}
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={allTemples}
                    renderItem={renderAllItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={noDataFound()}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: CONSTANTS.COLOR_SCREEN_BACKGROUND
    },
    sectionHeaderContainer: {
        paddingVertical: hp("1.5%")
    },
    sectionHeaderTitle: {
        fontFamily: "GothamMedium",
        color: CONSTANTS.COLOR_DARK_GREY,
        fontWeight: "500",
        fontSize: wp("4.2%")
    }
})