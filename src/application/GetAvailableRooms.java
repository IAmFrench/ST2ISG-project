package application;

import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

import repository.HotelRepository;

public class GetAvailableRooms extends ServerResource {

	@Get  
	public String toString() {
		String uid = "Availables Rooms Ok";
		return uid;  
	}  
	
	private void getHotels(){
		
		HotelRepository.getInstance().getHotels();
	}
}
