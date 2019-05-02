from xml.dom import minidom
import json
from math import sin, cos, sqrt, atan2, radians

# approximate radius of earth in km
R = 6373

def calculateDistance(p, q):
	lat1 = radians(p['lat'])
	lon1 = radians(p['lon'])
	lat2 = radians(q['lat'])
	lon2 = radians(q['lon'])

	dlon = lon2 - lon1
	dlat = lat2 - lat1

	a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
	c = 2 * atan2(sqrt(a), sqrt(1 - a))

	distance = R * c

	return distance

def getAltitudeFromPoint(p):
	for child in p.childNodes:
		if child.nodeType==child.ELEMENT_NODE and child.tagName == 'ele':
			return child.firstChild.nodeValue

# 20 meter smooth interval
INTERVAL = 0.050
def smoothenElevation(d):
	d[0]['grad'] = 0
	for i in range(1, len(d)):
		l = i - 1
		r = i
		while l > 0 and d[i]['dis'] - d[l]['dis'] < INTERVAL:
			l -= 1
		while r < len(d) - 1 and d[r]['dis'] - d[i]['dis'] < INTERVAL:
			r += 1

		d[i]['grad'] = (d[r]['alt'] - d[l]['alt']) / (d[r]['dis'] - d[l]['dis'])

total_distance = 0

for index in ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14']:
	xmldoc = minidom.parse('strecke{}.gpx'.format(index))
	itemlist = xmldoc.getElementsByTagName('trkpt')

	d = [
		{
			'lat': float(item.attributes['lat'].value),
			'lon': float(item.attributes['lon'].value),
			'alt': float(getAltitudeFromPoint(item)),
		} for item in itemlist
	]

	d[0]['dis'] = 0.0
	s = 0
	for p, q in zip(d[:-1], d[1:]):
		s += calculateDistance(p, q)
		q['dis'] = s

	print('distance: {},'.format('%.5f' % s))

	total_distance += s

	smoothenElevation(d)

	with open('strecke{}.json'.format(index), 'w') as outfile:
		json.dump(d, outfile, indent=4)

print('total distance: {},'.format('%.5f' % total_distance))