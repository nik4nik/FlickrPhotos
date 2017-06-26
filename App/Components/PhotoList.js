'use strict';
import React, { Component } from 'react'
import {
	Image,
	ListView,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';

class PhotoList extends Component {
		static navigationOptions = {
		title: 'Results',
	};

	constructor(props) {
		super(props);
		var dataSource = new ListView.DataSource(
			{rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			dataSource: dataSource.cloneWithRows(this.props.navigation.state.params.photos),
			thumbnailSize: this.props.navigation.state.params.thumbnailSize
		};
	}

	renderPhoto(rowData: string, sectionID: number, rowID: number) {
		var uri = `https://farm${rowData.farm}.staticflickr.com/${rowData.server}/${rowData.id}_${rowData.secret}.jpg`;
		if (!uri) return
		return (
		  <View style={styles.photoContainer}>
			<TouchableHighlight onPress={() => this.openPhoto(rowData)} underlayColor="transparent">
			  <Image
				source={{uri: uri}}
				style={{width: this.state.thumbnailSize, height: this.state.thumbnailSize}}
			  />
			</TouchableHighlight>
		  </View>
		)
	}
 
	render() {
		return (
			<ListView
				dataSource={this.state.dataSource}
				renderRow={this.renderPhoto.bind(this)}
				contentContainerStyle={styles.list}
				initialListSize={21}
				pageSize={3}
			/>
		);
	}

	openPhoto(photo) {
		this.props.navigation.navigate('Photo', {photoInfo: photo});
	}
}

var styles = StyleSheet.create({
  list: {
	justifyContent: 'space-around',
	flexDirection: 'row',
	flexWrap: 'wrap'
},
  photoContainer: {
	padding: 5
},
  listView: {
	marginTop: 40,
	backgroundColor: '#F5FCFF',
},
  thumb: {
	width: 80,
	height: 80,
	marginRight: 10
},
  textContainer: {
	flex: 1
},
  separator: {
	height: 1,
	backgroundColor: '#dddddd'
},
  price: {
	fontSize: 25,
	fontWeight: 'bold',
	color: '#48BBEC'
},
  title: {
	fontSize: 20,
	color: '#656565'
},
  rowContainer: {
	flexDirection: 'row',
	padding: 10
}
});

module.exports = PhotoList;