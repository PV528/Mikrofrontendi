import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './carlogic.css';

const CarLogic = () => {
    const [cars, setCars] = useState([]);
    const [newCar, setNewCar] = useState({
      registerNumber: '',
      brand: '',
      model: '',
      color: '',
      year: '',
      kilometersDriven: '',
      pricePerDay: ''
  });
  const [registerNumberInput, setRegisterNumberInput] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [colorInput, setColorInput] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [selectedCars, setSelectedCars] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [showTable, setShowTable] = useState(false);


    useEffect(() => {
        // pridobim vse avte, ko se stran naloži
        pridobiAvte();
    }, []);

    const pridobiAvte = () => {
        axios.get('http://gatewayWeb:3000/cars/all')
            .then(response => {
                console.log(response.data);
                setCars(response.data);
            })
            .catch(error => console.error("Error fetching cars:", error));
    };

    const dodajAvto = () => {
      axios.post('http://gatewayWeb:3000/cars/addCar', newCar)
          .then(response => {
              setCars([...cars, response.data]);
              setNewCar({
                  registerNumber: '',
                  brand: '',
                  model: '',
                  color: '',
                  year: '',
                  kilometersDriven: '',
                  pricePerDay: ''
              });
          })
          .catch(error => console.error("Error adding car:", error));
  };

    const pridobiAvtoPoId = () => {
      axios.get(`http://gatewayWeb:3000/cars/${registerNumberInput}`)
        .then(response => {
            console.log(response.data);
            setSelectedCar(response.data);
        })
        .catch(error => console.error("Error fetching car by register number:", error));
};

    const pridobiAvtoPoBarvi = () => {
      axios.get(`http://gatewayWeb:3000/cars/color/${colorInput}`)
        .then(response => {
          console.log(response.data);
          setSelectedCars(response.data);
          setShowTable(true); //dokler ne klicem je tabela skrita, šele ko kličem se prikaže
      })
      .catch(error => console.error("Error fetching cars by color:", error));
};

    const pridobiAvtoPoZnamki = () => {
      axios.get(`http://gatewayWeb:3000/cars/brand/${brandInput}`)
        .then(response => {
          console.log(response.data);
          setSelectedCars(response.data);
          setShowTable(true); //dokler ne klicem je tabela skrita, šele ko kličem se prikaže
  })
      .catch(error => console.error("Error fetching cars by color:", error));
};

    const izbrisiAvto = (registerNumber) => {
      axios.delete(`http://gatewayWeb:3000/cars/${registerNumber}`)
        .then(response => {
          console.log("Car deleted successfully:", response.data);
          setCars(cars.filter(car => car.registerNumber !== registerNumber));
      })
      .catch(error => console.error("Error deleting car:", error));
};

    const klikPosodobi = (car) => {
      setEditCar(car);
      setIsEditing(true);
};

    const posodobiSubmit = () => {
      axios.put(`http://gatewayWeb:3000/cars/${editCar.registerNumber}`, editCar)
      .then(response => {
          // Update corresponding row in the table
          const updatedCars = cars.map(car => {
              if (car.id === editCar.id) {
                  return response.data;
              }
              return car;
          });
          setCars(updatedCars);
          setIsEditing(false);
          setEditCar(null);
      })
      .catch(error => console.error("Error updating car:", error));
};

const posodobiPrekini = () => {
  setIsEditing(false);
  setEditCar(null);
};
    return (
        <div>
            <h1>Car Management</h1>
            <div>
                <h2>Add New Car</h2>
                <input type="text" value={newCar.registerNumber} onChange={(e) => setNewCar({ ...newCar, registerNumber: e.target.value })} placeholder="Register Number" />
                <input type="text" value={newCar.brand} onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })} placeholder="Brand" />
                <input type="text" value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} placeholder="Model" />
                <input type="text" value={newCar.color} onChange={(e) => setNewCar({ ...newCar, color: e.target.value })} placeholder="Color" />
                <input type="text" value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} placeholder="Year" />
                <input type="text" value={newCar.kilometersDriven} onChange={(e) => setNewCar({ ...newCar, kilometersDriven: e.target.value })} placeholder="Kilometers driven" />
                <input type="text" value={newCar.pricePerDay} onChange={(e) => setNewCar({ ...newCar, pricePerDay: e.target.value })} placeholder="Price per day" />
                <button onClick={dodajAvto}>Dodaj avto</button>
            </div>
            <div>
                <h2>Get Car By Register Number</h2>
                <input type="text" value={registerNumberInput} onChange={(e) => setRegisterNumberInput(e.target.value)} placeholder="Register Number" />
                <button onClick={pridobiAvtoPoId}>Get Car</button>
                <div>
                {selectedCar && (
                    <div>
                        <h3>Selected Car</h3>
                        <p>Register Number: {selectedCar.registerNumber}</p>
                        <p>Brand: {selectedCar.brand}</p>
                        <p>Model: {selectedCar.model}</p>
                        <p>Color: {selectedCar.color}</p>
                        <p>Year: {selectedCar.year}</p>
                        <p>Kilometers Driven: {selectedCar.kilometersDriven}</p>
                        <p>Price Per Day: {selectedCar.pricePerDay}</p>
                    </div>
                )}
                </div>
                <div>
                <h2>Get Cars By Color</h2>
                <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="Color" />
                <button onClick={pridobiAvtoPoBarvi}>Get Cars</button>
                <input type="text" value={brandInput} onChange={(e) => setBrandInput(e.target.value)} placeholder="Brand" />
                <button onClick={pridobiAvtoPoZnamki}>Get Cars</button>
            </div>
            {showTable && ( // Render the table only when showTable is true
                <table>
                    <thead>
                        <tr>
                            <th>Register Number</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Color</th>
                            <th>Year</th>
                            <th>Kilometers Driven</th>
                            <th>Price Per Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedCars.map((car, index) => (
                            <tr key={index}>
                                <td>{car.registerNumber}</td>
                                <td>{car.brand}</td>
                                <td>{car.model}</td>
                                <td>{car.color}</td>
                                <td>{car.year}</td>
                                <td>{car.kilometersDriven}</td>
                                <td>{car.pricePerDay}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
            <table>
                <thead>
                    <tr>
                        <th>Register Number</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Color</th>
                        <th>Year</th>
                        <th>Kilometers Driven</th>
                        <th>Price Per Day</th>
                        <th>Možnosti</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car, index) => (
                        <tr key={index}>
                            <td>{car.registerNumber}</td>
                            <td>{car.brand}</td>
                            <td>{car.model}</td>
                            <td>{car.color}</td>
                            <td>{car.year}</td>
                            <td>{car.kilometersDriven}</td>
                            <td>{car.pricePerDay}</td>
                            <td>
                            <button onClick={() => klikPosodobi(car)}>Edit</button>
                            <button onClick={() => izbrisiAvto(car.registerNumber)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEditing && (
    <div>
        <h2>Edit Car Details</h2>
        <form>
            <label>
                Kilometers Driven:
                <input
                    type="number"
                    value={editCar.kilometersDriven}
                    onChange={(e) => setEditCar({ ...editCar, kilometersDriven: parseInt(e.target.value) })}
                />
            </label>
        </form>
        <button onClick={posodobiSubmit}>Update</button>
        <button onClick={posodobiPrekini}>Cancel</button>
    </div>
)}
        </div>
    );
};

export default CarLogic;
