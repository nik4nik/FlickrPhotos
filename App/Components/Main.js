'use strict';
import React from 'react';
import {
	ActivityIndicator,
	AppRegistry,
	AsyncStorage,
	Image,
	ListView,
	StyleSheet,
	Slider,
	Text,
	TextInput,
	TouchableHighlight,
	View,
} from 'react-native';

import Dimensions from 'Dimensions';
import { StackNavigator } from 'react-navigation';
import PhotoList from './PhotoList';
import Photo from './Photo';
import {fetchSearchResults} from '../Utils/FlickrInterface';

class Main extends React.Component{
	
  constructor(props) {
	super(props);
	this.state = {
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2}),
		slideValue: 1,
		isLoading: false,
		photoInfo: {},
		searchedTag: '',
		error: false
	}
	
	// Retrieve the last state
	AsyncStorage.getItem("searchedTag").then((value) => { this.setState({"searchedTag": value}); }).done();
	AsyncStorage.getItem("slideValue").then((value) => { this.setState({"slideValue": +value}); }).done();

  }
  _handleChange(e){
	this.setState({ searchedTag: e.nativeEvent.text });
  }
  _handleResponse(res) {
	if(res.photos.total === 0){
		this.setState({
			error: 'No photo was found!',
			isLoading: false
		})
	} else {
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(res.photos.photo),
			photoInfo: res.photos.photo,
			isLoading: false,
			error: false
		});
		var dim = Dimensions.get('window').width,
			idx = this.state.slideValue - 1;
		this.props.navigation.navigate('Res', {
			photos : res.photos.photo,
			thumbnailSize : [dim/1.1, dim/2.2, dim/3.3, dim/4.5, dim/5.8][idx]
		});
	}
  }
  _fetchData() {
	if (!this.state.searchedTag) return;
	this.setState({	isLoading: true	});
	AsyncStorage.setItem("searchedTag", this.state.searchedTag);
	AsyncStorage.setItem("slideValue",  String(this.state.slideValue));
	
	const searchParams = {
			contentType: //this.state.searchOptions.contentType,
				{
					other: false,
					photos: true,
					screenshots: false,
				},
			isCommons: false, //this.state.searchOptions.isCommons,
			page: 1 //this.state.page,
			//sortOrder: this.state.searchOptions.sortOrder,
	};
		
	fetchSearchResults(this.state.searchedTag, searchParams)
	.then((jsonRes) => this._handleResponse(jsonRes))
	.catch((err) => {
		this.setState({
			isLoading: false,
			error: `There was an error: ${err}`
		})
	});
  }
  onSearchPressed() {
	this._fetchData();
  }
  render() {
	var showErr = (
			this.state.error ?
				<Text style={styles.error}> {this.state.error} </Text> :
				<View></View>
		),
		spinner = this.state.isLoading ?
			( <ActivityIndicator size='large'/> ) :
			( <View/> );
	return (
		<View style={styles.mainContainer}>
			<TextInput
				placeholder='Search Term'
				style={styles.searchInput}
				value={this.state.searchedTag}
				onChange={this._handleChange.bind(this)}
				onEndEditing={this._fetchData.bind(this)}				
			/>
			{showErr}
			<View style={{ flexDirection: 'row' }}>
				<Text style={styles.label}>Columns:</Text>
				<Slider
				 style={{ width: 250 }}
				 step={1}
				 minimumValue={1}
				 maximumValue={5}
				 value={this.state.slideValue}
				 onValueChange={val => this.setState({ slideValue: val })}
				/>
				<Text style={styles.welcome}>{this.state.slideValue}</Text>
			</View>
			<TouchableHighlight
				onPress={this.onSearchPressed.bind(this)}
				underlayColor='#99d9f4'>
				<Text style={styles.buttonText}>Search</Text>
			</TouchableHighlight>
			{spinner}
			</View>
	)
  }
}

var styles = StyleSheet.create({
  buttonText: {
	fontSize: 18,
	color: 'white',
	alignSelf: 'center'
	},
  error: {
	color: 'red',
	padding: 10
  },
  label: {
	alignSelf: 'center'
  },
  mainContainer: {
	flex: 1,
	padding: 15,
	flexDirection: 'column',
	justifyContent: 'center',
	backgroundColor: '#48BBEC'
  },
  searchInput: {
	height: 50,
	padding: 4,
	marginRight: 5,
	fontSize: 23,
	color: 'white'
  },
  title: {
	marginBottom: 20,
	fontSize: 25,
	textAlign: 'center',
	color: '#fff'
  },
})

const Dir = StackNavigator({
  Home: { screen: Main },
  Res: { screen: PhotoList },
  Photo: { screen: Photo },
});

AppRegistry.registerComponent('FlickrPhotos', () => Dir);