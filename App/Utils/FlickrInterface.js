const API_KEY = 'c1d19218884ad7798723808be4d48fd6';//FlickrCredentials.key;

const BASE_URL = 'https://api.flickr.com/services/rest?';
const baseQueryParams = {
	api_key: API_KEY,
	extras: 'date_taken, date_upload, owner_name, views',
	format: 'json',
	nojsoncallback: 1,
	per_page: 99,
};

const constructQueryString = function(params) {
	const queryString = Object.keys(params)
		.map(key => key + '=' + encodeURIComponent(params[key]))
		.join('&');
	return queryString;
}

const convertContentTypeToAPITerm = function(contentType) {
	var {other, photos, screenshots} = contentType;
	if (other && photos && screenshots) return 7;
	if (other && photos)  return 6;
	if (other && screenshots) return 5;
	if (photos && screenshots) return 4;
	if (other) return 3;
	if (photos) return 1;
	if (screenshots) return 2;
};

/**
 * fetchSearchResults - Make a search photos API call to Flickr.
 * @param {string} searchText The text to search for.
 * @param {object} searchParams The parameters for the search. Possible values are:
 *                              contentType (object representing the content types to search, see SearchOptions component for more info)
 *                              isCommons.
 *                              The automatic params are defined in baseQueryParams above.
 * @returns {Promise} Promise resolving to the json response.
 */
export const fetchSearchResults = function(searchText, searchParams) {
	
	var queryParams = Object.assign({}, baseQueryParams, {
		content_type: convertContentTypeToAPITerm(searchParams.contentType),
		method: 'flickr.photos.search',
		text: searchText,
	});
	if (searchParams.isCommons) queryParams['is_commons'] = true;
	const searchUrl = BASE_URL + constructQueryString(queryParams);
	return fetch(searchUrl)
		.then(response => response.json());
}