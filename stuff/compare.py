from copy import deepcopy

def compare(district):
    """Stores a configuration of the district all houses are connected and
        if it's cheaper than the previous ones """
    if len(district.disconnectedHouses) == 0 and \
            district.costs < district.compare.costs:
        district.compare = deepcopy(district)
