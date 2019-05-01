from xml.dom import minidom
import json

for index in ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14']:
	xmldoc = minidom.parse('strecke{}.gpx'.format(index))
	itemlist = xmldoc.getElementsByTagName('trkpt')

	data = [
		{
			'lat': float(item.attributes['lat'].value),
			'lon': float(item.attributes['lon'].value),
			'alt': float(item.firstChild.firstChild.nodeValue) if item.firstChild is not None else None,
		} for item in itemlist
	]

	with open('strecke{}.json'.format(index), 'w') as outfile:
		json.dump(data, outfile, indent=4)