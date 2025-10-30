import React, { useState, useEffect } from 'react';

function App() {
  const [Track, setTrack] = useState(null); // Track data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedGenres, setSelectedGenres] = useState(['soul']); // Selected genres
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [startYear, setStartYear] = useState(1970); // Start year
  const [endYear, setEndYear] = useState(1980); // End year

  const genres = [
    'rock',
    'pop',
    'jazz',
    'blues',
    'country',
    'hip-hop',
    'electronic',
    'classical',
    'folk',
    'r&b',
    'indie',
    'soul',
    'funk',
  ];

  const toggleGenre = (genre) => { // Toggle genre selection
    setSelectedGenres(prev => {
      if(prev.includes(genre)){
        return prev.filter(g => g !== genre);
      }
      else{
        return [...prev, genre];
      }
    });
  };

  const fetchTrack = async () => { // Fetch random track from backend
    setLoading(true);
    setError("");
    try{
      const genreParam = selectedGenres.length > 0 ? selectedGenres.join('&') : 'soul';
      const yearParam = `${startYear}-${endYear}`;
      const response = await fetch(`https://muse-jw19.onrender.com/api/random?genre=${genreParam}&year=${yearParam}`);
      const data = await response.json();

      if(data.error){
        setError(data.error);
        setTrack(null);
      }
      else{
        setTrack(data);
      }
    }
    catch(err){
      setError("Failed to find a track. Please try again.");
      setTrack(null);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
  // eslint disable next line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}> 
      <h1 style={styles.title}>Random Track</h1>

      <div style={styles.controlsWrapper}>
        <div style={styles.dropdownContainer}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={styles.dropdownButton}
          >
            <span>
              {selectedGenres.length === 0 ? 'Select Genres'
              : `${selectedGenres.length} Genre${selectedGenres.length > 1 ? 's' : ''} selected`}
            </span>
            <span style={styles.arrow}>{isDropdownOpen ? '▲' : '▼'}</span>
          </button>

          {isDropdownOpen && (
            <div style={styles.dropdownMenu}>
              {genres.map(genre => (
                <label key={genre} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                    style={styles.checkbox}
                  />
                  <span style={styles.genreName}>{genre}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {selectedGenres.length > 0 && (
          <div style={styles.selectedGenres}>
            {selectedGenres.map(genre => (
              <span key={genre} style={styles.tag}>
                {genre}
                <button 
                  onClick={() => toggleGenre(genre)}
                  style={styles.removeTag}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div style={styles.yearContainer}>
          <label style={styles.yearLabel}>
            <span style={styles.yearText}>Start Year:</span>
            <input
              type="number"
              min="1900"
              max="2024"
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value) || 1900)}
              style={styles.yearInput}
            />
          </label>
          <label style={styles.yearLabel}>
            <span style={styles.yearText}>End Year:</span>
            <input
              type="number"
              min="1900"
              max="2024"
              value={endYear}
              onChange={(e) => setEndYear(parseInt(e.target.value) || 2024)}
              style={styles.yearInput}
            />
          </label>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {Track && (
        <div style={styles.card}>
          <h2>{Track.artist}</h2>
          <p>{Track.track}</p>
          <iframe
            width="100%"
            height="315"
            src={Track.youtubeUrl.replace("watch?v=", "embed/")}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <p style={styles.discogsLink}>
            <a href={Track.discogsUrl} target="_blank" rel="noreferrer" style={styles.link}>
              View on Discogs
            </a>
          </p>
        </div>
      )}

      <button onClick={fetchTrack} style={styles.button}>
        Find Another Track
      </button>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#111",
    color: "#fff",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  controlsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px'
  },
  dropdownContainer: {
    position: 'relative',
    width: '250px'
  },
  dropdownButton: {
    width: '100%',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  arrow: {
    fontSize: '12px'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginTop: '5px',
    maxHeight: '300px',
    overflowY: 'auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    cursor: 'pointer',
    textAlign: 'left',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s'
  },
  checkbox: {
    marginRight: '10px',
    cursor: 'pointer',
    width: '16px',
    height: '16px'
  },
  genreName: {
    textTransform: 'capitalize',
    fontSize: '14px',
    color: '#333'
  },
  selectedGenres: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    maxWidth: '600px'
  },
  tag: {
    backgroundColor: '#e0e0e0',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    textTransform: 'capitalize',
    color: '#333'
  },
  removeTag: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0 5px',
    color: '#666'
  },
  yearContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  yearLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  yearText: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  yearInput: {
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '2px solid #444',
    backgroundColor: '#222',
    color: '#fff',
    width: '100px',
    textAlign: 'center'
  },
  card: {
    backgroundColor: "#222",
    borderRadius: "12px",
    padding: "1.5rem",
    margin: "0 auto 1.5rem auto",
    maxWidth: "600px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
  discogsLink: {
    marginTop: '1rem'
  },
  link: {
    color: '#1db954',
    textDecoration: 'none',
    fontSize: '1rem'
  },
  button: {
    backgroundColor: "#1db954",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: '10px'
  },
  error: {
    color: "tomato",
    marginBottom: '1rem'
  }
};

export default App;