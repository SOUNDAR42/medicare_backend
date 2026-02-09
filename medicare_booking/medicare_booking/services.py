
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
            # 2. Nearby Search
            entity_name = model_class._meta.verbose_name_plural
            message = f"No {entity_name} found exactly at this pincode. Searching for nearby {entity_name}."
            
            # Try to find a reference location for this pincode
            # Check the primary model first
            ref_loc = model_class.objects.filter(pincode=pincode).first()
            
            # If not found, check the reference model (e.g., check Pharmacy if searching for Hospital)
            if not ref_loc and ref_model_class:
                ref_loc = ref_model_class.objects.filter(pincode=pincode).first()
            
            target_lat = None
            target_lon = None
            
            if ref_loc and ref_loc.latitude and ref_loc.longitude:
               target_lat = ref_loc.latitude
               target_lon = ref_loc.longitude
            
            if target_lat:
                # Get all entities with valid coordinates
                all_entities = model_class.objects.exclude(latitude__isnull=True).exclude(longitude__isnull=True)
                nearby = []
                for entity in all_entities:
                    dist = haversine(target_lat, target_lon, entity.latitude, entity.longitude)
                    # Define a radius, e.g., 50km
                    if dist <= 50: 
                        nearby.append((entity, dist))
                
                # Sort by distance
                nearby.sort(key=lambda x: x[1])
                entities = [e[0] for e in nearby]
            else:
                message += f" Could not determine location for this pincode to find nearby {entity_name}."
    except ValueError:
         message = "Invalid pincode format."
         
    return entities, message
