package serverRest;

import org.restlet.Application;
import org.restlet.Restlet;
import org.restlet.routing.Router;

import application.GetAvailableRooms;
import application.GetBooking;

public class RouterRest extends Application{
	
	@Override
	public synchronized Restlet createInboundRoot() {
		Router router = new Router(getContext());
		router.attach("/hotels", GetAvailableRooms.class);
		router.attach("/booking", GetBooking.class);
		return router;
	}

}
