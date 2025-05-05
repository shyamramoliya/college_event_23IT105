import React, { useState, useEffect } from 'react';

function App() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;
    try {
      const res = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
        }),
      });
      if (res.ok) {
        setFormData({ title: '', description: '', date: '' });
        fetchEvents();
      }
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20, fontFamily: 'sans-serif' }}>
      <nav style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
        <div style={{ fontWeight: 'bold' }}>Event Manager</div>
        <div>
          <a href="#login" style={{ marginRight: 15, textDecoration: 'none', color: '#333' }}>Login</a>
          <a href="#register" style={{ textDecoration: 'none', color: '#333' }}>Register</a>
        </div>
      </nav>

      <h2>Events</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.length === 0 && <li>No events</li>}
        {events.map(event => (
          <li key={event._id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10 }}>
            <strong>{event.title}</strong><br />
            <small>{new Date(event.date).toLocaleString()}</small>
            {event.description && <p>{event.description}</p>}
          </li>
        ))}
      </ul>

      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Title</label><br />
          <input type="text" name="title" value={formData.title} onChange={handleChange} style={{ width: '100%', padding: 6 }} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Description</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: 6 }} rows={3} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Date and Time</label><br />
          <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: 6 }} required />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Add Event</button>
      </form>
    </div>
  );
}

export default App;
