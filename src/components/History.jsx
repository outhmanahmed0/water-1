import React from 'react';
import '../App.css';

function History({ history }) {
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="card glass-panel section-card">
            <h2>History 📅</h2>
            {sortedHistory.length === 0 ? (
                <p className="empty-text">No history yet. Start drinking! </p>
            ) : (
                <ul className="history-list">
                    {sortedHistory.map((item, index) => (
                        <li key={index} className="history-item">
                            <span className="date">{item.date}</span>
                            <span className="count">💧 {item.count} cups</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default History;
