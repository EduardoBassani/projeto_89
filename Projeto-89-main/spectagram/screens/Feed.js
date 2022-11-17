import React, { Component } from 'react';
import { Text, View , StyleSheet, Platform, StatusBar, Image} from 'react-native';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Flatlist} from 'react-native-gesture-handler';
import PostCard from './PostCard';


let stories = require("./temp.json");
let customFonts = {
    'Bubblugum-Sans':require('../assets/fonts/BubblegumSans-Regular.ttf'),
}

export default class Feed extends Component {
    constructor(props){
       super(props);
       this.state={
          fontsLoaded:false,
          posts: [],
       };
    }

    async _loadFontAsync() {
       await Font.loadAsync(customFonts);
       this.async_loadFontAsync({fontsLoaded:true});
    }

    componentDidMount(){
       this.async_loadFontAsync();
    }

    renderItem = ({ item: post }) => {
        return <PostCard post={post} navigation={this.props.navigation}/>;
    };

    keyExtractor = (item,index) => index.toString();

    fetchPosts = () => {
      firebase
          .database()
          .ref("/posts/")
          .on("value", (snapshot) => {
              let posts = []
              if (snapshot.val()) {
                  Object.keys(snapshot.val()).forEach(function (key) {
                      posts.push({
                          key: key,
                          value: snapshot.val()[key]
                      })
                  });
              }
              this.setState({ posts: posts })
              this.props.setUpdateToFalse();
          }, function (errorObject) {
              console.log("A leitura falhou: " + errorObject.code);
          })
   }

    render() {
        if (!this.state.fontsLoaded) {
            return<AppLoading/>;
        } else {
            return (
                <View style={styles.container}>
                   <SafeAreaView style={styles.droidSafeArea}>
                     <View style={styles.appTitle}>
                        <View style={styles.appIcon}>
                           <Image source={require("../assets/logo.png")} styles={{width:60, height:60, rezizeMode:"contain", marginLeft:10}}></Image>
                        </View>
                        <View style={styles.appTitleText}>
                        <Text>
                            App Narração de História
                        </Text>
                     </View>
                     </View>
                     <View style={styles.cardContainer}>
                        <Flatlist
                           keyExtractor = {this.keyExtractor}
                           data = {stories}
                           renderItem={this.renderItem}
                        />
                     </View>
                   </SafeAreaView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    containerLight: {
        flex: 1,
        backgroundColor: "white"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
        flex: 0.07,
        flexDirection: "row"
    },
    appIcon: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center"
    },
    iconImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    appTitleTextContainer: {
        flex: 0.8,
        justifyContent: "center"
    },
    appTitleText: {
        color: "white",
        fontSize: RFValue(28),
    },
    appTitleTextLight: {
        color: "black",
        fontSize: RFValue(28)
    },
    cardContainer: {
        flex: 0.85
    },
    noPosts: {
        flex: 0.85,
        justifyContent: "center",
        alignItems: "center"
    },
    noPostsTextLight: {
        fontSize: RFValue(20),
    },
    noPostsText: {
        color: "white",
        fontSize: RFValue(20),
    }
});
 
