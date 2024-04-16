import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import InfiniteScroll from "react-infinite-scroll-component";

const CollegeDuniya = ({ dummyData }) => {
  const [sortBy, setSortBy] = useState({ column: "ranking", ascending: true });
  const [sortedData, setSortedData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const perPage = 20;
  const scrollRef = useRef();

  // Effect to sort data when dummyData or sorting parameters change
  useEffect(() => {
    const sortData = () => {
      // Sorting the dummyData based on sortBy parameters
      const sorted = [...dummyData.colleges].sort((a, b) => {
        const { column, ascending } = sortBy;
        if (a[column] < b[column]) return ascending ? -1 : 1;
        if (a[column] > b[column]) return ascending ? 1 : -1;
        return 0;
      });
      // Update sortedData state
      setSortedData(sorted);
      // Reset current page and hasMore flag
      setCurrentPage(0);
      setHasMore(true);
      // Update visibleData based on sorting result
      if (fullyLoaded) {
        setVisibleData(sorted);
      } else {
        setVisibleData(sorted.slice(0, perPage));
      }
    };

    sortData();
  }, [dummyData, sortBy, perPage, fullyLoaded]);

  // Effect to adjust scroll position after sorting
  useEffect(() => {
    const container = scrollRef.current;
    // Calculate total height before and after sorting
    const totalHeightBeforeSort = container.scrollHeight;
    const totalHeightAfterSort =
      (totalHeightBeforeSort * sortedData.length) / dummyData.colleges.length;
    // Adjust scroll position
    const newScrollPosition =
      (scrollPosition / totalHeightBeforeSort) * totalHeightAfterSort;
    container.scrollTop = newScrollPosition;
  }, [sortedData, scrollPosition, dummyData]);

  // Function to fetch more data when scrolling
  const fetchMoreData = () => {
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const newData = sortedData.slice(
        nextPage * perPage,
        (nextPage + 1) * perPage
      );
      setCurrentPage(nextPage);
      // Check if there is more data to load
      if (newData.length < perPage) {
        setHasMore(false);
        if (sortedData.length === dummyData.colleges.length) {
          setFullyLoaded(true);
        }
      }
      // Update visibleData with new data
      setVisibleData((prevData) => [...prevData, ...newData]);
    }, 500);
  };

  // Function to handle scroll event
  const handleScroll = () => {
    setScrollPosition(scrollRef.current.scrollTop);
  };

  // Function to handle column sorting
  const handleSort = (column) => {
    // Toggle ascending/descending order if sorting on the same column
    const newAscending = sortBy.column === column ? !sortBy.ascending : true;
    // Sort data based on the selected column and order
    const sorted = [...sortedData].sort((a, b) => {
      if (a[column] < b[column]) return newAscending ? -1 : 1;
      if (a[column] > b[column]) return newAscending ? 1 : -1;
      return 0;
    });
    // Update sortedData and visibleData
    setSortedData(sorted);
    setVisibleData(
      sorted.slice(currentPage * perPage, (currentPage + 1) * perPage)
    );
    // Update sortBy state
    setSortBy({ column: column, ascending: newAscending });
  };

  return (
    <div
      ref={scrollRef}
      style={{ height: "500px", overflowY: "scroll", marginLeft: "20%" }}
      onScroll={handleScroll}
    >
      <InfiniteScroll
        dataLength={visibleData.length}
        next={fetchMoreData}
        hasMore={hasMore && !fullyLoaded}
        loader={<h4>Loading...</h4>}
        endMessage={fullyLoaded ? <p>No more colleges to load</p> : null}
        scrollableTarget={scrollRef.current}
      >
        <table>
          <thead>
            <tr>
              {/* Column headers with sorting functionality */}
              <th onClick={() => handleSort("ranking")}>
                CD Rank{" "}
                {sortBy.column === "ranking" &&
                  (sortBy.ascending ? "🔽" : "🔼")}
              </th>
              <th onClick={() => handleSort("name")}>
                College{" "}
                {sortBy.column === "name" && (sortBy.ascending ? "🔽" : "🔼")}
              </th>
              <th onClick={() => handleSort("course")}>
                Course{" "}
                {sortBy.column === "course" && (sortBy.ascending ? "🔽" : "🔼")}
              </th>
              <th onClick={() => handleSort("fees")}>
                Fees{" "}
                {sortBy.column === "fees" && (sortBy.ascending ? "🔽" : "🔼")}
              </th>
              <th onClick={() => handleSort("user_rating")}>
                User Rating{" "}
                {sortBy.column === "user_rating" &&
                  (sortBy.ascending ? "🔽" : "🔼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Render visible data */}
            {visibleData.map((item) => (
              <tr key={item.id}>
                <td>{`#${item.ranking}`}</td>
                <td>{item.name}</td>
                <td>{item.course}</td>
                <td>{`$${item.fees}`}</td>
                <td>{item.user_rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default CollegeDuniya;
