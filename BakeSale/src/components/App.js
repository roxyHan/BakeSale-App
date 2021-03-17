/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import BackGroundColor from 'react-native-background-color';

import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
 } from 'react-native';

import ajax from '../ajax';
import DealDetail from './DealDetail';
import DealList from './DealList';
import SearchBar from './SearchBar';



class App extends React.Component {
  titleXPOs = new Animated.Value(0); 
  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null,
    activeSearchTerm: '',
  };
 
  animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width -160;
    Animated.timing(
      this.titleXPOs,
      {
        toValue: direction * (width / 2), 
        duration : 1000,
        easing: Easing.ease,
        useNativeDriver: false,
      }
    ).start(( { finished }) => {
      if (finished) {
        this.animateTitle(-1 * direction)
     }
    });
  };

  async componentDidMount() {
    this.animateTitle();
    const deals = await ajax.fetchInitialDeals();
    this.setState({ deals });
    SplashScreen.hide();
  }

  searchDeals = async (searchTerm) => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealsSearchResults(searchTerm);
    }
    this.setState({ dealsFromSearch, activeSearchTerm: searchTerm });
  };

  setCurrentDeal = (dealId) => {
    this.setState({
      currentDealId: dealId
    });
  };

  unsetCurrentDeal = () => {
    this.setState({
      currentDealId: null
    });
  };

  currentDeal = () => {
    return this.state.deals.find(
      (deal) => deal.key === this.state.currentDealId
    );
  };

  render() {
    if (this.state.currentDealId) {
      return (
        <View style={styles.main}>
        <DealDetail
          initialDealData={this.currentDeal()}
          onBack={this.unsetCurrentDeal} 
        />
        </View>
      );
    }

    const dealsToDisplay = 
      (this.state.dealsFromSearch).length > 0
        ? this.state.dealsFromSearch
        : this.state.deals;

    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar 
            searchDeals = {this.searchDeals}
            initialSearchTerm={this.state.activeSearchTerm}
          />
          <DealList 
            deals={dealsToDisplay} 
            onItemPress={this.setCurrentDeal}    
          />

        </View>
      );
    }

    return (
      <Animated.View style={[{left : this.titleXPOs }, styles.container]} >
       <Text style={styles.header}>Bakesale</Text>
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  main: {
    marginTop: 30,
  },

  header: {
    fontSize: 40,  
  },

});

export default App;
