package service;

import java.util.ArrayList;
import java.util.List;

import bo.Hotel;

public class HotelServices implements IHotel {
	

    private final List<Hotel> hotel = new ArrayList<>();

	@Override
	public List<Hotel> getHotel() {
		// TODO Auto-generated method stub
		return hotel;
	}

	@Override
	public void deleteByName(String hotelName) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void addHotel(Hotel hotel) {
		// TODO Auto-generated method stub
		
	}


}
