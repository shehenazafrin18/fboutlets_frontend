import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

function QueryFilter({ filter, setFilter }) {
  const [value, setValue] = useState(filter);
  // const onChange = useAsyncDebounce((value) => {
  //   setFilter(value || undefined);

  // }, 1000);

  const onChange = (value) => {
    setFilter(value || undefined);
    localStorage.setItem("queryStatus", value);
  };

  return (
    <span>
      <select
        className="form-control form-control-solid form-control-lg"
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        defaultValue={localStorage.getItem("queryStatus")}
      >
        <option value="">All</option>
        <option value={"Yes"}>Yes</option>
        <option value={"No"}>No</option>
      </select>
    </span>
  );
}

export default QueryFilter;
