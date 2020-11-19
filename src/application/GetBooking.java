package application;

import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

public class GetBooking extends ServerResource {


	@Get  
	public String toString() {
		String uid = "Booking Ok";
		return uid;  
	}  
}
