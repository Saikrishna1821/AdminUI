import React, { useRef} from "react";
import "./Pagination.css";
import nextpage from "./assets/angle-right.png";
import firstpage from "./assets/lastpage.png";
import prevpage from "./assets/angle-left.png";
import lastpage from "./assets/next-page.png";

function Pagination({ length, handlePage}) {
  const currentPageValue = useRef(1);
  let pages = [];

  for (let i = 1; i <= length; i++) pages.push(i);

  const handleInput = (event, page) => {
    if (event.target.className === "prev" && currentPageValue.current > 1) {
      handlePage(currentPageValue.current - 1);
      if (currentPageValue.current > 1)
        currentPageValue.current = currentPageValue.current - 1;
    } else if (
      event.target.className === "next" &&
      currentPageValue.current < length
    ) {
      handlePage(currentPageValue.current + 1);
      if (currentPageValue.current < length)
        currentPageValue.current = currentPageValue.current + 1;
    } else {
      currentPageValue.current = page;
      handlePage(page);
    }
  };

  return (
    <>
      {currentPageValue.current !== 1 ? (
        <button onClick={(e) => handleInput(e, 1)} className="btn">
          <img src={firstpage} alt="first" width="20px" />
        </button>
      ) : (
        ""
      )}

      {pages.map((page, index) => {
        return (
          <>
            {currentPageValue.current !== 1 ? (
              index === 0 ? (
                <button className="btn" onClick={(e) => handleInput(e, page)}>
                  <img src={prevpage} alt="prev" width="20px" />
                </button>
              ) : null
            ) : (
              ""
            )}
            <button className={currentPageValue.current===page?"select-btn":"btn"} onClick={(e) => handleInput(e, page)}>
              {page}
            </button>
            {currentPageValue.current!==length?(index === length - 1 ? (
              <button className="btn" onClick={(e) => handleInput(e, page)}>
                <img src={nextpage} alt="next" width="20px" />
              </button>
            ) : null):''}
          </>
        );
      })}

      {currentPageValue.current !==length ? (
        <button className="btn" onClick={(e) => handleInput(e, length)}>
          <img src={lastpage} alt="lastpage" width="20px" />
        </button>
      ) : (
        ""
      )}
    </>
  );
}

export default Pagination;
