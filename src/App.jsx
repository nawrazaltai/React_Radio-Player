import { useCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { AiOutlineSearch } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
  const [channels, setChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false);

  const handleFetch = useCallback(() => {
    if (searchTerm === " ") {
      return;
    }

    fetch(`https://api.sr.se/api/v2/channels?format=json&size=100`)
      .then((response) => response.json())
      .then((data) => {
        setChannels(
          data.channels.filter((channel) => {
            return channel.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          })
        );
        setLoading(false);
      });
  }, [searchTerm]);

  const handleSubmit = (e) => {
    setLoading(true);
    handleFetch();
    e.preventDefault();
  };

  const handleSearch = (e) => {
    if (e.target.value.length >= 1) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
    setSearchTerm(e.target.value);
  };

  console.log(channels);

  return (
    <div className="App">
      <div className="searchContainer">
        <h1 className="searchQuestion">
          Which radio station do you wish to listen to?
        </h1>
        <form onSubmit={handleSubmit}>
          <AiOutlineSearch className="searchIcon" />
          <input
            type="text"
            value={searchTerm}
            placeholder="Enter radio station.."
            onChange={handleSearch}
            required
          />
          <button
            className={`submitBtn ${buttonStatus ? "" : "disabled"}`}
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      <div className="channelContainer">
        {channels.map((channel) => {
          return (
            <div
              key={channel.id}
              className="channelDiv"
              style={{
                backgroundColor: "#" + channel.color,
              }}
            >
              <div
                className="imageDiv"
                style={{
                  backgroundColor: "#" + channel.color,
                  // backgroundImage: `url(${channel.image})`,
                }}
              >
                {loading ? (
                  <Skeleton
                    className="imgSkeletonLoader"
                    width={"14em"}
                    count={1}
                  />
                ) : (
                  <img src={channel.image} alt="" />
                )}
              </div>

              <div className="mainContent">
                <h1 className="title">
                  {" "}
                  {loading ? <Skeleton height={"1.3em"} /> : channel.name}{" "}
                </h1>
                <span className="description">
                  {loading ? (
                    <Skeleton count={3} width={"20em"} />
                  ) : (
                    channel.tagline
                  )}
                </span>

                {loading ? (
                  <Skeleton
                    // width={"100%"}
                    height={"2.5em"}
                    borderRadius={"20px"}
                    count={1}
                    className="audioSkeletonLoader"
                  />
                ) : (
                  <audio controls>
                    <source src={channel.liveaudio.url} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default App;
