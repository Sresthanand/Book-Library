import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-svg-core/styles.css";

const Home: React.FC = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/getbooks")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.books);
        console.log(data.books);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container mx-auto mt-8">
        <div className="flex items-center">
          <div>
            <FontAwesomeIcon
              icon={faBook}
              className="text-blue-800 w-14 h-14"
            />
          </div>
          <h1 className="text-2xl font-bold text-blue-800">My Books</h1>
        </div>

        <div className="flex flex-wrap mx-4 mt-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4"
            >
              <Link to={`/about/${book.id}`}>
                <div className="rounded-md shadow-md">
                  <img
                    src={book.image}
                    alt="Book Cover"
                    className="object-cover mb-4"
                  />
                </div>
                <h2 className="text-lg font-bold italic mb-2">{book.name}</h2>
                <p className="text-sm text-gray-600">{book.author}</p>
              </Link>
            </div>
          ))}

          <div
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 border-dotted border-2 border-blue-500 text-center"
            style={{ borderRadius: "10px", height: "260px" }}
          >
            <div className="flex flex-col justify-center items-center h-full">
              <div>
                <Link to="/addbook">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-blue-500 text-4xl"
                  />
                </Link>
              </div>
              <p className="mt-4 text-lg font-bold underline">Add a book</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
