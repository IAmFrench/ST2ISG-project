package serverRest;

import org.restlet.Component;
import org.restlet.data.Protocol;

public class RestDistributor {
	
	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
 
		Component component = new Component();  
		component.getServers().add(Protocol.HTTP, 8180); 
		component.getDefaultHost().attach(new RouterRest());  
		component.start();  
	}	 
 

}
