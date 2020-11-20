package application;

import java.rmi.RemoteException;

import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

import ws.HotelsListStub;
import ws.HotelsListStub.GetHotelsList;

public class GetHotels extends ServerResource {
	/**
	 * @param args
	 * @throws RemoteException 
	 */
	@Get 
	public String GetHotels() throws RemoteException {
		// TODO Auto-generated method stub
		HotelsListStub hls = new HotelsListStub();
		GetHotelsList g = new GetHotelsList();
		return hls.getHotelsList(g).get_return();
	}
}
