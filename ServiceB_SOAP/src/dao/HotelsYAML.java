package dao;

import java.io.InputStream;



public class HotelsYAML {

	private InputStream inputStream;
	
    public HotelsYAML(String file) {    
        inputStream = HotelsYAML.class.getClassLoader().getResourceAsStream(file);            
    }

	public InputStream getInputStream() {
		return inputStream;
	} 
}
