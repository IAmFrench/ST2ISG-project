package bo;

public class Hotel {
	
	  public String hotelName;
	  public String numberOfNight;
	  public String startDate;
	  public String endDate;
	  public String bookID;
	 
	  
	  public Hotel(String hotelName,String numberOfNight,String startDate,String endDate,
			  String bookID){
		  
		  this.hotelName= hotelName;
		  this.numberOfNight= numberOfNight;
		  this.startDate= startDate;
		  this.endDate= endDate;
		  this.bookID= bookID;
	  }
}

