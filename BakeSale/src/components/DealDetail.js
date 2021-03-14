import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, Image, StyleSheet, Dimensions, PanResponder, Animated, TouchableOpacity} from 'react-native';

import { priceDisplay } from '../util';
import ajax from '../ajax';

class DealDetail extends React.Component {
    imageXPos = new Animated.Value(0);
    imagePanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gs) => {
            this.imageXPos.setValue(gs.dx);
        },
        onPanResponderRelease: (evt, gs) => {
            this.width = Dimensions.get('window').width;
            if (Math.abs(gs.dx) > this.width * 0.4) {
                const direction = Math.sign(gs.dx);
                // -1 for left and 1 for right
                // swapping left or right depending on the sign of the direction var
                Animated.timing(this.imageXPos, {
                    toValue: direction * this.width,
                    duration: 250,
                    useNativeDriver: false,
                }).start(() => this.handleSwipe(-1 * direction));
            }
            else {
                // swipping less than 40% of the width of the screen, reset the image
               Animated.spring(this.imageXPos, {
                   toValue: 0,
                   useNativeDriver: false,
                }).start(); 
            }
        },
    });

    handleSwipe = (indexDirection) => {
        if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
            Animated.spring(this.imageXPos, {
                toValue: 0,
                useNativeDriver: false,
            }).start();
        }
        this.setState((prevState) => ({
            imageIndex: prevState.imageIndex + indexDirection
        }), () => {
            // Next image animation 
            this.imageXPos.setValue(indexDirection * this.width);
            Animated.spring(this.imageXPos, {
                toValue: 0,
                useNativeDriver: false,
            }).start();
        }
    )};

    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    };
    state = {
        deal: this.props.initialDealData,
        imageIndex: 0,
    };

    async componentDidMount() {
        const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
        this.setState({
            deal: fullDeal,
        });
    }



    render() {
        const { deal } = this.state;
        return (
            <View style={styles.deal}>
                <TouchableOpacity onPress={this.props.onBack}>
                    <Text style={styles.backLink}>Back</Text>
                </TouchableOpacity>

                <Animated.Image
                 {...this.imagePanResponder.panHandlers}
                 source={{ uri: deal.media[this.state.imageIndex] }}
                style={[{ left: this.imageXPos },  styles.image]}
                />
                <View style={styles.detail}>
                    <Text style={styles.title}> {deal.title} </Text>
                    <View style={styles.footer}>
                        <View style={styles.info}>
                            <Text style={styles.cause}> {deal.cause.name} </Text>
                            <Text style={styles.price}> {priceDisplay(deal.price)} </Text>
                        </View>
                        {deal.user && (
                            <View style={styles.user}>
                                <Image source={{ uri: deal.user.avatar}} style={styles.avatar} />
                                <Text>{deal.user.name}</Text> 
                            </View>
                        )}
                    </View>
                <View style={styles.description}>
                    <Text>{deal.description}</Text>
                </View>
            </View>
        </View>

        );
    }
}

const styles = StyleSheet.create({
    deal: {
       // margin: 15,
    },

    backLink: {
        fontSize: 20,
        marginBottom: 5,
        color: '#22f',
        marginLeft: 10,

    },

    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc',
    },

    detail: {
       // borderColor: '#bbb',
        // borderWidth: 1,
    },

    info: {
        alignItems: 'center',
    },

    title: {
        fontSize: 16,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: 'rgba(237, 149, 45, 0.4)',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },

    user: {
        alignItems: 'center',
    },

    cause: {
        marginVertical: 10,
    },

    price: {
        fontWeight: 'bold',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    
    description: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderStyle: 'dotted',
        margin: 10,
        padding: 10,
    },
}); 

export default DealDetail;