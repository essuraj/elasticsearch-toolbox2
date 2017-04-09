import { bindable } from 'aurelia-framework';
import { ESFactory as esF } from '../../services/esFactory'
interface cm {
	getValue(): string;
	setValue(data: string): any;
}
declare var CodeMirror: any;
export class Builder {
	factory: esF;
	@bindable indexes;
	@bindable esURL;
	title = 'Welcome to the Query builder';
	selectedIndices = [];
	maps: String[];
	constructor() {
		this.factory = new esF();

	}
	esQ={};
	esQA={};
	queriesList = [];
	aggList = [];
	addToQuery() {
		this.queriesList.push((JSON.parse(JSON.stringify(this.esQ))));
	this.esQ={};
	}
	addToAggQuery() {
		this.aggList.push((JSON.parse(JSON.stringify(this.esQA))));
	this.esQA={};
	}
	async getMappings() {
		this.maps = new Array();
		let indexNMaps = await this.factory.getMappings(this.esURL, this.selectedIndices);
		console.log(indexNMaps)
		let indexes = Object.keys(indexNMaps)
		indexes.map(x => {
			let mappings = indexNMaps[x].mappings;
			let mapsList = Object.keys(mappings)
			mapsList.forEach(map => {
				this.getPropsAndFields(x, mappings, map)
			});
			indexNMaps[x].mappings
		})
		// return maps;
	}
	getPropsAndFields(index, mappings, map) {

		if (mappings[map].fields !== undefined) {
			let fields = mappings[map].fields;
			if (fields.keyword === undefined) {
				console.warn(fields)
			} else {
				// console.info(fields.keyword)
				this.maps.push(index + "." + map + ".keyword")
				console.warn(index + "." + map + "-keyword")

			}

		} else {
			let properties = mappings[map].properties;


			let propKeys = Object.keys(properties)
			console.info(propKeys)
			propKeys.forEach(map2 => {
				console.log(index + "." + map + "." + map2)
				this.getPropsAndFields(index + "." + map, properties, map2)
			});
		}
	}
}

