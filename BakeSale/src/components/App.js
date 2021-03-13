/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
 } from 'react-native';

import ajax from '../ajax';
import DealDetail from './DealDetail';
import DealList from './DealList';
import SearchBar from './SearchBar';


class App extends React.Component {
  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null,
  };
 
  async componentDidMount() {
    const deals = await ajax.fetchInitialDeals();
    this.setState({ deals });
  }

  searchDeals = async (searchTerm) => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealsSearchResults(searchTerm);
    }
    this.setState({ dealsFromSearch });
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
          <SearchBar searchDeals = {this.searchDeals}/>
          <DealList 
            deals={dealsToDisplay} 
            onItemPress={this.setCurrentDeal}    
          />

        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.state.deals.length > 0 ? (
          <DealList deals={this.state.deals} onItemPress={this.setCurrentDeal} />
        ) : (
          <Text style={styles.header}>Bakesale</Text>
        )}
        
        
      </View>
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
