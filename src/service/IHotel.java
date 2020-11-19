package service;

import java.util.List;

import bo.Hotel;

public interface IHotel {
	
    //Interface, contrat défini
    /**
     * Get all users
     *
     * @return {@link List}
     */
    List<Hotel> getHotel();

    /**
     * Deletes an user
     *
     * @param city
     */
    void deleteByName(String hotelName);

    /**
     * Add an user
     *
     * @param city
     */
    void addHotel(Hotel hotel);

}
