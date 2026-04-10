import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://localhost:5000/tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      setMessage("");
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem", fontFamily: "Arial" }}>
      <h1>AI Helpdesk Automation Assistant</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue..."
          rows="5"
          style={{ width: "100%", padding: "1rem", marginBottom: "1rem" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit Ticket"}
        </button>
      </form>

      <h2>Submitted Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <p><strong>Message:</strong> {ticket.message}</p>
              <p><strong>Category:</strong> {ticket.category}</p>
              <p><strong>Priority:</strong> {ticket.priority}</p>
              <p><strong>Created:</strong> {ticket.created_at}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;