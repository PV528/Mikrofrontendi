import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './rentalLogic.css';

const RentalLogic = () => {
    const [rentals, setRentals] = useState([]);
    const [rentalIdInput, setrentalIdInput] = useState('');
    const [selectedRental, setSelectedRental] = useState(null);
    const [newRental, setNewRental] = useState({
        rentStart: '',
        rentEnd: '',
        price: 0,
        carId: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editRental, setEditRental] = useState(null);
    


    useEffect(() => {
        // pridobim vse avte, ko se stran naloži
        pridobiNajeme();
    }, []);

    const pridobiNajeme = () => {
        axios.get('http://localhost:3000/api/rentals')
            .then(response => {
                console.log(response.data);
                setRentals(response.data);
            })
            .catch(error => console.error("Error fetching cars:", error));
    };

    const pridobiNajemPoId = () => {
        axios.get(`http://localhost:3000/api/rentals/${rentalIdInput}`)
            .then(response => {
                console.log(response.data);
                setSelectedRental(response.data);
        })
            .catch(error => console.error("Error fetching car by register number:", error));
};

    const izbrisiNajem = () => {
    const rentalId = prompt("Enter rental ID to delete:");
    if (rentalId) {
        axios.delete(`http://localhost:3000/api/rentals/${rentalId}`)
            .then(response => {
                console.log("Rental deleted successfully:", response.data);
                setRentals(rentals.filter(rental => rental.id !== rentalId));
            })
            .catch(error => console.error("Error deleting rental:", error));
    }
};

    const dodajNajem = () => {
        axios.post('http://localhost:3000/api/rentals/create', newRental)
        .then(response => {
            setRentals([...rentals, response.data]);
            setNewRental({
                rentStart: '',
                rentEnd: '',
                price: '',
                carId: ''
        });
      })
      .catch(error => console.error("Error adding rental:", error));
  };

  const clickUpdate = (rental) => {
    setEditRental(rental);
    setIsEditing(true);
  };
  
  const submitUpdate = () => {
    axios.put(`http://localhost:3000/api/rentals/${editRental.id}`, editRental)
      .then(response => {
        const updatedRentals = rentals.map(rental => {
          if (rental.id === editRental.id) {
            return response.data;
          }
          return rental;
        });
        setRentals(updatedRentals);
        setIsEditing(false);
        setEditRental(null);
      })
      .catch(error => console.error("Error updating rental:", error));
  };
  
  const cancelUpdate = () => {
    setIsEditing(false);
    setEditRental(null);
  };
  
  return (
    <div>
      <div>
        <h2>Add New Rental</h2>
        <input type="text" value={newRental.rentStart} onChange={(e) => setNewRental({ ...newRental, rentStart: e.target.value })} placeholder="Start Date"/>
        <input type="text" value={newRental.rentEnd} onChange={(e) => setNewRental({ ...newRental, rentEnd: e.target.value })} placeholder="End Date"/>
        <input type="text" value={newRental.price} onChange={(e) => setNewRental({ ...newRental, price: e.target.value })} placeholder="Price"/>
        <input type="text" value={newRental.carId} onChange={(e) => setNewRental({ ...newRental, carId: e.target.value })} placeholder="Car ID"/>
        <button onClick={dodajNajem}>Add Rental</button>
      </div>
  
      <div>
        <h2>Get Rental By id</h2>
        <input
          type="text"
          value={rentalIdInput}
          onChange={(e) => setrentalIdInput(e.target.value)}
          placeholder="Rental id"
        />
        <button onClick={pridobiNajemPoId}>Get Rental</button>
        {selectedRental && (
          <div>
            <h3>Selected Rental</h3>
            <p>Rent start: {selectedRental.rentstart}</p>
            <p>Rent end: {selectedRental.rentend}</p>
            <p>Price: {selectedRental.price}</p>
            <p>Car id: {selectedRental.carid}</p>
          </div>
        )}
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Price</th>
                <th>Car ID</th>
                <th>Možnosti</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{rental.rentstart}</td>
                  <td>{rental.rentend}</td>
                  <td>{rental.price}</td>
                  <td>{rental.carid}</td>
                  <td>
                    <button onClick={() => clickUpdate(rental)}>Edit</button>
                    <button onClick={() => izbrisiNajem(rental.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isEditing && (
    <div>
        <h2>Edit Rental Details</h2>
        <form>
            <label>
                ID:
                <input
                    type="text"
                    value={editRental.id}
                    onChange={(e) => setEditRental({ ...editRental, id: e.target.value })}
                />
            </label>
            <label>
                Start Date:
                <input
                    type="text"
                    value={editRental.rentStart}
                    onChange={(e) => setEditRental({ ...editRental, rentStart: e.target.value })}
                />
            </label>
            <label>
                End Date:
                <input
                    type="text"
                    value={editRental.rentEnd}
                    onChange={(e) => setEditRental({ ...editRental, rentEnd: e.target.value })}
                />
            </label>
            <label>
                Price:
                <input
                    type="number"
                    value={editRental.price}
                    onChange={(e) => setEditRental({ ...editRental, price: parseInt(e.target.value) })}
                />
            </label>
            <label>
                Car ID:
                <input
                    type="text"
                    value={editRental.carId}
                    onChange={(e) => setEditRental({ ...editRental, carId: e.target.value })}
                />
            </label>
        </form>
        <button onClick={submitUpdate}>Update</button>
        <button onClick={cancelUpdate}>Cancel</button>
    </div>
)}

        </div>
        </div>
      </div>
  );
}  

export default RentalLogic;
