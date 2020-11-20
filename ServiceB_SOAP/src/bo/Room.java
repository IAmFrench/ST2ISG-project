package bo;

public class Room {

    public String roomName;
    public int reservationId;
    public boolean isAvailable;

    public Room(String roomName, int reservationId, boolean isAvailable) {
        this.roomName = roomName;
        this.reservationId = -1;
        this.isAvailable = true;
    }

    public String getRoomName() {
        return roomName;
    }

    public int getReservationId() {
        return reservationId;
    }

    public boolean isAvailable() {
        return (reservationId == -1);
    }

    public void setReservationId(int reservationId) {
        this.reservationId = reservationId;
    }

}
