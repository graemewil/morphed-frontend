import React, { useEffect, useState } from 'react';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch('https://morphed-hs-production.up.railway.app/api/hubspot/contacts')
      .then((res) => res.json())
      .then((data) => setContacts(data.results || []))
      .catch((err) => console.error('❌ Failed to fetch contacts', err));
  }, []);

  return (
    <div>
      <h2>HubSpot Contacts</h2>
      {contacts.length === 0 && <p>No contacts found.</p>}
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>{contact.properties.firstname} {contact.properties.lastname}</li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsPage;
