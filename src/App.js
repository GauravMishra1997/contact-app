import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State variables
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch initial list of contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.log('Error fetching contacts:', error);
    }
  };

  // Add a new contact
  const addContact = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
        }),
      });
      const data = await response.json();
      setContacts([...contacts, data]);
      setName('');
      setPhone('');
      setEmail('');
    } catch (error) {
      console.log('Error adding contact:', error);
    }
  };

  // Remove a contact
  const removeContact = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      setContacts(updatedContacts);
    } catch (error) {
      console.log('Error removing contact:', error);
    }
  };

  // Edit a contact
  const editContact = (id) => {
    const contactToEdit = contacts.find((contact) => contact.id === id);
    if (contactToEdit) {
      setName(contactToEdit.name);
      setPhone(contactToEdit.phone);
      setEmail(contactToEdit.email);
      setEditingId(id);
    }
  };

  // Update a contact
  const updateContact = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
        }),
      });
      const updatedContact = await response.json();
      const updatedContacts = contacts.map((contact) => {
        if (contact.id === editingId) {
          return updatedContact;
        }
        return contact;
      });
      setContacts(updatedContacts);
      setName('');
      setPhone('');
      setEmail('');
      setEditingId(null);
    } catch (error) {
      console.log('Error updating contact:', error);
    }
  };

  return (
    <div className="App">
      <h1>Contact List</h1>

      {/* Add contact form */}
      <div className="form">
        {/* Name input */}
        <input
          type="text"
          placeholder="Name (Alphabets Only)"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^A-Za-z]/g, ''))}
        />
        {/* Phone input */}
        <input
          type="text"
          placeholder="Phone (Numbers Only)"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
        />
        {/* Email input */}
        <input
          type="text"
          placeholder="Email (@ symbol required)"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/[^a-zA-Z0-9@._-]/g, ''))}
        />
        {/* Add or update contact button */}
        {editingId ? (
          <button onClick={updateContact}>Update Contact</button>
        ) : (
          <button onClick={addContact}>Add Contact</button>
        )}
      </div>

      {/* Display contact list */}
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <div className="contact-info">
              {/* Display contact information */}
              <span>{contact.name} - {contact.phone} - {contact.email}</span>
              <div className="button-container">
                {/* Edit button */}
                <button onClick={() => editContact(contact.id)}>Edit</button>
                {/* Remove button */}
                <button onClick={() => removeContact(contact.id)}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
