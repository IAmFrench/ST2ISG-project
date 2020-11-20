package WS;

import java.io.InputStream;
import java.util.Map;

import org.yaml.snakeyaml.Yaml;

import dao.HotelsYAML;

public class HotelsList {

	Map<String, Object> hotels;

	@SuppressWarnings("unchecked")
	public HotelsList() {
		Yaml yaml = new Yaml();
		InputStream inputStream = new HotelsYAML("./hotels.yaml").getInputStream();
		hotels = (Map<String, Object>) yaml.load(inputStream);
		getHotelsList();
	}
	
	public String getHotelsList(){	
		String s = hotels.toString();
		return  s;
	}
}
