package repository;

import java.util.List;

import bo.Hotel;
import service.HotelServices;

public class HotelRepository {
	
    private static volatile HotelRepository instance;

   
    public static HotelRepository getInstance() {
        if (instance == null) {
            synchronized (HotelRepository.class) {
                if (instance == null)
                    instance = new HotelRepository();
            }
        }
        return instance;
    }

    
    private HotelRepository( ){
        
    }

    public List<Hotel> getHotel()
    {
		return null;
       
    }

    public void addCity(Hotel hotel)
    {
   
    }


    public void deleteCity(Hotel city)
    {
 
    }

    public void updateCity(Hotel city) {
       
    }

}
