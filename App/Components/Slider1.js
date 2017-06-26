'use strict';
import React from 'react';
import {
	Slider,
	StyleSheet,
	Text,
	View,
} from 'react-native';

class Slider1 extends React.Component {
	static defaultProps = {
		value: 1
	};

	state = {
		value: this.props.value
	};

	render() {
		return (
			<View>
				<Text style={styles.text} >
					{this.state.value && +this.state.value.toFixed(3)}
				</Text>
				<Slider
					{...this.props}
					minimumValue={1}
					maximumValue={5}
					step={1}
					onValueChange={(value) => this.setState({value: value})} />
			</View>
		);
	}
}

var styles = StyleSheet.create({
  slider: {
	alignSelf: 'auto',
  },
  text: {
	textAlign: 'right',
  },  
})

module.exports = Slider1;