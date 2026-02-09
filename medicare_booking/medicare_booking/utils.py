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
    # Find the maximum existing ID
    max_id = model_class.objects.aggregate(max_id=Max(id_field))['max_id']
    
    if max_id is None:
        return f"{prefix}1"
    
    # Extract the numeric part (assuming format is PrefixNumber)
    try:
        current_num = int(max_id[len(prefix):])
        new_num = current_num + 1
    except ValueError:
        # Fallback if ID format is unexpected, though we expect consistent usage
        return f"{prefix}1"
        
    return f"{prefix}{new_num}"

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
