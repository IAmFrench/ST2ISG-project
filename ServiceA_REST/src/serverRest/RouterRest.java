package serverRest;

import org.restlet.Application;
import org.restlet.Restlet;
import org.restlet.routing.Router;

import application.GetHotels;

public class RouterRest extends Application{
	

	public synchronized Restlet createInboundRoot() {
		Router router = new Router(getContext());
		router.attach("/hotels", GetHotels.class);
	//	router.attach("/booking", GetBooking.class);
		return router;
	}

}
