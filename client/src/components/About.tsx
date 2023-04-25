import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";

const About: React.FC = () => {
  const [book, setBook] = useState({
    id: 0,
    name: "",
    author: "",
    readTime: "",
    details: "",
  });
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/aboutbook/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBook(data);
      });
  }, [id]);

  const fetchRatings = async () => {
    const BookId = id;
    try {
      const response = await fetch(`http://localhost:8080/rating/${BookId}`);
      const data = await response.json();
      const ratingsData = data.ratings;
      let totalRating = 0;
      for (let i = 0; i < ratingsData.length; i++) {
        totalRating += ratingsData[i].rating;
      }
      const avgRating =
        ratingsData.length > 0 ? totalRating / ratingsData.length : 0;
      setAverageRating(avgRating);
      setTotalCount(ratingsData.length);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleStarClick = (starCount: number) => {
    setRating(starCount);
  };

  const handleRateButtonClick = () => {
    setShowRating(true);
  };

  const handleGoBackClick = () => {
    setShowRating(false);
    setRating(0);
  };

  const handleRatingSubmit = () => {
    const BookId = id;

    console.log("Submitting rating:", rating);
    console.log("Submitting Book:", BookId);

    fetch("http://localhost:8080/rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ BookId: BookId, rating: rating }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Rating submitted successfully!");
          fetchRatings();
        } else {
          console.error("Failed to submit rating:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Failed to submit rating:", error);
      });
  };

  return (
    <div>
      <Navbar />

      <div className="mt-12 ml-12 flex justify-start items-center">
        <div className="border border-blue-800 text-blue-500 rounded-lg p-2 flex items-center">
          <Link to="/">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-blue-800 text-lg mr-2"
            />
          </Link>

          <p className="text-blue-800 font-bold">Back To Home</p>
        </div>
      </div>

      <div className="mt-6 mx-12 flex justify-start items-start">
        <div
          style={{
            borderRadius: "10px",
            height: "400px",
            width: "600px",
            backgroundImage: `url(${book.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.25)",
            cursor: "pointer",
          }}
        ></div>
        <div className="ml-14 w-full">
          <h1 className="text-3xl font-bold text-blue-800 font-bold">
            {book.name}
          </h1>
          <p className="text-gray-500 mt-2">{book.author} </p>
          <p className="text-gray-500 mt-1">Book Read Time: {book.readTime} </p>
          <p className="text-gray-900 mt-4">{book.details}</p>

          <div className="flex">
            <div className="flex flex-col mt-4">
              <p className="text-gray-500">Summary</p>
              <div className="w-40">
                <div className="flex-shrink-0 bg-gray-300 h-4 rounded-full mt-3">
                  <div className="bg-yellow-500 h-full rounded-full"></div>
                </div>

                <div className="flex-shrink-0 bg-gray-300 h-4  rounded-full mt-3">
                  <div className="bg-yellow-500 h-full rounded-full w-4/5"></div>
                </div>

                <div className="flex-shrink-0 bg-gray-300 h-4 rounded-full mt-3">
                  <div className="bg-yellow-500 h-full rounded-full w-3/5"></div>
                </div>

                <div className="flex-shrink-0 bg-gray-300 h-4 rounded-full mt-3">
                  <div className="bg-yellow-500 h-full rounded-full w-2/5"></div>
                </div>

                <div className="flex-shrink-0 bg-gray-300 h-4 rounded-full mt-3">
                  <div className="bg-yellow-500 h-full rounded-full w-1/5"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col ml-10 mt-8">
              <div>
                <p className="text-black font-bold text-2xl">
                  {averageRating.toFixed(1)}{" "}
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                </p>

                <p className="text-gray-500 mt-1">{totalCount} Reviews</p>
              </div>

              <div className="mt-5">
                <p className="text-black font-bold text-2xl">
                  {" "}
                  {((averageRating / 5) * 100).toFixed(0)}%{" "}
                </p>
                <p className="text-gray-500">Recommended</p>
              </div>
            </div>

            <div className="mt-8 ml-4">
              {showRating ? (
                <div>
                  <p className="w-80">
                    Rating<span className="text-yellow-600">*</span>
                  </p>

                  <div>
                    {[1, 2, 3, 4, 5].map((starCount) => (
                      <FontAwesomeIcon
                        key={starCount}
                        icon={faStar}
                        className={
                          starCount <= rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                        style={{ fontSize: "24px", marginTop: "3px" }}
                        onClick={() => handleStarClick(starCount)}
                      />
                    ))}
                  </div>
                  <button
                    className="border-blue-900 text-blue-900 border-2 rounded-lg px-4 py-2 mt-4"
                    onClick={handleGoBackClick}
                  >
                    Go Back
                  </button>
                  <button
                    className="border-blue-900 text-blue-900 border-2 rounded-lg px-4 py-2 mt-4 ml-4"
                    onClick={handleRatingSubmit}
                  >
                    Submit Rating
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 w-80">
                    Click on the button to start rating Your Book.
                  </p>
                  <button
                    className="border-blue-900 text-blue-900 border-2 rounded-lg px-4 py-2 mt-4"
                    onClick={handleRateButtonClick}
                  >
                    Rate this Book
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            className="bg-blue-900 text-white rounded-lg px-4 py-2 mt-5"
            onClick={() => window.open(book.pdf, "_blank")}
          >
            Read this Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
