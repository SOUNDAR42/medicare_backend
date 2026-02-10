from django.db.models import Max
import math

def generate_custom_id(model_class, id_field, prefix):
    """
    Generates a custom ID like PH1, PH2, MD1, etc.
    :param model_class: The Django model class.
    :param id_field: The name of the ID field (e.g., 'pharmacy_id').
    :param prefix: The prefix string (e.g., 'PH').
    :return: A string ID.
    """
    # Filter IDs starting with the prefix
    ids = model_class.objects.filter(**{f"{id_field}__startswith": prefix}).values_list(id_field, flat=True)
    
    max_num = 0
    for id_val in ids:
        try:
            # Extract numeric part
            num = int(id_val[len(prefix):])
            if num > max_num:
                max_num = num
        except ValueError:
            continue
            
    return f"{prefix}{max_num + 1}"

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return float('inf')

    # Convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])

    # Haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r
