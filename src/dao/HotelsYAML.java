package dao;

import java.io.File;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator.Feature;


public class HotelsYAML {
	
	private HotelsYAML() {
		
    ObjectMapper  mapper = new ObjectMapper(new YAMLFactory());
	mapper.findAndRegisterModules();
   // mapper.readValue(new File("src/main/resources/orderInput.yaml"), Order.class);

	}
}
