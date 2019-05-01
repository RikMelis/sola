import json
from math import sin, cos, sqrt, atan2, radians

# approximate radius of earth in m
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


total_distance = 0
for index in ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14']:
# for index in ['01']:
	with open('strecke{}.json'.format(index), 'rw') as f:
	    d = json.load(f)
	    d[0]['dis'] = 0.0
	    s = 0
	    for p, q in zip(d[:-1], d[1:]):
	    	s += calculateDistance(p, q)
	    	q['dis'] = s

	    print('distance: {},'.format('%.5f' % s))

	    total_distance += s
	    with open('strecke{}.json'.format(index), 'w') as outfile:
	    	json.dump(d, outfile, indent=4)


print('total distance: {},'.format('%.5f' % total_distance))
