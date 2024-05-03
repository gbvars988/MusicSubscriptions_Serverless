import { React, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Main() {
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState({
    title: "",
    year: "",
    artist: "",
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [musicSubs, setMusicSubs] = useState();

  useEffect(() => {
    fetchMusicSubscriptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuery = async () => {
    const apiURL =
      "https://9fxewbudah.execute-api.us-east-1.amazonaws.com/Production/SongQueryFunction";
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });
      const data = await response.json();
      if (data.body && data.body.length === 0) {
        setError("No result is retrieved. Please query again");
        setResults([]);
      } else if (data.statusCode === 400) {
        setError("No result is retrieved. Please query again");
      } else {
        setError("");
        setResults(data.body);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching data");
    }
  };

  const handleAddSubscription = async (email, title) => {
    console.log("subscribe clicked");
    console.log(
      "Stringified Payload:",
      JSON.stringify({
        // Debugging: log the stringified payload
        email: email,
        music_title: title,
      })
    );
    const apiURL =
      "https://oa4r5ijfvh.execute-api.us-east-1.amazonaws.com/Production/AddSubscriptionFunction";

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          musictitle: title,
        }),
      });
      const data = await response.json();
      if (data.body && data.statusCode === 200) {
        console.log("success added");
        console.log(data.body);
        fetchMusicSubscriptions();
      } else {
        console.log("something went wrong");
        console.log(data);
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleRemoveSubscription = async (email, title) => {
    const apiURL =
      "https://gtlloy24ih.execute-api.us-east-1.amazonaws.com/Production/RemoveSubscriptionFunction";
    try {
      const response = await fetch(apiURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          musictitle: title,
        }),
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        fetchMusicSubscriptions();
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const fetchMusicSubscriptions = async () => {
    const apiURL =
      "https://0hoikf6x87.execute-api.us-east-1.amazonaws.com/Production/FetchSubsriptionsFunction";

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: location.state.email,
        }),
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        setMusicSubs(data.body);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="main-bg">
      <h1>Main Page</h1>
      <div className="user-area">
        <h3>User Area:</h3>
        {location.state.username}
      </div>
      <div className="subscriptions-area">
        <h3>Music subscriptions</h3>
        <div>
          {musicSubs &&
            musicSubs.map((item, index) => (
              <div key={index}>
                <p>
                  Title: {item.title}, Artist: {item.artist}, Year: {item.year}
                  <img
                    src={item.presigned_image_url}
                    width="100"
                    height="100"
                  />
                </p>
                <button
                  onClick={() =>
                    handleRemoveSubscription(location.state.email, item.title)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="query-area">
        <h3>Query area</h3>
        <input
          type="text"
          name="title"
          value={query.title}
          onChange={handleChange}
          placeholder="Enter title"
        />
        <input
          type="text"
          name="year"
          value={query.year}
          onChange={handleChange}
          placeholder="Enter year"
        />
        <input
          type="text"
          name="artist"
          value={query.artist}
          onChange={handleChange}
          placeholder="Enter artist"
        />
        <button onClick={handleQuery}>Query</button>
        {error && <p>{error}</p>}
        {results.map((item, index) => (
          <div key={index}>
            <p>
              Title: {item.title}, Artist: {item.artist}, Year: {item.year},{" "}
              <img
                src={item.presigned_image_url}
                width="100"
                height="100"
              ></img>
              <button
                onClick={() =>
                  handleAddSubscription(location.state.email, item.title)
                }
              >
                Subscribe
              </button>
            </p>
          </div>
        ))}
      </div>
      <div className="logout-btn">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Main;
