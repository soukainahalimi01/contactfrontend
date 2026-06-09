import React, { useEffect, useState } from "react";

function Contact() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const token = localStorage.getItem("token");


      const response = await fetch("http://localhost:8080/api/contacts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur de chargement");
      }

      const data = await response.json();

      setContacts(data);
    } catch (error) {
      console.error("ERREUR =", error);
    }
  };

  return (
    <div>
      <h2>Mes Contacts</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Ville</th>
          </tr>
        </thead>

        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.lastName}</td>
                <td>{contact.firstName}</td>
                <td>{contact.tel}</td>
                <td>{contact.email}</td>
                <td>{contact.ville}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Aucun contact trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Contact;