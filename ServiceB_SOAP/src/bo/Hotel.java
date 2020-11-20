package bo;

import java.util.List;

public class Hotel {

    public String hotelName;
    public int totalRooms;
    public int availableRooms;
    public List<Room> hotelRoom;

    public Hotel(String hotelName, int totalRooms, int availableRooms, List<Room> hotelRoom) {
        this.hotelName = hotelName;
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.hotelRoom = hotelRoom;
    }
}

