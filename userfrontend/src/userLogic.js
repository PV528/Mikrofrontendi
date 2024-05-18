import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userLogic.css';

const UserLogic = () => {
    const [users, setUsers] = useState([]);
    const [idInput, setIdInput] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        rentalId: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState(null);
    
    useEffect(() => {
        // pridobim vse avte, ko se stran naloži
        pridobiUporabnike();
    }, []);

    const pridobiUporabnike = () => {
        axios.get('http://localhost:3000/user/all')
            .then(response => {
                console.log(response.data);
                setUsers(response.data);
            })
            .catch(error => console.error("Error fetching cars:", error));
    };
    const pridobiUporabnikaPoId = () => {
        axios.get(`http://localhost:3000/user/${idInput}`)
          .then(response => {
              console.log(response.data);
              setSelectedUser(response.data);
          })
          .catch(error => console.error("Error fetching car by register number:", error));
  };
  const dodajUporabnika = () => {
    axios.post('http://localhost:3000/user/add', newUser)
        .then(response => {
            setUsers([...users, response.data]);
            setNewUser({
                email: '',
                password: '',
                rentalId: ''
            });
        })
        .catch(error => console.error("Error adding car:", error));
};

  const izbrisiUporabnika = (id) => {
    axios.delete(`http://localhost:3000/user/${id}`)
      .then(response => {
        console.log("Car deleted successfully:", response.data);
        setUsers(users.filter(user => user.id !== id));
    })
    .catch(error => console.error("Error deleting car:", error));
};

const klikPosodobi = (user) => {
    setEditUser(user);
    setIsEditing(true);
};

  const posodobiSubmit = () => {
    axios.put(`http://localhost:3000/user/${editUser.id}`, editUser)
    .then(response => {
        // Update corresponding row in the table
        const updatedUsers = users.map(user => {
            if (user.id === editUser.id) {
                return response.data;
            }
            return user;
        });
        setUsers(updatedUsers);
        setIsEditing(false);
        setEditUser(null);
    })
    .catch(error => console.error("Error updating car:", error));
};

const posodobiPrekini = () => {
setIsEditing(false);
setEditUser(null);
};
return (
    <div>
        <h1>UserManagement</h1>
        <div>
            <h2>Add New User</h2>
            <input type="text" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" />
            <input type="text" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password" />
            <input type="text" value={newUser.rentalId} onChange={(e) => setNewUser({ ...newUser, rentalId: e.target.value })} placeholder="rentalId" />
            <button onClick={dodajUporabnika}>Dodaj uporabnika</button>
        </div>
        <div>
            <div>
                <h2>Get Car By Register Number</h2>
                <input type="text" value={idInput} onChange={(e) => setIdInput(e.target.value)} placeholder="User id" />
                <button onClick={pridobiUporabnikaPoId}>Get Car</button>
                <div>
                    {selectedUser && (
                        <div>
                            <h3>Selected User</h3>
                            <p>Id: {selectedUser.id}</p>
                            <p>Email: {selectedUser.email}</p>
                            <p>Password: {selectedUser.password}</p>
                            <p>rentalId: {selectedUser.rentalId}</p>
                        </div>
                    )}
                </div>
            </div>
            <h2>User List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Rental ID</th>
                        <th>Možnosti</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>{user.rentalId}</td>
                            <td>
                                <button onClick={() => klikPosodobi(user)}>Edit</button>
                                <button onClick={() => izbrisiUporabnika(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEditing && (
                    <div>
                        <h2>Edit User Details</h2>
                        <form>
                            <label>
                                Email:
                                <input
                                    type="text"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                />
                            </label>
                            <label>
                                Password:
                                <input
                                    type="text"
                                    value={editUser.password}
                                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                />
                            </label>
                            <label>
                                Rental ID:
                                <input
                                    type="text"
                                    value={editUser.rentalId}
                                    onChange={(e) => setEditUser({ ...editUser, rentalId: e.target.value })}
                                />
                            </label>
                            </form>
                            <button onClick={posodobiSubmit}>Update</button>
                            <button onClick={posodobiPrekini}>Cancel</button>
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserLogic;