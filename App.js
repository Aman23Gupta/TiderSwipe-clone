import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, PanResponder } from 'react-native';

const DATA = [
  { id: 1, text: 'Card #1', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 2, text: 'Card #2', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 3, text: 'Card #3', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 4, text: 'Card #4', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
  { id: 5, text: 'Card #5', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 6, text: 'Card #6', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 7, text: 'Card #7', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 8, text: 'Card #8', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
];

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class App extends Component {

  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
    }
  }

  UNSAFE_componentWillMount() {
    this.rotate = this.position.x.interpolate({
      inputRange: [-1 * SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-15deg', '0deg', '15deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTransform = {
      transform: [{ rotate: this.rotate }, ...this.position.getTranslateTransform()]
    }

    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
        //console.log(gestureState);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.dx>120) {
          Animated.spring(this.position, {
            toValue: {x: SCREEN_WIDTH+100, y: gestureState.dy}
          }).start (()=> {
            this.setState({currentIndex: this.state.currentIndex+1},()=> {
              this.position.setValue({x:0,y:0})
            })
          })
        }
        else if(gestureState.dx<-120) {
          Animated.spring(this.position, {
            toValue: { x: -1*SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: {x:0,y:0},
            friction: 4
          }).start()
        }
      }
    })
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-1 * SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.nopeOpacity = this.position.x.interpolate({
      inputRange: [-1 * SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })
  }

  renderData() {
    return DATA.map((item, i) => {
      if(i < this.state.currentIndex) {
        return null;
      }
      else if(i===this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} 
            style={[this.rotateAndTransform, styles.AnimationStyle]}
          >

            <Animated.View
              style={{
                opacity: this.likeOpacity,
                transform: [{ rotate: '-30deg' }],
                position: "absolute",
                top: 50,
                left: 40,
                zIndex: 1000
              }}
            >
              <Text style={styles.likeStyle}>LIKE</Text>
            </Animated.View>
            <Animated.View
              style={{
                opacity: this.nopeOpacity,
                transform: [{ rotate: '30deg' }],
                position: "absolute",
                top: 50,
                right: 40,
                zIndex: 1000
              }}
            >
              <Text style={styles.nopeStyle}>NOPE</Text>
            </Animated.View>

            <Image
              style={styles.imageStyle}
              source={{uri: item.uri}}
            />
          </Animated.View>
        );
      }
      else {
        return (
          <Animated.View
            key={item.id}
            style={ styles.AnimationStyle }
          >
            <Image
              style={styles.imageStyle}
              source={{ uri: item.uri }}
            />
          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{ height: 60 }}>
        </View>
        <View style={{ flex: 1 }}>
          {this.renderData()}
        </View>
        <View style={{ height: 60 }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    flex: 1,
    height: null,
    width: null,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  AnimationStyle: {
    height: SCREEN_HEIGHT-120,
    width: SCREEN_WIDTH,
    padding: 10,
    position: 'absolute'
  },
  likeStyle: {
    borderWidth: 1,
    borderColor: "green",
    color: "green",
    fontSize: 32,
    fontWeight: "900",
    padding: 10
  },
  nopeStyle: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
    fontSize: 32,
    fontWeight: "900",
    padding: 10
  },
});

export default App;
