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


class App extends React.Component {
  state = {
    deals: [],
    currentDealId: null,
  }
 
  async componentDidMount() {
    const deals = await ajax.fetchInitialDeals();
    this.setState({ deals });
  }

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
      return <DealDetail initialDealData={this.currentDeal()}
                          onBack={this.unsetCurrentDeal} 
              />
    }
    if (this.state.deals.length > 0) {
      return <DealList 
              deals={this.state.deals} 
              onItemPress={this.setCurrentDeal}    
    />
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

  header: {
    fontSize: 40,  
  },

});

export default App;
