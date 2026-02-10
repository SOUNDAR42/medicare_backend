
from medicare_booking.utils import haversine
from pharmacies.models import Pharmacy
from hospitals.models import Hospital

def search_entities_by_pincode(model_class, pincode, ref_model_class=None):
    """
    Search for entities (Hospital/Pharmacy) by pincode with geospatial fallback.
    
    :param model_class: The model class to search for (e.g., Hospital).
    :param pincode: The pincode to search for.
    :param ref_model_class: (Optional) Another model class to use for finding location if 
                            no entity of 'model_class' exists at 'pincode'.
    :return: (list_of_entities, message_string)
    """
    entities = []
    message = ""
    
    if not pincode:
        return model_class.objects.all(), ""

    try:
        pincode = int(pincode)
        # 1. Exact Match
        entities = list(model_class.objects.filter(pincode=pincode))
        
        if not entities:
            # 2. Nearby Search - DISABLED (Lat/Long removed)
            entity_name = model_class._meta.verbose_name_plural
            message = f"No {entity_name} found exactly at this pincode."
    except ValueError:
         message = "Invalid pincode format."
         
    return entities, message
